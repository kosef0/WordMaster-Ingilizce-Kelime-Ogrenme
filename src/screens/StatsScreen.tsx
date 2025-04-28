import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getLearningStats, getWordStatuses } from '../services/statsService';
import { getUserWords } from '../services/wordService';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const StatsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [learnedWords, setLearnedWords] = useState([]);
  const [learningWords, setLearningWords] = useState([]);
  const [activeTab, setActiveTab] = useState('learning'); // learning, mastered
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // İstatistikleri yükle
      const statsData = await getLearningStats();
      setStats(statsData);
      
      // Kelime durumlarını yükle
      const wordStatuses = await getWordStatuses();
      
      // Tüm kullanıcı kelimelerini getir
      const userWordsData = await getUserWords(user?.id || '1');
      
      // Öğreniliyor ve öğrenildi durumundaki kelimeleri filtrele
      const learning = [];
      const mastered = [];
      
      userWordsData.forEach(word => {
        const status = wordStatuses[word._id] || 'new';
        if (status === 'learning') {
          learning.push(word);
        } else if (status === 'mastered') {
          mastered.push(word);
        }
      });
      
      setLearningWords(learning);
      setLearnedWords(mastered);
      
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderWordItem = (item) => (
    <TouchableOpacity 
      key={item._id}
      style={styles.wordCard}
      onPress={() => navigation.navigate('WordDetail', { wordId: item._id })}
      activeOpacity={0.8}
    >
      <View style={styles.wordContent}>
        <Text style={styles.englishWord}>{item.english_word || 'Kelime bulunamadı'}</Text>
        <Text style={styles.turkishWord}>{item.turkish_word || 'Çeviri bulunamadı'}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      <LinearGradient
        colors={['#4CAF50', '#8BC34A']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Kelime İstatistikleri</Text>
            <Text style={styles.headerSubtitle}>Öğrenme ilerlemeni takip et</Text>
          </View>
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Ionicons name="flame-outline" size={24} color="#FF5722" />
            <Text style={styles.statsNumber}>{stats?.streak || 0}</Text>
            <Text style={styles.statsLabel}>Gün Serisi</Text>
          </View>
          
          <View style={styles.statsCard}>
            <Ionicons name="book-outline" size={24} color="#4CAF50" />
            <Text style={styles.statsNumber}>{stats?.mastered || 0}</Text>
            <Text style={styles.statsLabel}>Öğrenilen</Text>
          </View>
          
          <View style={styles.statsCard}>
            <Ionicons name="time-outline" size={24} color="#2196F3" />
            <Text style={styles.statsNumber}>{stats?.learning || 0}</Text>
            <Text style={styles.statsLabel}>Öğreniliyor</Text>
          </View>
        </View>
        
        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.sectionTitle}>İlerleme Durumu</Text>
          
          <View style={styles.progressBars}>
            <View style={styles.progressItem}>
              <View style={styles.progressLabelContainer}>
                <Text style={styles.progressLabel}>Yeni</Text>
                <Text style={styles.progressCount}>{stats?.newWords || 0}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, {
                  width: `${stats?.newWords ? (stats.newWords / (stats.newWords + stats.learning + stats.mastered) * 100) : 0}%`,
                  backgroundColor: '#FFC107'
                }]} />
              </View>
            </View>
            
            <View style={styles.progressItem}>
              <View style={styles.progressLabelContainer}>
                <Text style={styles.progressLabel}>Öğreniliyor</Text>
                <Text style={styles.progressCount}>{stats?.learning || 0}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, {
                  width: `${stats?.learning ? (stats.learning / (stats.newWords + stats.learning + stats.mastered) * 100) : 0}%`,
                  backgroundColor: '#2196F3'
                }]} />
              </View>
            </View>
            
            <View style={styles.progressItem}>
              <View style={styles.progressLabelContainer}>
                <Text style={styles.progressLabel}>Öğrenildi</Text>
                <Text style={styles.progressCount}>{stats?.mastered || 0}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, {
                  width: `${stats?.mastered ? (stats.mastered / (stats.newWords + stats.learning + stats.mastered) * 100) : 0}%`,
                  backgroundColor: '#4CAF50'
                }]} />
              </View>
            </View>
          </View>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'learning' && styles.activeTabButton]}
            onPress={() => setActiveTab('learning')}
          >
            <Text style={[styles.tabText, activeTab === 'learning' && styles.activeTabText]}>
              Öğreniliyor ({learningWords.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'mastered' && styles.activeTabButton]}
            onPress={() => setActiveTab('mastered')}
          >
            <Text style={[styles.tabText, activeTab === 'mastered' && styles.activeTabText]}>
              Öğrenildi ({learnedWords.length})
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Word Lists */}
        <View style={styles.wordsContainer}>
          {activeTab === 'learning' ? (
            learningWords.length > 0 ? (
              learningWords.map(word => renderWordItem(word))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="time-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>Henüz öğrenilmekte olan kelime yok</Text>
              </View>
            )
          ) : (
            learnedWords.length > 0 ? (
              learnedWords.map(word => renderWordItem(word))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="book-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>Henüz öğrenilen kelime yok</Text>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 45,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -30,
    marginBottom: 20,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: (width - 60) / 3,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  progressContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  progressBars: {
    gap: 16,
  },
  progressItem: {
    marginBottom: 12,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
  },
  activeTabButton: {
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  wordsContainer: {
    marginBottom: 30,
  },
  wordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  wordContent: {
    flex: 1,
  },
  englishWord: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  turkishWord: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default StatsScreen; 
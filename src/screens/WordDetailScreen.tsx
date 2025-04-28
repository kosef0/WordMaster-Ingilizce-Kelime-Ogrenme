import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getWordById } from '../services/wordService';
import { getWordStatus, updateWordStatus } from '../services/statsService';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const WordDetailScreen = ({ route, navigation }) => {
  const { wordId } = route.params;
  const { user } = useAuth();
  
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [learningStatus, setLearningStatus] = useState('new'); // new, learning, mastered
  const [cardFlipped, setCardFlipped] = useState(false);
  
  // Animasyon değerleri
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });
  
  useEffect(() => {
    loadWordDetails();
  }, [wordId]);
  
  const loadWordDetails = async () => {
    try {
      setLoading(true);
      const wordData = await getWordById(wordId);
      setWord(wordData);
      
      // Kelime öğrenme durumunu getir
      const status = await getWordStatus(wordId);
      setLearningStatus(status);
      
      setError(null);
    } catch (err) {
      console.error('Kelime detayları yüklenirken hata:', err);
      setError('Kelime detayları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };
  
  const flipCard = () => {
    if (cardFlipped) {
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnimation, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setCardFlipped(!cardFlipped);
  };
  
  const handleUpdateStatus = async (status) => {
    if (!user) {
      Alert.alert('Uyarı', 'Bu işlem için giriş yapmalısınız');
      return;
    }
    
    try {
      // Durumu güncelle ve istatistikleri kaydet
      await updateWordStatus(wordId, status);
      setLearningStatus(status);
      
      // Duruma göre başarı mesajı
      let message = '';
      if (status === 'new') {
        message = 'Kelime "Yeni" durumuna taşındı';
      } else if (status === 'learning') {
        message = 'Kelime "Öğreniliyor" durumuna taşındı';
      } else if (status === 'mastered') {
        message = 'Tebrikler! Kelimeyi öğrendiniz';
      }
      
      Alert.alert('Başarılı', message);
    } catch (error) {
      console.error('Öğrenme durumu güncellenirken hata:', error);
      Alert.alert('Hata', 'Öğrenme durumu güncellenirken bir hata oluştu');
    }
  };

  const getStatusColor = () => {
    switch(learningStatus) {
      case 'mastered':
        return '#58CC02'; // Yeşil
      case 'learning':
        return '#FF9600'; // Turuncu
      default:
        return '#1CB0F6'; // Mavi
    }
  };

  const speakWord = () => {
    // TTS implementation will be added
    Alert.alert('Bilgi', 'Ses özelliği yakında eklenecek');
  };
  
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#58CC02" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF4B4B" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadWordDetails}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }]
  };
  
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }]
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={getStatusColor()} />
      
      <LinearGradient
        colors={[getStatusColor(), adjustBrightness(getStatusColor(), -30)]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Kelime Detayı</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {learningStatus === 'new' ? 'Yeni' : 
                 learningStatus === 'learning' ? 'Öğreniliyor' : 'Öğrenildi'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.soundButton} onPress={speakWord}>
            <Ionicons name="volume-high" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardContainer}>
          <TouchableOpacity activeOpacity={0.9} onPress={flipCard}>
            <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
              <View style={styles.cardContent}>
                <Text style={styles.englishWord}>{word?.english_word || 'Kelime bulunamadı'}</Text>
                {word?.phonetic && (
                  <Text style={styles.phonetic}>/{word.phonetic}/</Text>
                )}
                <View style={styles.tapHint}>
                  <Ionicons name="sync" size={18} color="rgba(0,0,0,0.4)" />
                  <Text style={styles.tapHintText}>Çevirmek için dokun</Text>
                </View>
              </View>
            </Animated.View>
            
            <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
              <View style={styles.cardContent}>
                <Text style={styles.turkishWord}>{word?.turkish_word || 'Çeviri bulunamadı'}</Text>
                <View style={styles.tapHint}>
                  <Ionicons name="sync" size={18} color="rgba(0,0,0,0.4)" />
                  <Text style={styles.tapHintText}>İngilizce için dokun</Text>
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.learningButtonsContainer}>
          <TouchableOpacity 
            style={[
              styles.learningButton, 
              learningStatus === 'new' ? styles.activeButton : null,
              { backgroundColor: learningStatus === 'new' ? '#1CB0F6' : '#E6F8FA' }
            ]}
            onPress={() => handleUpdateStatus('new')}
          >
            <Ionicons 
              name="bookmark-outline" 
              size={22} 
              color={learningStatus === 'new' ? '#fff' : '#1CB0F6'} 
            />
            <Text 
              style={[
                styles.learningButtonText, 
                { color: learningStatus === 'new' ? '#fff' : '#1CB0F6' }
              ]}
            >
              Yeni
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.learningButton, 
              learningStatus === 'learning' ? styles.activeButton : null,
              { backgroundColor: learningStatus === 'learning' ? '#FF9600' : '#FFF4DC' }
            ]}
            onPress={() => handleUpdateStatus('learning')}
          >
            <Ionicons 
              name="school-outline" 
              size={22} 
              color={learningStatus === 'learning' ? '#fff' : '#FF9600'} 
            />
            <Text 
              style={[
                styles.learningButtonText, 
                { color: learningStatus === 'learning' ? '#fff' : '#FF9600' }
              ]}
            >
              Öğreniliyor
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.learningButton, 
              learningStatus === 'mastered' ? styles.activeButton : null,
              { backgroundColor: learningStatus === 'mastered' ? '#58CC02' : '#E8F6E8' }
            ]}
            onPress={() => handleUpdateStatus('mastered')}
          >
            <Ionicons 
              name="checkmark-circle-outline" 
              size={22} 
              color={learningStatus === 'mastered' ? '#fff' : '#58CC02'} 
            />
            <Text 
              style={[
                styles.learningButtonText, 
                { color: learningStatus === 'mastered' ? '#fff' : '#58CC02' }
              ]}
            >
              Öğrenildi
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Kelime Bilgisi</Text>
          
          <View style={styles.infoCard}>
            {word?.wordType && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Türü:</Text>
                <View style={styles.tagContainer}>
                  <Text style={styles.wordType}>
                    {word.wordType}
                  </Text>
                </View>
              </View>
            )}
            
            {word?.level && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Seviye:</Text>
                <View style={[styles.levelBadge, styles[`level${word.level}`]]}>
                  <Text style={styles.levelText}>
                    {word.level === 'A1' ? 'Başlangıç' : 
                     word.level === 'A2' ? 'Temel' : 
                     word.level === 'B1' ? 'Orta' : 
                     word.level === 'B2' ? 'Orta-Üst' : 
                     word.level === 'C1' ? 'İleri' : 'Üst'}
                  </Text>
                </View>
              </View>
            )}
            
            {word?.category && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Kategori:</Text>
                <Text style={styles.infoValue}>{word.category.name}</Text>
              </View>
            )}
          </View>
        </View>
        
        {word?.examples && word.examples.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Örnek Cümleler</Text>
            {word.examples.map((example, index) => (
              <View key={index} style={styles.exampleCard}>
                <Text style={styles.exampleText}>"{example}"</Text>
                <TouchableOpacity style={styles.speakExample}>
                  <Ionicons name="volume-medium-outline" size={18} color="#1CB0F6" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        
        {word?.synonyms && word.synonyms.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Eş Anlamlılar</Text>
            <View style={styles.tagContainer}>
              {word.synonyms.map((synonym, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{synonym}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {word?.additionalInfo && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Ek Bilgi</Text>
            <View style={styles.noteCard}>
              <Text style={styles.additionalInfo}>{word.additionalInfo}</Text>
            </View>
          </View>
        )}
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.practiceButton}
            onPress={() => navigation.navigate('StudyScreen', { wordId: word._id })}
          >
            <Ionicons name="school" size={22} color="#fff" />
            <Text style={styles.practiceButtonText}>Bu Kelimeyi Çalış</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
};

// Yardımcı fonksiyon - rengin parlaklığını ayarlar
const adjustBrightness = (hex, percent) => {
  // Basit bir şekilde koyu veya açık renk döndürür
  if (percent > 0) {
    return hex + '80'; // Alfa ile daha açık
  } else {
    return hex + 'CC'; // Alfa ile daha koyu
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  soundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 30,
  },
  cardContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  card: {
    width: width - 60,
    height: 200,
    backfaceVisibility: 'hidden',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  cardFront: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
  },
  cardBack: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  englishWord: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  turkishWord: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  phonetic: {
    fontSize: 18,
    color: '#888',
    marginTop: 5,
    marginBottom: 10,
  },
  tapHint: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tapHintText: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 12,
    marginLeft: 5,
  },
  learningButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  learningButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  learningButtonText: {
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  activeButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    width: 80,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordType: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  levelA1: {
    backgroundColor: '#E8F6E8',
  },
  levelA2: {
    backgroundColor: '#CCF2CC',
  },
  levelB1: {
    backgroundColor: '#FFF4DC',
  },
  levelB2: {
    backgroundColor: '#FFE0B2',
  },
  levelC1: {
    backgroundColor: '#E6F8FA',
  },
  levelC2: {
    backgroundColor: '#D4EEFF',
  },
  levelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  exampleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exampleText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontStyle: 'italic',
  },
  speakExample: {
    padding: 5,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#555',
  },
  noteCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD900',
  },
  additionalInfo: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  actionsContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  practiceButton: {
    backgroundColor: '#58CC02',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  practiceButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4B4B',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  retryButton: {
    backgroundColor: '#58CC02',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    height: 20,
  },
});

export default WordDetailScreen; 
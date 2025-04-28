import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getRandomWords } from '../services/wordService';
import { recordWordView, recordWordAnswer, getWordStatus } from '../services/statsService';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const StudyScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDefinition, setShowDefinition] = useState(false);
  const [studyComplete, setStudyComplete] = useState(false);
  const [wordStatuses, setWordStatuses] = useState({});

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      setLoading(true);
      // 10 rastgele kelime yükle
      const wordData = await getRandomWords(10);
      setWords(wordData);
      
      // Kelimelerin durum bilgilerini yükle
      const statuses = {};
      for (const word of wordData) {
        const status = await getWordStatus(word.id);
        statuses[word.id] = status;
      }
      setWordStatuses(statuses);
      
      setError(null);
    } catch (err) {
      console.error('Kelimeler yüklenirken hata:', err);
      setError('Kelimeler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleShowDefinition = async () => {
    const currentWord = words[currentWordIndex];
    try {
      // Kelime görüntüleme sayısını kaydet
      await recordWordView(currentWord.id);
      setShowDefinition(true);
    } catch (error) {
      console.error('Kelime görüntülenme kaydedilirken hata:', error);
    }
  };

  const handleAnswer = async (isCorrect) => {
    const currentWord = words[currentWordIndex];
    try {
      // Cevabı kaydet (doğru/yanlış)
      await recordWordAnswer(currentWord.id, isCorrect);
      
      // Güncel kelime durumunu al
      const updatedStatus = await getWordStatus(currentWord.id);
      setWordStatuses(prev => ({
        ...prev,
        [currentWord.id]: updatedStatus
      }));
      
      // Sonraki kelimeye geç
      if (currentWordIndex < words.length - 1) {
        setTimeout(() => {
          setCurrentWordIndex(currentWordIndex + 1);
          setShowDefinition(false);
        }, 500);
      } else {
        setStudyComplete(true);
      }
    } catch (error) {
      console.error('Cevap kaydedilirken hata:', error);
      Alert.alert('Hata', 'Cevap kaydedilirken bir hata oluştu');
    }
  };

  const handleRestart = () => {
    setCurrentWordIndex(0);
    setShowDefinition(false);
    setStudyComplete(false);
    loadWords();
  };

  const handleWordDetail = () => {
    const currentWord = words[currentWordIndex];
    navigation.navigate('WordDetail', { wordId: currentWord.id });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Kelimeler yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF5E62" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadWords}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (studyComplete) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
        <LinearGradient
          colors={['#4CAF50', '#8BC34A']}
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
              <Text style={styles.headerTitle}>Çalışma Tamamlandı</Text>
            </View>
          </View>
        </LinearGradient>
        
        <View style={styles.completeContainer}>
          <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
          <Text style={styles.completeTitle}>Tebrikler!</Text>
          <Text style={styles.completeText}>
            Bu çalışma oturumunu tamamladınız. Kelimeleri düzenli tekrar etmek
            öğrenmenizi hızlandıracaktır.
          </Text>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
            onPress={handleRestart}
          >
            <Text style={styles.actionButtonText}>Yeniden Başla</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.actionButtonText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentWord = words[currentWordIndex];
  const progress = ((currentWordIndex + 1) / words.length) * 100;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      <LinearGradient
        colors={['#4CAF50', '#8BC34A']}
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
            <Text style={styles.headerTitle}>Kelime Çalışması</Text>
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progress}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentWordIndex + 1} / {words.length}
        </Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {currentWord && (
          <View style={styles.wordCard}>
            <View style={styles.statusIndicator}>
              {wordStatuses[currentWord.id] === 'new' && (
                <View style={[styles.statusDot, { backgroundColor: '#ccc' }]} />
              )}
              {wordStatuses[currentWord.id] === 'learning' && (
                <View style={[styles.statusDot, { backgroundColor: '#FFA500' }]} />
              )}
              {wordStatuses[currentWord.id] === 'mastered' && (
                <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
              )}
            </View>
            
            <Text style={styles.term}>{currentWord.term}</Text>
            
            {!showDefinition ? (
              <TouchableOpacity 
                style={styles.revealButton}
                onPress={handleShowDefinition}
              >
                <Text style={styles.revealButtonText}>Anlamı Göster</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.definitionContainer}>
                <Text style={styles.definition}>{currentWord.definition}</Text>
                
                <View style={styles.responseButtons}>
                  <TouchableOpacity 
                    style={[styles.responseButton, styles.incorrectButton]}
                    onPress={() => handleAnswer(false)}
                  >
                    <Ionicons name="close-circle" size={20} color="#fff" />
                    <Text style={styles.responseButtonText}>Bilmedim</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.responseButton, styles.correctButton]}
                    onPress={() => handleAnswer(true)}
                  >
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.responseButtonText}>Bildim</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.detailButton}
              onPress={handleWordDetail}
            >
              <Text style={styles.detailButtonText}>Detaylar</Text>
              <Ionicons name="information-circle-outline" size={20} color="#2196F3" />
            </TouchableOpacity>
          </View>
        )}
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
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    width: 50,
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  wordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statusIndicator: {
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  term: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  revealButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  revealButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  definitionContainer: {
    marginTop: 20,
  },
  definition: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    lineHeight: 26,
  },
  responseButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  responseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '48%',
  },
  incorrectButton: {
    backgroundColor: '#FF5252',
  },
  correctButton: {
    backgroundColor: '#4CAF50',
  },
  responseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 10,
  },
  detailButtonText: {
    color: '#2196F3',
    fontSize: 14,
    marginRight: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF5E62',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  completeTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  completeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  actionButton: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StudyScreen; 
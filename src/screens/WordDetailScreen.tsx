import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { getWordById } from '../services/wordService';
import { Ionicons } from '@expo/vector-icons';

const WordDetailScreen = ({ route, navigation }) => {
  const { wordId } = route.params;
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWordDetails();
  }, [wordId]);

  const fetchWordDetails = async () => {
    try {
      setLoading(true);
      const wordData = await getWordById(wordId);
      setWord(wordData);
      setError(null);
    } catch (err) {
      console.error('Kelime detayı yüklenirken hata oluştu:', err);
      setError('Kelime detayı yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Kelime detayı yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="cloud-offline" size={64} color="#FF5E62" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchWordDetails}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Kelime Detayı</Text>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.wordCard}>
          <Text style={styles.englishWord}>{word?.english}</Text>
          {word?.pronunciation && (
            <Text style={styles.pronunciation}>/{word.pronunciation}/</Text>
          )}
          <Text style={styles.turkishWord}>{word?.turkish}</Text>
          
          {word?.exampleSentence && (
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleLabel}>Örnek Cümle:</Text>
              <Text style={styles.exampleSentence}>{word.exampleSentence}</Text>
            </View>
          )}
          
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Kategori:</Text>
            <Text style={styles.categoryName}>{word?.category?.name}</Text>
          </View>
          
          <View style={styles.difficultyContainer}>
            <Text style={styles.difficultyLabel}>Zorluk:</Text>
            <View style={[
              styles.difficultyBadge, 
              word?.difficulty === 'easy' ? styles.easyBadge : 
              word?.difficulty === 'hard' ? styles.hardBadge : 
              styles.mediumBadge
            ]}>
              <Text style={styles.difficultyText}>
                {word?.difficulty === 'easy' ? 'Kolay' : 
                 word?.difficulty === 'hard' ? 'Zor' : 'Orta'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="volume-high-outline" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Dinle</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Kaydet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Paylaş</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTextContainer: {
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  wordCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  englishWord: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pronunciation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  turkishWord: {
    fontSize: 22,
    color: '#4CAF50',
    marginBottom: 20,
  },
  exampleContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  exampleLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  exampleSentence: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 5,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 5,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  easyBadge: {
    backgroundColor: '#E8F5E9',
  },
  mediumBadge: {
    backgroundColor: '#FFF8E1',
  },
  hardBadge: {
    backgroundColor: '#FFEBEE',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF5E62',
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
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WordDetailScreen;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { getWordsByCategory } from '../services/wordService';
import { getCategoryById } from '../services/categoryService';
import { Ionicons } from '@expo/vector-icons';

const CategoryDetailScreen = ({ route, navigation }) => {
  const { categoryId } = route.params;
  const [category, setCategory] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryAndWords();
  }, [categoryId]);

  const fetchCategoryAndWords = async () => {
    try {
      setLoading(true);
      console.log('Fetching category with ID:', categoryId);
      const categoryData = await getCategoryById(categoryId);
      console.log('Category data:', categoryData);
      
      const wordsData = await getWordsByCategory(categoryId);
      console.log('Words data:', wordsData);
      
      setCategory(categoryData);
      setWords(wordsData);
      setError(null);
    } catch (err) {
      console.error('Kategori ve kelimeler yüklenirken hata oluştu:', err);
      setError('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const renderWordItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.wordCard}
      onPress={() => navigation.navigate('WordDetail', { wordId: item._id })}
      activeOpacity={0.7}
    >
      <View style={styles.wordContent}>
        <Text style={styles.englishWord}>{item.english}</Text>
        <Text style={styles.turkishWord}>{item.turkish}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

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
        <Ionicons name="cloud-offline" size={64} color="#FF5E62" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCategoryAndWords}>
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
          <Text style={styles.headerTitle}>{category?.name || 'Kategori'}</Text>
          <Text style={styles.wordCount}>{words.length} kelime</Text>
        </View>
      </View>
      
      {words.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="book-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Bu kategoride henüz kelime bulunmamaktadır</Text>
        </View>
      ) : (
        <FlatList
          data={words}
          renderItem={renderWordItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  wordCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  listContainer: {
    padding: 15,
  },
  wordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  turkishWord: {
    fontSize: 16,
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
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});

export default CategoryDetailScreen;
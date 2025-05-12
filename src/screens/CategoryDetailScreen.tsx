import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getCategoryById } from '../services/categoryService';
import { getWordsByCategory } from '../services/wordService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const CategoryDetailScreen = ({ route, navigation }) => {
  const { colors, isDark } = useTheme();
  const { categoryId } = route.params;
  const { user } = useAuth();
  
  const [category, setCategory] = useState(null);
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategoryDetails();
  }, [categoryId]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredWords(words);
    } else {
      const filtered = words.filter(word => 
        (word.english_word ? word.english_word.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
        (word.turkish_word ? word.turkish_word.toLowerCase().includes(searchQuery.toLowerCase()) : false)
      );
      setFilteredWords(filtered);
    }
  }, [searchQuery, words]);

  const loadCategoryDetails = async () => {
    try {
      setLoading(true);
      
      console.log(`Kategori ID ${categoryId} için detaylar yükleniyor...`);
      
      // Kategori detaylarını getir
      const categoryData = await getCategoryById(categoryId);
      console.log('Kategori detayları başarıyla alındı:', categoryData);
      setCategory(categoryData);
      
      // Kategoriye ait kelimeleri getir
      console.log(`Kategori ID ${categoryId} için kelimeler getiriliyor...`);
      const wordsData = await getWordsByCategory(categoryId);
      console.log(`Kategori ID ${categoryId} için ${wordsData.length} kelime alındı:`, wordsData);
      setWords(wordsData);
      setFilteredWords(wordsData);
      
      setError(null);
    } catch (err) {
      console.error('Kategori detayları yüklenirken hata:', err);
      console.error('Kategori çekme hatası:', err);
      setError('Kategori detayları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getRandomGradient = () => {
    // Dark mode için daha koyu ama canlı renkler
    const darkGradients: readonly [string, string][] = [
      ['#FF5722', '#C41C00'], // Turuncu-kırmızı
      ['#2196F3', '#0D47A1'], // Mavi
      ['#4CAF50', '#1B5E20'], // Yeşil
      ['#9C27B0', '#4A148C'], // Mor
      ['#FF9800', '#E65100'], // Turuncu
    ];
    
    // Light mode için daha açık, parlak renkler
    const lightGradients: readonly [string, string][] = [
      ['#FF9966', '#FF5E62'], // Turuncu-kırmızı
      ['#56CCF2', '#2F80ED'], // Mavi
      ['#4CAF50', '#8BC34A'], // Yeşil
      ['#9C27B0', '#673AB7'], // Mor
      ['#F2994A', '#F2C94C'], // Turuncu
    ];
    
    const gradients = isDark ? darkGradients : lightGradients;
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const renderWordItem = ({ item }) => {
    const gradient = getRandomGradient();
    
    return (
      <TouchableOpacity 
        style={[styles.wordCard, { 
          backgroundColor: colors.card,
          shadowColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'
        }]}
        onPress={() => navigation.navigate('WordDetail', { wordId: item._id })}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={gradient}
          style={styles.wordGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.wordContent}>
            <Text style={styles.englishWord}>{item.english_word || 'Kelime bulunamadı'}</Text>
            <Text style={styles.turkishWord}>{item.turkish_word || 'Çeviri bulunamadı'}</Text>
            {item.examples && item.examples.length > 0 && (
              <Text style={styles.exampleText} numberOfLines={2}>
                "{item.examples[0]}"
              </Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: colors.primary }]} 
          onPress={loadCategoryDetails}
        >
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#2E7D32" : "#4CAF50"} />
      
      <LinearGradient
        colors={isDark ? ['#2E7D32', '#1B5E20'] : ['#4CAF50', '#8BC34A']}
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
            <Text style={styles.headerTitle}>{category?.name}</Text>
            <Text style={styles.wordCount}>{words.length} kelime</Text>
          </View>
        </View>
      </LinearGradient>
      
      <View style={[styles.searchContainer, { 
        backgroundColor: colors.card,
        shadowColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'
      }]}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Kelime ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      {category?.description && (
        <View style={[styles.descriptionContainer, { 
          backgroundColor: colors.card,
          shadowColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'
        }]}>
          <Text style={[styles.descriptionText, { color: colors.text }]}>{category.description}</Text>
        </View>
      )}
      
      {filteredWords.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {searchQuery.length > 0 
              ? 'Aramanızla eşleşen kelime bulunamadı' 
              : 'Bu kategoride henüz kelime bulunmamaktadır'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredWords}
          renderItem={renderWordItem}
          keyExtractor={item => item._id}
          contentContainerStyle={[styles.listContainer, { backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
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
  wordCount: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  listContainer: {
    padding: 10,
    paddingBottom: 30,
  },
  wordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 6,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  wordGradient: {
    padding: 16,
  },
  wordContent: {
    paddingVertical: 6,
  },
  englishWord: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  turkishWord: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
    marginTop: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
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
    elevation: 2,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CategoryDetailScreen; 
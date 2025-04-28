import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchWords } from '../services/wordService';
import { LinearGradient } from 'expo-linear-gradient';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(['apple', 'hello', 'school', 'food']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  
  // Animasyonlar için değişkenler
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
    // Ekran açıldığında input otomatik fokuslanır
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    
    // Animasyonları başlat
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (query.trim().length > 1) {
        performSearch();
      } else if (query.trim().length === 0) {
        setResults([]);
      }
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [query]);
  
  const performSearch = async () => {
    if (query.trim().length < 2) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await searchWords(query);
      setResults(data);
      
      // Son aramaları güncelle (gerçek uygulamada AsyncStorage kullanılabilir)
      updateRecentSearches(query);
    } catch (err) {
      console.error('Arama hatası:', err);
      setError('Arama yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  
  const updateRecentSearches = (newQuery) => {
    const trimmedQuery = newQuery.trim();
    if (trimmedQuery && !recentSearches.includes(trimmedQuery)) {
      const updated = [trimmedQuery, ...recentSearches].slice(0, 5);
      setRecentSearches(updated);
    }
  };
  
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };
  
  const handleItemPress = (item) => {
    // Kelime detayına yönlendir
    navigation.navigate('WordDetail', { wordId: item._id });
  };
  
  const renderResultItem = ({ item }) => {
    // Aranan metin içindeki arama terimini vurgula
    const highlightedEnglish = highlightMatchedText(item.english_word, query);
    const highlightedTurkish = highlightMatchedText(item.turkish_word, query);
    
    return (
      <TouchableOpacity 
        style={styles.resultItem}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#fff', '#f8f8f8']}
          style={styles.resultGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.wordContainer}>
            <Text style={styles.englishWord}>{item.english_word}</Text>
            <Text style={styles.turkishWord}>{item.turkish_word}</Text>
          </View>
          
          <View style={styles.itemBadges}>
            {item.level && (
              <View style={[styles.badge, getLevelBadgeStyle(item.level)]}>
                <Text style={styles.badgeText}>{item.level}</Text>
              </View>
            )}
            {item.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category.name}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.itemArrow}>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  
  const highlightMatchedText = (text, query) => {
    if (!text || !query || query.trim() === '') return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => (
      part.toLowerCase() === query.toLowerCase() ? (
        <Text key={index} style={styles.highlight}>{part}</Text>
      ) : (
        part
      )
    ));
  };
  
  const getLevelBadgeStyle = (level) => {
    switch(level.toUpperCase()) {
      case 'A1': return styles.levelA1;
      case 'A2': return styles.levelA2;
      case 'B1': return styles.levelB1;
      case 'B2': return styles.levelB2;
      case 'C1': return styles.levelC1;
      case 'C2': return styles.levelC2;
      default: return styles.levelA1;
    }
  };
  
  const renderRecentSearchItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => {
        setQuery(item);
        performSearch();
      }}
    >
      <Ionicons name="time-outline" size={16} color="#888" />
      <Text style={styles.recentText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#58CC02" />
      
      <LinearGradient
        colors={['#58CC02', '#30A501']}
        style={styles.header}
      >
        <View style={styles.searchHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Kelime veya ifade ara..."
              placeholderTextColor="#999"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              onSubmitEditing={performSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={clearSearch}
              >
                <Ionicons name="close-circle" size={18} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
      
      <Animated.View 
        style={[
          styles.content, 
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#58CC02" />
            <Text style={styles.loaderText}>Aranıyor...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={64} color="#FF4B4B" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={performSearch}>
              <Text style={styles.retryButtonText}>Tekrar Dene</Text>
            </TouchableOpacity>
          </View>
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            renderItem={renderResultItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : query.length > 0 ? (
          <View style={styles.noResultContainer}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.noResultText}>"{query}" için sonuç bulunamadı</Text>
            <Text style={styles.noResultSubtext}>Farklı bir kelime aramayı deneyin</Text>
          </View>
        ) : (
          <View style={styles.recentSearchesContainer}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Son Aramalar</Text>
              {recentSearches.length > 0 && (
                <TouchableOpacity 
                  onPress={() => setRecentSearches([])}
                  hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                >
                  <Text style={styles.clearAllText}>Temizle</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {recentSearches.length > 0 ? (
              <FlatList
                data={recentSearches}
                renderItem={renderRecentSearchItem}
                keyExtractor={item => item}
                contentContainerStyle={styles.recentListContainer}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyRecentContainer}>
                <Ionicons name="time-outline" size={50} color="#ddd" />
                <Text style={styles.emptyRecentText}>Henüz son arama yok</Text>
              </View>
            )}
            
            <View style={styles.suggestionContainer}>
              <Text style={styles.suggestionTitle}>Arama İpuçları</Text>
              <View style={styles.tipCard}>
                <Ionicons name="bulb-outline" size={22} color="#1CB0F6" />
                <Text style={styles.tipText}>Kelime, kategori veya seviye arayabilirsiniz.</Text>
              </View>
              <View style={styles.tipCard}>
                <Ionicons name="information-circle-outline" size={22} color="#1CB0F6" />
                <Text style={styles.tipText}>En az 2 karakter girmelisiniz.</Text>
              </View>
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
    paddingTop: 45,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
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
  retryButton: {
    backgroundColor: '#58CC02',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  noResultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 16,
  },
  noResultSubtext: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 30,
  },
  resultItem: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  resultGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordContainer: {
    flex: 1,
  },
  englishWord: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  turkishWord: {
    fontSize: 15,
    color: '#666',
  },
  highlight: {
    backgroundColor: 'rgba(88, 204, 2, 0.2)',
    color: '#333',
    fontWeight: '700',
  },
  itemBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 6,
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
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  categoryBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  itemArrow: {
    marginLeft: 8,
  },
  recentSearchesContainer: {
    flex: 1,
    paddingTop: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  clearAllText: {
    fontSize: 14,
    color: '#1CB0F6',
    fontWeight: '600',
  },
  recentListContainer: {
    paddingBottom: 20,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  recentText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  emptyRecentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  emptyRecentText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  suggestionContainer: {
    marginTop: 20,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tipText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
});

export default SearchScreen; 
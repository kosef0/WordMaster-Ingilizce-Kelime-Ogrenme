import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
  TextInput,
} from 'react-native';
import { getCategories } from '../services/categoryService';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const CategoriesScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Animasyon değerleri
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [200, 80],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      setFilteredCategories(categoriesData);
      setError(null);
    } catch (err) {
      console.error('Kategoriler yüklenirken hata:', err);
      setError('Kategoriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getRandomGradient = (index) => {
    const gradients = isDark ? [
      ['#2196F3', '#0D47A1'], // Mavi
      ['#4CAF50', '#1B5E20'], // Yeşil
      ['#FF5722', '#C41C00'], // Turuncu-kırmızı
      ['#9C27B0', '#4A148C'], // Mor
      ['#FF9800', '#E65100'], // Turuncu
      ['#009688', '#004D40'], // Teal
      ['#3F51B5', '#1A237E'], // Indigo
    ] as readonly [string, string][] : [
      ['#2196F3', '#42A5F5'], // Mavi
      ['#4CAF50', '#66BB6A'], // Yeşil
      ['#FF5722', '#FF8A65'], // Turuncu-kırmızı
      ['#9C27B0', '#BA68C8'], // Mor
      ['#FF9800', '#FFA726'], // Turuncu
      ['#009688', '#26A69A'], // Teal
      ['#3F51B5', '#5C6BC0'], // Indigo
    ] as readonly [string, string][];
    return gradients[index % gradients.length];
  };

  const getCategoryIcon = (name) => {
    // Kategori ismine göre icon seç
    const lowerName = name ? name.toLowerCase() : '';
    
    if (lowerName.includes('yemek') || lowerName.includes('yiyecek')) {
      return 'restaurant';
    } else if (lowerName.includes('spor')) {
      return 'football';
    } else if (lowerName.includes('seyahat')) {
      return 'airplane';
    } else if (lowerName.includes('iş')) {
      return 'briefcase';
    } else if (lowerName.includes('renk')) {
      return 'color-palette';
    } else if (lowerName.includes('sayı')) {
      return 'calculator';
    } else if (lowerName.includes('fiil')) {
      return 'flash';
    } else if (lowerName.includes('zaman')) {
      return 'time';
    }
    
    return 'library'; // Varsayılan icon
  };

  const renderItem = ({ item, index }) => {
    const gradient = getRandomGradient(index);
    const icon = getCategoryIcon(item.name);
    const completionPercent = Math.floor(Math.random() * 100); // Demo amaçlı rastgele tamamlanma yüzdesi
    
    return (
      <TouchableOpacity 
        style={[
          styles.categoryCard,
          { 
            backgroundColor: colors.card,
            shadowColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'
          }
        ]}
        onPress={() => navigation.navigate('CategoryDetail', { categoryId: item._id })}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={gradient}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={22} color="#fff" />
            </View>
            <View style={styles.completionBadge}>
              <Text style={styles.completionText}>{completionPercent}%</Text>
            </View>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.categoryName}>{item.name}</Text>
            {item.description && (
              <Text style={styles.categoryDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${completionPercent}%` }
                ]} 
              />
            </View>
            
            <View style={styles.cardFooter}>
              <View style={styles.wordCount}>
                <Ionicons name="book-outline" size={14} color="rgba(255,255,255,0.9)" />
                <Text style={styles.wordCountText}>
                  {item.wordCount || Math.floor(Math.random() * 40 + 10)} kelime
                </Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={24} color="#fff" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Kategoriler yükleniyor...</Text>
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
          onPress={loadCategories}
        >
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#121212" : "#3F51B5"} />
      
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={isDark ? ['#303F9F', '#1A237E'] : ['#3F51B5', '#5C6BC0']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Animated.View 
            style={[
              styles.headerTitleContainer, 
              {
                opacity: headerOpacity,
                transform: [
                  { scale: titleScale },
                  { translateY: titleTranslateY }
                ]
              }
            ]}
          >
            <Text style={styles.headerTitle}>Kelime Kategorileri</Text>
            <Text style={styles.headerSubtitle}>İngilizce kelime kategorilerini keşfedin</Text>
          </Animated.View>
          
          <View style={styles.searchBarContainer}>
            <TouchableOpacity 
              style={styles.searchBar}
              onPress={() => navigation.navigate('Search')}
              activeOpacity={0.7}
            >
              <Ionicons name="search" size={20} color="#777" />
              <Text style={styles.searchPlaceholder}>Kategori veya kelime ara...</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
      
      <View style={[styles.searchContainer, { 
        backgroundColor: colors.card,
        shadowColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'
      }]}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Kategori ara..."
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
      
      {filteredCategories.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <Ionicons name="folder-open-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {searchQuery.length > 0 
              ? 'Aramanızla eşleşen kategori bulunamadı' 
              : 'Henüz kategori bulunmamaktadır'}
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          data={filteredCategories}
          renderItem={renderItem}
          keyExtractor={item => item._id || Math.random().toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          numColumns={2}
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
  header: {
    position: 'absolute',
    width: '100%',
    zIndex: 10,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 45,
    paddingHorizontal: 20,
  },
  headerTitleContainer: {
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 5,
  },
  searchBarContainer: {
    marginBottom: 15,
  },
  searchBar: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  searchPlaceholder: {
    marginLeft: 10,
    fontSize: 16,
    color: '#aaa',
  },
  listContainer: {
    paddingTop: 230,
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  cardGradient: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  completionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  categoryDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 10,
    flex: 1,
  },
  progressBar: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordCountText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    marginLeft: 5,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
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
});

export default CategoriesScreen;
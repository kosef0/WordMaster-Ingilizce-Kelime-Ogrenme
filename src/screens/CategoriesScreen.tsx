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
} from 'react-native';
import { getCategories } from '../services/categoryService';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CategoriesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
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
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      console.log('Çekilen kategoriler:', data);
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error('Kategori çekme hatası:', err);
      setError('Kategorileri yüklerken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Kategori kartları için renkler - tipini readonly tuples olarak değiştirelim
  const gradientColors: readonly [string, string][] = [
    ['#58CC02', '#2B8700'], // Duolingo Yeşil
    ['#1CB0F6', '#0076BA'], // Duolingo Mavi
    ['#FF9600', '#E05D00'], // Turuncu
    ['#FF4B4B', '#C00000'], // Kırmızı
    ['#A560FF', '#7839D4'], // Mor
    ['#F2B134', '#E0A400'], // Sarı
    ['#00CD9C', '#00A47D'], // Turkuaz
  ];

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
    const colorIndex = index % gradientColors.length;
    const icon = getCategoryIcon(item.name);
    const completionPercent = Math.floor(Math.random() * 100); // Demo amaçlı rastgele tamamlanma yüzdesi
    
    return (
      <TouchableOpacity 
        style={styles.categoryCard}
        onPress={() => navigation.navigate('CategoryDetail', { categoryId: item._id })}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={gradientColors[colorIndex]}
          style={styles.gradient}
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#58CC02" />
        <Text style={styles.loadingText}>Kategoriler yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="cloud-offline" size={64} color="#FF4B4B" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCategories}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#58CC02" />
      
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={['#58CC02', '#30A501']}
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
            <Text style={styles.headerTitle}>Kategoriler</Text>
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
      
      {categories.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="folder-open-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Henüz kategori bulunmamaktadır</Text>
        </View>
      ) : (
        <Animated.FlatList
          data={categories}
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
    backgroundColor: '#f6f6f6',
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
  gradient: {
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
});

export default CategoriesScreen;
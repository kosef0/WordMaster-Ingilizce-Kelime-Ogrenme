import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Dimensions
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles';
import { CATEGORIES, Category, SAMPLE_WORDS } from '../constants';
import { Button, CategoryCard } from '../components';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamList, RootStackParamList } from '../navigation';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type CategoryListScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Categories'>,
  StackNavigationProp<RootStackParamList>
>;

const { width } = Dimensions.get('window');

const CategoryListScreen: React.FC = () => {
  const navigation = useNavigation<CategoryListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'themes' | 'levels'>('all');
  const [animationReady, setAnimationReady] = useState(false);
  
  useEffect(() => {
    // Animasyon için kısa gecikme
    const timer = setTimeout(() => {
      setAnimationReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Kategorilere göre kelime sayıları hesaplanıyor
  const categoryWordCounts = SAMPLE_WORDS.reduce((acc, word) => {
    if (!acc[word.category]) {
      acc[word.category] = { total: 0, learned: 0 };
    }
    
    acc[word.category].total += 1;
    if (word.isLearned) {
      acc[word.category].learned += 1;
    }
    
    return acc;
  }, {} as Record<string, { total: number; learned: number }>);
  
  // Kategorileri filtreleyelim
  const filteredCategories = CATEGORIES.filter(category => {
    // Tab filtresi
    if (activeTab === 'themes' && category.level) return false;
    if (activeTab === 'levels' && !category.level) return false;
    
    // Arama filtresi
    if (searchQuery) {
      return category.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });
  
  const getCategoryProgress = (categoryId: string) => {
    // Gerçekte bu map edilebilir ama örnek verilerle çalışıyoruz
    if (categoryId === 'fruits') {
      return { learned: 2, total: 5 };
    } else if (categoryId === 'animals') {
      return { learned: 1, total: 8 };
    } else if (categoryId === 'colors') {
      return { learned: 5, total: 10 };
    } else if (categoryId === 'a1') {
      return { learned: 15, total: 50 };
    } else if (categoryId === 'b1') {
      return { learned: 5, total: 75 };
    } else if (categoryId === 'c1') {
      return { learned: 0, total: 100 };
    }
    
    // Diğer kategoriler için varsayılan değerler
    return { learned: Math.floor(Math.random() * 10), total: 10 + Math.floor(Math.random() * 40) };
  };
  
  const renderCategoryItem = ({ item, index }: { item: Category, index: number }) => {
    const progress = getCategoryProgress(item.id);
    
    return (
      <Animatable.View
        animation={animationReady ? "fadeInUp" : undefined}
        duration={800}
        delay={400 + (index * 100)} 
        style={styles.categoryCardContainer}
      >
        <CategoryCard 
          category={item}
          progress={progress}
          onPress={() => {
            // Kategori detay ekranına yönlendirme yapılıyor
            navigation.navigate('CategoryDetail', { categoryId: item.id });
          }}
        />
      </Animatable.View>
    );
  };
  
  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={[COLORS.gradient.primaryToSecondary.start, COLORS.gradient.primaryToSecondary.end] as readonly [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Animatable.View 
          animation={animationReady ? "fadeInDown" : undefined}
          duration={1000}
          style={styles.headerContent}
        >
          <Text style={styles.headerTitle}>Kategoriler</Text>
          <Text style={styles.headerSubtitle}>İstediğiniz kategoriden kelime öğrenmeye başlayın</Text>
        </Animatable.View>
        
        <Animatable.View 
          animation={animationReady ? "fadeIn" : undefined}
          duration={1000}
          delay={300}
          style={styles.searchContainer}
        >
          <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Kategori Ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.gray}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </Animatable.View>
      </LinearGradient>
      
      <Animatable.View 
        animation={animationReady ? "fadeInUp" : undefined}
        duration={800}
        delay={400}
        style={styles.tabContainer}
      >
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>Tümü</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'themes' && styles.activeTab]} 
          onPress={() => setActiveTab('themes')}
        >
          <Text style={[styles.tabText, activeTab === 'themes' && styles.activeTabText]}>Temalar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'levels' && styles.activeTab]} 
          onPress={() => setActiveTab('levels')}
        >
          <Text style={[styles.tabText, activeTab === 'levels' && styles.activeTabText]}>Seviyeler</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
  
  const renderEmptyComponent = () => (
    <Animatable.View 
      animation={animationReady ? "fadeIn" : undefined}
      duration={800}
      style={styles.emptyContainer}
    >
      <Ionicons name="search-outline" size={50} color={COLORS.gray} />
      <Text style={styles.emptyText}>Kategori bulunamadı</Text>
      <Text style={styles.emptySubtext}>Farklı bir arama terimi deneyin</Text>
    </Animatable.View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <FlatList
        data={filteredCategories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={[
          styles.listContent,
          filteredCategories.length === 0 && styles.emptyListContent
        ]}
        showsVerticalScrollIndicator={false}
      />
      
      <Animatable.View 
        animation={animationReady ? "fadeInUp" : undefined}
        duration={800}
        style={styles.footer}
      >
        <Button 
          title="Ana Sayfaya Dön"
          variant="outline"
          onPress={() => {
            navigation.navigate('Home');
          }}
        />
      </Animatable.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: SIZES.xxlarge + 70,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    backgroundColor: COLORS.white,
    marginBottom: SIZES.medium,
    borderBottomLeftRadius: SIZES.medium,
    borderBottomRightRadius: SIZES.medium,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  headerGradient: {
    padding: SIZES.large,
  },
  headerContent: {
    marginBottom: SIZES.medium,
  },
  headerTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 1,
    marginBottom: SIZES.small / 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: FONTS.size.medium,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SIZES.medium,
  },
  searchContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    padding: SIZES.small,
    marginBottom: SIZES.small,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: SIZES.small,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: FONTS.size.medium,
    color: COLORS.darkGray,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    margin: SIZES.medium,
    marginTop: 0,
    padding: SIZES.small / 2,
    ...SHADOWS.small,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.small,
    alignItems: 'center',
    borderRadius: SIZES.small - 2,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  tabText: {
    fontSize: FONTS.size.small,
    fontWeight: '500',
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  categoryCardContainer: {
    marginHorizontal: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.xxlarge,
  },
  emptyText: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginTop: SIZES.medium,
  },
  emptySubtext: {
    fontSize: FONTS.size.medium,
    color: COLORS.gray,
    marginTop: SIZES.small,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    ...SHADOWS.medium,
  },
});

export default CategoryListScreen; 
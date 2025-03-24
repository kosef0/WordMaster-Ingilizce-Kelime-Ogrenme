import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  Platform
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles';
import { SAMPLE_WORDS, Word, CATEGORIES } from '../constants';
import { WordCard, Button, CategoryCard } from '../components';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamList, RootStackParamList } from '../navigation';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [words, setWords] = useState<Word[]>(SAMPLE_WORDS);
  const [animationReady, setAnimationReady] = useState(false);
  
  useEffect(() => {
    // Animasyon için kısa gecikme
    const timer = setTimeout(() => {
      setAnimationReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleMarkLearned = (id: string) => {
    setWords(prevWords => 
      prevWords.map(word => 
        word.id === id ? { ...word, isLearned: true } : word
      )
    );
  };

  const renderWordCard = ({ item }: { item: Word }) => {
    if (item.isLearned) return null;
    
    return (
      <WordCard
        word={item.word}
        translation={item.translation}
        pronunciation={item.pronunciation}
        examples={item.examples}
        difficulty={item.difficulty}
        onMarkLearned={() => handleMarkLearned(item.id)}
      />
    );
  };

  // Kategori seçiminde çağrılacak fonksiyon
  const handleCategorySelect = (categoryId: string) => {
    // Kategori detay ekranına yönlendirme yapılıyor
    navigation.navigate('CategoryDetail', { categoryId });
  };

  const statistics = {
    totalWords: words.length,
    learnedWords: words.filter(word => word.isLearned).length
  };

  const categoryStats = words.reduce((acc, word) => {
    if (!acc[word.category]) {
      acc[word.category] = { total: 0, learned: 0 };
    }
    
    acc[word.category].total += 1;
    if (word.isLearned) {
      acc[word.category].learned += 1;
    }
    
    return acc;
  }, {} as Record<string, { total: number; learned: number }>);
  
  // Ana ekranda gösterilecek kategorileri seçiyoruz
  const featuredCategories = CATEGORIES.filter(cat => !cat.level).slice(0, 5);

  // Kategori ilerleme bilgilerini alma fonksiyonu
  const getCategoryProgress = (categoryId: string) => {
    // Eğer kategori ID'si veritabanımızda varsa gerçek verileri kullanıyoruz
    if (categoryStats[categoryId]) {
      return categoryStats[categoryId];
    }
    
    // Yoksa varsayılan/örnek veriler dönüyoruz
    return { learned: 0, total: 0 };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryDark} barStyle="light-content" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={[COLORS.gradient.coolGradient.start, COLORS.gradient.coolGradient.end] as readonly [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />
      
      {/* Decorative Shapes */}
      <View style={styles.shapesContainer}>
        <Animatable.View 
          animation={animationReady ? "fadeIn" : undefined}
          duration={1000} 
          style={[styles.decorativeShape, styles.shape1]} 
        />
        <Animatable.View 
          animation={animationReady ? "fadeIn" : undefined}
          duration={1500} 
          delay={200}
          style={[styles.decorativeShape, styles.shape2]} 
        />
        <Animatable.View 
          animation={animationReady ? "fadeIn" : undefined}
          duration={1200} 
          delay={400}
          style={[styles.decorativeShape, styles.shape3]} 
        />
      </View>
      
      <View style={styles.header}>
        <Animatable.Text 
          animation={animationReady ? "fadeInDown" : undefined}
          duration={1000}
          style={styles.headerTitle}
        >
          WordMaster
        </Animatable.Text>
        <Animatable.View 
          animation={animationReady ? "fadeInDown" : undefined}
          duration={1000}
          delay={200}
          style={styles.userContainer}
        >
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.iconText}>👤</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
      
      <Animatable.View 
        animation={animationReady ? "fadeIn" : undefined}
        duration={800}
        delay={300}
        style={styles.statsContainer}
      >
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{statistics.totalWords}</Text>
          <Text style={styles.statLabel}>Toplam Kelime</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{statistics.learnedWords}</Text>
          <Text style={styles.statLabel}>Öğrenilen</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {Math.round((statistics.learnedWords / statistics.totalWords) * 100)}%
          </Text>
          <Text style={styles.statLabel}>İlerleme</Text>
        </View>
      </Animatable.View>
      
      <View style={styles.categoryContainer}>
        <Animatable.View 
          animation={animationReady ? "fadeInLeft" : undefined}
          duration={800}
          delay={400}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Kategoriler</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Categories')}
          >
            <Text style={styles.seeAllText}>Tümünü Gör →</Text>
          </TouchableOpacity>
        </Animatable.View>
        
        <FlatList
          data={featuredCategories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const progress = getCategoryProgress(item.id);
            
            return (
              <Animatable.View
                animation={animationReady ? "fadeInUp" : undefined}
                duration={800}
                delay={500 + (index * 100)}
              >
                <CategoryCard
                  category={item}
                  progress={progress}
                  onPress={() => handleCategorySelect(item.id)}
                  style={styles.horizontalCategoryCard}
                  showProgress={false}
                />
              </Animatable.View>
            );
          }}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      <View style={styles.wordsSection}>
        <Animatable.View
          animation={animationReady ? "fadeInLeft" : undefined}
          duration={800}
          delay={600}
        >
          <Text style={styles.sectionTitle}>Bugünün Kelimeleri</Text>
        </Animatable.View>
        
        <FlatList
          data={words.filter(word => !word.isLearned).slice(0, 5)}
          renderItem={({ item, index }) => (
            <Animatable.View
              animation={animationReady ? "fadeInRight" : undefined}
              duration={800}
              delay={700 + (index * 100)}
            >
              {renderWordCard({ item })}
            </Animatable.View>
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.wordsList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 220,
  },
  shapesContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 250,
    overflow: 'hidden',
  },
  decorativeShape: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.5,
  },
  shape1: {
    width: 150,
    height: 150,
    backgroundColor: COLORS.white,
    top: -30,
    right: -30,
    opacity: 0.2,
  },
  shape2: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.secondary,
    top: 60,
    left: -25,
    opacity: 0.15,
  },
  shape3: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.accent,
    bottom: 50,
    right: 80,
    opacity: 0.1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  iconText: {
    fontSize: FONTS.size.large,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.large,
    marginTop: SIZES.medium,
    borderRadius: SIZES.medium,
    ...SHADOWS.medium,
    elevation: 4,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: COLORS.lightGray,
  },
  statNumber: {
    fontSize: FONTS.size.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.small / 2,
  },
  statLabel: {
    fontSize: FONTS.size.small,
    color: COLORS.darkGray,
  },
  categoryContainer: {
    marginBottom: SIZES.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    marginTop: SIZES.xlarge,
    marginBottom: SIZES.medium,
  },
  sectionTitle: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  seeAllText: {
    fontSize: FONTS.size.small,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoriesList: {
    paddingLeft: SIZES.large,
    paddingRight: SIZES.small,
  },
  horizontalCategoryCard: {
    marginRight: SIZES.medium,
    width: width * 0.4,
    minWidth: 150,
    maxWidth: 180,
  },
  wordsSection: {
    flex: 1,
    paddingHorizontal: SIZES.large,
    marginTop: SIZES.large,
  },
  wordsList: {
    paddingBottom: SIZES.xxlarge,
  },
});

export default HomeScreen; 
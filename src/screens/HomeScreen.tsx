import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('Kullanıcı');
  const [recentCategories, setRecentCategories] = useState([
    { id: '1', name: 'Yiyecekler', count: 42 },
    { id: '2', name: 'Fiiller', count: 38 },
    { id: '3', name: 'Renkler', count: 15 },
  ]);
  
  const [stats, setStats] = useState({
    learnedWords: 124,
    streak: 7,
    totalPoints: 1250
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      <LinearGradient
        colors={['#4CAF50', '#8BC34A']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Merhaba,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle" size={40} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Ionicons name="book-outline" size={24} color="#4CAF50" />
            <Text style={styles.statsNumber}>{stats.learnedWords}</Text>
            <Text style={styles.statsLabel}>Öğrenilen</Text>
          </View>
          
          <View style={styles.statsCard}>
            <Ionicons name="flame-outline" size={24} color="#FF5722" />
            <Text style={styles.statsNumber}>{stats.streak}</Text>
            <Text style={styles.statsLabel}>Gün Serisi</Text>
          </View>
          
          <View style={styles.statsCard}>
            <Ionicons name="star-outline" size={24} color="#FFC107" />
            <Text style={styles.statsNumber}>{stats.totalPoints}</Text>
            <Text style={styles.statsLabel}>Puan</Text>
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#E3F2FD' }]}
            onPress={() => navigation.navigate('Categories')}
          >
            <Ionicons name="grid-outline" size={28} color="#2196F3" />
            <Text style={styles.actionText}>Kategoriler</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#F9FBE7' }]}
            onPress={() => {/* Quiz başlat */}}
          >
            <Ionicons name="help-circle-outline" size={28} color="#8BC34A" />
            <Text style={styles.actionText}>Quiz</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#FFF3E0' }]}
            onPress={() => {/* Kelime Oyunu */}}
          >
            <Ionicons name="game-controller-outline" size={28} color="#FF9800" />
            <Text style={styles.actionText}>Oyun</Text>
          </TouchableOpacity>
        </View>
        
        {/* Recent Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son Kategoriler</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
            <Text style={styles.seeAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        
        {recentCategories.map((category) => (
          <TouchableOpacity 
            key={category.id}
            style={styles.categoryItem}
            onPress={() => navigation.navigate('CategoryDetail', { categoryId: category.id })}
          >
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count} kelime</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
        
        {/* Daily Challenge */}
        <TouchableOpacity style={styles.challengeCard}>
          <LinearGradient
            colors={['#673AB7', '#9C27B0']}
            style={styles.challengeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.challengeContent}>
              <View>
                <Text style={styles.challengeTitle}>Günlük Meydan Okuma</Text>
                <Text style={styles.challengeDescription}>
                  Bugün 5 yeni kelime öğren ve 100 puan kazan!
                </Text>
              </View>
              <Ionicons name="trophy" size={40} color="#FFC107" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.footer} />
      </ScrollView>
    </View>
=======
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
>>>>>>> bed42af4b2d242a4be38a0dce664da7ff1abddc0
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
=======
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
>>>>>>> bed42af4b2d242a4be38a0dce664da7ff1abddc0
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
<<<<<<< HEAD
    marginTop: -30,
    marginBottom: 20,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: (width - 60) / 3,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
=======
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
>>>>>>> bed42af4b2d242a4be38a0dce664da7ff1abddc0
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
<<<<<<< HEAD
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 60) / 3,
    height: 90,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    color: '#333',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  challengeCard: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  challengeGradient: {
    padding: 20,
  },
  challengeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  challengeDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    width: width - 120,
  },
  footer: {
    height: 20,
  },
});

export default HomeScreen;
=======
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
>>>>>>> bed42af4b2d242a4be38a0dce664da7ff1abddc0

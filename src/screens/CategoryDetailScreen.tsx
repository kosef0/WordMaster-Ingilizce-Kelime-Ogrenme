import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Alert
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles';
import { CATEGORIES, SAMPLE_WORDS, Word } from '../constants';
import { Button, WordCard } from '../components';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type CategoryDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CategoryDetail'>;
type CategoryDetailScreenRouteProp = RouteProp<RootStackParamList, 'CategoryDetail'>;

const { width } = Dimensions.get('window');

const CategoryDetailScreen: React.FC = () => {
  const navigation = useNavigation<CategoryDetailScreenNavigationProp>();
  const route = useRoute<CategoryDetailScreenRouteProp>();
  const { categoryId } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(CATEGORIES.find(c => c.id === categoryId));
  const [categoryWords, setCategoryWords] = useState<Word[]>([]);
  const [learningProgress, setLearningProgress] = useState({ learned: 0, total: 0 });
  const [animationReady, setAnimationReady] = useState(false);
  
  useEffect(() => {
    // Animasyon için kısa gecikme
    const timer = setTimeout(() => {
      setAnimationReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Kategoriye ait kelimeleri yükle
    const loadCategoryWords = () => {
      // Gerçek uygulamada API'den yükleme yapılacak
      // Şimdilik örnek veriler üzerinden filtreleme yapıyoruz
      setLoading(true);
      
      setTimeout(() => {
        // Örnek olarak kategori ID'si ile eşleşen kelimeleri filtreliyoruz
        // Gerçek senaryoda backend'den alınacak
        const words = SAMPLE_WORDS.filter(word => word.category === categoryId || 
          // Eğer örneklerde eşleşen yoksa, rastgele veri göster
          Math.random() > 0.7);
        
        setCategoryWords(words);
        setLearningProgress({
          learned: words.filter(word => word.isLearned).length,
          total: words.length
        });
        setLoading(false);
      }, 800); // Yükleme hissi için kısa bir gecikme
    };
    
    loadCategoryWords();
  }, [categoryId]);
  
  // Kategori öğrenildi mi kontrolü
  const isCategoryLearned = learningProgress.learned > 0 && learningProgress.learned === learningProgress.total;
  
  // Kelimeyi öğrenildi olarak işaretle
  const handleMarkLearned = (wordId: string) => {
    setCategoryWords(prevWords => 
      prevWords.map(word => 
        word.id === wordId ? { ...word, isLearned: true } : word
      )
    );
    
    // Öğrenme durumunu güncelle
    setLearningProgress(prev => ({
      ...prev,
      learned: prev.learned + 1
    }));
  };
  
  const renderWordCard = ({ item }: { item: Word }) => {
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
  
  const startQuiz = () => {
    // Quiz özelliği şimdilik devre dışı
    Alert.alert(
      "Geliştirme Aşamasında",
      "Quiz özelliği henüz geliştirme aşamasındadır. Daha sonra tekrar deneyin.",
      [{ text: "Tamam", style: "default" }]
    );
  };
  
  // Eğer kategori bulunamadıysa
  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={COLORS.primaryDark} barStyle="light-content" />
        <LinearGradient
          colors={[COLORS.primaryDark, COLORS.primary] as readonly [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.errorGradient}
        >
          <View style={styles.errorContainer}>
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={2000}
              style={styles.errorIconContainer}
            >
              <Ionicons name="alert-circle-outline" size={60} color={COLORS.white} />
            </Animatable.View>
            <Text style={styles.errorText}>Kategori bulunamadı!</Text>
            <Button
              title="Ana Sayfaya Dön"
              onPress={() => navigation.navigate('Main')}
              containerStyle={{ marginTop: SIZES.large }}
            />
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryDark} barStyle="light-content" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={[category.color || COLORS.primary, COLORS.gradient.coolGradient.end] as readonly [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{category.name}</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>
      
      {/* İçerik */}
      <ScrollView style={styles.content}>
        {/* Kategori başlığı ve bilgileri */}
        <Animatable.View 
          animation={animationReady ? "fadeIn" : undefined}
          duration={800}
          style={styles.categoryHeader}
        >
          <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
          </View>
          
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>{category.name}</Text>
            
            {category.level && (
              <View style={[styles.levelBadge, { backgroundColor: category.color }]}>
                <Text style={styles.levelText}>{category.level}</Text>
              </View>
            )}
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animatable.View 
                  animation={animationReady ? "fadeIn" : undefined}
                  duration={800}
                  delay={500}
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${(learningProgress.learned / learningProgress.total) * 100}%`,
                      backgroundColor: category.color
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {learningProgress.learned} / {learningProgress.total} Kelime
              </Text>
            </View>
          </View>
        </Animatable.View>
        
        {/* Quiz Butonu (Tüm kelimeler öğrenildiyse gösterilir) */}
        {isCategoryLearned && (
          <Animatable.View 
            animation={animationReady ? "bounceIn" : undefined}
            duration={1000}
            style={styles.quizContainer}
          >
            <LinearGradient
              colors={[COLORS.success, COLORS.category.green] as readonly [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.quizGradient}
            >
              <View style={styles.quizContent}>
                <Animatable.View
                  animation="pulse"
                  iterationCount="infinite"
                  duration={2000}
                  style={styles.congratsIconContainer}
                >
                  <Ionicons name="trophy" size={40} color={COLORS.white} />
                </Animatable.View>
                <View style={styles.quizTextContainer}>
                  <Text style={styles.quizTitle}>Tebrikler! Bu kategorideki tüm kelimeleri öğrendiniz.</Text>
                  <Button
                    title="Quiz'e Başla"
                    onPress={startQuiz}
                    containerStyle={styles.quizButton}
                  />
                </View>
              </View>
            </LinearGradient>
          </Animatable.View>
        )}
        
        {/* Kelime Listesi */}
        <View style={styles.wordsContainer}>
          <Text style={styles.sectionTitle}>Kelimeler</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Kelimeler yükleniyor...</Text>
            </View>
          ) : categoryWords.length > 0 ? (
            categoryWords.map((word, index) => (
              <Animatable.View 
                key={word.id}
                animation={animationReady ? "fadeInUp" : undefined}
                duration={500}
                delay={300 + (index * 100)}
                style={styles.wordCardContainer}
              >
                {renderWordCard({ item: word })}
              </Animatable.View>
            ))
          ) : (
            <Animatable.View
              animation={animationReady ? "fadeIn" : undefined}
              duration={800}
              style={styles.emptyContainer}
            >
              <Ionicons name="book-outline" size={50} color={COLORS.gray} />
              <Text style={styles.emptyText}>Bu kategoride henüz kelime bulunmuyor.</Text>
            </Animatable.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    borderBottomLeftRadius: SIZES.medium,
    borderBottomRightRadius: SIZES.medium,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: FONTS.size.large,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.large,
    backgroundColor: COLORS.white,
    marginTop: SIZES.medium,
    marginHorizontal: SIZES.medium,
    borderRadius: SIZES.medium,
    ...SHADOWS.medium,
    elevation: 4,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.medium,
    ...SHADOWS.small,
  },
  categoryIcon: {
    fontSize: 36,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.small / 2,
  },
  levelBadge: {
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.small / 4,
    borderRadius: SIZES.small / 2,
    alignSelf: 'flex-start',
    marginBottom: SIZES.small,
  },
  levelText: {
    color: COLORS.white,
    fontSize: FONTS.size.small,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: SIZES.small / 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginBottom: SIZES.small / 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: FONTS.size.small,
    color: COLORS.gray,
  },
  quizContainer: {
    marginHorizontal: SIZES.medium,
    marginVertical: SIZES.medium,
    borderRadius: SIZES.medium,
    overflow: 'hidden',
    ...SHADOWS.medium,
    elevation: 4,
  },
  quizGradient: {
    borderRadius: SIZES.medium,
  },
  quizContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.large,
  },
  congratsIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.medium,
  },
  quizTextContainer: {
    flex: 1,
  },
  quizTitle: {
    fontSize: FONTS.size.medium,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SIZES.medium,
  },
  quizButton: {
    borderRadius: SIZES.small * 2,
    backgroundColor: COLORS.white,
  },
  wordsContainer: {
    padding: SIZES.large,
  },
  sectionTitle: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.medium,
  },
  wordCardContainer: {
    marginBottom: SIZES.medium,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.xxlarge,
  },
  loadingText: {
    marginTop: SIZES.medium,
    fontSize: FONTS.size.medium,
    color: COLORS.gray,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.xxlarge,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: FONTS.size.medium,
    color: COLORS.gray,
    marginTop: SIZES.large,
  },
  errorGradient: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.large,
  },
  errorIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.large,
  },
  errorText: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SIZES.medium,
  }
});

export default CategoryDetailScreen;
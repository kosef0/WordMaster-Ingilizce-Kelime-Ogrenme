import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import MultipleChoiceQuestion from '../components/learning/MultipleChoiceQuestion';
import MatchingQuestion from '../components/learning/MatchingQuestion';
import TranslationQuestion from '../components/learning/TranslationQuestion';
import ListenAndWriteQuestion from '../components/learning/ListenAndWriteQuestion';
import LessonComplete from '../components/learning/LessonComplete';
import { Category, Lesson, completeLesson } from '../services/learningService';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

interface LessonScreenProps {
  route: {
    params: {
      lesson: Lesson;
      category: Category;
      lessonIndex: number;
    };
  };
  navigation: any;
}

// Test verileri
const generateQuestions = (category: Category, lesson: Lesson) => {
  // Gerçek uygulamada bu veriler API'dan gelecektir
  return [
    {
      id: '1',
      type: 'multiple_choice',
      question: '"Apple" kelimesinin anlamı nedir?',
      options: ['Elma', 'Armut', 'Muz', 'Portakal'],
      correctAnswer: 'Elma',
      image: 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    },
    {
      id: '2',
      type: 'matching',
      pairs: [
        { id: '1', english: 'Banana', turkish: 'Muz' },
        { id: '2', english: 'Orange', turkish: 'Portakal' },
        { id: '3', english: 'Strawberry', turkish: 'Çilek' },
      ],
    },
    {
      id: '3',
      type: 'translation',
      sentence: 'I like to eat fruits',
      correctAnswer: 'Meyve yemeyi severim',
    },
    {
      id: '4',
      type: 'listen_write',
      audioUrl: 'https://example.com/audio.mp3',
      word: 'Watermelon',
      correctAnswer: 'Watermelon',
    },
    {
      id: '5',
      type: 'multiple_choice',
      question: '"Grape" kelimesinin anlamı nedir?',
      options: ['Elma', 'Üzüm', 'Çilek', 'Karpuz'],
      correctAnswer: 'Üzüm',
      image: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    },
  ];
};

const LessonScreen: React.FC<LessonScreenProps> = ({ route, navigation }) => {
  const { lesson, category, lessonIndex } = route.params;
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hearts, setHearts] = useState(5);
  const [score, setScore] = useState(0);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Gerçek uygulamada burada API'dan soruları çekeceksiniz
    setTimeout(() => {
      const generatedQuestions = generateQuestions(category, lesson);
      setQuestions(generatedQuestions);
      setLoading(false);
    }, 1000);
  }, []);
  
  useEffect(() => {
    if (questions.length > 0) {
      Animated.timing(progressAnim, {
        toValue: (currentQuestionIndex + 1) / questions.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentQuestionIndex, questions]);
  
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
      
      // Doğru cevap animasyonu burada yapılabilir
      
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          // Ders tamamlandı
          handleLessonComplete();
        }
      }, 1000);
    } else {
      // Yanlış cevap
      setHearts(hearts - 1);
      
      if (hearts <= 1) {
        // Canlar bitti, dersi kaybetti
        Alert.alert(
          "Üzgünüz!",
          "Canlarınız bitti. Dersi tekrar denemek ister misiniz?",
          [
            {
              text: "Hayır",
              onPress: () => navigation.goBack(),
              style: "cancel"
            },
            { 
              text: "Evet", 
              onPress: () => {
                setHearts(5);
                setCurrentQuestionIndex(0);
                setScore(0);
              } 
            }
          ]
        );
      }
    }
  };
  
  const handleLessonComplete = async () => {
    setIsLessonComplete(true);
    
    // Dersi tamamlandı olarak işaretle ve ilerlemeyi güncelle
    try {
      // Dersi tamamla ve puanı kaydet
      const finalScore = Math.round((score / questions.length) * 100);
      await completeLesson(category.id, lesson.id, finalScore);
    } catch (error) {
      console.error('Ders tamamlanırken hata:', error);
      // Hata olsa bile kullanıcıya gösterme
    }
  };
  
  const handleContinue = () => {
    navigation.goBack();
  };
  
  const renderQuestion = () => {
    if (isLessonComplete) {
      return (
        <LessonComplete 
          score={score}
          totalQuestions={questions.length}
          onContinue={handleContinue}
          categoryColor={category.color}
        />
      );
    }
    
    if (loading || questions.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={category.color} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Sorular yükleniyor...
          </Text>
        </View>
      );
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    
    switch (currentQuestion.type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            categoryColor={category.color}
          />
        );
      case 'matching':
        return (
          <MatchingQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            categoryColor={category.color}
          />
        );
      case 'translation':
        return (
          <TranslationQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            categoryColor={category.color}
          />
        );
      case 'listen_write':
        return (
          <ListenAndWriteQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            categoryColor={category.color}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            Alert.alert(
              "Dersten Çıkış",
              "Dersten çıkmak istediğinize emin misiniz? İlerlemeniz kaydedilmeyecek.",
              [
                {
                  text: "Hayır",
                  style: "cancel"
                },
                { 
                  text: "Evet", 
                  onPress: () => navigation.goBack() 
                }
              ]
            );
          }}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: '#E0E0E0' }]}>
            <Animated.View 
              style={[
                styles.progressFill,
                { 
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: category.color 
                }
              ]}
            />
          </View>
          {!isLessonComplete && (
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {currentQuestionIndex + 1}/{questions.length}
            </Text>
          )}
        </View>
        
        <View style={styles.heartsContainer}>
          {[...Array(5)].map((_, index) => (
            <Ionicons
              key={`heart-${index}`}
              name="heart"
              size={18}
              color={index < hearts ? '#FF4B4B' : '#E0E0E0'}
              style={{ marginLeft: 2 }}
            />
          ))}
        </View>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderQuestion()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 5,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    width: 30,
  },
  heartsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default LessonScreen; 
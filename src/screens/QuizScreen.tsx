import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  Dimensions,
  ScrollView,
  Alert
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles';
import { CATEGORIES, SAMPLE_WORDS } from '../constants';
import { Button } from '../components';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;
type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

const { width } = Dimensions.get('window');

// Quiz soru tipi
type QuizQuestion = {
  id: string;
  word: string;
  correctAnswer: string;
  options: string[];
};

const QuizScreen: React.FC = () => {
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const route = useRoute<QuizScreenRouteProp>();
  const { categoryId } = route.params;
  
  const [category, setCategory] = useState(CATEGORIES.find(c => c.id === categoryId));
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // Her soru için 15 saniye
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Quiz sorularını hazırla
  useEffect(() => {
    prepareQuestions();
  }, []);
  
  // Soru zamanını takip et
  useEffect(() => {
    if (!showResults && !quizCompleted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Süre dolduğunda bir sonraki soruya geç
            handleNextQuestion();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex, showResults, quizCompleted]);
  
  const prepareQuestions = () => {
    // Kategoriye ait öğrenilmiş kelimeleri filtrele
    const categoryWords = SAMPLE_WORDS.filter(
      word => word.category === categoryId && word.isLearned
    );
    
    if (categoryWords.length < 5) {
      Alert.alert(
        "Yetersiz Kelime",
        "Bu kategoride quiz için yeterli öğrenilmiş kelime bulunmuyor. En az 5 kelime öğrenmeniz gerekiyor.",
        [{ text: "Geri Dön", onPress: () => navigation.goBack() }]
      );
      return;
    }
    
    // Her soru için rastgele 4 seçenek oluştur (1 doğru, 3 yanlış)
    const quizQuestions = categoryWords.map(word => {
      // Mevcut kelime hariç diğer kelimeleri al (yanlış cevaplar için)
      const otherWords = SAMPLE_WORDS.filter(w => w.id !== word.id);
      
      // Rastgele 3 yanlış cevap seç
      const wrongAnswers = otherWords
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.translation);
      
      // Tüm cevapları karıştır
      const options = [...wrongAnswers, word.translation].sort(() => 0.5 - Math.random());
      
      return {
        id: word.id,
        word: word.word,
        correctAnswer: word.translation,
        options
      };
    });
    
    // En fazla 10 soru göster
    setQuestions(quizQuestions.slice(0, 10));
  };
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    
    // Doğru cevabı kontrol et
    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Kısa bir gecikme ile sonraki soruya geç
    setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  };
  
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setTimeLeft(15);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      // Quiz tamamlandı
      if (timerRef.current) clearInterval(timerRef.current);
      setShowResults(true);
      setQuizCompleted(true);
    }
  };
  
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
    setQuizCompleted(false);
    setTimeLeft(15);
    prepareQuestions();
  };
  
  const getCurrentQuestion = () => {
    return questions[currentQuestionIndex] || null;
  };
  
  // Quiz henüz hazır değil veya yeterli kelime yok
  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            duration={1500}
          >
            <Ionicons name="hourglass-outline" size={60} color={COLORS.primary} />
          </Animatable.View>
          <Text style={styles.loadingText}>Quiz hazırlanıyor...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Sonuçları göster
  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    let resultMessage = '';
    let resultIcon = '';
    
    if (percentage >= 80) {
      resultMessage = 'Harika! Kelimeleri çok iyi öğrenmişsin!';
      resultIcon = '🏆';
    } else if (percentage >= 50) {
      resultMessage = 'İyi iş! Biraz daha çalışarak daha da iyileşebilirsin.';
      resultIcon = '👍';
    } else {
      resultMessage = 'Bu kelimeler üzerinde biraz daha çalışman gerekiyor.';
      resultIcon = '📚';
    }
    
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark] as readonly [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.resultsContainer}
        >
          <Animatable.View
            animation="bounceIn"
            duration={1200}
            style={styles.resultsContent}
          >
            <Text style={styles.resultIcon}>{resultIcon}</Text>
            <Text style={styles.resultTitle}>Quiz Tamamlandı!</Text>
            <Text style={styles.resultScore}>
              {score} / {questions.length}
            </Text>
            <Text style={styles.resultPercentage}>{percentage}%</Text>
            <Text style={styles.resultMessage}>{resultMessage}</Text>
            
            <View style={styles.resultButtonsContainer}>
              <Button
                title="Tekrar Dene"
                onPress={restartQuiz}
                containerStyle={styles.resultButton}
                variant="secondary"
              />
              <Button
                title="Kategoriye Dön"
                onPress={() => navigation.goBack()}
                containerStyle={styles.resultButton}
              />
            </View>
          </Animatable.View>
        </LinearGradient>
      </SafeAreaView>
    );
  }
  
  // Mevcut soru
  const currentQuestion = getCurrentQuestion();
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            Alert.alert(
              "Quiz'den Çık",
              "Quiz'den çıkmak istediğinize emin misiniz? İlerlemeniz kaydedilmeyecek.",
              [
                { text: "İptal", style: "cancel" },
                { text: "Çık", onPress: () => navigation.goBack() }
              ]
            );
          }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>
            {category ? category.name : 'Kelime Quizi'}
          </Text>
          <Text style={styles.headerSubtitle}>
            Soru {currentQuestionIndex + 1}/{questions.length}
          </Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score}</Text>
          <Text style={styles.scoreLabel}>Puan</Text>
        </View>
      </View>
      
      {/* İlerleme Çubuğu */}
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBarFill, 
            { 
              width: `${((currentQuestionIndex) / questions.length) * 100}%`,
              backgroundColor: COLORS.success
            }
          ]}
        />
      </View>
      
      {/* Zaman Göstergesi */}
      <View style={styles.timerContainer}>
        <Ionicons name="time-outline" size={18} color={COLORS.primary} />
        <View style={styles.timerBarContainer}>
          <View 
            style={[
              styles.timerBarFill, 
              { 
                width: `${(timeLeft / 15) * 100}%`,
                backgroundColor: timeLeft < 5 ? COLORS.error : COLORS.primary
              }
            ]}
          />
        </View>
        <Text style={styles.timerText}>{timeLeft}</Text>
      </View>
      
      {/* Soru Kartı */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Animatable.View
          animation="fadeIn"
          duration={500}
          style={styles.questionCard}
        >
          <Text style={styles.questionLabel}>Bu kelimenin anlamı nedir?</Text>
          <Text style={styles.questionWord}>{currentQuestion?.word}</Text>
          
          {/* Cevap Seçenekleri */}
          <View style={styles.optionsContainer}>
            {currentQuestion?.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              
              let optionStyle = styles.option;
              let textStyle = styles.optionText;
              
              if (isSelected) {
                optionStyle = isCorrect ? styles.correctOption : styles.wrongOption;
                textStyle = styles.selectedOptionText;
              }
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[optionStyle, styles.optionShadow]}
                  onPress={() => selectedAnswer === null && handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                >
                  <Text style={textStyle}>{option}</Text>
                  {isSelected && isCorrect && (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.white} style={styles.optionIcon} />
                  )}
                  {isSelected && !isCorrect && (
                    <Ionicons name="close-circle" size={20} color={COLORS.white} style={styles.optionIcon} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animatable.View>
      </ScrollView>
      
      {/* Sonraki Soru Butonu */}
      {selectedAnswer !== null && (
        <Animatable.View 
          animation="fadeInUp" 
          duration={300}
          style={styles.nextButtonContainer}
        >
          <Button
            title="Sonraki Soru"
            onPress={handleNextQuestion}
            containerStyle={styles.nextButton}
          />
        </Animatable.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  headerSubtitle: {
    fontSize: FONTS.size.small,
    color: COLORS.gray,
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  scoreText: {
    fontSize: FONTS.size.medium,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  scoreLabel: {
    fontSize: FONTS.size.xsmall,
    color: COLORS.white,
    opacity: 0.8,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: COLORS.lightGray,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  timerBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    marginHorizontal: SIZES.small,
    overflow: 'hidden',
  },
  timerBarFill: {
    height: '100%',
  },
  timerText: {
    fontSize: FONTS.size.small,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    width: 25,
    textAlign: 'right',
  },
  contentContainer: {
    flexGrow: 1,
    padding: SIZES.large,
  },
  questionCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    ...SHADOWS.medium,
    marginBottom: SIZES.xxlarge,
  },
  questionLabel: {
    fontSize: FONTS.size.medium,
    color: COLORS.gray,
    marginBottom: SIZES.small,
  },
  questionWord: {
    fontSize: FONTS.size.xxl,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.xlarge,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: SIZES.medium,
  },
  optionShadow: {
    ...SHADOWS.small,
    elevation: 4,
  },
  option: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  correctOption: {
    backgroundColor: COLORS.success,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wrongOption: {
    backgroundColor: COLORS.error,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: FONTS.size.medium,
    color: COLORS.darkGray,
    flex: 1,
  },
  selectedOptionText: {
    fontSize: FONTS.size.medium,
    color: COLORS.white,
    fontWeight: 'bold',
    flex: 1,
  },
  optionIcon: {
    marginLeft: SIZES.small,
  },
  nextButtonContainer: {
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
  nextButton: {
    borderRadius: SIZES.small,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  loadingText: {
    fontSize: FONTS.size.large,
    color: COLORS.darkGray,
    marginTop: SIZES.medium,
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  resultsContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.large,
    padding: SIZES.xlarge,
    width: '90%',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  resultIcon: {
    fontSize: 50,
    marginBottom: SIZES.medium,
  },
  resultTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.large,
  },
  resultScore: {
    fontSize: FONTS.size.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  resultPercentage: {
    fontSize: FONTS.size.xl,
    color: COLORS.gray,
    marginBottom: SIZES.large,
  },
  resultMessage: {
    fontSize: FONTS.size.medium,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: SIZES.xlarge,
  },
  resultButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  resultButton: {
    flex: 1,
    marginHorizontal: SIZES.small,
  },
});

export default QuizScreen; 
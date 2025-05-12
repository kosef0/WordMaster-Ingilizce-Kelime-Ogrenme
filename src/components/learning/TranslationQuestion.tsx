import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface TranslationQuestionProps {
  question: {
    sentence: string;
    correctAnswer: string;
  };
  onAnswer: (isCorrect: boolean) => void;
  categoryColor: string;
}

const TranslationQuestion: React.FC<TranslationQuestionProps> = ({
  question,
  onAnswer,
  categoryColor,
}) => {
  const { colors, isDark } = useTheme();
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0.95));
  
  useEffect(() => {
    // Animasyon
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const handleSubmit = () => {
    if (isSubmitted) return;
    
    Keyboard.dismiss();
    
    // Cevabı kontrol et (basit karşılaştırma)
    // Gerçek uygulamada daha gelişmiş bir karşılaştırma algoritması kullanılabilir
    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrect = question.correctAnswer.trim().toLowerCase();
    
    const correct = normalizedAnswer === normalizedCorrect;
    setIsCorrect(correct);
    setIsSubmitted(true);
    
    setTimeout(() => {
      onAnswer(correct);
    }, 1500);
  };
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <Text style={[styles.instructionText, { color: colors.text }]}>
        Bu cümleyi Türkçe'ye çevirin
      </Text>
      
      <View style={styles.sentenceContainer}>
        <Text style={[styles.sentenceText, { color: colors.text }]}>
          {question.sentence}
        </Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            { 
              color: colors.text,
              backgroundColor: isDark ? '#333' : '#fff',
              borderColor: isSubmitted 
                ? isCorrect ? '#58CC02' : '#FF4B4B'
                : isDark ? '#555' : '#e0e0e0'
            }
          ]}
          placeholder="Çevirinizi buraya yazın..."
          placeholderTextColor={isDark ? '#999' : '#aaa'}
          value={answer}
          onChangeText={setAnswer}
          multiline
          autoCapitalize="none"
          editable={!isSubmitted}
        />
        
        {isSubmitted && (
          <View style={styles.resultContainer}>
            {isCorrect ? (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#58CC02" />
                <Text style={styles.correctText}>Doğru!</Text>
              </>
            ) : (
              <>
                <Ionicons name="close-circle" size={24} color="#FF4B4B" />
                <Text style={styles.incorrectText}>
                  Doğru cevap: {question.correctAnswer}
                </Text>
              </>
            )}
          </View>
        )}
      </View>
      
      <TouchableOpacity
        style={[
          styles.submitButton,
          { 
            backgroundColor: answer.trim() === '' 
              ? '#E0E0E0' 
              : isSubmitted 
                ? isCorrect ? '#58CC02' : '#FF4B4B'
                : categoryColor
          }
        ]}
        onPress={handleSubmit}
        disabled={answer.trim() === '' || isSubmitted}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitted ? (isCorrect ? 'Doğru!' : 'Yanlış!') : 'Kontrol Et'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  sentenceContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginBottom: 20,
  },
  sentenceText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  correctText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#58CC02',
    marginLeft: 8,
  },
  incorrectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4B4B',
    marginLeft: 8,
    flex: 1,
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default TranslationQuestion; 
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface Option {
  value: string;
  isSelected: boolean;
  isCorrect?: boolean;
}

interface MultipleChoiceQuestionProps {
  question: {
    question: string;
    options: string[];
    correctAnswer: string;
    image?: string;
  };
  onAnswer: (isCorrect: boolean) => void;
  categoryColor: string;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  onAnswer,
  categoryColor,
}) => {
  const { colors, isDark } = useTheme();
  const [options, setOptions] = useState<Option[]>([]);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [scaleAnim] = useState(new Animated.Value(0.95));
  
  useEffect(() => {
    // Seçenekleri hazırla
    const formattedOptions = question.options.map(option => ({
      value: option,
      isSelected: false,
    }));
    setOptions(formattedOptions);
    
    // Animasyon
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [question]);
  
  const handleSelectOption = (selectedValue: string) => {
    if (answered) return;
    
    const isCorrect = selectedValue === question.correctAnswer;
    setSelectedOption(selectedValue);
    
    // Seçenekleri güncelle
    const updatedOptions = options.map(option => ({
      ...option,
      isSelected: option.value === selectedValue,
      isCorrect: option.value === question.correctAnswer,
    }));
    
    setOptions(updatedOptions);
    setAnswered(true);
    
    // Kısa bir gecikme sonra cevabı kontrol et
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1500);
  };
  
  const getOptionStyle = (option: Option) => {
    if (!answered) {
      return {
        backgroundColor: option.isSelected ? categoryColor + '40' : isDark ? '#333' : '#fff',
        borderColor: option.isSelected ? categoryColor : isDark ? '#555' : '#e0e0e0',
      };
    }
    
    if (option.value === question.correctAnswer) {
      return {
        backgroundColor: '#58CC02' + '30',
        borderColor: '#58CC02',
      };
    }
    
    if (option.isSelected && option.value !== question.correctAnswer) {
      return {
        backgroundColor: '#FF4B4B' + '30',
        borderColor: '#FF4B4B',
      };
    }
    
    return {
      backgroundColor: isDark ? '#333' : '#fff',
      borderColor: isDark ? '#555' : '#e0e0e0',
      opacity: 0.7,
    };
  };
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <Text style={[styles.questionText, { color: colors.text }]}>
        {question.question}
      </Text>
      
      {question.image && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: question.image }} 
            style={styles.questionImage}
            resizeMode="cover"
          />
        </View>
      )}
      
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              getOptionStyle(option),
            ]}
            onPress={() => handleSelectOption(option.value)}
            disabled={answered}
            activeOpacity={0.8}
          >
            <Text 
              style={[
                styles.optionText, 
                { 
                  color: answered && option.value === question.correctAnswer
                    ? '#58CC02'
                    : answered && option.isSelected && option.value !== question.correctAnswer
                      ? '#FF4B4B'
                      : colors.text
                }
              ]}
            >
              {option.value}
            </Text>
            
            {answered && option.value === question.correctAnswer && (
              <View style={styles.iconContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#58CC02" />
              </View>
            )}
            
            {answered && option.isSelected && option.value !== question.correctAnswer && (
              <View style={styles.iconContainer}>
                <Ionicons name="close-circle" size={24} color="#FF4B4B" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
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
  questionText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  questionImage: {
    width: '100%',
    height: '100%',
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MultipleChoiceQuestion; 
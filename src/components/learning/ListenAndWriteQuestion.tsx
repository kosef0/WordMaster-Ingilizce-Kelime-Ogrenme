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
// Not: Gerçek uygulamada ses çalma için expo-av kullanılabilir
// import { Audio } from 'expo-av';

interface ListenAndWriteQuestionProps {
  question: {
    audioUrl: string;
    word: string;
    correctAnswer: string;
  };
  onAnswer: (isCorrect: boolean) => void;
  categoryColor: string;
}

const ListenAndWriteQuestion: React.FC<ListenAndWriteQuestionProps> = ({
  question,
  onAnswer,
  categoryColor,
}) => {
  const { colors, isDark } = useTheme();
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0.95));
  // const [sound, setSound] = useState<Audio.Sound | null>(null);
  
  useEffect(() => {
    // Animasyon
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    // Ses dosyasını yükle
    // loadSound();
    
    // return () => {
    //   // Component unmount olduğunda sesi temizle
    //   if (sound) {
    //     sound.unloadAsync();
    //   }
    // };
  }, []);
  
  // Gerçek uygulamada ses dosyasını yüklemek için
  // const loadSound = async () => {
  //   try {
  //     const { sound: audioSound } = await Audio.Sound.createAsync(
  //       { uri: question.audioUrl },
  //       { shouldPlay: false }
  //     );
  //     setSound(audioSound);
  //   } catch (error) {
  //     console.error('Ses yüklenirken hata oluştu:', error);
  //   }
  // };
  
  // Gerçek uygulamada sesi çalmak için
  const playSound = async () => {
    setIsPlaying(true);
    
    // if (sound) {
    //   try {
    //     await sound.replayAsync();
    //     sound.setOnPlaybackStatusUpdate((status) => {
    //       if (status.didJustFinish) {
    //         setIsPlaying(false);
    //       }
    //     });
    //   } catch (error) {
    //     console.error('Ses çalınırken hata oluştu:', error);
    //     setIsPlaying(false);
    //   }
    // }
    
    // Test için 2 saniye sonra çalma durumunu kapat
    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  };
  
  const handleSubmit = () => {
    if (isSubmitted) return;
    
    Keyboard.dismiss();
    
    // Cevabı kontrol et
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
        Duyduğunuz kelimeyi yazın
      </Text>
      
      <View style={styles.audioContainer}>
        <TouchableOpacity
          style={[
            styles.playButton,
            { backgroundColor: isPlaying ? '#E0E0E0' : categoryColor }
          ]}
          onPress={playSound}
          disabled={isPlaying}
        >
          <Ionicons 
            name={isPlaying ? "volume-high" : "play"} 
            size={30} 
            color="#fff" 
          />
        </TouchableOpacity>
        
        {isPlaying && (
          <View style={styles.soundWaveContainer}>
            <View style={[styles.soundWave, { height: 15, backgroundColor: categoryColor }]} />
            <View style={[styles.soundWave, { height: 25, backgroundColor: categoryColor }]} />
            <View style={[styles.soundWave, { height: 20, backgroundColor: categoryColor }]} />
            <View style={[styles.soundWave, { height: 30, backgroundColor: categoryColor }]} />
            <View style={[styles.soundWave, { height: 15, backgroundColor: categoryColor }]} />
          </View>
        )}
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
          placeholder="Duyduğunuz kelimeyi yazın..."
          placeholderTextColor={isDark ? '#999' : '#aaa'}
          value={answer}
          onChangeText={setAnswer}
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
  audioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 30,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundWaveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    height: 40,
  },
  soundWave: {
    width: 5,
    marginHorizontal: 3,
    borderRadius: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    height: 60,
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

export default ListenAndWriteQuestion; 
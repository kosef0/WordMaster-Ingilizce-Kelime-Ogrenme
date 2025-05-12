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
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

interface LessonCompleteProps {
  score: number;
  totalQuestions: number;
  onContinue: () => void;
  categoryColor: string;
}

const LessonComplete: React.FC<LessonCompleteProps> = ({
  score,
  totalQuestions,
  onContinue,
  categoryColor,
}) => {
  const { colors, isDark } = useTheme();
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [opacityAnim] = useState(new Animated.Value(0));
  const [starsAnim] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);
  
  // Yıldız sayısını hesapla
  const starCount = Math.min(3, Math.max(1, Math.ceil((score / totalQuestions) * 3)));
  
  useEffect(() => {
    // Ana animasyonu başlat
    Animated.sequence([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Yıldız animasyonlarını başlat
    starsAnim.forEach((anim, index) => {
      setTimeout(() => {
        if (index < starCount) {
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.spring(anim, {
              toValue: 0.8,
              friction: 3,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.spring(anim, {
              toValue: 1,
              friction: 3,
              tension: 40,
              useNativeDriver: true,
            }),
          ]).start();
        }
      }, 500 + index * 300);
    });
  }, []);
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={[categoryColor + '80', categoryColor]}
        style={styles.gradientContainer}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.congratsText}>Tebrikler!</Text>
          <Text style={styles.completedText}>Dersi tamamladınız</Text>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              {score}/{totalQuestions}
            </Text>
            <Text style={styles.scoreLabel}>doğru cevap</Text>
          </View>
          
          <View style={styles.starsContainer}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.starContainer,
                  {
                    opacity: index < starCount ? starsAnim[index] : 0.3,
                    transform: [
                      { 
                        scale: index < starCount 
                          ? starsAnim[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.5, 1],
                            }) 
                          : 0.7 
                      },
                      { 
                        rotate: index < starCount 
                          ? starsAnim[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: ['-45deg', '0deg'],
                            }) 
                          : '0deg' 
                      }
                    ],
                  },
                ]}
              >
                <Ionicons 
                  name="star" 
                  size={50} 
                  color={index < starCount ? '#FFD700' : '#E0E0E0'} 
                />
              </Animated.View>
            ))}
          </View>
          
          <View style={styles.messageContainer}>
            {starCount === 3 && (
              <Text style={styles.excellentText}>Mükemmel!</Text>
            )}
            {starCount === 2 && (
              <Text style={styles.goodText}>İyi iş!</Text>
            )}
            {starCount === 1 && (
              <Text style={styles.tryAgainText}>Tekrar deneyebilirsiniz!</Text>
            )}
          </View>
          
          <View style={styles.rewardsContainer}>
            <View style={styles.rewardItem}>
              <Ionicons name="trophy" size={24} color="#FFD700" />
              <Text style={styles.rewardText}>+{score * 5} XP</Text>
            </View>
            
            <View style={styles.rewardItem}>
              <Ionicons name="diamond" size={24} color="#1CB0F6" />
              <Text style={styles.rewardText}>+{starCount}</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.continueButton}
            onPress={onContinue}
          >
            <Text style={styles.continueButtonText}>Devam Et</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gradientContainer: {
    width: '100%',
    padding: 20,
  },
  contentContainer: {
    alignItems: 'center',
    padding: 20,
  },
  congratsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  completedText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  starContainer: {
    marginHorizontal: 10,
  },
  messageContainer: {
    marginVertical: 10,
  },
  excellentText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  goodText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  tryAgainText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  rewardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  rewardText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default LessonComplete; 
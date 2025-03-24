import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  LayoutAnimation, 
  Platform, 
  UIManager
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Animasyon için Android uyumluluğu
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface WordCardProps {
  word: string;
  translation: string;
  pronunciation?: string;
  examples: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  onMarkLearned: () => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch(difficulty) {
    case 'easy':
      return COLORS.success;
    case 'medium':
      return COLORS.warning;
    case 'hard':
      return COLORS.error;
    default:
      return COLORS.gray;
  }
};

const getDifficultyText = (difficulty: string) => {
  switch(difficulty) {
    case 'easy':
      return 'Kolay';
    case 'medium':
      return 'Orta';
    case 'hard':
      return 'Zor';
    default:
      return '';
  }
};

const WordCard: React.FC<WordCardProps> = ({ 
  word, 
  translation, 
  pronunciation, 
  examples, 
  difficulty,
  onMarkLearned 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [learningAnimation, setLearningAnimation] = useState<any>(null);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const handleMarkLearned = () => {
    if (learningAnimation && typeof learningAnimation.pulse === 'function') {
      learningAnimation.pulse(800).then(() => {
        setTimeout(() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          onMarkLearned();
        }, 300);
      });
    } else {
      onMarkLearned();
    }
  };

  return (
    <Animatable.View 
      animation="fadeIn"
      duration={500}
      style={styles.container}
    >
      <View style={styles.gradientCard}>
        <TouchableOpacity 
          style={styles.cardHeader} 
          onPress={toggleExpand}
          activeOpacity={0.8}
        >
          <View style={styles.wordContainer}>
            <Text style={styles.wordText}>{word}</Text>
            {pronunciation && (
              <Text style={styles.pronunciationText}>[{pronunciation}]</Text>
            )}
          </View>
          
          <View style={styles.rightContainer}>
            <View 
              style={[
                styles.difficultyBadge, 
                { backgroundColor: getDifficultyColor(difficulty) }
              ]}
            >
              <Text style={styles.difficultyText}>
                {getDifficultyText(difficulty)}
              </Text>
            </View>
            <Animatable.View 
              animation={expanded ? "rotate90" : undefined}
              style={[
                styles.expandIcon,
                { transform: [{ rotate: expanded ? "90deg" : "0deg" }] }
              ]}
              duration={300}
            >
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={COLORS.darkGray} 
              />
            </Animatable.View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.divider} />
        
        <View style={styles.translationContainer}>
          <Text style={styles.translationLabel}>Çeviri:</Text>
          <Text style={styles.translationText}>{translation}</Text>
        </View>
        
        {expanded && (
          <Animatable.View 
            animation="fadeIn"
            duration={300}
            style={styles.expandedContent}
          >
            {examples && examples.length > 0 && (
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesLabel}>Örnek Cümleler:</Text>
                {examples.map((example, index) => (
                  <View key={index} style={styles.exampleItem}>
                    <Ionicons name="ellipse" size={8} color={COLORS.primary} style={styles.bulletPoint} />
                    <Text style={styles.exampleText}>{example}</Text>
                  </View>
                ))}
              </View>
            )}
            
            <Animatable.View 
              ref={(ref) => setLearningAnimation(ref)}
              style={styles.buttonContainer}
            >
              <TouchableOpacity 
                style={styles.learnedButton}
                onPress={handleMarkLearned}
                activeOpacity={0.7}
              >
                <View style={styles.gradientButton}>
                  <Text style={styles.learnedButtonText}>Öğrendim</Text>
                </View>
              </TouchableOpacity>
            </Animatable.View>
          </Animatable.View>
        )}
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.small,
    borderRadius: SIZES.medium,
    overflow: 'hidden',
    ...SHADOWS.medium,
    elevation: 4,
  },
  gradientCard: {
    borderRadius: SIZES.medium,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.medium,
  },
  wordContainer: {
    flex: 1,
  },
  wordText: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  pronunciationText: {
    fontSize: FONTS.size.small,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    borderRadius: SIZES.small / 2,
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.small / 4,
    marginRight: SIZES.small,
  },
  difficultyText: {
    fontSize: FONTS.size.small,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  expandIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SIZES.medium,
  },
  translationContainer: {
    padding: SIZES.medium,
    paddingTop: SIZES.small,
  },
  translationLabel: {
    fontSize: FONTS.size.small,
    color: COLORS.gray,
    marginBottom: 4,
  },
  translationText: {
    fontSize: FONTS.size.medium,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  expandedContent: {
    padding: SIZES.medium,
    paddingTop: 0,
  },
  examplesContainer: {
    marginBottom: SIZES.medium,
  },
  examplesLabel: {
    fontSize: FONTS.size.small,
    color: COLORS.gray,
    marginBottom: SIZES.small,
  },
  exampleItem: {
    flexDirection: 'row',
    marginBottom: SIZES.small / 2,
    paddingRight: SIZES.medium,
  },
  bulletPoint: {
    marginTop: 4,
    marginRight: SIZES.small / 2,
  },
  exampleText: {
    flex: 1,
    fontSize: FONTS.size.small,
    color: COLORS.darkGray,
    lineHeight: 18,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: SIZES.small,
  },
  learnedButton: {
    borderRadius: SIZES.small,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  gradientButton: {
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.small,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.small,
    backgroundColor: COLORS.primary,
  },
  learnedButtonText: {
    color: COLORS.white,
    fontSize: FONTS.size.medium,
    fontWeight: 'bold',
  },
});

export default WordCard; 
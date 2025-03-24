import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Image
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles';
import { Button } from '../components';
import { Word } from '../constants';

interface WordDetailScreenProps {
  route?: {
    params: {
      word: Word
    }
  };
  // Navigation props can be added for real navigation
}

// Örnek kelime - gerçek senaryoda route üzerinden alınacak
const exampleWord: Word = {
  id: '3',
  word: 'democracy',
  translation: 'demokrasi',
  pronunciation: '/dɪˈmɒk.rə.si/',
  examples: [
    'Democracy is a system of government.',
    'They fought for democracy in their country.',
    'The principles of democracy include freedom and equality.'
  ],
  difficulty: 'medium',
  category: 'politics',
  isLearned: false
};

const WordDetailScreen: React.FC<WordDetailScreenProps> = ({ route }) => {
  // Eğer route ile kelime gelirse onu, gelmezse örnek kelimeyi kullan
  const word = route?.params?.word || exampleWord;
  const [isLearned, setIsLearned] = useState(word.isLearned);
  
  const handleMarkLearned = () => {
    setIsLearned(true);
    // Burada veritabanında güncelleme yapılabilir
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <View style={[styles.difficultyBadge, 
              { backgroundColor: word.difficulty === 'easy' 
                ? COLORS.success 
                : word.difficulty === 'medium' 
                ? COLORS.warning 
                : COLORS.error 
              }]}>
              <Text style={styles.difficultyText}>
                {word.difficulty === 'easy' ? 'Kolay' : word.difficulty === 'medium' ? 'Orta' : 'Zor'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.wordContainer}>
          <Text style={styles.wordText}>{word.word}</Text>
          <Text style={styles.categoryBadge}>{word.category}</Text>
          {word.pronunciation && <Text style={styles.pronunciationText}>{word.pronunciation}</Text>}
          <View style={styles.divider} />
          <Text style={styles.translationTitle}>Çevirisi</Text>
          <Text style={styles.translationText}>{word.translation}</Text>
        </View>
        
        <View style={styles.examplesContainer}>
          <Text style={styles.sectionTitle}>Örnek Cümleler</Text>
          {word.examples.map((example, index) => (
            <View key={index} style={styles.exampleItem}>
              <Text style={styles.exampleNumber}>{index + 1}</Text>
              <Text style={styles.exampleText}>{example}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.audioSection}>
          <Text style={styles.sectionTitle}>Sesli Telaffuz</Text>
          <TouchableOpacity style={styles.audioButton}>
            <Text style={styles.audioButtonText}>▶ Dinle</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Notlar</Text>
          <View style={styles.noteCard}>
            <Text style={styles.notePlaceholder}>
              Bu kelimeye özel notlarınızı buraya ekleyebilirsiniz...
            </Text>
            <TouchableOpacity style={styles.addNoteButton}>
              <Text style={styles.addNoteButtonText}>+ Not Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          {!isLearned ? (
            <Button 
              title="Öğrendim" 
              variant="primary"
              onPress={handleMarkLearned}
            />
          ) : (
            <View style={styles.learnedContainer}>
              <Text style={styles.learnedText}>✓ Bu kelimeyi öğrendiniz</Text>
            </View>
          )}
          
          <Button 
            title="Quiz'de Dene" 
            variant="secondary"
            containerStyle={styles.quizButton}
          />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  backButtonText: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small / 2,
    borderRadius: SIZES.small,
  },
  difficultyText: {
    color: COLORS.white,
    fontSize: FONTS.size.small,
    fontWeight: '600',
  },
  wordContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    margin: SIZES.large,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  wordText: {
    fontSize: FONTS.size.xxxl,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.small,
  },
  categoryBadge: {
    backgroundColor: COLORS.lightGray,
    color: COLORS.darkGray,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small / 2,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
    fontSize: FONTS.size.small,
    textTransform: 'capitalize',
  },
  pronunciationText: {
    fontSize: FONTS.size.medium,
    fontStyle: 'italic',
    color: COLORS.darkGray,
    marginBottom: SIZES.medium,
  },
  divider: {
    height: 1,
    width: '80%',
    backgroundColor: COLORS.border,
    marginVertical: SIZES.medium,
  },
  translationTitle: {
    fontSize: FONTS.size.medium,
    color: COLORS.gray,
    marginBottom: SIZES.small,
  },
  translationText: {
    fontSize: FONTS.size.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  examplesContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    marginHorizontal: SIZES.large,
    marginBottom: SIZES.medium,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: FONTS.size.large,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: SIZES.medium,
  },
  exampleItem: {
    flexDirection: 'row',
    marginBottom: SIZES.medium,
  },
  exampleNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: SIZES.small,
    fontSize: FONTS.size.small,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  exampleText: {
    flex: 1,
    fontSize: FONTS.size.medium,
    lineHeight: 22,
    color: COLORS.darkGray,
  },
  audioSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    marginHorizontal: SIZES.large,
    marginBottom: SIZES.medium,
    ...SHADOWS.small,
  },
  audioButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
  },
  audioButtonText: {
    color: COLORS.white,
    fontSize: FONTS.size.medium,
    fontWeight: '600',
  },
  notesSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    marginHorizontal: SIZES.large,
    marginBottom: SIZES.large,
    ...SHADOWS.small,
  },
  noteCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
  },
  notePlaceholder: {
    color: COLORS.gray,
    fontSize: FONTS.size.medium,
    fontStyle: 'italic',
    marginBottom: SIZES.medium,
  },
  addNoteButton: {
    alignSelf: 'flex-end',
  },
  addNoteButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.size.medium,
    fontWeight: '600',
  },
  actionsContainer: {
    padding: SIZES.large,
    marginBottom: SIZES.large,
  },
  learnedContainer: {
    backgroundColor: COLORS.success,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  learnedText: {
    color: COLORS.white,
    fontSize: FONTS.size.medium,
    fontWeight: '600',
  },
  quizButton: {
    marginTop: SIZES.small,
  },
});

export default WordDetailScreen; 
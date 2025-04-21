<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { getWordById } from '../services/wordService';
import { Ionicons } from '@expo/vector-icons';

const WordDetailScreen = ({ route, navigation }) => {
  const { wordId } = route.params;
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWordDetails();
  }, [wordId]);

  const fetchWordDetails = async () => {
    try {
      setLoading(true);
      const wordData = await getWordById(wordId);
      setWord(wordData);
      setError(null);
    } catch (err) {
      console.error('Kelime detayı yüklenirken hata oluştu:', err);
      setError('Kelime detayı yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Kelime detayı yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="cloud-offline" size={64} color="#FF5E62" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchWordDetails}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Kelime Detayı</Text>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.wordCard}>
          <Text style={styles.englishWord}>{word?.english}</Text>
          {word?.pronunciation && (
            <Text style={styles.pronunciation}>/{word.pronunciation}/</Text>
          )}
          <Text style={styles.turkishWord}>{word?.turkish}</Text>
          
          {word?.exampleSentence && (
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleLabel}>Örnek Cümle:</Text>
              <Text style={styles.exampleSentence}>{word.exampleSentence}</Text>
            </View>
          )}
          
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Kategori:</Text>
            <Text style={styles.categoryName}>{word?.category?.name}</Text>
          </View>
          
          <View style={styles.difficultyContainer}>
            <Text style={styles.difficultyLabel}>Zorluk:</Text>
            <View style={[
              styles.difficultyBadge, 
              word?.difficulty === 'easy' ? styles.easyBadge : 
              word?.difficulty === 'hard' ? styles.hardBadge : 
              styles.mediumBadge
            ]}>
              <Text style={styles.difficultyText}>
                {word?.difficulty === 'easy' ? 'Kolay' : 
                 word?.difficulty === 'hard' ? 'Zor' : 'Orta'}
=======
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
>>>>>>> bed42af4b2d242a4be38a0dce664da7ff1abddc0
              </Text>
            </View>
          </View>
        </View>
        
<<<<<<< HEAD
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="volume-high-outline" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Dinle</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Kaydet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Paylaş</Text>
          </TouchableOpacity>
=======
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
>>>>>>> bed42af4b2d242a4be38a0dce664da7ff1abddc0
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTextContainer: {
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  wordCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  englishWord: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pronunciation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  turkishWord: {
    fontSize: 22,
    color: '#4CAF50',
    marginBottom: 20,
  },
  exampleContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  exampleLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  exampleSentence: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 5,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 5,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  easyBadge: {
    backgroundColor: '#E8F5E9',
  },
  mediumBadge: {
    backgroundColor: '#FFF8E1',
  },
  hardBadge: {
    backgroundColor: '#FFEBEE',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF5E62',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WordDetailScreen;
=======
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
>>>>>>> bed42af4b2d242a4be38a0dce664da7ff1abddc0

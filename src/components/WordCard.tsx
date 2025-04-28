import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getWordStatus, WordStatus } from '../services/statsService';

export interface WordCardProps {
  word: {
    id: string;
    term: string;
    definition: string;
    category?: string;
  };
  onPress?: () => void;
  showStatus?: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({ word, onPress, showStatus = true }) => {
  const [status, setStatus] = useState<WordStatus>('new');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const wordStatus = await getWordStatus(word.id);
        setStatus(wordStatus);
      } catch (error) {
        console.error('Kelime durumu alınırken hata:', error);
      }
    };

    if (showStatus) {
      fetchStatus();
    }
  }, [word.id, showStatus]);

  const renderStatusIcon = () => {
    if (!showStatus) return null;

    let iconName = 'circle-outline';
    let color = '#ccc';

    switch (status) {
      case 'learning':
        iconName = 'circle-half-full';
        color = '#FFA500'; // Turuncu
        break;
      case 'mastered':
        iconName = 'check-circle';
        color = '#4CAF50'; // Yeşil
        break;
      case 'new':
      default:
        iconName = 'circle-outline';
        color = '#ccc'; // Gri
        break;
    }

    return (
      <View style={styles.statusContainer}>
        <Icon name={iconName} size={18} color={color} />
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.term}>{word.term}</Text>
        <Text style={styles.definition}>{word.definition}</Text>
        {word.category && (
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{word.category}</Text>
          </View>
        )}
      </View>
      {renderStatusIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 1,
  },
  term: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  definition: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  categoryContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  category: {
    fontSize: 12,
    color: '#888',
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default WordCard; 
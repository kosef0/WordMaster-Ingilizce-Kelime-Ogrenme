import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface Pair {
  id: string;
  english: string;
  turkish: string;
}

interface MatchItem {
  id: string;
  text: string;
  language: 'english' | 'turkish';
  pairId: string;
  isSelected: boolean;
  isMatched: boolean;
}

interface MatchingQuestionProps {
  question: {
    pairs: Pair[];
  };
  onAnswer: (isCorrect: boolean) => void;
  categoryColor: string;
}

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({
  question,
  onAnswer,
  categoryColor,
}) => {
  const { colors, isDark } = useTheme();
  const [items, setItems] = useState<MatchItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MatchItem | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [scaleAnim] = useState(new Animated.Value(0.95));
  
  useEffect(() => {
    // Eşleştirme öğelerini hazırla
    const englishItems = question.pairs.map(pair => ({
      id: `english_${pair.id}`,
      text: pair.english,
      language: 'english' as const,
      pairId: pair.id,
      isSelected: false,
      isMatched: false,
    }));
    
    const turkishItems = question.pairs.map(pair => ({
      id: `turkish_${pair.id}`,
      text: pair.turkish,
      language: 'turkish' as const,
      pairId: pair.id,
      isSelected: false,
      isMatched: false,
    }));
    
    // Karıştır
    const shuffledItems = [...englishItems, ...turkishItems].sort(() => Math.random() - 0.5);
    setItems(shuffledItems);
    
    // Animasyon
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [question]);
  
  const handleSelectItem = (item: MatchItem) => {
    // Eğer öğe zaten eşleştirilmişse, hiçbir şey yapma
    if (item.isMatched) return;
    
    // Seçili öğe yoksa, bu öğeyi seç
    if (!selectedItem) {
      const updatedItems = items.map(i => 
        i.id === item.id ? { ...i, isSelected: true } : i
      );
      setItems(updatedItems);
      setSelectedItem(item);
      return;
    }
    
    // Aynı öğeye tekrar tıklanırsa, seçimi kaldır
    if (selectedItem.id === item.id) {
      const updatedItems = items.map(i => 
        i.id === item.id ? { ...i, isSelected: false } : i
      );
      setItems(updatedItems);
      setSelectedItem(null);
      return;
    }
    
    // Farklı bir öğe seçilirse, eşleşme kontrolü yap
    if (selectedItem.pairId === item.pairId && selectedItem.language !== item.language) {
      // Eşleşme başarılı
      const updatedItems = items.map(i => 
        i.id === item.id || i.id === selectedItem.id
          ? { ...i, isSelected: false, isMatched: true }
          : i
      );
      setItems(updatedItems);
      setSelectedItem(null);
      
      // Eşleşen çifti kaydet
      const updatedMatchedPairs = [...matchedPairs, item.pairId];
      setMatchedPairs(updatedMatchedPairs);
      
      // Tüm çiftler eşleştirildi mi kontrol et
      if (updatedMatchedPairs.length === question.pairs.length) {
        setTimeout(() => {
          onAnswer(true);
        }, 1000);
      }
    } else {
      // Eşleşme başarısız
      const updatedItems = items.map(i => 
        i.id === item.id 
          ? { ...i, isSelected: true } 
          : i.id === selectedItem.id 
            ? { ...i, isSelected: false } 
            : i
      );
      setItems(updatedItems);
      setSelectedItem(item);
    }
  };
  
  const getItemStyle = (item: MatchItem) => {
    if (item.isMatched) {
      return {
        backgroundColor: '#58CC02' + '30',
        borderColor: '#58CC02',
      };
    }
    
    if (item.isSelected) {
      return {
        backgroundColor: categoryColor + '40',
        borderColor: categoryColor,
      };
    }
    
    return {
      backgroundColor: isDark ? '#333' : '#fff',
      borderColor: isDark ? '#555' : '#e0e0e0',
    };
  };
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <Text style={[styles.instructionText, { color: colors.text }]}>
        Eşleşen İngilizce ve Türkçe kelimeleri bulun
      </Text>
      
      <View style={styles.itemsContainer}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.itemButton,
              getItemStyle(item),
              item.language === 'english' ? { borderLeftWidth: 4 } : { borderRightWidth: 4 }
            ]}
            onPress={() => handleSelectItem(item)}
            disabled={item.isMatched}
            activeOpacity={0.8}
          >
            <Text 
              style={[
                styles.itemText, 
                { 
                  color: item.isMatched 
                    ? '#58CC02' 
                    : item.isSelected 
                      ? categoryColor 
                      : colors.text
                }
              ]}
            >
              {item.text}
            </Text>
            
            {item.isMatched && (
              <View style={styles.iconContainer}>
                <Ionicons name="checkmark-circle" size={20} color="#58CC02" />
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
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    width: '48%',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MatchingQuestion; 
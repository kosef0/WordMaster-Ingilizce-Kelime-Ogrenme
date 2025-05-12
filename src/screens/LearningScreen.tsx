import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { getLearningCategories, Category } from '../services/learningService';
import { useAuth } from '../context/AuthContext';

const LearningScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  // Kategorileri yükle
  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await getLearningCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Kategori kartı
  const renderCategoryCard = ({ item }: { item: Category }) => {
    // Önceki kategori bulunmazsa veya progress değeri yoksa varsayılan olarak 0 kullan
    const previousCategory = categories.find(c => c.id === String(parseInt(item.id) - 1));
    const previousProgress = previousCategory?.progress ?? 0;
    const isLocked = item.id !== '1' && previousProgress < 100;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          { backgroundColor: isLocked ? '#E0E0E0' : item.color + '20' }
        ]}
        onPress={() => {
          if (!isLocked) {
            navigation.navigate('CategoryLessons', { category: item } as never);
          }
        }}
        disabled={isLocked}
      >
        <View style={[
          styles.categoryIconContainer,
          { backgroundColor: isLocked ? '#BDBDBD' : item.color }
        ]}>
          {isLocked ? (
            <Ionicons name="lock-closed" size={24} color="#fff" />
          ) : (
            <Ionicons name={item.icon as any} size={24} color="#fff" />
          )}
        </View>
        <Text style={[
          styles.categoryTitle,
          { color: isLocked ? '#9E9E9E' : colors.text }
        ]}>
          {item.title}
        </Text>
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar,
              { backgroundColor: isLocked ? '#E0E0E0' : '#E0E0E0' }
            ]}
          >
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${item.progress}%`,
                  backgroundColor: isLocked ? '#BDBDBD' : item.color
                }
              ]}
            />
          </View>
          <Text style={[
            styles.progressText,
            { color: isLocked ? '#9E9E9E' : colors.textSecondary }
          ]}>
            {item.progress}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Öğrenme Yolculuğu</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="trophy" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="heart" size={24} color="#FF4B4B" />
            <Text style={styles.livesText}>5</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoriesList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
    position: 'relative',
  },
  livesText: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF4B4B',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FF4B4B',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesList: {
    padding: 20,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    flex: 1,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    width: 30,
  },
});

export default LearningScreen; 
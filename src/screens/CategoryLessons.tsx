import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Category, Lesson } from '../services/learningService';

interface CategoryLessonsProps {
  route: {
    params: {
      category: Category;
    };
  };
  navigation: any;
}

const CategoryLessons: React.FC<CategoryLessonsProps> = ({ route, navigation }) => {
  const { category } = route.params;
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  
  // Ders kartı
  const renderLessonCard = ({ item, index }: { item: Lesson; index: number }) => {
    const isLocked = item.locked;
    const isCompleted = item.completed;
    
    return (
      <TouchableOpacity
        style={[
          styles.lessonCard,
          { 
            backgroundColor: isLocked 
              ? '#E0E0E0' 
              : isCompleted 
                ? category.color + '40'
                : category.color + '20'
          }
        ]}
        onPress={() => {
          if (!isLocked) {
            navigation.navigate('LessonScreen', { 
              lesson: item,
              category: category,
              lessonIndex: index
            });
          }
        }}
        disabled={isLocked}
      >
        <View style={[
          styles.lessonIconContainer,
          { 
            backgroundColor: isLocked 
              ? '#BDBDBD' 
              : isCompleted 
                ? category.color 
                : category.color + '80'
          }
        ]}>
          {isLocked ? (
            <Ionicons name="lock-closed" size={24} color="#fff" />
          ) : isCompleted ? (
            <Ionicons name="checkmark" size={24} color="#fff" />
          ) : (
            <Text style={styles.lessonNumber}>{index + 1}</Text>
          )}
        </View>
        
        <View style={styles.lessonContent}>
          <Text style={[
            styles.lessonTitle,
            { color: isLocked ? '#9E9E9E' : colors.text }
          ]}>
            {item.title}
          </Text>
          
          <View style={styles.lessonDetails}>
            <View style={styles.lessonDetailItem}>
              <Ionicons 
                name="book-outline" 
                size={14} 
                color={isLocked ? '#BDBDBD' : category.color} 
              />
              <Text style={[
                styles.lessonDetailText,
                { color: isLocked ? '#BDBDBD' : colors.textSecondary }
              ]}>
                5 Kelime
              </Text>
            </View>
            
            <View style={styles.lessonDetailItem}>
              <Ionicons 
                name="time-outline" 
                size={14} 
                color={isLocked ? '#BDBDBD' : category.color} 
              />
              <Text style={[
                styles.lessonDetailText,
                { color: isLocked ? '#BDBDBD' : colors.textSecondary }
              ]}>
                3 dakika
              </Text>
            </View>
          </View>
        </View>
        
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Ionicons name="star" size={16} color="#FFD700" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {category.title}
          </Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: '#E0E0E0' }]}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${category.progress}%`, backgroundColor: category.color }
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {category.progress}%
            </Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="heart" size={24} color="#FF4B4B" />
            <Text style={styles.livesText}>5</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.categoryBanner}>
        <LinearGradient
          colors={[category.color + '80', category.color]}
          style={styles.bannerGradient}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerIconContainer}>
              <Ionicons name={category.icon as any} size={40} color="#fff" />
            </View>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>{category.title}</Text>
              <Text style={styles.bannerSubtitle}>
                {category.lessons.length} ders ile İngilizce öğren
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={category.color} />
        </View>
      ) : (
        <FlatList
          data={category.lessons}
          renderItem={renderLessonCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lessonsList}
          showsVerticalScrollIndicator={false}
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
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 150,
    marginTop: 5,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    flex: 1,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    width: 30,
  },
  categoryBanner: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bannerGradient: {
    padding: 20,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonsList: {
    padding: 20,
    paddingTop: 10,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  lessonIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  lessonNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  lessonDetails: {
    flexDirection: 'row',
    marginTop: 5,
  },
  lessonDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonDetailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  completedBadge: {
    backgroundColor: '#FFF9E5',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
});

export default CategoryLessons;
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

const HomeScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [userName, setUserName] = useState(user?.name || 'Kullanıcı');
  const [dailyGoal, setDailyGoal] = useState(5);
  const [completedToday, setCompletedToday] = useState(2);
  const [dailyStreak, setDailyStreak] = useState(7);
  const [xp, setXp] = useState(1250);
  const [recentCategories, setRecentCategories] = useState([
    { id: '1', name: 'Yiyecekler', count: 42, color: '#58CC02' },
    { id: '2', name: 'Fiiller', count: 38, color: '#FF9600' },
    { id: '3', name: 'Renkler', count: 15, color: '#1CB0F6' },
  ]);
  
  const [courses, setCourses] = useState([
    { id: '1', title: 'Temel İngilizce', level: 'Başlangıç', progress: 35, color: isDark ? '#2C8AF4' : '#1CB0F6' },
    { id: '2', title: 'İş İngilizcesi', level: 'Orta', progress: 60, color: isDark ? '#FF9100' : '#FF9600' },
    { id: '3', title: 'Seyahat İngilizcesi', level: 'Başlangıç', progress: 20, color: isDark ? '#F44336' : '#FF4B4B' },
  ]);
  
  // Animasyon değerleri
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp'
  });
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [230, 180],
    extrapolate: 'clamp'
  });
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={isDark ? "#121212" : "#58CC02"} />
      
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={isDark ? ['#2E7D32', '#1B5E20'] : ['#58CC02', '#30A501']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Merhaba,</Text>
              <Text style={styles.userName}>{userName}</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => navigation.navigate('Search')}
              >
                <Ionicons name="search" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => navigation.navigate('ProfileStack')}
              >
                <Ionicons name="person-circle" size={36} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.streakContainer}>
            <View style={styles.streakItem}>
              <Ionicons name="flame" size={24} color="#FFD900" />
              <Text style={styles.streakNumber}>{dailyStreak}</Text>
              <Text style={styles.streakLabel}>Gün Serisi</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.streakItem}>
              <Ionicons name="diamond" size={24} color="#FFD900" />
              <Text style={styles.streakNumber}>{xp}</Text>
              <Text style={styles.streakLabel}>XP Puanı</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
      
      <Animated.ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Günlük Hedef */}
        <View style={[styles.dailyGoalCard, { 
          backgroundColor: colors.card,
          shadowColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'
        }]}>
          <View style={styles.goalHeader}>
            <Text style={[styles.goalTitle, { color: colors.text }]}>Günlük Hedef</Text>
            <Text style={[styles.goalProgress, { color: colors.primary }]}>{completedToday}/{dailyGoal}</Text>
          </View>
          
          <View style={[styles.progressBarContainer, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#F0F0F0' }]}>
            <View style={[styles.progressBar, { width: `${(completedToday/dailyGoal) * 100}%` }]} />
          </View>
          
          <TouchableOpacity 
            style={styles.continueLessonButton}
            onPress={() => navigation.navigate('StudyScreen')}
          >
            <Text style={styles.continueLessonText}>Derse Devam Et</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Kurslarım */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Kurslarım</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CategoriesStack')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.coursesScrollContent}
        >
          {courses.map((course) => (
            <TouchableOpacity 
              key={course.id}
              style={[styles.courseCard, { 
                backgroundColor: colors.card,
                shadowColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)' 
              }]}
              onPress={() => navigation.navigate('CategoryDetail', { categoryId: course.id })}
            >
              <LinearGradient
                colors={[course.color, adjustBrightness(course.color, isDark ? -15 : -30)]}
                style={styles.courseGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.courseContent}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseLevel}>{course.level}</Text>
                  
                  <View style={styles.courseProgressContainer}>
                    <View style={[styles.courseProgressBar, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)' }]}>
                      <View 
                        style={[
                          styles.courseProgressFill, 
                          { width: `${course.progress}%`, backgroundColor: isDark ? 'white' : adjustBrightness(course.color, 40) }
                        ]} 
                      />
                    </View>
                    <Text style={styles.courseProgressText}>{course.progress}%</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Hızlı Pratik */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Hızlı Pratik</Text>
        </View>
        
        <View style={styles.quickPracticeContainer}>
          <TouchableOpacity 
            style={[styles.practiceCard, { backgroundColor: isDark ? '#3E2A00' : '#FFF4DC' }]}
            onPress={() => navigation.navigate('StudyScreen')}
          >
            <View style={[styles.practiceIconContainer, { backgroundColor: isDark ? '#FFB300' : '#FFCE26' }]}>
              <Ionicons name="help-circle" size={24} color="#FFF" />
            </View>
            <Text style={[styles.practiceTitle, { color: colors.text }]}>Kelime Kartları</Text>
            <Text style={[styles.practiceSubtitle, { color: colors.textSecondary }]}>5 dakika</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.practiceCard, { backgroundColor: isDark ? '#003D3D' : '#E6FFFA' }]}
            onPress={() => navigation.navigate('Learning')}
          >
            <View style={[styles.practiceIconContainer, { backgroundColor: isDark ? '#00B3B3' : '#00CCCC' }]}>
              <Ionicons name="school" size={24} color="#FFF" />
            </View>
            <Text style={[styles.practiceTitle, { color: colors.text }]}>Duolingo Tarzı</Text>
            <Text style={[styles.practiceSubtitle, { color: colors.textSecondary }]}>10 dakika</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.practiceCard, { backgroundColor: isDark ? '#3D0A3D' : '#FFF0FF' }]}
            onPress={() => navigation.navigate('WordDetail', { wordId: 'random' })}
          >
            <View style={[styles.practiceIconContainer, { backgroundColor: isDark ? '#9C27B0' : '#BA68C8' }]}>
              <Ionicons name="shuffle" size={24} color="#FFF" />
            </View>
            <Text style={[styles.practiceTitle, { color: colors.text }]}>Rastgele Kelime</Text>
            <Text style={[styles.practiceSubtitle, { color: colors.textSecondary }]}>2 dakika</Text>
          </TouchableOpacity>
        </View>
        
        {/* Daily Challenge */}
        <TouchableOpacity style={[styles.challengeCard, { 
          shadowColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'
        }]}>
          <LinearGradient
            colors={isDark ? ['#7C4DFF', '#4527A0'] : ['#A560FF', '#7839D4']}
            style={styles.challengeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.challengeContent}>
              <View>
                <View style={styles.challengeBadge}>
                  <Text style={styles.challengeBadgeText}>GÜNLÜK</Text>
                </View>
                <Text style={styles.challengeTitle}>Meydan Okuma</Text>
                <Text style={styles.challengeDescription}>
                  5 yeni kelime öğren, 100 XP kazan!
                </Text>
              </View>
              <View style={styles.trophyContainer}>
                <Ionicons name="trophy" size={46} color="#FFD900" />
                <View style={styles.xpBadge}>
                  <Text style={styles.xpText}>+100</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.footer} />
      </Animated.ScrollView>
    </View>
  );
};

// Yardımcı fonksiyon - rengin parlaklığını ayarlar
const adjustBrightness = (hex, percent) => {
  // Basit bir şekilde koyu veya açık renk döndürür
  if (percent > 0) {
    return hex + '80'; // Alfa ile daha açık
  } else {
    return hex + 'CC'; // Alfa ile daha koyu
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 230,
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 45,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    padding: 2,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 5,
    marginTop: 20,
  },
  streakItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  streakNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  streakLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 240,
    paddingBottom: 30,
  },
  dailyGoalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3C3C3C',
  },
  goalProgress: {
    fontSize: 15,
    fontWeight: '600',
    color: '#58CC02',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginBottom: 15,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 4,
  },
  continueLessonButton: {
    flexDirection: 'row',
    backgroundColor: '#58CC02',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#58CC02',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  continueLessonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginRight: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3C3C3C',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1CB0F6',
  },
  coursesScrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  courseCard: {
    width: CARD_WIDTH,
    height: 130,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  courseGradient: {
    flex: 1,
    padding: 18,
  },
  courseContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  courseLevel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  courseProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  courseProgressBar: {
    height: 8,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  courseProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  courseProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 10,
  },
  quickPracticeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  practiceCard: {
    width: '30%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  practiceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  practiceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3C3C3C',
    marginBottom: 3,
    textAlign: 'center',
  },
  practiceSubtitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  challengeCard: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 40,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  challengeGradient: {
    padding: 20,
  },
  challengeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  challengeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  challengeDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    maxWidth: '70%',
  },
  trophyContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  xpBadge: {
    position: 'absolute',
    bottom: -5,
    backgroundColor: '#58CC02',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  xpText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    height: 30,
  },
});

export default HomeScreen;
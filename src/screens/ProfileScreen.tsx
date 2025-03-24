import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles';
import { SAMPLE_WORDS, CATEGORIES } from '../constants';
import { Button } from '../components';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../navigation';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type ProfileScreenNavigationProp = BottomTabNavigationProp<BottomTabParamList, 'Profile'>;

const { width } = Dimensions.get('window');

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [animationReady, setAnimationReady] = useState(false);
  
  // Örnek kullanıcı bilgileri (gerçek uygulamada API'den alınacak)
  const user = {
    name: "Demo Kullanıcı",
    email: "demo@wordmaster.com",
    joinDate: "18 Mart 2023",
    avatar: null, // Gerçek uygulamada resim URL'si olabilir
    streak: 4, // Kaç gün üst üste çalışıldı
  };
  
  // İstatistikler
  const statistics = {
    totalWords: SAMPLE_WORDS.length,
    learnedWords: SAMPLE_WORDS.filter(word => word.isLearned).length,
    totalCategories: CATEGORIES.length,
    completedCategories: 2, // Örnek veri
  };
  
  // Kategori bazlı ilerleme hesaplama
  const categoryProgress = CATEGORIES.map(category => {
    const categoryWords = SAMPLE_WORDS.filter(word => word.category === category.id);
    const learnedWords = categoryWords.filter(word => word.isLearned).length;
    const progress = categoryWords.length > 0 
      ? (learnedWords / categoryWords.length) * 100 
      : 0;
    
    return {
      ...category,
      progress: Math.round(progress),
      learned: learnedWords,
      total: categoryWords.length
    };
  }).sort((a, b) => b.progress - a.progress);
  
  useEffect(() => {
    // Animasyon için kısa gecikme
    const timer = setTimeout(() => {
      setAnimationReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkış yapmak istiyor musunuz?",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Çıkış Yap", 
          onPress: () => {
            // Uygulamadan çıkış yap
            navigation.navigate('Login' as any);
          } 
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryDark} barStyle="light-content" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark] as readonly [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profilim</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => {
              Alert.alert("Bilgi", "Ayarlar sayfası geliştirme aşamasındadır.");
            }}
          >
            <Ionicons name="settings-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        
        {/* Kullanıcı Bilgileri */}
        <Animatable.View 
          animation={animationReady ? "fadeIn" : undefined}
          duration={800}
          style={styles.userInfoContainer}
        >
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.joinDateContainer}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.white} style={styles.joinDateIcon} />
              <Text style={styles.joinDate}>{user.joinDate} tarihinden beri üye</Text>
            </View>
          </View>
        </Animatable.View>
        
        {/* Streak Bilgisi */}
        <Animatable.View 
          animation={animationReady ? "bounceIn" : undefined}
          duration={1000}
          delay={300}
          style={styles.streakContainer}
        >
          <View style={styles.streakContent}>
            <Ionicons name="flame" size={24} color={COLORS.warning} style={styles.streakIcon} />
            <Text style={styles.streakText}>{user.streak} Günlük Seri!</Text>
          </View>
        </Animatable.View>
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        {/* İstatistikler */}
        <Animatable.View 
          animation={animationReady ? "fadeInUp" : undefined}
          duration={800}
          delay={400}
          style={styles.statsContainer}
        >
          <Text style={styles.sectionTitle}>İstatistiklerim</Text>
          
          <View style={styles.statsGrid}>
            {/* Öğrenilen Kelimeler */}
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="book-outline" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.statNumber}>{statistics.learnedWords}</Text>
              <Text style={styles.statLabel}>Öğrenilen Kelime</Text>
            </View>
            
            {/* Tamamlanan Kategoriler */}
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="grid-outline" size={24} color={COLORS.success} />
              </View>
              <Text style={styles.statNumber}>{statistics.completedCategories}</Text>
              <Text style={styles.statLabel}>Tamamlanan Kategori</Text>
            </View>
            
            {/* Toplam Kelime */}
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="list-outline" size={24} color={COLORS.secondary} />
              </View>
              <Text style={styles.statNumber}>{statistics.totalWords}</Text>
              <Text style={styles.statLabel}>Toplam Kelime</Text>
            </View>
            
            {/* Toplam Kategori */}
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="grid-outline" size={24} color={COLORS.warning} />
              </View>
              <Text style={styles.statNumber}>{statistics.totalCategories}</Text>
              <Text style={styles.statLabel}>Toplam Kategori</Text>
            </View>
          </View>
          
          {/* Genel İlerleme */}
          <View style={styles.overallProgressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Genel İlerleme</Text>
              <Text style={styles.progressValue}>
                {Math.round((statistics.learnedWords / statistics.totalWords) * 100)}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(statistics.learnedWords / statistics.totalWords) * 100}%`,
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressSubtext}>
              {statistics.learnedWords} / {statistics.totalWords} kelime öğrenildi
            </Text>
          </View>
        </Animatable.View>
        
        {/* Kategori İlerlemeleri */}
        <Animatable.View 
          animation={animationReady ? "fadeInUp" : undefined}
          duration={800}
          delay={600}
          style={styles.categoryProgressContainer}
        >
          <Text style={styles.sectionTitle}>Kategori İlerlemelerim</Text>
          
          {categoryProgress.slice(0, 5).map((category, index) => (
            <Animatable.View
              key={category.id}
              animation={animationReady ? "fadeInUp" : undefined}
              duration={500}
              delay={700 + (index * 100)}
              style={styles.categoryItem}
            >
              <View style={styles.categoryHeader}>
                <View style={styles.categoryTitleContainer}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <Text style={styles.categoryProgressValue}>{category.progress}%</Text>
              </View>
              
              <View style={styles.categoryProgressBar}>
                <View 
                  style={[
                    styles.categoryProgressFill, 
                    { 
                      width: `${category.progress}%`,
                      backgroundColor: category.color,
                    }
                  ]} 
                />
              </View>
              
              <Text style={styles.categoryProgressSubtext}>
                {category.learned} / {category.total} kelime öğrenildi
              </Text>
            </Animatable.View>
          ))}
          
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('Categories')}
          >
            <Text style={styles.seeAllText}>Tüm Kategorileri Gör</Text>
          </TouchableOpacity>
        </Animatable.View>
        
        {/* Çıkış Butonu */}
        <Animatable.View 
          animation={animationReady ? "fadeInUp" : undefined}
          duration={800}
          delay={800}
          style={styles.logoutButtonContainer}
        >
          <Button
            title="Çıkış Yap"
            onPress={handleLogout}
            variant="outline"
            containerStyle={styles.logoutButton}
          />
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    borderBottomLeftRadius: SIZES.medium,
    borderBottomRightRadius: SIZES.medium,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.large,
    paddingTop: SIZES.medium,
  },
  headerTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.large,
  },
  avatarContainer: {
    marginRight: SIZES.large,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.white,
    ...SHADOWS.medium,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    ...SHADOWS.medium,
  },
  avatarText: {
    fontSize: FONTS.size.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: FONTS.size.small,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SIZES.small,
  },
  joinDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinDateIcon: {
    marginRight: 4,
  },
  joinDate: {
    fontSize: FONTS.size.small,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  streakContainer: {
    alignSelf: 'flex-start',
    marginLeft: SIZES.large,
    marginBottom: SIZES.large,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SIZES.medium,
    padding: SIZES.small,
    paddingRight: SIZES.medium,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIcon: {
    marginRight: SIZES.small / 2,
  },
  streakText: {
    fontSize: FONTS.size.medium,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  content: {
    flex: 1,
    paddingTop: SIZES.medium,
  },
  sectionTitle: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.medium,
  },
  statsContainer: {
    margin: SIZES.medium,
    padding: SIZES.large,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    ...SHADOWS.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.large,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.small,
  },
  statNumber: {
    fontSize: FONTS.size.xl,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FONTS.size.small,
    color: COLORS.gray,
    textAlign: 'center',
  },
  overallProgressContainer: {
    marginTop: SIZES.small,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small / 2,
  },
  progressTitle: {
    fontSize: FONTS.size.medium,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  progressValue: {
    fontSize: FONTS.size.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.lightGray,
    borderRadius: 5,
    marginBottom: SIZES.small / 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  progressSubtext: {
    fontSize: FONTS.size.small,
    color: COLORS.gray,
  },
  categoryProgressContainer: {
    margin: SIZES.medium,
    padding: SIZES.large,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    ...SHADOWS.medium,
  },
  categoryItem: {
    marginBottom: SIZES.medium,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small / 2,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: FONTS.size.large,
    marginRight: SIZES.small,
  },
  categoryName: {
    fontSize: FONTS.size.medium,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  categoryProgressValue: {
    fontSize: FONTS.size.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  categoryProgressBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginBottom: SIZES.small / 2,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryProgressSubtext: {
    fontSize: FONTS.size.small,
    color: COLORS.gray,
  },
  seeAllButton: {
    alignItems: 'center',
    paddingVertical: SIZES.medium,
    marginTop: SIZES.small,
  },
  seeAllText: {
    fontSize: FONTS.size.medium,
    color: COLORS.primary,
    fontWeight: '600',
  },
  logoutButtonContainer: {
    margin: SIZES.medium,
    marginBottom: SIZES.xxlarge,
  },
  logoutButton: {
    backgroundColor: COLORS.white,
  },
});

export default ProfileScreen; 
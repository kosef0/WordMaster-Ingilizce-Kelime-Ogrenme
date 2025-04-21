import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('Kullanıcı');
  const [recentCategories, setRecentCategories] = useState([
    { id: '1', name: 'Yiyecekler', count: 42 },
    { id: '2', name: 'Fiiller', count: 38 },
    { id: '3', name: 'Renkler', count: 15 },
  ]);
  
  const [stats, setStats] = useState({
    learnedWords: 124,
    streak: 7,
    totalPoints: 1250
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      <LinearGradient
        colors={['#4CAF50', '#8BC34A']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Merhaba,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle" size={40} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Ionicons name="book-outline" size={24} color="#4CAF50" />
            <Text style={styles.statsNumber}>{stats.learnedWords}</Text>
            <Text style={styles.statsLabel}>Öğrenilen</Text>
          </View>
          
          <View style={styles.statsCard}>
            <Ionicons name="flame-outline" size={24} color="#FF5722" />
            <Text style={styles.statsNumber}>{stats.streak}</Text>
            <Text style={styles.statsLabel}>Gün Serisi</Text>
          </View>
          
          <View style={styles.statsCard}>
            <Ionicons name="star-outline" size={24} color="#FFC107" />
            <Text style={styles.statsNumber}>{stats.totalPoints}</Text>
            <Text style={styles.statsLabel}>Puan</Text>
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#E3F2FD' }]}
            onPress={() => navigation.navigate('Categories')}
          >
            <Ionicons name="grid-outline" size={28} color="#2196F3" />
            <Text style={styles.actionText}>Kategoriler</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#F9FBE7' }]}
            onPress={() => {/* Quiz başlat */}}
          >
            <Ionicons name="help-circle-outline" size={28} color="#8BC34A" />
            <Text style={styles.actionText}>Quiz</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#FFF3E0' }]}
            onPress={() => {/* Kelime Oyunu */}}
          >
            <Ionicons name="game-controller-outline" size={28} color="#FF9800" />
            <Text style={styles.actionText}>Oyun</Text>
          </TouchableOpacity>
        </View>
        
        {/* Recent Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son Kategoriler</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
            <Text style={styles.seeAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        
        {recentCategories.map((category) => (
          <TouchableOpacity 
            key={category.id}
            style={styles.categoryItem}
            onPress={() => navigation.navigate('CategoryDetail', { categoryId: category.id })}
          >
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count} kelime</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
        
        {/* Daily Challenge */}
        <TouchableOpacity style={styles.challengeCard}>
          <LinearGradient
            colors={['#673AB7', '#9C27B0']}
            style={styles.challengeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.challengeContent}>
              <View>
                <Text style={styles.challengeTitle}>Günlük Meydan Okuma</Text>
                <Text style={styles.challengeDescription}>
                  Bugün 5 yeni kelime öğren ve 100 puan kazan!
                </Text>
              </View>
              <Ionicons name="trophy" size={40} color="#FFC107" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -30,
    marginBottom: 20,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: (width - 60) / 3,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 60) / 3,
    height: 90,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    color: '#333',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  challengeCard: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  challengeGradient: {
    padding: 20,
  },
  challengeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  challengeDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    width: width - 120,
  },
  footer: {
    height: 20,
  },
});

export default HomeScreen;
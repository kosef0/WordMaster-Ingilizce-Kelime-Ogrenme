import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const UserProfileHeader = ({
  username = 'Test User',
  greeting = 'Merhaba,',
  streakDays = 7,
  xpPoints = 1250,
  colors = ['#32CD32', '#228B22'], // Yeşil tonları
  style,
}) => {
  return (
    <LinearGradient
      colors={colors}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.userInfo}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.username}>{username}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={styles.flameIcon}>
            <Text style={styles.flameEmoji}>🔥</Text>
          </View>
          <Text style={styles.statValue}>{streakDays}</Text>
          <Text style={styles.statLabel}>Gün Serisi</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.diamondIcon}>
            <Text style={styles.diamondEmoji}>💎</Text>
          </View>
          <Text style={styles.statValue}>{xpPoints}</Text>
          <Text style={styles.statLabel}>XP Puanı</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  userInfo: {
    flexDirection: 'column',
    marginBottom: 6,
  },
  greeting: {
    color: 'white',
    fontSize: 16,
  },
  username: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 12,
    marginTop: 6,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  flameIcon: {
    marginBottom: 2,
  },
  flameEmoji: {
    fontSize: 24,
  },
  diamondIcon: {
    marginBottom: 2,
  },
  diamondEmoji: {
    fontSize: 24,
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
  },
});

export default UserProfileHeader; 
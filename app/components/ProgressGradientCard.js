import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ProgressGradientCard = ({
  title,
  description,
  progress = 0,
  colors = ['#6441A5', '#2a0845'],
  maxValue = 100,
  style,
  progressBarColor = '#fff',
}) => {
  // Ensure progress is between 0 and maxValue
  const validProgress = Math.min(Math.max(0, progress), maxValue);
  const progressPercentage = (validProgress / maxValue) * 100;
  
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${progressPercentage}%`, backgroundColor: progressBarColor }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {validProgress} / {maxValue}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginVertical: 8,
  },
  gradient: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBackground: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
});

export default ProgressGradientCard; 
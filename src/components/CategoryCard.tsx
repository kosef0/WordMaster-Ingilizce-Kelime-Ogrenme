import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles';
import { Category } from '../constants';

interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
  style?: ViewStyle;
  showProgress?: boolean;
  progress?: {
    learned: number;
    total: number;
  };
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  style,
  showProgress = true,
  progress = { learned: 0, total: 0 }
}) => {
  const progressPercentage = progress.total > 0 
    ? Math.round((progress.learned / progress.total) * 100) 
    : 0;

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: category.color }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{category.name}</Text>
        
        {showProgress && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${progressPercentage}%`,
                    backgroundColor: category.color
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {progress.learned}/{progress.total}
            </Text>
          </View>
        )}
        
        {category.level && (
          <View style={[styles.levelBadge, { backgroundColor: category.color }]}>
            <Text style={styles.levelText}>{category.level}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginVertical: SIZES.small / 2,
    marginHorizontal: SIZES.small,
    borderLeftWidth: 5,
    ...SHADOWS.small,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.medium,
  },
  icon: {
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONTS.size.medium,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: SIZES.small / 2,
    flexShrink: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: SIZES.small,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: FONTS.size.small,
    color: COLORS.gray,
    minWidth: 45,
    textAlign: 'right',
  },
  levelBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: SIZES.small / 2,
    paddingVertical: 2,
    borderRadius: SIZES.small / 2,
  },
  levelText: {
    color: COLORS.white,
    fontSize: FONTS.size.xs,
    fontWeight: 'bold',
  },
});

export default CategoryCard; 
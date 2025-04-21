import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  TouchableOpacityProps, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
  Easing
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../styles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  containerStyle,
  textStyle,
  onPress,
  ...rest
}) => {
  // Animasyon değerleri
  const [scaleValue] = useState(new Animated.Value(1));
  
  // Basılma efekti
  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.96,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease)
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease)
    }).start();
  };
  
  const handlePress = () => {
    if (onPress && !disabled && !isLoading) {
      onPress();
    }
  };

  const getBackgroundColor = () => {
    if (disabled) return COLORS.gray;
    
    switch (variant) {
      case 'primary':
        return COLORS.primary;
      case 'secondary':
        return COLORS.secondary;
      case 'outline':
        return 'transparent';
      default:
        return COLORS.primary;
    }
  };

  const getBorderColor = () => {
    if (disabled) return COLORS.gray;
    
    switch (variant) {
      case 'outline':
        return COLORS.primary;
      default:
        return 'transparent';
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.darkGray;
    
    switch (variant) {
      case 'outline':
        return COLORS.primary;
      default:
        return COLORS.white;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return SIZES.small;
      case 'large':
        return SIZES.large;
      default:
        return SIZES.medium;
    }
  };
  
  // Button yüksekliği
  const getHeight = () => {
    switch (size) {
      case 'small':
        return 40;
      case 'large':
        return 60;
      default:
        return 50;
    }
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleValue }],
          borderRadius: SIZES.small,
          overflow: 'hidden'
        }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            paddingVertical: getPadding(),
            height: getHeight(),
          },
          containerStyle,
        ]}
        disabled={disabled || isLoading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={0.9}
        {...rest}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={getTextColor()} />
        ) : (
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.large,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: FONTS.size.regular,
    fontWeight: '600',
  },
});

export default Button; 
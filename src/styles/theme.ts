import { COLORS } from './colors';

export const FONTS = {
  // Font ailesi
  regular: 'System', // Varsayılan sistem fontu kullanılabilir veya özel fontlar ile değiştirilebilir
  medium: 'System',
  bold: 'System',
  
  // Font boyutları
  size: {
    xs: 10,
    small: 12,
    medium: 14,
    regular: 16,
    large: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  }
};

export const SIZES = {
  // Ekran boyutları
  base: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  
  // Ekran genişlik ve yükseklik değerleri için varsayılan değerler
  // Bu değerler runtime'da gerçek ekran boyutlarıyla değiştirilebilir
  width: 375,
  height: 812
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Tema için varsayılan değerleri dışa aktaralım
export default {
  COLORS,
  FONTS,
  SIZES,
  SHADOWS,
}; 
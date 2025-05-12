import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

type ThemeSettingsProps = {
  containerStyle?: ViewStyle;
};

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ containerStyle }) => {
  const { colors, isDark, theme, setTheme, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, containerStyle]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Tema Ayarları</Text>
      </View>

      {/* Dark Mode Toggle */}
      <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
        <View style={styles.settingInfo}>
          <Ionicons 
            name={isDark ? "moon" : "sunny"} 
            size={24} 
            color={isDark ? "#A560FF" : "#FFD900"} 
          />
          <Text style={[styles.settingText, { color: colors.text }]}>
            Karanlık Mod
          </Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#58CC02' }}
          thumbColor={isDark ? '#FFFFFF' : '#f4f3f4'}
        />
      </View>

      {/* System Theme Option */}
      <TouchableOpacity 
        style={[styles.settingRow, { borderBottomColor: colors.border }]}
        onPress={() => setTheme('system')}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="phone-portrait-outline" size={24} color={colors.text} />
          <Text style={[styles.settingText, { color: colors.text }]}>
            Sistem Ayarlarını Kullan
          </Text>
        </View>
        <View style={styles.radioContainer}>
          <View style={[
            styles.radioOuter, 
            { borderColor: colors.primary }
          ]}>
            {theme === 'system' && (
              <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Light Theme Option */}
      <TouchableOpacity 
        style={[styles.settingRow, { borderBottomColor: colors.border }]}
        onPress={() => setTheme('light')}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="sunny-outline" size={24} color={colors.text} />
          <Text style={[styles.settingText, { color: colors.text }]}>
            Açık Tema
          </Text>
        </View>
        <View style={styles.radioContainer}>
          <View style={[
            styles.radioOuter, 
            { borderColor: colors.primary }
          ]}>
            {theme === 'light' && (
              <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Dark Theme Option */}
      <TouchableOpacity 
        style={[styles.settingRow, { borderBottomColor: colors.border }]}
        onPress={() => setTheme('dark')}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="moon-outline" size={24} color={colors.text} />
          <Text style={[styles.settingText, { color: colors.text }]}>
            Koyu Tema
          </Text>
        </View>
        <View style={styles.radioContainer}>
          <View style={[
            styles.radioOuter, 
            { borderColor: colors.primary }
          ]}>
            {theme === 'dark' && (
              <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Theme Preview */}
      <View style={styles.previewContainer}>
        <View style={[
          styles.previewCard, 
          { backgroundColor: isDark ? darkColors.background : lightColors.background }
        ]}>
          <Text style={[
            styles.previewText, 
            { color: isDark ? darkColors.text : lightColors.text }
          ]}>
            Şu anki tema: {isDark ? 'Koyu' : 'Açık'}
          </Text>
          <View style={[
            styles.previewButton, 
            { backgroundColor: isDark ? darkColors.primary : lightColors.primary }
          ]}>
            <Text style={styles.previewButtonText}>Örnek Buton</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Light and dark color preview
const lightColors = {
  background: '#FFFFFF',
  text: '#303030',
  primary: '#58CC02',
};

const darkColors = {
  background: '#121212',
  text: '#FFFFFF',
  primary: '#58CC02',
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  radioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  previewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  previewCard: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 16,
    marginBottom: 12,
  },
  previewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  previewButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ThemeSettings; 
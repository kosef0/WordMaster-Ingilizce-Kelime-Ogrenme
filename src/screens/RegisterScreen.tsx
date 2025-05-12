import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen = () => {
  const { colors, isDark } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useAuth();
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError('İsminizi giriniz');
      return false;
    } else if (name.trim().length < 2) {
      setNameError('İsim en az 2 karakter olmalıdır');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('E-posta adresinizi giriniz');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Geçerli bir e-posta adresi giriniz');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Şifrenizi giriniz');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalıdır');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const validateConfirmPassword = (confirmPass: string) => {
    if (!confirmPass) {
      setConfirmPasswordError('Şifrenizi tekrar giriniz');
      return false;
    } else if (confirmPass !== password) {
      setConfirmPasswordError('Şifreler eşleşmiyor');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  };

  const handleRegister = async () => {
    console.log('Kayıt formuna tıklandı');
    
    // Tüm alanları doğrula
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      console.log('Form doğrulama başarısız:', {
        isNameValid,
        isEmailValid,
        isPasswordValid,
        isConfirmPasswordValid
      });
      return;
    }

    try {
      console.log('Kayıt işlemi başlatılıyor...');
      await register(name, email, password);
      console.log('Kayıt başarılı');
      // Başarılı kayıt durumunda - otomatik olarak giriş yapacak
    } catch (error: any) {
      console.error('Kayıt işleminde hata:', error);
      let errorMessage = 'Kayıt olurken bir hata oluştu';
      
      if (error.response) {
        // Sunucudan gelen hata mesajını kullan
        errorMessage = error.response.data.msg || 'Bu e-posta adresi zaten kullanımda olabilir';
        console.log('Sunucu hatası:', error.response.status, error.response.data);
      } else if (error.request) {
        // Sunucuya ulaşılamadı
        errorMessage = 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.';
        console.log('İstek hatası:', error.request);
      } else {
        console.log('Genel hata:', error.message);
      }
      
      Alert.alert('Kayıt Başarısız', errorMessage);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.background : '#fff' }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#121212" : "#58CC02"} />
      
      <LinearGradient
        colors={isDark ? ['#2E7D32', '#1B5E20'] : ['#58CC02', '#30A501']}
        style={styles.headerGradient}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidContainer}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: isDark ? colors.text : '#333' }]}>Hesap Oluştur</Text>
          <Text style={[styles.subtitle, { color: isDark ? colors.textSecondary : '#666' }]}>WordMaster'a hoş geldiniz</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={22} color={isDark ? colors.textSecondary : '#888'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: nameError ? colors.error : 'transparent' }]}
                placeholder="Ad Soyad"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : '#999'}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (nameError) validateName(text);
                }}
                onBlur={() => validateName(name)}
              />
            </View>
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={22} color={isDark ? colors.textSecondary : '#888'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: emailError ? colors.error : 'transparent' }]}
                placeholder="E-posta"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : '#999'}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) validateEmail(text);
                }}
                onBlur={() => validateEmail(email)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={22} color={isDark ? colors.textSecondary : '#888'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: passwordError ? colors.error : 'transparent' }]}
                placeholder="Şifre"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : '#999'}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) validatePassword(text);
                  if (confirmPassword && confirmPasswordError) {
                    validateConfirmPassword(confirmPassword);
                  }
                }}
                onBlur={() => validatePassword(password)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.showPasswordButton} 
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={22} 
                  color={isDark ? colors.textSecondary : '#888'} 
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={22} color={isDark ? colors.textSecondary : '#888'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: confirmPasswordError ? colors.error : 'transparent' }]}
                placeholder="Şifre Tekrar"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : '#999'}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) validateConfirmPassword(text);
                }}
                onBlur={() => validateConfirmPassword(confirmPassword)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.showPasswordButton} 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={22} 
                  color={isDark ? colors.textSecondary : '#888'} 
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.primary }]} 
              onPress={handleRegister} 
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Kayıt Ol</Text>
              )}
            </TouchableOpacity>

            <View style={styles.linkContainer}>
              <Text style={[styles.linkText, { color: isDark ? colors.textSecondary : '#666' }]}>Zaten hesabınız var mı? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.link, { color: colors.primary }]}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
  },
  form: {
    width: '90%',
    maxWidth: 400,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  showPasswordButton: {
    padding: 8,
  },
  errorText: {
    color: '#FF5E62',
    marginBottom: 8,
    marginLeft: 5,
    fontSize: 12,
  },
  button: {
    backgroundColor: '#58CC02',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    elevation: 2,
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 15,
    color: '#666',
  },
  link: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#58CC02',
  },
});

export default RegisterScreen;
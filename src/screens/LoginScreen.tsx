<<<<<<< HEAD
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen e-posta ve şifre giriniz.');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Giriş Hatası', 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WordMaster</Text>
      <Text style={styles.subtitle}>İngilizce Kelime Öğrenme Uygulaması</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Giriş Yap</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.link}>Hesabınız yok mu? Kayıt olun</Text>
        </TouchableOpacity>
      </View>
    </View>
=======
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles';
import { Button } from '../components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import * as Animatable from 'react-native-animatable';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(30)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animasyonu
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Form animasyonu
    Animated.timing(moveAnim, {
      toValue: 0,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();

    // Logo dönme animasyonu
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });

  const handleLogin = () => {
    // Basit doğrulama
    if (!email || !password) {
      setErrorMessage('Lütfen tüm alanları doldurun.');
      return;
    }

    // Giriş yükleniyor
    setIsLoading(true);
    setErrorMessage('');

    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setIsLoading(false);
      
      // Demo amaçlı olarak, sabit bir e-posta ve şifre ile giriş yapabilirsiniz
      if (email === 'demo@wordmaster.com' && password === 'password') {
        navigation.navigate('Main');
      } else {
        setErrorMessage('Geçersiz e-posta veya şifre.');
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.logoContainer, 
              { 
                opacity: fadeAnim,
                transform: [{ rotate: spin }]
              }
            ]}
          >
            <Text style={styles.logo}>🔤</Text>
            <Animatable.Text 
              animation="pulse" 
              iterationCount="infinite" 
              duration={2000} 
              style={styles.appName}
            >
              WordMaster
            </Animatable.Text>
          </Animated.View>

          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: moveAnim }]
              }
            ]}
          >
            <Animatable.Text 
              animation="fadeIn" 
              duration={1000} 
              delay={500} 
              style={styles.welcomeText}
            >
              Hoş Geldiniz!
            </Animatable.Text>
            
            <Animatable.Text 
              animation="fadeIn" 
              duration={1000} 
              delay={700} 
              style={styles.subtitle}
            >
              Hesabınıza giriş yaparak kelime öğrenmeye başlayın
            </Animatable.Text>

            {errorMessage ? (
              <Animatable.View 
                animation="shake" 
                duration={500} 
                style={styles.errorContainer}
              >
                <Text style={styles.errorText}>{errorMessage}</Text>
              </Animatable.View>
            ) : null}

            <Animatable.View 
              animation="fadeInUp" 
              duration={800} 
              delay={800} 
              style={styles.inputContainer}
            >
              <Text style={styles.inputLabel}>E-posta</Text>
              <TextInput
                style={styles.input}
                placeholder="E-posta adresinizi girin"
                placeholderTextColor={COLORS.gray}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </Animatable.View>

            <Animatable.View 
              animation="fadeInUp" 
              duration={800} 
              delay={1000} 
              style={styles.inputContainer}
            >
              <Text style={styles.inputLabel}>Şifre</Text>
              <TextInput
                style={styles.input}
                placeholder="Şifrenizi girin"
                placeholderTextColor={COLORS.gray}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </Animatable.View>

            <Animatable.View 
              animation="fadeIn" 
              duration={800} 
              delay={1200}
            >
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
              </TouchableOpacity>
            </Animatable.View>

            <Animatable.View 
              animation="bounceIn" 
              duration={1000} 
              delay={1400}
            >
              <Button
                title="Giriş Yap"
                onPress={handleLogin}
                isLoading={isLoading}
                containerStyle={styles.loginButton}
              />
            </Animatable.View>

            <Animatable.View 
              animation="fadeIn" 
              duration={1000} 
              delay={1600} 
              style={styles.separatorContainer}
            >
              <View style={styles.separator} />
              <Text style={styles.separatorText}>veya</Text>
              <View style={styles.separator} />
            </Animatable.View>

            <Animatable.View 
              animation="fadeInUp" 
              duration={800} 
              delay={1800} 
              style={styles.socialButtonsContainer}
            >
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: '#4267B2' }]}
                activeOpacity={0.8}
              >
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: '#DB4437' }]}
                activeOpacity={0.8}
              >
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
            </Animatable.View>

            <Animatable.View 
              animation="fadeIn" 
              duration={1000} 
              delay={2000} 
              style={styles.registerContainer}
            >
              <Text style={styles.registerText}>Hesabınız yok mu?</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Register')}
                activeOpacity={0.7}
              >
                <Text style={styles.registerLink}>Üye Ol</Text>
              </TouchableOpacity>
            </Animatable.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Hareketli arka plan şekilleri */}
      <Animatable.View animation="pulse" iterationCount="infinite" duration={4000} style={[styles.backgroundShape, styles.shape1]} />
      <Animatable.View animation="pulse" iterationCount="infinite" duration={5000} style={[styles.backgroundShape, styles.shape2]} />
      <Animatable.View animation="pulse" iterationCount="infinite" duration={6000} style={[styles.backgroundShape, styles.shape3]} />
    </SafeAreaView>
>>>>>>> bed42af4b2d242a4be38a0dce664da7ff1abddc0
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4CAF50',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: '#4CAF50',
    fontSize: 16,
  },
});

export default LoginScreen;
=======
    backgroundColor: COLORS.background,
  },
  keyboardAvoidContainer: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SIZES.xxlarge,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SIZES.xxlarge * 1.5,
    marginBottom: SIZES.large,
  },
  logo: {
    fontSize: 80,
    marginBottom: SIZES.medium,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  appName: {
    fontSize: FONTS.size.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    letterSpacing: 1,
  },
  formContainer: {
    padding: SIZES.large,
  },
  welcomeText: {
    fontSize: FONTS.size.xl,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.small / 2,
  },
  subtitle: {
    fontSize: FONTS.size.medium,
    color: COLORS.gray,
    marginBottom: SIZES.large,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: FONTS.size.small,
  },
  inputContainer: {
    marginBottom: SIZES.medium,
  },
  inputLabel: {
    fontSize: FONTS.size.small,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: SIZES.small / 2,
  },
  input: {
    backgroundColor: COLORS.white,
    height: 55,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    color: COLORS.darkGray,
    fontSize: FONTS.size.medium,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SIZES.large,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: FONTS.size.small,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: SIZES.large,
    height: 55,
    borderRadius: SIZES.small * 2,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.lightGray,
  },
  separatorText: {
    color: COLORS.gray,
    marginHorizontal: SIZES.small,
    fontSize: FONTS.size.small,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.large,
  },
  socialButton: {
    flex: 1,
    height: 50,
    borderRadius: SIZES.small,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SIZES.small / 2,
    ...SHADOWS.small,
  },
  socialButtonText: {
    color: COLORS.white,
    fontSize: FONTS.size.small,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.small,
  },
  registerText: {
    color: COLORS.darkGray,
    fontSize: FONTS.size.small,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONTS.size.small,
    marginLeft: SIZES.small / 2,
  },
  // Arka plan şekilleri
  backgroundShape: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.15,
  },
  shape1: {
    backgroundColor: COLORS.gradient.start,
    width: width * 0.5,
    height: width * 0.5,
    top: -width * 0.15,
    left: -width * 0.15,
    borderRadius: 150,
  },
  shape2: {
    backgroundColor: COLORS.gradient.middle,
    width: width * 0.4,
    height: width * 0.4,
    bottom: height * 0.25,
    right: -width * 0.1,
    borderRadius: 200,
  },
  shape3: {
    backgroundColor: COLORS.gradient.end,
    width: width * 0.3,
    height: width * 0.3,
    bottom: height * 0.05,
    left: width * 0.3,
    borderRadius: 150,
  },
});

export default LoginScreen; 
>>>>>>> bed42af4b2d242a4be38a0dce664da7ff1abddc0

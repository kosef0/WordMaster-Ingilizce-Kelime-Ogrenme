import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles';
import { Button } from '../components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import * as Animatable from 'react-native-animatable';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;
const { width, height } = Dimensions.get('window');

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    // Animasyonların başlama zamanını ayarlıyoruz
    setTimeout(() => {
      setAnimationReady(true);
    }, 100);
  }, []);

  const handleRegister = () => {
    // Basit doğrulama
    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMessage('Lütfen tüm alanları doldurun.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Şifreler eşleşmiyor.');
      return;
    }

    // Kayıt yükleniyor
    setIsLoading(true);
    setErrorMessage('');

    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setIsLoading(false);
      
      // Demo amaçlı başarılı kayıt
      navigation.navigate('Main');
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
          <Animatable.View 
            animation="fadeIn"
            duration={500}
            style={styles.header}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Animatable.Text 
                animation="pulse" 
                iterationCount="infinite" 
                duration={3000}
                style={styles.backButtonText}
              >
                ←
              </Animatable.Text>
            </TouchableOpacity>
            <Animatable.Text 
              animation="fadeIn"
              duration={800}
              style={styles.headerTitle}
            >
              WordMaster
            </Animatable.Text>
            <View style={{ width: 40 }} />
          </Animatable.View>

          <Animatable.View 
            animation="fadeInUp"
            duration={800}
            delay={300}
            style={styles.formContainer}
          >
            <Animatable.Text 
              animation="fadeIn"
              duration={1000}
              delay={500}
              style={styles.subtitle}
            >
              İngilizce kelime haznenizi geliştirmek için hesap oluşturun
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
              animation={animationReady ? "fadeInUp" : undefined}
              duration={800}
              delay={600}
              style={styles.inputContainer}
            >
              <Text style={styles.inputLabel}>Ad Soyad</Text>
              <TextInput
                style={styles.input}
                placeholder="Adınızı ve soyadınızı girin"
                placeholderTextColor={COLORS.gray}
                value={fullName}
                onChangeText={setFullName}
              />
            </Animatable.View>

            <Animatable.View 
              animation={animationReady ? "fadeInUp" : undefined}
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
              animation={animationReady ? "fadeInUp" : undefined}
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
              animation={animationReady ? "fadeInUp" : undefined}
              duration={800}
              delay={1200}
              style={styles.inputContainer}
            >
              <Text style={styles.inputLabel}>Şifre Tekrar</Text>
              <TextInput
                style={styles.input}
                placeholder="Şifrenizi tekrar girin"
                placeholderTextColor={COLORS.gray}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </Animatable.View>

            <Animatable.View 
              animation={animationReady ? "bounceIn" : undefined}
              duration={1000}
              delay={1400}
            >
              <Button
                title="Kayıt Ol"
                onPress={handleRegister}
                isLoading={isLoading}
                containerStyle={styles.registerButton}
              />
            </Animatable.View>

            <Animatable.View 
              animation={animationReady ? "fadeIn" : undefined}
              duration={1000}
              delay={1600}
              style={styles.termsContainer}
            >
              <Text style={styles.termsText}>
                Kayıt olarak, 
                <Text style={styles.termsLink}> Kullanım Koşulları </Text> 
                ve 
                <Text style={styles.termsLink}> Gizlilik Politikası</Text>'nı kabul etmiş olursunuz.
              </Text>
            </Animatable.View>

            <Animatable.View 
              animation={animationReady ? "fadeIn" : undefined}
              duration={1000}
              delay={1800}
              style={styles.loginContainer}
            >
              <Text style={styles.loginText}>Zaten hesabınız var mı?</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.7}
              >
                <Text style={styles.loginLink}>Giriş Yap</Text>
              </TouchableOpacity>
            </Animatable.View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Hareketli arka plan şekilleri */}
      <Animatable.View animation="pulse" iterationCount="infinite" duration={4000} style={[styles.backgroundShape, styles.shape1]} />
      <Animatable.View animation="pulse" iterationCount="infinite" duration={5000} style={[styles.backgroundShape, styles.shape2]} />
      <Animatable.View animation="pulse" iterationCount="infinite" duration={6000} style={[styles.backgroundShape, styles.shape3]} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
    borderWidth: 1, 
    borderColor: 'rgba(0,0,0,0.05)',
  },
  backButtonText: {
    fontSize: FONTS.size.large,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  formContainer: {
    padding: SIZES.large,
  },
  subtitle: {
    fontSize: FONTS.size.medium,
    color: COLORS.darkGray,
    marginBottom: SIZES.large,
    textAlign: 'center',
    lineHeight: 22,
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
  registerButton: {
    marginTop: SIZES.small,
    marginBottom: SIZES.medium,
    height: 55,
    borderRadius: SIZES.small * 2,
  },
  termsContainer: {
    marginBottom: SIZES.large,
  },
  termsText: {
    color: COLORS.gray,
    fontSize: FONTS.size.small,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.small,
  },
  loginText: {
    color: COLORS.darkGray,
    fontSize: FONTS.size.small,
  },
  loginLink: {
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
    zIndex: 0,
  },
  shape1: {
    backgroundColor: COLORS.gradient.start,
    width: width * 0.4,
    height: width * 0.4,
    top: height * 0.05,
    right: -width * 0.1,
    borderRadius: 150,
  },
  shape2: {
    backgroundColor: COLORS.gradient.middle,
    width: width * 0.35,
    height: width * 0.35,
    bottom: height * 0.35,
    left: -width * 0.1,
    borderRadius: 200,
  },
  shape3: {
    backgroundColor: COLORS.gradient.end,
    width: width * 0.25,
    height: width * 0.25,
    bottom: height * 0.05,
    right: width * 0.3,
    borderRadius: 150,
  },
});

export default RegisterScreen; 
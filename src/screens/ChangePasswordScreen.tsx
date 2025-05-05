import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ChangePasswordScreen = () => {
  const { changePassword } = useAuth();
  const navigation = useNavigation();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword) {
      Alert.alert('Hata', 'Mevcut şifrenizi giriniz');
      return;
    }
    
    if (!newPassword) {
      Alert.alert('Hata', 'Yeni şifrenizi giriniz');
      return;
    }
    
    if (newPassword.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await changePassword(currentPassword, newPassword);
      Alert.alert('Başarılı', 'Şifreniz başarıyla değiştirildi', [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Şifre değiştirme hatası:', error);
      
      let errorMessage = 'Şifre değiştirilirken bir sorun oluştu';
      // @ts-ignore
      if (error.response && error.response.data && error.response.data.msg) {
        // @ts-ignore
        errorMessage = error.response.data.msg;
      }
      
      Alert.alert('Hata', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3F51B5', '#5C6BC0']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Şifre Değiştir</Text>
          <View style={styles.placeholderView} />
        </View>
      </LinearGradient>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.content}>
          <View style={styles.formContainer}>
            <Text style={styles.description}>
              Şifrenizi değiştirmek için önce mevcut şifrenizi, ardından yeni şifrenizi giriniz.
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mevcut Şifre</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Mevcut şifreniz"
                  placeholderTextColor="#999"
                  secureTextEntry={!showCurrentPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton} 
                  onPress={toggleCurrentPasswordVisibility}
                >
                  <Ionicons 
                    name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Yeni Şifre</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Yeni şifreniz"
                  placeholderTextColor="#999"
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton} 
                  onPress={toggleNewPasswordVisibility}
                >
                  <Ionicons 
                    name={showNewPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Yeni Şifre (Tekrar)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Yeni şifrenizi tekrar giriniz"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton} 
                  onPress={toggleConfirmPasswordVisibility}
                >
                  <Ionicons 
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>Şifre gereksinimleri:</Text>
              <View style={styles.requirement}>
                <Ionicons 
                  name={newPassword.length >= 6 ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={newPassword.length >= 6 ? "#4CAF50" : "#999"} 
                />
                <Text style={[
                  styles.requirementText, 
                  newPassword.length >= 6 && styles.requirementMet
                ]}>
                  En az 6 karakter
                </Text>
              </View>
              
              <View style={styles.requirement}>
                <Ionicons 
                  name={/[A-Z]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={/[A-Z]/.test(newPassword) ? "#4CAF50" : "#999"} 
                />
                <Text style={[
                  styles.requirementText, 
                  /[A-Z]/.test(newPassword) && styles.requirementMet
                ]}>
                  En az 1 büyük harf
                </Text>
              </View>
              
              <View style={styles.requirement}>
                <Ionicons 
                  name={/[0-9]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={/[0-9]/.test(newPassword) ? "#4CAF50" : "#999"} 
                />
                <Text style={[
                  styles.requirementText, 
                  /[0-9]/.test(newPassword) && styles.requirementMet
                ]}>
                  En az 1 rakam
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleChangePassword}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Şifreyi Değiştir</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholderView: {
    width: 40,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  eyeButton: {
    padding: 8,
  },
  passwordRequirements: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 10,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 8,
  },
  requirementMet: {
    color: '#4CAF50',
  },
  saveButton: {
    backgroundColor: '#3F51B5',
    borderRadius: 8,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen; 
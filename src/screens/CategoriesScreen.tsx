import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  Dimensions,
  StatusBar
} from 'react-native';
import { getCategories } from '../services/categoryService';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api'; // Import the api module

const { width } = Dimensions.get('window');

const CategoriesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Kategorileri getirme fonksiyonunu güncelleyelim
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Önce API'nin çalışıp çalışmadığını kontrol edelim
      try {
        // Use the baseURL from the api module
        const testResponse = await fetch(`${api.defaults.baseURL}/api/health`);
        console.log('API sağlık kontrolü:', testResponse.status);
      } catch (testError) {
        console.log('API sağlık kontrolü başarısız:', testError);
      }
      
      // Use the imported getCategories function
      const response = await getCategories();
      setCategories(response);
    } catch (err) {
      console.error('Kategori çekme hatası:', err);
      setError('Kategoriler yüklenirken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  // Kategori kartları için renkler
  const gradientColors = [
    ['#FF9966', '#FF5E62'],
    ['#56CCF2', '#2F80ED'],
    ['#4CAF50', '#8BC34A'],
    ['#9C27B0', '#673AB7'],
    ['#F2994A', '#F2C94C'],
    ['#00BCD4', '#3F51B5'],
  ];

  const renderItem = ({ item, index }) => {
    const colorIndex = index % gradientColors.length;
    
    return (
      <TouchableOpacity 
        style={styles.categoryCard}
        onPress={() => {
          // When navigating to CategoryDetailScreen
          navigation.navigate('CategoryDetail', { 
            categoryId: item._id 
          });
          console.log('Navigating to category with ID:', item._id);
        }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={gradientColors[colorIndex] as unknown as readonly [string, string]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardContent}>
            <Text style={styles.categoryName}>{item.name}</Text>
            {item.description && (
              <Text style={styles.categoryDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}
            <View style={styles.cardFooter}>
              <Text style={styles.learnMore}>Kelimeleri Gör</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Kategoriler yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="cloud-offline" size={64} color="#FF5E62" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCategories}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kategoriler</Text>
        <Text style={styles.headerSubtitle}>İngilizce kelime kategorilerini keşfedin</Text>
      </View>
      
      {categories.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="folder-open-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Henüz kategori bulunmamaktadır</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          numColumns={2}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  listContainer: {
    padding: 10,
  },
  categoryCard: {
    width: (width - 40) / 2,
    height: 160,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    flex: 1,
    padding: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  learnMore: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF5E62',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});

export default CategoriesScreen;
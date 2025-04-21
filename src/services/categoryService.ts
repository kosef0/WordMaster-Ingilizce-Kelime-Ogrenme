import api from './api';

export const getCategories = async () => {
  try {
    console.log('Kategorileri getirme isteği gönderiliyor...');
    // Add a timeout to the request
    const response = await api.get('/api/categories', { timeout: 20000 });
    console.log('Kategoriler başarıyla alındı:', response.data);
    return response.data;
  } catch (error) {
    console.error('Kategorileri getirirken hata oluştu:', error);
    // More detailed error logging
    if (error.response) {
      console.error('Sunucu yanıtı:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Yanıt alınamadı, istek:', error.request);
      console.error('Bağlantı URL:', api.defaults.baseURL + '/api/categories');
    }
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    console.log('Kategori detayı getirme isteği gönderiliyor:', id);
    const response = await api.get(`/api/categories/${id}`);
    console.log('Kategori detayı başarıyla alındı:', response.data);
    return response.data;
  } catch (error) {
    console.error('Kategori detayını getirirken hata oluştu:', error);
    throw error;
  }
};

// Yeni kategori ekle
export const addCategory = async (categoryData: any) => {
  try {
    const response = await api.post('/api/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Kategori eklerken hata oluştu:', error);
    throw error;
  }
};

// Kategori güncelle
export const updateCategory = async (id: string, categoryData: any) => {
  try {
    const response = await api.put(`/api/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Kategori güncellerken hata oluştu:', error);
    throw error;
  }
};

// Kategori sil
export const deleteCategory = async (id: string) => {
  try {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Kategori silerken hata oluştu:', error);
    throw error;
  }
};
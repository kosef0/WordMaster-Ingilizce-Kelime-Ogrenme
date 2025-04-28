import api from './api';

// Tüm kategorileri getir
export const getCategories = async () => {
  try {
    const response = await api.get('/api/categories');
    return response.data;
  } catch (error) {
    console.error('Kategorileri getirirken hata oluştu:', error);
    throw error;
  }
};

// ID'ye göre kategori getir
export const getCategoryById = async (id: string) => {
  try {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Kategori detaylarını getirirken hata oluştu:', error);
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
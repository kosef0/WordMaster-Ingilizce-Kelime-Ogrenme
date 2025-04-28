import api from './api';

// Kategori ID'sine göre kelimeleri getir
export const getWordsByCategory = async (categoryId: string) => {
  try {
    const response = await api.get(`/api/words/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Kategori kelimelerini getirirken hata oluştu:', error);
    throw error;
  }
};

// ID'ye göre kelime detaylarını getir
export const getWordById = async (id: string) => {
  try {
    const response = await api.get(`/api/words/${id}`);
    return response.data;
  } catch (error) {
    console.error('Kelime detaylarını getirirken hata oluştu:', error);
    throw error;
  }
};

// Kelime ara
export const searchWords = async (query: string) => {
  try {
    const response = await api.get(`/api/words/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error('Kelime ararken hata oluştu:', error);
    throw error;
  }
};

// Yeni kelime ekle
export const addWord = async (wordData: any) => {
  try {
    const response = await api.post('/api/words', wordData);
    return response.data;
  } catch (error) {
    console.error('Kelime eklerken hata oluştu:', error);
    throw error;
  }
};

// Kelime güncelle
export const updateWord = async (id: string, wordData: any) => {
  try {
    const response = await api.put(`/api/words/${id}`, wordData);
    return response.data;
  } catch (error) {
    console.error('Kelime güncellerken hata oluştu:', error);
    throw error;
  }
};

// Kullanıcının öğrendiği/öğrenmekte olduğu kelimeleri getir
export const getUserWords = async (userId: string, status?: string) => {
  try {
    let url = `/api/words/user/${userId}`;
    if (status) {
      url += `?status=${status}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Kullanıcı kelimelerini getirirken hata oluştu:', error);
    throw error;
  }
};

// Kelime öğrenme durumunu güncelle
export const updateLearningStatus = async (wordId: string, userId: string, status: string) => {
  try {
    const response = await api.post(`/api/words/${wordId}/learning-status`, {
      userId,
      status
    });
    return response.data;
  } catch (error) {
    console.error('Öğrenme durumu güncellenirken hata oluştu:', error);
    throw error;
  }
};

// Rastgele kelimeler getir
export const getRandomWords = async (limit: number = 10) => {
  try {
    const response = await api.get(`/api/words/random?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Rastgele kelimeler getirilirken hata oluştu:', error);
    throw error;
  }
}; 
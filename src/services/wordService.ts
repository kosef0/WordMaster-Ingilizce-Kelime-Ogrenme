import api from './api';

// Make sure the API endpoint is correct
export const getWordsByCategory = async (categoryId) => {
  try {
    console.log('Fetching words for category:', categoryId);
    // Verify this endpoint matches your backend API
    const response = await api.get(`/api/words/category/${categoryId}`);
    console.log('API response for words:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching words:', error.response?.data || error.message);
    throw error;
  }
};

export const getWordById = async (id) => {
  try {
    const response = await api.get(`/api/words/${id}`);
    return response.data;
  } catch (error) {
    console.error('Kelime detayını getirirken hata oluştu:', error);
    throw error;
  }
};
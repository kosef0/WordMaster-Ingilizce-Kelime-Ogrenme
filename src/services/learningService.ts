import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

// AsyncStorage Keys
const LEARNING_PROGRESS_KEY = 'learning_progress';
const CATEGORIES_KEY = 'learning_categories';
const LESSONS_KEY = 'learning_lessons';

// Tip tanımlamaları
export interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  locked: boolean;
  score?: number;
  lastCompleted?: number;
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  color: string;
  progress: number;
  lessons: Lesson[];
}

// Tüm öğrenme kategorilerini getir
export const getLearningCategories = async (): Promise<Category[]> => {
  try {
    // Önce lokal depolamadan kontrol et
    const storedCategories = await AsyncStorage.getItem(CATEGORIES_KEY);
    
    if (storedCategories) {
      return JSON.parse(storedCategories);
    }
    
    // Varsayılan kategorileri döndür
    const defaultCategories: Category[] = [
      {
        id: '1',
        title: 'Yiyecekler',
        icon: 'fast-food',
        color: '#58CC02',
        progress: 0,
        lessons: [
          { id: '1-1', title: 'Temel Yiyecekler', completed: false, locked: false },
          { id: '1-2', title: 'Meyveler', completed: false, locked: true },
          { id: '1-3', title: 'Sebzeler', completed: false, locked: true },
          { id: '1-4', title: 'İçecekler', completed: false, locked: true },
          { id: '1-5', title: 'Tatlılar', completed: false, locked: true },
        ]
      },
      {
        id: '2',
        title: 'Renkler',
        icon: 'color-palette',
        color: '#FF9600',
        progress: 0,
        lessons: [
          { id: '2-1', title: 'Temel Renkler', completed: false, locked: true },
          { id: '2-2', title: 'Karışık Renkler', completed: false, locked: true },
          { id: '2-3', title: 'Renk Tonları', completed: false, locked: true },
          { id: '2-4', title: 'Renkler ve Nesneler', completed: false, locked: true },
          { id: '2-5', title: 'Renklerle İlgili İfadeler', completed: false, locked: true },
        ]
      },
      {
        id: '3',
        title: 'Sayılar',
        icon: 'calculator',
        color: '#1CB0F6',
        progress: 0,
        lessons: [
          { id: '3-1', title: '1-10 Arası Sayılar', completed: false, locked: true },
          { id: '3-2', title: '11-100 Arası Sayılar', completed: false, locked: true },
          { id: '3-3', title: 'Sıra Sayıları', completed: false, locked: true },
          { id: '3-4', title: 'Tarihler', completed: false, locked: true },
          { id: '3-5', title: 'Para Birimleri', completed: false, locked: true },
        ]
      },
      {
        id: '4',
        title: 'Hayvanlar',
        icon: 'paw',
        color: '#FF4B4B',
        progress: 0,
        lessons: [
          { id: '4-1', title: 'Evcil Hayvanlar', completed: false, locked: true },
          { id: '4-2', title: 'Vahşi Hayvanlar', completed: false, locked: true },
          { id: '4-3', title: 'Deniz Canlıları', completed: false, locked: true },
          { id: '4-4', title: 'Kuşlar', completed: false, locked: true },
          { id: '4-5', title: 'Böcekler', completed: false, locked: true },
        ]
      },
    ];
    
    // Varsayılan kategorileri kaydet
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
    
    return defaultCategories;
  } catch (error) {
    console.error('Öğrenme kategorileri getirilirken hata oluştu:', error);
    throw error;
  }
};

// Kategori ilerlemesini güncelle
export const updateCategoryProgress = async (categoryId: string): Promise<Category[]> => {
  try {
    const categories = await getLearningCategories();
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex === -1) {
      throw new Error('Kategori bulunamadı');
    }
    
    // Tamamlanan derslerin yüzdesini hesapla
    const category = categories[categoryIndex];
    const completedLessons = category.lessons.filter(lesson => lesson.completed).length;
    const totalLessons = category.lessons.length;
    const progress = Math.round((completedLessons / totalLessons) * 100);
    
    // Kategori ilerlemesini güncelle
    categories[categoryIndex].progress = progress;
    
    // Sonraki kategorinin kilidini kontrol et ve güncelle
    const nextCategoryIndex = categoryIndex + 1;
    if (nextCategoryIndex < categories.length && progress === 100) {
      // İlk dersin kilidini aç
      if (categories[nextCategoryIndex].lessons.length > 0) {
        categories[nextCategoryIndex].lessons[0].locked = false;
      }
    }
    
    // Değişiklikleri kaydet
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    
    // Sunucuya senkronize et (eğer kullanıcı giriş yapmışsa)
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        await api.post('/api/learning/sync', { categories });
      }
    } catch (syncError) {
      console.error('Kategori ilerlemesi senkronize edilirken hata:', syncError);
      // Senkronizasyon hatası olsa bile devam et
    }
    
    return categories;
  } catch (error) {
    console.error('Kategori ilerlemesi güncellenirken hata oluştu:', error);
    throw error;
  }
};

// Ders tamamlandı olarak işaretle
export const completeLesson = async (
  categoryId: string, 
  lessonId: string, 
  score: number
): Promise<Category[]> => {
  try {
    const categories = await getLearningCategories();
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex === -1) {
      throw new Error('Kategori bulunamadı');
    }
    
    const category = categories[categoryIndex];
    const lessonIndex = category.lessons.findIndex(l => l.id === lessonId);
    
    if (lessonIndex === -1) {
      throw new Error('Ders bulunamadı');
    }
    
    // Dersi tamamlandı olarak işaretle
    categories[categoryIndex].lessons[lessonIndex].completed = true;
    categories[categoryIndex].lessons[lessonIndex].score = score;
    categories[categoryIndex].lessons[lessonIndex].lastCompleted = Date.now();
    
    // Bir sonraki dersin kilidini aç
    const nextLessonIndex = lessonIndex + 1;
    if (nextLessonIndex < category.lessons.length) {
      categories[categoryIndex].lessons[nextLessonIndex].locked = false;
    }
    
    // Kategori ilerlemesini güncelle
    const completedLessons = category.lessons.filter(lesson => lesson.completed).length;
    const totalLessons = category.lessons.length;
    const progress = Math.round((completedLessons / totalLessons) * 100);
    categories[categoryIndex].progress = progress;
    
    // Sonraki kategorinin kilidini kontrol et
    if (progress === 100 && categoryIndex + 1 < categories.length) {
      // Bir sonraki kategorinin ilk dersinin kilidini aç
      categories[categoryIndex + 1].lessons[0].locked = false;
    }
    
    // Değişiklikleri kaydet
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    
    // Kullanıcı istatistiklerini güncelle
    try {
      // Öğrenme istatistiklerini getir
      const learningProgressStr = await AsyncStorage.getItem(LEARNING_PROGRESS_KEY);
      let learningProgress = learningProgressStr 
        ? JSON.parse(learningProgressStr) 
        : { totalLessonsCompleted: 0, totalPoints: 0, streak: 0, lastStudyDate: null };
      
      // İstatistikleri güncelle
      learningProgress.totalLessonsCompleted += 1;
      learningProgress.totalPoints += score;
      
      // Günlük çalışma kontrolü
      const today = new Date().toDateString();
      if (learningProgress.lastStudyDate !== today) {
        learningProgress.lastStudyDate = today;
        learningProgress.streak += 1;
      }
      
      // İstatistikleri kaydet
      await AsyncStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(learningProgress));
      
      // Sunucuya senkronize et (eğer kullanıcı giriş yapmışsa)
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        await api.post('/api/learning/complete-lesson', { 
          categoryId, 
          lessonId, 
          score,
          progress: learningProgress
        });
      }
    } catch (statsError) {
      console.error('İstatistikler güncellenirken hata:', statsError);
      // İstatistik hatası olsa bile devam et
    }
    
    return categories;
  } catch (error) {
    console.error('Ders tamamlanırken hata oluştu:', error);
    throw error;
  }
};

// Öğrenme istatistiklerini getir
export const getLearningProgress = async () => {
  try {
    const progressStr = await AsyncStorage.getItem(LEARNING_PROGRESS_KEY);
    
    if (progressStr) {
      return JSON.parse(progressStr);
    }
    
    // Varsayılan değerler
    const defaultProgress = {
      totalLessonsCompleted: 0,
      totalPoints: 0,
      streak: 0,
      lastStudyDate: null
    };
    
    await AsyncStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(defaultProgress));
    return defaultProgress;
  } catch (error) {
    console.error('Öğrenme istatistikleri getirilirken hata oluştu:', error);
    throw error;
  }
};

// Kullanıcı giriş yaptığında sunucudan ilerleme bilgilerini al
export const syncLearningProgress = async (userId: string) => {
  try {
    // Sunucudan ilerleme bilgilerini al
    const response = await api.get(`/api/learning/progress/${userId}`);
    const serverData = response.data;
    
    if (serverData.categories && serverData.categories.length > 0) {
      // Sunucudan gelen kategori verilerini kaydet
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(serverData.categories));
    }
    
    if (serverData.progress) {
      // Sunucudan gelen ilerleme verilerini kaydet
      await AsyncStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(serverData.progress));
    }
    
    return {
      categories: serverData.categories,
      progress: serverData.progress
    };
  } catch (error) {
    console.error('İlerleme bilgileri senkronize edilirken hata oluştu:', error);
    // Sunucu hatası durumunda lokal verileri kullan
    const categories = await getLearningCategories();
    const progress = await getLearningProgress();
    
    return { categories, progress };
  }
}; 
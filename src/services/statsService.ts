import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Kullanıcının öğrenme istatistiklerini getir
export const getUserStats = async (userId: string) => {
  try {
    const response = await api.get(`/api/stats/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Kullanıcı istatistikleri getirilirken hata oluştu:', error);
    throw error;
  }
};

// Öğrenilen kelime sayısını getir (Lokal depolama)
export const getLearningStats = async () => {
  try {
    const learningStats = await AsyncStorage.getItem('learningStats');
    if (learningStats) {
      return JSON.parse(learningStats);
    }
    
    // Varsayılan değerler
    const defaultStats = {
      newWords: 0,
      learning: 0,
      mastered: 0,
      lastStudyDate: null,
      streak: 0,
      totalPoints: 0,
    };
    
    await AsyncStorage.setItem('learningStats', JSON.stringify(defaultStats));
    return defaultStats;
  } catch (error) {
    console.error('Öğrenme istatistikleri getirilirken hata oluştu:', error);
    throw error;
  }
};

// Öğrenme durumunu güncelle ve istatistikleri güncelle
export const updateLearningStats = async (
  wordId: string, 
  prevStatus: string | null, 
  newStatus: string
) => {
  try {
    // Mevcut istatistikleri getir
    const stats = await getLearningStats();
    
    // Eski durum değerini azalt (eğer varsa)
    if (prevStatus && prevStatus !== newStatus) {
      if (prevStatus === 'new') {
        stats.newWords = Math.max(0, stats.newWords - 1);
      } else if (prevStatus === 'learning') {
        stats.learning = Math.max(0, stats.learning - 1);
      } else if (prevStatus === 'mastered') {
        stats.mastered = Math.max(0, stats.mastered - 1);
      }
    }
    
    // Yeni durum değerini artır
    if (newStatus === 'new') {
      stats.newWords += 1;
    } else if (newStatus === 'learning') {
      stats.learning += 1;
      stats.totalPoints += 5; // Öğrenme durumuna geçince 5 puan
    } else if (newStatus === 'mastered') {
      stats.mastered += 1;
      stats.totalPoints += 10; // Öğrenildi durumuna geçince 10 puan
    }
    
    // Günlük çalışma kontrolü
    const today = new Date().toDateString();
    if (stats.lastStudyDate !== today) {
      stats.lastStudyDate = today;
      stats.streak += 1;
    }
    
    // Değişiklikleri kaydet
    await AsyncStorage.setItem('learningStats', JSON.stringify(stats));
    
    return stats;
  } catch (error) {
    console.error('Öğrenme istatistikleri güncellenirken hata oluştu:', error);
    throw error;
  }
};

// Kelime öğrenme durumlarını getir (Lokal depolama)
export const getWordStatuses = async () => {
  try {
    const wordStatuses = await AsyncStorage.getItem('wordStatuses');
    if (wordStatuses) {
      return JSON.parse(wordStatuses);
    }
    return {}; // Boş obje döndür
  } catch (error) {
    console.error('Kelime durumları getirilirken hata oluştu:', error);
    throw error;
  }
};

// Kelime durumu türleri
export type WordStatus = 'new' | 'learning' | 'mastered';

// Stats için anahtar değerler
const STATS_STORAGE_KEY = 'word_stats';
const WORD_HISTORY_KEY = 'word_history';

// Kelime istatistikleri için tip tanımı
interface WordStats {
  [wordId: string]: {
    status: WordStatus;
    viewCount: number;
    lastViewed: number;
    correctCount: number;
    incorrectCount: number;
  };
}

// Kelime durumunu al
export const getWordStatus = async (wordId: string): Promise<WordStatus> => {
  try {
    const statsData = await AsyncStorage.getItem(STATS_STORAGE_KEY);
    
    if (statsData) {
      const stats: WordStats = JSON.parse(statsData);
      
      if (stats[wordId]) {
        return stats[wordId].status;
      }
    }
    
    return 'new'; // Veri yoksa 'new' döndür
  } catch (error) {
    console.error('Kelime durumu alınırken hata:', error);
    return 'new';
  }
};

// Kelime durumunu güncelle
export const updateWordStatus = async (
  wordId: string, 
  status: WordStatus
): Promise<void> => {
  try {
    const statsData = await AsyncStorage.getItem(STATS_STORAGE_KEY);
    let stats: WordStats = {};
    
    if (statsData) {
      stats = JSON.parse(statsData);
    }
    
    // Eğer kelime daha önce kaydedilmişse güncelle, yoksa yeni kayıt oluştur
    if (stats[wordId]) {
      stats[wordId] = {
        ...stats[wordId],
        status,
        lastViewed: Date.now(),
      };
    } else {
      stats[wordId] = {
        status,
        viewCount: 1,
        lastViewed: Date.now(),
        correctCount: 0,
        incorrectCount: 0,
      };
    }
    
    await AsyncStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Kelime durumu güncellenirken hata:', error);
  }
};

// Kelime çalışma kaydı
export const recordWordView = async (wordId: string): Promise<void> => {
  try {
    const statsData = await AsyncStorage.getItem(STATS_STORAGE_KEY);
    let stats: WordStats = {};
    
    if (statsData) {
      stats = JSON.parse(statsData);
    }
    
    if (stats[wordId]) {
      stats[wordId].viewCount += 1;
      stats[wordId].lastViewed = Date.now();
    } else {
      stats[wordId] = {
        status: 'new',
        viewCount: 1,
        lastViewed: Date.now(),
        correctCount: 0,
        incorrectCount: 0,
      };
    }
    
    await AsyncStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    
    // Kelime geçmişine de ekle
    await addToWordHistory(wordId);
  } catch (error) {
    console.error('Kelime görüntüleme kaydedilirken hata:', error);
  }
};

// Kelime cevap kaydı
export const recordWordAnswer = async (
  wordId: string, 
  isCorrect: boolean
): Promise<void> => {
  try {
    const statsData = await AsyncStorage.getItem(STATS_STORAGE_KEY);
    let stats: WordStats = {};
    
    if (statsData) {
      stats = JSON.parse(statsData);
    }
    
    if (stats[wordId]) {
      if (isCorrect) {
        stats[wordId].correctCount += 1;
      } else {
        stats[wordId].incorrectCount += 1;
      }
      
      // Durumu güncelle
      if (stats[wordId].correctCount >= 5) {
        stats[wordId].status = 'mastered';
      } else if (stats[wordId].correctCount >= 1) {
        stats[wordId].status = 'learning';
      }
      
    } else {
      stats[wordId] = {
        status: isCorrect ? 'learning' : 'new',
        viewCount: 1,
        lastViewed: Date.now(),
        correctCount: isCorrect ? 1 : 0,
        incorrectCount: isCorrect ? 0 : 1,
      };
    }
    
    await AsyncStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Kelime cevabı kaydedilirken hata:', error);
  }
};

// Kelime geçmişine ekle
const addToWordHistory = async (wordId: string): Promise<void> => {
  try {
    const historyData = await AsyncStorage.getItem(WORD_HISTORY_KEY);
    let history: { wordId: string, timestamp: number }[] = [];
    
    if (historyData) {
      history = JSON.parse(historyData);
    }
    
    // Yeni geçmiş kaydı ekle (son 100 kayıt tutulacak)
    history.push({
      wordId,
      timestamp: Date.now(),
    });
    
    // Son 100 kaydı tut
    if (history.length > 100) {
      history = history.slice(-100);
    }
    
    await AsyncStorage.setItem(WORD_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Kelime geçmişi güncellenirken hata:', error);
  }
};

// İstatistik özeti al
export const getStatsOverview = async (): Promise<{
  totalWords: number;
  newWords: number;
  learningWords: number;
  masteredWords: number;
}> => {
  try {
    const statsData = await AsyncStorage.getItem(STATS_STORAGE_KEY);
    
    if (!statsData) {
      return {
        totalWords: 0,
        newWords: 0, 
        learningWords: 0,
        masteredWords: 0
      };
    }
    
    const stats: WordStats = JSON.parse(statsData);
    const wordIds = Object.keys(stats);
    
    const newWords = wordIds.filter(id => stats[id].status === 'new').length;
    const learningWords = wordIds.filter(id => stats[id].status === 'learning').length;
    const masteredWords = wordIds.filter(id => stats[id].status === 'mastered').length;
    
    return {
      totalWords: wordIds.length,
      newWords,
      learningWords,
      masteredWords
    };
  } catch (error) {
    console.error('İstatistik özeti alınırken hata:', error);
    return {
      totalWords: 0,
      newWords: 0,
      learningWords: 0,
      masteredWords: 0
    };
  }
}; 
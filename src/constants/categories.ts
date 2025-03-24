export interface Category {
  id: string;
  name: string;
  icon: string; // Emoji simgesi
  color: string; // Kategori rengi
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'; // Seviye kategorileri için
}

export const CATEGORIES: Category[] = [
  // Tema Kategorileri
  {
    id: 'colors',
    name: 'Renkler',
    icon: '🎨',
    color: '#F44336'
  },
  {
    id: 'weather',
    name: 'Hava Durumu',
    icon: '☁️',
    color: '#2196F3'
  },
  {
    id: 'time',
    name: 'Günler, Aylar, Mevsimler',
    icon: '📅',
    color: '#9C27B0'
  },
  {
    id: 'family',
    name: 'Aile Üyeleri',
    icon: '👨‍👩‍👧‍👦',
    color: '#E91E63'
  },
  {
    id: 'fruits',
    name: 'Meyveler',
    icon: '🍎',
    color: '#F44336'
  },
  {
    id: 'vegetables',
    name: 'Sebzeler',
    icon: '🥦',
    color: '#4CAF50'
  },
  {
    id: 'pets',
    name: 'Evcil Hayvan İsimleri',
    icon: '🐶',
    color: '#795548'
  },
  {
    id: 'wild_animals',
    name: 'Vahşi Hayvan İsimleri',
    icon: '🦁',
    color: '#FF9800'
  },
  {
    id: 'house',
    name: 'Evin Bölümleri ve Ev Çeşitleri',
    icon: '🏠',
    color: '#607D8B'
  },
  {
    id: 'occupations',
    name: 'Meslekler',
    icon: '👩‍⚕️',
    color: '#3F51B5'
  },
  {
    id: 'body',
    name: 'Vücudun Bölümleri',
    icon: '🫀',
    color: '#E91E63'
  },
  {
    id: 'hobbies',
    name: 'Hobiler',
    icon: '🎸',
    color: '#009688'
  },
  {
    id: 'emotions',
    name: 'Duygu ve Hisler',
    icon: '😊',
    color: '#FFEB3B'
  },
  {
    id: 'countries',
    name: 'Ülkeler, Milletler ve Diller',
    icon: '🌎',
    color: '#2196F3'
  },
  {
    id: 'travel',
    name: 'Seyahat Kelimeleri',
    icon: '✈️',
    color: '#673AB7'
  },
  {
    id: 'school',
    name: 'Okul Araç Gereç Kelimeleri',
    icon: '📚',
    color: '#FF5722'
  },
  
  // Seviye Kategorileri
  {
    id: 'a1',
    name: 'A1 Seviye Kelimeler',
    icon: '🔤',
    color: '#4CAF50',
    level: 'A1'
  },
  {
    id: 'a2',
    name: 'A2 Seviye Kelimeler',
    icon: '🔤',
    color: '#8BC34A',
    level: 'A2'
  },
  {
    id: 'b1',
    name: 'B1 Seviye Kelimeler',
    icon: '🔤',
    color: '#FFEB3B',
    level: 'B1'
  },
  {
    id: 'b2',
    name: 'B2 Seviye Kelimeler',
    icon: '🔤',
    color: '#FFC107',
    level: 'B2'
  },
  {
    id: 'c1',
    name: 'C1 Seviye Kelimeler',
    icon: '🔤',
    color: '#FF9800',
    level: 'C1'
  },
  {
    id: 'c2',
    name: 'C2 Seviye Kelimeler',
    icon: '🔤',
    color: '#FF5722',
    level: 'C2'
  }
]; 
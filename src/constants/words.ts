export interface Word {
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
  examples: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  isLearned: boolean;
  lastReviewed?: Date;
}

export const SAMPLE_WORDS: Word[] = [
  {
    id: '1',
    word: 'apple',
    translation: 'elma',
    pronunciation: '/ˈæp.əl/',
    examples: [
      'I eat an apple every day.',
      'She gave him a red apple.',
      'The apple tree is in our garden.'
    ],
    difficulty: 'easy',
    category: 'food',
    isLearned: false
  },
  {
    id: '2',
    word: 'book',
    translation: 'kitap',
    pronunciation: '/bʊk/',
    examples: [
      'I read a book last night.',
      'He wrote a book about his travels.',
      'The book is on the shelf.'
    ],
    difficulty: 'easy',
    category: 'education',
    isLearned: false
  },
  {
    id: '3',
    word: 'democracy',
    translation: 'demokrasi',
    pronunciation: '/dɪˈmɒk.rə.si/',
    examples: [
      'Democracy is a system of government.',
      'They fought for democracy in their country.',
      'The principles of democracy include freedom and equality.'
    ],
    difficulty: 'medium',
    category: 'politics',
    isLearned: false
  },
  {
    id: '4',
    word: 'resilience',
    translation: 'dayanıklılık',
    pronunciation: '/rɪˈzɪl.i.əns/',
    examples: [
      'Resilience is the ability to recover quickly from difficulties.',
      'She showed great resilience in the face of adversity.',
      'Mental resilience is important for overall wellbeing.'
    ],
    difficulty: 'hard',
    category: 'psychology',
    isLearned: false
  },
  {
    id: '5',
    word: 'ambiguous',
    translation: 'belirsiz',
    pronunciation: '/æmˈbɪɡ.ju.əs/',
    examples: [
      'His answer was ambiguous and confusing.',
      'The law is ambiguous on this matter.',
      'She gave an ambiguous smile.'
    ],
    difficulty: 'hard',
    category: 'language',
    isLearned: false
  },
  {
    id: '6',
    word: 'dog',
    translation: 'köpek',
    pronunciation: '/dɒɡ/',
    examples: [
      'They have a dog as a pet.',
      'The dog barked at the stranger.',
      'She took her dog for a walk.'
    ],
    difficulty: 'easy',
    category: 'animals',
    isLearned: false
  },
  {
    id: '7',
    word: 'happiness',
    translation: 'mutluluk',
    pronunciation: '/ˈhæp.i.nəs/',
    examples: [
      'Everyone searches for happiness in life.',
      'Money cannot buy happiness.',
      'Her face was filled with happiness when she saw them.'
    ],
    difficulty: 'medium',
    category: 'emotions',
    isLearned: false
  },
  {
    id: '8',
    word: 'programming',
    translation: 'programlama',
    pronunciation: '/ˈprəʊ.ɡræm.ɪŋ/',
    examples: [
      'He studied programming at university.',
      'Programming requires logical thinking.',
      'She enjoys programming in her free time.'
    ],
    difficulty: 'medium',
    category: 'technology',
    isLearned: false
  }
]; 
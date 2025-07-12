export interface Category {
  id: string;
  name: string;
  icon: string;
  query: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'general',
    name: 'General',
    icon: '📰',
    query: 'general',
    description: 'Latest breaking news and top stories'
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    query: 'technology OR AI OR artificial intelligence OR software OR programming',
    description: 'Tech news, AI, software, and innovation'
  },
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    query: 'business OR economy OR finance OR stocks OR market',
    description: 'Business news, economy, and financial markets'
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: '⚽',
    query: 'sports OR football OR basketball OR soccer OR tennis',
    description: 'Sports news, scores, and athletic events'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    query: 'entertainment OR movies OR music OR celebrity OR film',
    description: 'Movies, music, celebrities, and entertainment'
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    query: 'science OR research OR discovery OR space OR NASA',
    description: 'Scientific discoveries and research news'
  },
  {
    id: 'health',
    name: 'Health',
    icon: '🏥',
    query: 'health OR medical OR medicine OR healthcare OR COVID',
    description: 'Health news, medical research, and wellness'
  }
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getDefaultCategory = (): Category => {
  return categories[0]; // General
}; 
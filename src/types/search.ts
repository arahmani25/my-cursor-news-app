export interface SearchFilters {
  dateFrom?: string;
  dateTo?: string;
  sources?: string[];
  sortBy?: 'relevance' | 'publishedAt' | 'popularity';
  language?: string;
  pageSize?: number;
}

export interface Source {
  id: string;
  name: string;
  description?: string;
  url?: string;
  category?: string;
}

export interface SortOption {
  value: 'relevance' | 'publishedAt' | 'popularity';
  label: string;
  description: string;
}

export const sortOptions: SortOption[] = [
  {
    value: 'relevance',
    label: 'Relevance',
    description: 'Most relevant to your search'
  },
  {
    value: 'publishedAt',
    label: 'Date',
    description: 'Newest articles first'
  },
  {
    value: 'popularity',
    label: 'Popularity',
    description: 'Most popular articles'
  }
];

export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' }
];

export const pageSizeOptions = [
  { value: 10, label: '10 articles' },
  { value: 20, label: '20 articles' },
  { value: 30, label: '30 articles' },
  { value: 50, label: '50 articles' }
]; 
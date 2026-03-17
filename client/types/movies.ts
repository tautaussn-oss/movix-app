export interface Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
  rating: number;
  director: string;
  duration: number;
  poster: string;
  description: string;
  featured: boolean;
}
export type SearchBarProp = {
  onSearch: (value: string) => void;
};
export type SortSelectProp = {
  onSort: (value: SortingType) => void;
};
export type SortingType = '' | 'A-Z' | 'high-low' | 'newest-first';

export type SelectGenreProp = {
  onSelect: (value: string) => void;
};

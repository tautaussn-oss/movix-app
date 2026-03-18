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

export type SelectBarProp = {
  onSelect: (value: string) => void;
};
export type SelectType = 'sort' | 'genre' | 'year';

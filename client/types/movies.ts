export interface Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
  rating: number | null;
  director: string;
  duration: number;
  poster: string;
  description: string;
  featured: boolean;
}
export type SearchBarProp = {
  searchText: string;
  onSearch: (value: string) => void;
  onChange: (value: string) => void;
};

export type SelectBarProp = {
  placeholder: string;
  selected?: string;
  options: string[];
  onSelect: (value: string) => void;
};

export type SwitchProp = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};
export interface Genre {
  id: number;
  genre: string;
}
export type DataMap = {
  movies: Movie[];
  genres: Genre[];
};
export type StatusMessageProp = {
  type: 'empty' | 'error';
  message: string;
};
export type FilterMoviesParams = {
  search?: string;
  genres?: string[];
  featured?: boolean;
  sortBy?: string;
};
export type GenreMultiSelectProp = {
  genres: Genre[]|null;
  selected?: string[];
  onSelect: (value: string[]) => void;
};
export interface Director {
  id: number;
  full_name: string;
}
export type CreatePageProps = {
  genres: Genre[] | null;
  directors: Director[] | null;
};
export type MovieFormProps = {
  movie?: Movie | undefined;
  genres: Genre[] | null;
};

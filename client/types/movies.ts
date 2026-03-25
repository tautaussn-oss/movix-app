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
  onSearch: (value: string) => void;
};

export type SelectBarProp = {
  onSelect: (value: string) => void;
};

export type SwitchProp = {
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
export type StatusMessageProp={
  type:'empty'|'error'
  message:string
}

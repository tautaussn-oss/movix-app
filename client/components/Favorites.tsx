'use client';

import { Movie } from '@/types/movies';
import { useEffect, useState } from 'react';
import { MovieGrid } from './MovieGrid';
import { StatusMessage } from './StatusMessage';

export function Favorites({ movies }: { movies: Movie[] }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    const arr: number[] = stored ? JSON.parse(stored) : [];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorites(arr);
  }, []);

  const favoriteMovies = movies.filter((m) => favorites.includes(m.id));
  if (favoriteMovies.length === 0) return <StatusMessage message="No favorite Movies!" />;
  return <MovieGrid moviesList={favoriteMovies} />;
}

'use client';

import { Movie } from '@/types/movies';
import { useEffect, useState } from 'react';
import { MovieGrid } from './MovieGrid';
import { StatusMessage } from './StatusMessage';
import { getFavorites } from '@/lib/localStorage';

export function Favorites({ movies }: { movies: Movie[] }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const favoriteMovies = movies.filter((m) => favorites.includes(m.id));
  if (favoriteMovies.length === 0)
    return <StatusMessage type="empty" message="No favorite Movies!" />;
  return <MovieGrid moviesList={favoriteMovies} />;
}

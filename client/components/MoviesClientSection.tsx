'use client';
import { Movie, Genre } from '@/types/movies';

import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { SelectBar } from '@/components/SelectBar';
import { Switch } from '@/components/Switch';
import { MovieGrid } from './MovieGrid';
import { StatusMessage } from './StatusMessage';
import { getFilteredMovies } from '@/lib/movies';

const SORTING_OPTIONS = ['title', 'year', 'rating'];

export function MoviesClientSection({
  moviesList,
  genresList,
}: { moviesList: Movie[] } & { genresList: Genre[] | null }) {
  const [movies, setMovies] = useState<Movie[] | null>(moviesList);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [featured, setFeatured] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState('');
  const [error, setError] = useState('');
  const genres = genresList !== null ? genresList.map((g) => g.genre) : [];
  useEffect(() => {
    async function fetchFilteredData() {
      setError('');
      try {
        const filteredMovies = await getFilteredMovies({
          search: searchQuery,
          genres: selectedGenre ? [selectedGenre] : [],
          featured,
          sortBy,
        });
        setMovies(filteredMovies);
      } catch (e) {
        if (e instanceof Error) setError(e.message);
        else setError('Something went wrong while filtering!');
      }
    }
    fetchFilteredData();
  }, [searchQuery, selectedGenre, featured, sortBy]);

  const handleSort = (sortingType: string) => {
    setSortBy(sortingType);
  };

  const handleSearch = (title: string) => {
    setSearchQuery(title);
  };
  const handleGenreFilter = (genre: string) => {
    setSelectedGenre(genre);
  };
  const handleFeatured = (checked: boolean) => {
    setFeatured(checked);
  };

  if (error) return <StatusMessage type="error" message={error} />;
  if (movies === null || movies.length === 0)
    return <StatusMessage type="empty" message="No movies found!" />;
  
  return (
    <div className="flex flex-col items-center gap-3 p-5">
      <SearchBar onSearch={handleSearch} />
      <SelectBar placeholder="Filter by Genre:" options={genres} onSelect={handleGenreFilter} />
      <SelectBar placeholder="Sort by:" options={SORTING_OPTIONS} onSelect={handleSort} />

      <div className="flex flex-col w-full md:flex-row justify-center gap-5">
        <button className="text-white border border-white rounded-full w-full md:w-1/3 lg:w-1/4">
          Add Movie <span className="font-bold text-lg">+</span>
        </button>
        <Switch checked={featured} onChange={handleFeatured} />
      </div>
      <MovieGrid moviesList={movies} />
    </div>
  );
}

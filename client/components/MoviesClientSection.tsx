'use client';
import { Movie, Genre } from '@/types/movies';

import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { SelectBar } from '@/components/SelectBar';
import { Switch } from '@/components/Switch';
import { MovieGrid } from './MovieGrid';
import { StatusMessage } from './StatusMessage';
import { getFilteredMovies } from '@/lib/movies';
import { GenreMultiSelect } from './GenreMultiSelect';
import Link from 'next/link';

const SORTING_OPTIONS = ['title', 'year', 'rating'];

export function MoviesClientSection({
  moviesList,
  genresList,
}: { moviesList: Movie[] } & { genresList: Genre[] | null }) {
  const [movies, setMovies] = useState<Movie[] | null>(moviesList);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
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
          genres: selectedGenres ? selectedGenres : [],
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
  }, [searchQuery, selectedGenres, featured, sortBy]);

  const handleSort = (sortingType: string) => {
    setSortBy(sortingType);
  };

  const handleSearch = (title: string) => {
    setSearchQuery(title);
  };
  const handleGenreFilter = (genres: string[]) => {
    setSelectedGenres(genres);
  };
  const handleFeatured = (checked: boolean) => {
    setFeatured(checked);
  };

  if (error) return <StatusMessage type="error" message={error} />;

  return (
    <div className="flex flex-col items-center gap-3 p-5">
      <SearchBar onSearch={handleSearch} />
      <GenreMultiSelect genres={genres} onSelect={handleGenreFilter} />
      <SelectBar placeholder="Sort by:" options={SORTING_OPTIONS} onSelect={handleSort} />

      <div className="flex flex-col w-full md:flex-row justify-center gap-5">
        <Link href={'/movies/create'} className="text-white text-center border border-white rounded-full w-full md:w-1/3 lg:w-1/4">
          Add Movie <span className="font-bold text-lg">+</span>
        </Link>
        <Switch label='Show Featured Movies Only' checked={featured} onChange={handleFeatured} />
      </div>
      {movies === null || movies.length === 0 ? (
        <StatusMessage type="empty" message="No movies found!" />
      ) : (
        <MovieGrid moviesList={movies} />
      )}
    </div>
  );
}

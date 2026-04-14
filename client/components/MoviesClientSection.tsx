'use client';
import { Movie, MovieClientSectionProp } from '@/types/movies';

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
  initialGenre,
}: MovieClientSectionProp) {
  const [movies, setMovies] = useState<Movie[] | null>(moviesList);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initialGenre ? [initialGenre] : [],
  );
  const [featured, setFeatured] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState('');
  const [error, setError] = useState('');
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
  const handleTextChange = (text: string) => {
    setSearchText(text);
  };
  const handleClear = () => {
    setSearchQuery('');
    setSortBy('');
    setSelectedGenres([]);
    setFeatured(false);
    setSearchText('');
  };

  if (error) return <StatusMessage type="error" message={error} />;

  return (
    <div className="flex flex-col items-center gap-3 p-5">
      <SearchBar searchText={searchText} onSearch={handleSearch} onChange={handleTextChange} />
      <div className="flex flex-col gap-3  w-full md:w-1/2 lg:w-1/3">
        <p className="text-white font-bold">Genre</p>
        <GenreMultiSelect
          genres={genresList}
          selected={selectedGenres}
          onSelect={handleGenreFilter}
        />
        <p className="text-white font-bold">Sort by</p>
        <SelectBar
          placeholder="All"
          selected={sortBy}
          options={SORTING_OPTIONS}
          onSelect={handleSort}
        />
        <div className="flex flex-col w-full md:flex-row justify-center gap-3">
          <button
            className="text-black text-center bg-[#c08600] rounded-lg md:w-1/2 px-3 py-1"
            onClick={handleClear}
          >
            Clear Filters
          </button>
          <Link
            href={'/movies/create'}
            className="text-black text-center bg-[#c08600] rounded-lg md:w-1/2  px-3 py-1"
          >
            Add Movie <span className="font-bold text-lg">+</span>
          </Link>
        </div>
        <Switch
          id="mcswitch"
          label="Show Featured Movies Only"
          checked={featured}
          onChange={handleFeatured}
        />
      </div>
      {movies === null || movies.length === 0 ? (
        <StatusMessage type="empty" message="No movies found!" />
      ) : (
        <MovieGrid moviesList={movies} />
      )}
    </div>
  );
}

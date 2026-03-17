'use client';
import { GenreSelect } from '@/components/GenreSelect';
import { MovieGrid } from '@/components/MovieGrid';
import { SearchBar } from '@/components/SearchBar';
import { SortSelect } from '@/components/SortSelect';
import movies from '@/data/movies.json';
import { SortingType } from '@/types/movies';
import { useState } from 'react';

export default function MoviesPage() {
  const moviesList = movies;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortingType>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const genres = [...new Set(movies.flatMap((movie) => movie.genres))];
  // useEffect(() => {
  //     const fetchMovies = async () => {
  //         try {
  //         const response = await fetch("https://movix-app-az3n.onrender.com/api/movies");

  //         if (!response.ok) {
  //             throw new Error("Failed to fetch movies");
  //         }

  //         const data = await response.json();
  //         setMoviesList(data.movies);
  //         } catch (error) {
  //         console.error("Error fetching movies:", error);
  //         }
  //     };
  //     fetchMovies();
  //     }, []);

  const handleSearch = (title: string) => {
    setSearchQuery(title);
  };
  const handleSort = (sortingType: SortingType) => {
    setSortOption(sortingType);
  };
  const handleGenreFilter = (genre: string) => {
    setSelectedGenre(genre);
  };
  const filteredMovies =
    searchQuery === ''
      ? moviesList
      : moviesList.filter((movie) =>
          movie.title.toLowerCase().trim().includes(searchQuery.toLowerCase().trim()),
        );
  const sortedMovies =
    sortOption === ''
      ? filteredMovies
      : sortOption === 'A-Z'
        ? [...filteredMovies].sort((a, b) => a.title.localeCompare(b.title))
        : sortOption === 'high-low'
          ? [...filteredMovies].sort((a, b) => b.rating - a.rating)
          : [...filteredMovies].sort((a, b) => b.year - a.year);
  const filteredByGenre =
    selectedGenre !== ''
      ? sortedMovies.filter((movie) => movie.genres.includes(selectedGenre))
      : sortedMovies;
  return (
    <div className="flex flex-col items-center gap-5">
      <SearchBar onSearch={handleSearch} />
      <div className="flex flex-col items-center md:flex-row justify-evenly gap-3 w-full">
        <SortSelect onSort={handleSort} />
        <GenreSelect onSelect={handleGenreFilter} genres={genres} />
      </div>
      <MovieGrid movies={filteredByGenre} />
    </div>
  );
}

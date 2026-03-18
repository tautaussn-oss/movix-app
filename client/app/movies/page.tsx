'use client';
import { MovieGrid } from '@/components/MovieGrid';
import { SearchBar } from '@/components/SearchBar';
import { SelectBar } from '@/components/SelectBar';
import movies from '@/data/movies.json';
import { useState } from 'react';

const sortOptions = ['A-Z', 'Rating (high-low)', 'Year (Newest)'];
const yearOptions = ['before 90s', '90s', '00s', '10s', '20s'];

export default function MoviesPage() {
  const moviesList = movies;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
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
  const handleSort = (sortingType: string) => {
    setSortOption(sortingType);
  };
  const handleGenreFilter = (genre: string) => {
    setSelectedGenre(genre);
  };
  const handleYearFilter = (year: string) => {
    setSelectedYear(year);
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
        : sortOption === 'Rating (high-low)'
          ? [...filteredMovies].sort((a, b) => b.rating - a.rating)
          : [...filteredMovies].sort((a, b) => b.year - a.year);
  const filteredByGenre =
    selectedGenre !== ''
      ? sortedMovies.filter((movie) => movie.genres.includes(selectedGenre))
      : sortedMovies;

  const filteredByYear =
    selectedYear === ''
      ? filteredByGenre
      : selectedYear === 'before 90s'
        ? filteredByGenre.filter((movie) => movie.year < 1990)
        : selectedYear === '90s'
          ? filteredByGenre.filter((movie) => movie.year >= 1990 && movie.year < 2000)
          : selectedYear === '00s'
            ? filteredByGenre.filter((movie) => movie.year >= 2000 && movie.year < 2010)
            : selectedYear === '10s'
              ? filteredByGenre.filter((movie) => movie.year >= 2010 && movie.year < 2020)
              : filteredByGenre.filter((movie) => movie.year >= 2020);
  return (
    <div className="flex flex-col items-center gap-5">
      <SearchBar onSearch={handleSearch} />
      <div className="flex flex-col items-center md:flex-row justify-evenly gap-3 w-full">
        <SelectBar type={'sort'} options={sortOptions} onSelect={handleSort} />
        <SelectBar type={'genre'} onSelect={handleGenreFilter} options={genres} />
        <SelectBar type="year" onSelect={handleYearFilter} options={yearOptions} />
      </div>
      <MovieGrid movies={filteredByYear} />
    </div>
  );
}

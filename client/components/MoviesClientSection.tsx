'use client';
import { Movie, Genre } from '@/types/movies';

import { useState, useEffect } from 'react';
import { getMoviesByGenreId } from '@/lib/movies';
import { SearchBar } from '@/components/SearchBar';
import { SelectBar } from '@/components/SelectBar';
import { Switch } from '@/components/Switch';
import { MovieGrid } from './MovieGrid';
import { StatusMessage } from './StatusMessage';


export function MoviesClientSection({ moviesList, genresList }: { moviesList: Movie[] } & {genresList: Genre[] | null}) {
  const [movies, setMovies]=useState<Movie[]| null>(moviesList);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenreId, setSelectedGenreId] = useState<string>('');
  const [featured, setFeatured] = useState<boolean>(false);

  useEffect(()=>{
    async function filteredMoviesByGenre(id:string) {
      if(selectedGenreId!==""){
        const filteredMovies= await getMoviesByGenreId(id);
      setMovies(filteredMovies);
      }
      else setMovies(moviesList);
    }
    filteredMoviesByGenre(selectedGenreId);
  },[selectedGenreId, moviesList]);

  const handleSearch = (title: string) => {
    setSearchQuery(title);
  };
  const handleGenreFilter = (genre: string) => {
    setSelectedGenreId(genre);
  };
  const handleFeatured = (checked: boolean) => {
    setFeatured(checked);
  };
  const searchResults=searchQuery!=='' && movies!==null?movies.filter(movie=>movie.title.toLowerCase().trim().includes(searchQuery.toLowerCase().trim())):movies;
  const featuredMovies=featured && searchResults!==null?searchResults.filter(movie=>movie.featured):searchResults;
  if (movies === null) return <StatusMessage message='No movies found with this filter'/>;

  return (
    <div className="flex flex-col items-center gap-3">
      <SearchBar onSearch={handleSearch} />
      <SelectBar onSelect={handleGenreFilter} genres={genresList} />
      
      <div className="flex flex-col w-1/2 md:flex-row md:w-full lg:w-2/3 justify-center gap-5">
        <button className="text-white border border-white rounded-full w-full md:w-1/2">
          Add Movie <span className="font-bold text-lg">+</span>
        </button>
        <Switch checked={featured} onChange={handleFeatured} />
      </div>{featuredMovies!==null && featuredMovies.length!==0?<MovieGrid moviesList={featuredMovies} />:<StatusMessage message='No featured movies!'/>}
    </div>
  );
}

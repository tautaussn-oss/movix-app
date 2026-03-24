import { MovieCard } from './MovieCard';
import { Movie } from '@/types/movies';

export function MovieGrid({ moviesList }: { moviesList: Movie[] }) {
  
  // const filteredMovies =
  //   searchQuery === ''
  //     ? moviesList
  //     : moviesList.filter((movie) =>
  //         movie.title.toLowerCase().trim().includes(searchQuery.toLowerCase().trim()),
  //       );
  // const sortedMovies =
  //   sortOption === ''
  //     ? filteredMovies
  //     : sortOption === 'A-Z'
  //       ? [...filteredMovies].sort((a, b) => a.title.localeCompare(b.title))
  //       : sortOption === 'Rating (high-low)'
  //         ? [...filteredMovies].sort((a, b) => b.rating - a.rating)
  //         : [...filteredMovies].sort((a, b) => b.year - a.year);
  // const filteredByGenre =
  //   selectedGenre !== ''
  //     ? sortedMovies.filter((movie) => movie.genres.includes(selectedGenre))
  //     : sortedMovies;

  // const filteredByYear =
  //   selectedYear === ''
  //     ? filteredByGenre
  //     : selectedYear === 'before 90s'
  //       ? filteredByGenre.filter((movie) => movie.year < 1990)
  //       : selectedYear === '90s'
  //         ? filteredByGenre.filter((movie) => movie.year >= 1990 && movie.year < 2000)
  //         : selectedYear === '00s'
  //           ? filteredByGenre.filter((movie) => movie.year >= 2000 && movie.year < 2010)
  //           : selectedYear === '10s'
  //             ? filteredByGenre.filter((movie) => movie.year >= 2010 && movie.year < 2020)
  //             : filteredByGenre.filter((movie) => movie.year >= 2020);
  // const featuredMovies = featured
  //   ? filteredByYear.filter((movie) => movie.featured)
  //   : filteredByYear;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center gap-3">
      {moviesList.map((movie) => {
        return <MovieCard key={movie.id} movie={movie} />;
      })}
    </div>
  );
}

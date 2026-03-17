import { Movie } from '@/types/movies';
import { MovieCard } from './MovieCard';

export function MovieGrid({ movies }: { movies: Movie[] }) {
  return (
    <div>
      {movies.length === 0 && <p>No movies found with this title!</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6">
        {movies.map((movie) => {
          return <MovieCard key={movie.id} movie={movie} />;
        })}
      </div>
    </div>
  );
}

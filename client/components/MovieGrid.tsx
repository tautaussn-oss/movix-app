import { MovieCard } from './MovieCard';
import { Movie } from '@/types/movies';

export function MovieGrid({ moviesList }: { moviesList: Movie[] }) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-3">
      {moviesList.map((movie) => {
        return <MovieCard key={movie.id} movie={movie} />;
      })}
    </div>
  );
}

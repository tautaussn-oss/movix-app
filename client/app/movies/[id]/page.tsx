import { MovieDetail } from '@/components/MovieDetail';
import { StatusMessage } from '@/components/StatusMessage';
import { getData, getMovieByID } from '@/lib/movies';
import { Movie } from '@/types/movies';

export default async function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let movie, movies;
  try {
    [movie, movies] = await Promise.all([getMovieByID(id), getData('movies')]);
  } catch (e) {
    if (e instanceof Error) {
      return <StatusMessage type="error" message={e.message} />;
    } else
      return (
        <StatusMessage type="error" message="Something went wrong while loading movie details!" />
      );
  }

  if (movie === null) return <StatusMessage type="empty" message="This movie does not exist!" />;

  let prevMovie = null;
  let nextMovie = null;
  let relatedMovies: Movie[] = [];

  if (movies !== null) {
    const currentIndex = movies.findIndex((m) => m.id === movie.id);

    if (currentIndex > 0) {
      prevMovie = movies[currentIndex - 1];
    }

    if (currentIndex < movies.length - 1) {
      nextMovie = movies[currentIndex + 1];
    }

    relatedMovies = movies.filter(
      (m) => m.id !== movie.id && m.genres.some((genre) => movie.genres.includes(genre)),
    );
  }

  return (
    <div className="flex justify-center w-full">
      <MovieDetail
        movie={movie}
        prevMovie={prevMovie}
        nextMovie={nextMovie}
        relatedMovies={relatedMovies}
      />
    </div>
  );
}

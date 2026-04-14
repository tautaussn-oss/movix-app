import { Footer } from '@/components/Footer';
import { MovieDetail } from '@/components/MovieDetail';
import { StatusMessage } from '@/components/StatusMessage';
import { getMovieByID, getPrevNextMovie, getRelatedMovies } from '@/lib/movies';
import { Movie } from '@/types/movies';

export default async function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let movie;
  let prevMovie: number | null = null;
  let nextMovie: number | null = null;
  let relatedMovies: Movie[] | null = null;
  try {
    movie = await getMovieByID(id);
  } catch (e) {
    if (e instanceof Error) {
      return <StatusMessage type="error" message={e.message} />;
    } else
      return (
        <StatusMessage type="error" message="Something went wrong while loading movie details!" />
      );
  }
  try {
    [prevMovie, nextMovie, relatedMovies] = await Promise.all([
      getPrevNextMovie(id, 'prev'),
      getPrevNextMovie(id, 'next'),
      getRelatedMovies(id),
    ]);
  } catch (e) {
    console.error('Failed to load prev/next and related movie data!', e);
  }

  if (movie === null) return <StatusMessage type="empty" message="This movie does not exist!" />;

  return (
    <div className="flex flex-col justify-center w-full">
      <MovieDetail
        movie={movie}
        prevMovie={prevMovie}
        nextMovie={nextMovie}
        relatedMovies={relatedMovies}
      />
      <Footer />
    </div>
  );
}

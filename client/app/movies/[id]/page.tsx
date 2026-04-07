import { MovieDetail } from '@/components/MovieDetail';
import { StatusMessage } from '@/components/StatusMessage';
import { getMovieByID, getPrevNextMovie, getRelatedMovies } from '@/lib/movies';

export default async function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let movie, prevMovie, nextMovie, relatedMovies;
  try {
    [movie, prevMovie, nextMovie, relatedMovies] = await Promise.all([
      getMovieByID(id),
      getPrevNextMovie(id, 'prev'),
      getPrevNextMovie(id, 'next'),
      getRelatedMovies(id),
    ]);
  } catch (e) {
    if (e instanceof Error) {
      return <StatusMessage type="error" message={e.message} />;
    } else
      return (
        <StatusMessage type="error" message="Something went wrong while loading movie details!" />
      );
  }

  if (movie === null) return <StatusMessage type="empty" message="This movie does not exist!" />;

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

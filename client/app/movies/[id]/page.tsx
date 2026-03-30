import { MovieDetail } from '@/components/MovieDetail';
import { StatusMessage } from '@/components/StatusMessage';
import { getMovieByID, getPrevNextMovie } from '@/lib/movies';
// implement related movies

export default async function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let movie, prevMovie, nextMovie;
  try {
    [movie, prevMovie, nextMovie] = await Promise.all([
      getMovieByID(id),
      getPrevNextMovie(id, 'prev'),
      getPrevNextMovie(id, 'next'),
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
      />
    </div>
  );
}

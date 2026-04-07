import { MovieForm } from '@/components/MovieForm';
import { StatusMessage } from '@/components/StatusMessage';
import { getData, getMovieByID } from '@/lib/movies';

export default async function EditMovie({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let movie, genres;
  try {
    [movie, genres] = await Promise.all([getMovieByID(id), getData('genres')]);
  } catch (error) {
    if (error instanceof Error) {
      return <StatusMessage type="error" message={error.message} />;
    } else return <StatusMessage type="error" message="Something went wrong while loading data!" />;
  }

  if (movie === null) {
    return <StatusMessage type="error" message="Movie not found" />;
  }

  return (
    <div className="w-full h-full p-5 flex justify-center">
      <MovieForm movie={movie} genres={genres} />
    </div>
  );
}

import { MoviesClientSection } from '@/components/MoviesClientSection';
import { StatusMessage } from '@/components/StatusMessage';
import { getData } from '@/lib/movies';

export default async function MoviesPage() {
  let movies, genres;
  try {
    [movies, genres] = await Promise.all([getData('movies'), getData('genres')]);
  } catch {
    return <StatusMessage type="error" message="Something went wrong with loading data!" />;
  }

  if (movies === null) return <StatusMessage type="empty" message="Movies not found!" />;

  return <MoviesClientSection moviesList={movies} genresList={genres} />;
}

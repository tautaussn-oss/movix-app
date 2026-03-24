import { MoviesClientSection } from '@/components/MoviesClientSection';
import { getData } from '@/lib/movies';

export default async function MoviesPage() {
  const movies = await getData('movies');
  const genres=await getData('genres');

  return <MoviesClientSection moviesList={movies} genresList={genres} />;
}

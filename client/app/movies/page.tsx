import { MoviesClientSection } from '@/components/MoviesClientSection';
import { StatusMessage } from '@/components/StatusMessage';
import { getData } from '@/lib/movies';

export default async function MoviesPage() {
  const movies = await getData('movies');
  const genres=await getData('genres');

  if(movies===null) return <StatusMessage message='Movies not found!'/>

  return <MoviesClientSection moviesList={movies} genresList={genres} />;
}

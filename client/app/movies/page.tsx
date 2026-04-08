import { Footer } from '@/components/Footer';
import { MoviesClientSection } from '@/components/MoviesClientSection';
import { StatusMessage } from '@/components/StatusMessage';
import { getData } from '@/lib/movies';

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const { genre } = await searchParams;
  let movies, genres;
  try {
    [movies, genres] = await Promise.all([getData('movies'), getData('genres')]);
  } catch {
    return <StatusMessage type="error" message="Something went wrong with loading data!" />;
  }

  if (movies === null) return <StatusMessage type="empty" message="Movies not found!" />;

  return (
    <div>
      <MoviesClientSection moviesList={movies} genresList={genres} initialGenre={genre} />
      <Footer />
    </div>
  );
}

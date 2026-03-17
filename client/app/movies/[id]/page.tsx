import { MovieDetail } from '@/components/MovieDetail';
import movies from '@/data/movies.json';

export default async function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = movies.find((movie) => movie.id === Number(id));
  if (movie === undefined) return <p>Movie not found!</p>;
  return (
    <div className='flex justify-center w-full'>
      <MovieDetail movie={movie} />
    </div>
  );
}

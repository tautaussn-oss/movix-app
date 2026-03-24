import { Favorites } from '@/components/Favorites';
import { MovieGrid } from '@/components/MovieGrid';
import { StatusMessage } from '@/components/StatusMessage';
import { getData } from '@/lib/movies';

export default async function Home() {
  const movies = await getData('movies');
  if (movies === null) return <StatusMessage message="Movies not found!" />;
  const featured = movies.filter((movie) => movie.featured);
  return (
    <div className="">
      <main className="flex flex-col gap-5 items-center">
        <h1 className="text-white font-bold ">Featured Movies:</h1>
        <MovieGrid moviesList={featured} />
        <h1 className="text-white font-bold ">Favorites:</h1>
        <Favorites movies={movies} />
      </main>
    </div>
  );
}

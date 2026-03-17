import movies from '@/data/movies.json';
import { MovieGrid } from '@/components/MovieGrid';

export default function Home() {
  const filtered = movies.filter((movie) => movie.featured);
  return (
    <div className="">
      <main className="flex flex-col gap-5">
        <MovieGrid movies={filtered} />
      </main>
    </div>
  );
}

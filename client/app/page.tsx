import { MovieCard } from '@/components/MovieCard';
import movies from '@/data/movies.json'

export default function Home() {
  return (
    <div className="">
      <main className="">
        <div className='grid grid-cols-3 gap-5'>
          {movies.filter(movie=>movie.featured).map(movie=><MovieCard key={movie.id} movie={movie}/>)}
        </div>
        
      </main>
    </div>
  );
}

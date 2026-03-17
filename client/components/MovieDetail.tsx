import { Movie } from '@/types/movies';
import Image from 'next/image';

export function MovieDetail({ movie }: { movie: Movie }) {
  return (
    <div className="w-2/3 h-full flex flex-col md:flex-row text-gray-500 p-10 rounded shadow-lg bg-amber-100">
      <Image
        src={movie.poster}
        alt={movie.title}
        width={400}
        height={550}
        priority
        className="object-cover"
      />
      <div className=" flex flex-col justify-between">
        <h1 className="text-3xl font-bold text-black m-3">{movie.title}</h1>
        <p className=" mx-3">
          {movie.year},{' '}
          {movie.genres.join(' ')}
          , {movie.duration} minutes
        </p>
        <p className=" mx-3">{movie.description}</p>
        <p className=" mx-3">Rating: {movie.rating}</p>
        <p className=" mx-3">Director: {movie.director}</p>
      </div>
    </div>
  );
}

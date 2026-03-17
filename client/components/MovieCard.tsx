import { Movie } from '@/types/movies';
import Image from 'next/image';
import Link from 'next/link';

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="rounded-2xl w-75 shadow-2xl bg-amber-100 text-gray-500 hover:-translate-y-2 transition">
        <Image
          src={movie.poster}
          alt={movie.title}
          width={300}
          height={450}
          priority
          className="rounded-t-2xl object-cover"
        />
        <div className="m-3">
          <h1 className="font-bold text-lg">{movie.title}</h1>
          <p>{movie.year}</p>
          <p>
            {movie.genres.map((genre) => (
              <span key={genre}>{genre} </span>
            ))}
          </p>
          <p>{movie.rating}</p>
        </div>
      </div>
    </Link>
  );
}

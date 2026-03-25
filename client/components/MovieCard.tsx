import { Movie } from '@/types/movies';
import Image from 'next/image';
import Link from 'next/link';

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="m-3 flex flex-col rounded-[20px] w-69 shadow-2xl bg-white border border-black text-black hover:-translate-y-2 transition">
        <div className="relative w-full h-97.25 ">
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            className="object-cover rounded-t-[20px]"
          />
        </div>
        <div className="px-3 flex flex-col gap-8">
          <h1 className="font-bold text-2xl my-4">{movie.title}</h1>
          <div className="flex gap-2 py-6 border-t border-black">
            <p className="text-base text-zinc-900">{movie.year}</p>
            <p className="text-base text-zinc-900">{movie.genres.join(' ')}</p>
          </div>
          <p className="py-2 flex gap-2 text-base text-zinc-900">
            <span className="font-semibold text-lg text-zinc-900">Rating:</span>
            {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
          </p>
        </div>
      </div>
    </Link>
  );
}

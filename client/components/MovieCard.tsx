import { Movie } from '@/types/movies';
import Image from 'next/image';
import Link from 'next/link';

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="flex gap-4 p-4 items-center justify-start shadow-[4px_8px_20px_-3px_#AA7600] rounded-2xl h-53.75 w-70.5 bg-[#141414] hover:-translate-y-2 transition">
        <div className="relative h-40.25 aspect-2/3 ">
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            className="object-cover overflow-hidden"
          />
        </div>
        <div className="flex flex-col gap-3 justify-evenly items-start text-[#888888]">
          <h1 className="text-[#AA7600] font-semibold text-lg text-left">{movie.title}</h1>
          <p className="text-base">{movie.genres.join(' ')}</p>
          <p className="text-base">{movie.year}</p>

          <p className="text-base ">{movie.rating ? movie.rating.toFixed(1) : 'N/A'}</p>
        </div>
      </div>
    </Link>
  );
}

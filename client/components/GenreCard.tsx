import { Genre } from '@/types/movies';
import Image from 'next/image';
import { IoIosArrowForward } from 'react-icons/io';
import Link from 'next/link';

export function GenreCard({ genre }: { genre: Genre }) {
  return (
    <Link href={`/movies?genre=${genre.genre}`}>
      <div className="p-5 flex flex-col gap-3 shadow-[4px_8px_20px_-3px_#AA7600] rounded-2xl h-53.75 w-70.5 bg-[#141414] hover:-translate-y-2 transition">
        <div className="relative w-full h-40 rounded-2xl ">
          <Image src="/genre.png" alt={genre.genre} fill className="object-cover rounded-2xl " />
        </div>
        <p className="text-lg flex items-center justify-between text-[#aa7600]">
          {genre.genre}
          <IoIosArrowForward />
        </p>
      </div>
    </Link>
  );
}

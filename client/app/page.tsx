import { Footer } from '@/components/Footer';
import { MoviesViewSwitch } from '@/components/MoviesViewSwitch';
import { StatusMessage } from '@/components/StatusMessage';
import { getData, getFilteredMovies } from '@/lib/movies';
import { GenreCard } from '@/components/GenreCard';
import Image from 'next/image';

export default async function Home() {
  let movies, featured, popular, genres;
  try {
    [movies, featured, popular, genres] = await Promise.all([
      getData('movies'),
      getFilteredMovies({ featured: true }),
      getFilteredMovies({ sortBy: 'popular' }),
      getData('genres'),
    ]);
  } catch {
    return (
      <StatusMessage
        type="error"
        message={'Something went wrong while loading filterded movies!'}
      />
    );
  }

  return (
    <main className="flex flex-col gap-5 items-center ">
      <div className="relative w-full h-96">
        <Image src="/background.png" alt={'No poster Found!'} className="object-cover" fill />
        <div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-[#141414] to-transparent ">
          <h1 className="absolute bottom-2 left-[15%] w-[70%] text-center text-white font-bold text-2xl">
            Explore and find your favorite Movies, TV shows and more
          </h1>
        </div>
      </div>
      <MoviesViewSwitch movies={movies} featured={featured} popular={popular} />
      <h1 className="text-white text-2xl text-center w-70.5 my-5">
        Explore our vide variety of <span className="text-[#aa7600]">categories</span>
      </h1>
      <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-5 items-center justify-center lg:grid-cols-3">
        {genres?.map((genre) => {
          return <GenreCard key={genre.id} genre={genre} />;
        })}
      </div>
      <Footer />
    </main>
  );
}

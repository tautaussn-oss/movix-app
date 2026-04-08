'use client';
import { Movie } from '@/types/movies';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TbStarFilled } from 'react-icons/tb';
import { FaEdit } from 'react-icons/fa';
import { MdArrowBackIosNew } from 'react-icons/md';
import { MdArrowForwardIos } from 'react-icons/md';
import { IoMdBookmark } from 'react-icons/io';
import { IoBookmarkOutline } from 'react-icons/io5';
import { MdStar } from 'react-icons/md';
import { MovieGrid } from './MovieGrid';
import { StatusMessage } from './StatusMessage';
import { addFavorite, isFavorite, removeFavorite } from '@/lib/localStorage';

const rateButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export function MovieDetail({
  movie,
  prevMovie,
  nextMovie,
  relatedMovies,
}: {
  movie: Movie;
  prevMovie: number | null;
  nextMovie: number | null;
  relatedMovies: Movie[] | null;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [isFavoriteMovie, setIsFavoriteMovie] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [ratingError, setRatingError] = useState('');

  useEffect(() => {
    setIsFavoriteMovie(isFavorite(movie.id));
  }, [movie.id]);

  const handleDelete = async (id: number) => {
    setDeleteError('');
    try {
      const response = await fetch(`https://movix-app-az3n.onrender.com/api/movies/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete movie');
      }

      router.push('/movies');
    } catch (error) {
      if (error instanceof Error) {
        setDeleteError(error.message);
      } else setDeleteError('Something went wrong while trying to delete this movie!');
    }
  };
  const handleFavorites = () => {
    if (isFavoriteMovie) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie.id);
    }
    setIsFavoriteMovie(!isFavoriteMovie);
  };
  const handleRating = async (rating: number) => {
    setRatingError('');
    try {
      const response = await fetch(`https://movix-app-az3n.onrender.com/api/ratings/${movie.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });
      if (!response.ok) throw new Error('Failed to save Rating!');
      setRating(rating);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setRatingError(error.message);
      } else setRatingError('Something went wrong while trying to rate this movie!');
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full items-center p-5">
      <div className="w-full flex justify-between gap-3">
        {prevMovie ? (
          <Link
            href={`/movies/${prevMovie}`}
            className=" bg-[#141414] text-[#AA7600] border border-[#AA7600] hover:bg-amber-100 whitespace-nowrap w-1/2 md:max-w-1/3 rounded-xl py-2 px-3 flex gap-3 items-center justify-center"
          >
            <MdArrowBackIosNew />
            Previous Movie
          </Link>
        ) : (
          <button
            disabled
            className=" bg-[#f4f4f5] text-[#AA7600] border border-[#AA7600] hover:bg-amber-100 whitespace-nowrap w-1/2 md:max-w-1/3 rounded-xl py-2 px-3 flex gap-3 items-center justify-center"
          >
            <MdArrowBackIosNew />
            Previous Movie
          </button>
        )}

        {nextMovie ? (
          <Link
            href={`/movies/${nextMovie}`}
            className="whitespace-nowrap bg-[#aa7600] w-1/2 md:max-w-1/3 rounded-xl py-2 px-3 flex gap-3 items-center justify-center"
          >
            Next Movie
            <MdArrowForwardIos />
          </Link>
        ) : (
          <button
            disabled
            className="whitespace-nowrap bg-[#f4f4f5] border-[#aa7600] text-[#aa7600] border w-1/2 md:max-w-1/3 rounded-xl py-2 px-3 flex gap-3 items-center justify-center"
          >
            Next Movie
            <MdArrowForwardIos />
          </button>
        )}
      </div>

      {deleteError && (
        <p className="text-red-500 text-center text-sm px-3 py-2 border border-red-500 rounded-xl">
          {deleteError}
        </p>
      )}

      <div className="relative w-full h-190 bg-[#141414]">
        <div className="absolute top-0 left-0 w-full h-1/2  ">
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            className="object-cover blur-sm rounded-3xl overflow-hidden "
          />
          <div className="absolute top-0 left-0 w-full h-full scale-110  bg-linear-to-t from-[#141414] to-transparent" />
        </div>
        <div className="absolute left-0 top-60 w-full h-125 flex flex-col bg-[#141414] shadow-[4px_8px_20px_-3px_#AA7600] rounded-4xl">
          <div className=" mx-45 md:mx-50 mt-3 w-1/2 h-1/3 flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-white ">{movie.title}</h1>
            <p className="text-white text-xl ">{movie.genres.join(' ')}</p>
            <p className="flex gap-1 h-1/3 items-center text-white text-lg">
              <MdStar className="text-[#aa7600] text-sm" />
              {movie.rating !== null ? movie.rating.toFixed(1) : 'N/A'}
            </p>
          </div>
          <div className=" flex flex-col gap-5 m-3 h-2/3 justify-evenly text-white text-lg">
            <p className="">
              <span className="text-gray-400">Director: </span>
              {movie.director}
            </p>
            <p className="">
              <span className="text-gray-400">Duration: </span>
              {movie.duration} minutes
            </p>
            <p className="">
              <span className="text-gray-400">Year: </span>
              {movie.year}
            </p>
            <p className="">{movie.description}</p>
          </div>
        </div>
        <div className="absolute left-8 bottom-90 w-35 h-50">
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            className="object-cover rounded-[20px]"
          />
        </div>
      </div>
      <div className="flex flex-col items-center md:flex-row gap-2 text-gray-400 font-semibold">
        Rate this Movie:
        <div className="flex gap-1">
          {rateButtons.map((button) => {
            return (
              <button key={button} onClick={() => handleRating(button)}>
                <TbStarFilled
                  className={`text-2xl cursor-pointer ${button <= rating ? 'text-[#aa7600]' : 'text-gray-400'}`}
                />
              </button>
            );
          })}
        </div>
      </div>
      {ratingError && (
        <p className="text-red-500 text-center text-sm px-3 py-2 border border-red-500 rounded-xl">
          {ratingError}
        </p>
      )}
      <button
        className="flex gap-3 items-center justify-center w-full md:max-w-1/3 py-2 px-3 rounded-xl text-[#aa7600] border border-[#aa7600] cursor-pointer"
        onClick={handleFavorites}
      >
        {isFavoriteMovie ? 'Remove from Favorites' : 'Add to Favorites'}{' '}
        {isFavoriteMovie ? (
          <IoMdBookmark className={`text-lg text-[#aa7600]`} />
        ) : (
          <IoBookmarkOutline className="text-lg text-[#aa7600]" />
        )}
      </button>
      <Link
        href={`/movies/${movie.id.toString()}/edit`}
        className="flex gap-3 items-center justify-center w-full md:max-w-1/3 py-2 px-3 rounded-xl bg-[#aa7600] text-black "
      >
        Edit this Movie
        <FaEdit />
      </Link>
      <button
        className="py-2 px-3 w-1/2 md:max-w-1/4 lg:max-w-1/6 border border-[#aa7600] rounded-xl bg-red-500 hover:bg-red-600 cursor-pointer text-white"
        onClick={() => handleDelete(movie.id)}
      >
        Delete this Movie
      </button>
      <div className="w-full flex flex-col">
        <h1 className="w-full border-b border-[#aa7600] text-[#aa7600] font-semibold text-2xl p-5">
          Related Movies
        </h1>
        {relatedMovies && relatedMovies.length !== 0 ? (
          <MovieGrid moviesList={relatedMovies} />
        ) : (
          <StatusMessage type="empty" message="No Related Movies found!" />
        )}
      </div>
    </div>
  );
}

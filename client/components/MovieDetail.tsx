'use client';
import { Movie } from '@/types/movies';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TbStarFilled } from 'react-icons/tb';
import { GoHeartFill } from 'react-icons/go';
import { FaEdit } from 'react-icons/fa';
import { MdArrowBackIosNew } from 'react-icons/md';
import { MdArrowForwardIos } from 'react-icons/md';
import { MovieGrid } from './MovieGrid';
import { StatusMessage } from './StatusMessage';
import { addFavorite, isFavorite, removeFavorite } from '@/lib/localStorage';

const rateButtons = [1, 2, 3, 4, 5] as const;

export function MovieDetail({
  movie,
  prevMovie,
  nextMovie,
  relatedMovies,
}: {
  movie: Movie;
  prevMovie: Movie | null;
  nextMovie: Movie | null;
  relatedMovies: Movie[];
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
            href={`/movies/${prevMovie.id}`}
            className=" bg-white whitespace-nowrap w-1/2 md:max-w-1/3 rounded-full py-2 px-3 flex gap-3 items-center justify-center"
          >
            <MdArrowBackIosNew />
            Previous Movie
          </Link>
        ) : (
          <button
            disabled
            className="bg-gray-300 whitespace-nowrap w-1/2 md:max-w-1/3 rounded-full py-2 px-3 text-gray-500 flex gap-3 items-center justify-center"
          >
            <MdArrowBackIosNew />
            Previous Movie
          </button>
        )}

        {nextMovie ? (
          <Link
            href={`/movies/${nextMovie.id}`}
            className="whitespace-nowrap bg-white w-1/2 md:max-w-1/3 rounded-full py-2 px-3 flex gap-3 items-center justify-center"
          >
            Next Movie
            <MdArrowForwardIos />
          </Link>
        ) : (
          <button
            disabled
            className="whitespace-nowrap bg-gray-300 w-1/2 md:max-w-1/3 rounded-full py-2 px-3 text-gray-500 flex gap-3 items-center justify-center"
          >
            Next Movie
            <MdArrowForwardIos />
          </button>
        )}
      </div>
      <button
        className="py-2 px-3 w-full md:max-w-1/3  rounded-full bg-red-500 text-white"
        onClick={() => handleDelete(movie.id)}
      >
        Delete this Movie
      </button>
      {deleteError && <p className="text-red-500">{deleteError}</p>}

      <div className="w-69 h-full flex flex-col md:flex-row md:w-2/3 text-black rounded-2xl shadow-lg bg-white">
        <div className="relative w-full md:w-69 h-96">
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            className="object-cover rounded-t-[20px] md:rounded-t-none md:rounded-l-[20px]"
          />
        </div>
        <div className="flex flex-col justify-between gap-5">
          <h1 className="text-3xl font-bold text-black m-3">{movie.title}</h1>
          <p className="mx-3">
            <span className="font-semibold">Year: </span>
            {movie.year}, {movie.genres.join(' ')}
          </p>
          <p className="mx-3">
            <span className="font-semibold">Director: </span>
            {movie.director}
          </p>
          <p className="mx-3">
            <span className="font-semibold">Duration: </span>
            {movie.duration} minutes
          </p>
          <p className="mx-3 mb-3">{movie.description}</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2 text-white font-semibold">
        Rate this Movie:
        <div className='flex gap-1'>
          {rateButtons.map((button) => {
          return (
            <button key={button} onClick={() => handleRating(button)}>
              <TbStarFilled
                className={`text-2xl ${button <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
              />
            </button>
          );
        })}
        </div>
        <div className='flex gap-3'>
          <span className=""> Rating:</span>
        <span>{movie.rating !== null ? movie.rating.toFixed(1) : 'N/A'} / 5</span>
        </div>
      </div>
      {ratingError && <p className="text-red-500">{ratingError}</p>}
      <button
        className="flex gap-3 items-center justify-center w-full md:max-w-1/3 py-2 px-3 rounded-full text-white border border-white"
        onClick={handleFavorites}
      >
        {isFavoriteMovie ? 'Remove from Favorites' : 'Add to Favorites'}{' '}
        <GoHeartFill className={`${isFavoriteMovie && 'text-red-500'}`} />
      </button>
      <button className="flex gap-3 items-center justify-center w-full md:max-w-1/3 py-2 px-3 rounded-full bg-white text-black ">
        Edit this Movie
        <FaEdit />
      </button>
      <div className="w-full flex flex-col">
        <h1 className="w-full border-b border-gray-300 text-white font-semibold text-2xl p-5">
          Related Movies
        </h1>
        {relatedMovies.length > 0 ? (
          <div>
            <MovieGrid moviesList={relatedMovies} />
          </div>
        ) : (
          <StatusMessage type="empty" message="No Related Movies!" />
        )}
      </div>
    </div>
  );
}

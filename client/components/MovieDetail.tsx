'use client';
import { MovieDetailProp } from '@/types/movies';
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
import { deleteMovie, rateMovie } from '@/lib/movies';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';

const rateButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export function MovieDetail({ movie, prevMovie, nextMovie, relatedMovies }: MovieDetailProp) {
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
      await deleteMovie(id.toString());
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
      await rateMovie(movie.id.toString(), rating);
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
          <div className="w-1/2 md:w-1/3">
            <Button
              asChild
              variant={'outline'}
              className="w-full border border-[#aa7600] bg-[#141414] text-[#aa7600]"
            >
              <Link href={`/movies/${prevMovie}`}>
                <MdArrowBackIosNew />
                Previous Movie
              </Link>
            </Button>
          </div>
        ) : (
          <button
            disabled
            className=" bg-[#f4f4f5] text-[#AA7600] border border-[#AA7600] whitespace-nowrap w-1/2 md:max-w-1/3 rounded-xl  px-3 flex gap-3 items-center justify-center"
          >
            <MdArrowBackIosNew />
            Previous Movie
          </button>
        )}

        {nextMovie ? (
          <div className="w-1/2 md:w-1/3">
            <Button asChild variant={'secondary'} className="w-full text-[#141414] bg-[#aa7600]">
              <Link href={`/movies/${nextMovie}`}>
                Next Movie
                <MdArrowForwardIos />
              </Link>
            </Button>
          </div>
        ) : (
          <button
            disabled
            className="whitespace-nowrap bg-[#f4f4f5] border-[#aa7600] text-[#aa7600] border w-1/2 md:max-w-1/3 rounded-xl  px-3 flex gap-3 items-center justify-center"
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
        <div className="absolute left-0 top-0 w-full h-1/2  ">
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            className="object-cover blur-sm rounded-3xl overflow-hidden "
          />
          <div className="absolute top-0 left-0 w-full h-full scale-110  bg-linear-to-t from-[#141414] to-transparent" />
        </div>
        <div className="absolute left-0 top-60 w-full h-125 flex flex-col gap-3 px-5 bg-[#141414] shadow-[4px_8px_20px_-3px_#AA7600] rounded-4xl">
          <div className="relative flex gap-4 items-start ">
            <div className="relative shrink-0 w-32 h-44 -translate-y-10 rounded-[20px] overflow-hidden">
              <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
            </div> 

            <div className="flex-1 min-w-0 flex flex-col gap-2 pt-2">
              <h1 className="text-2xl font-bold text-white leading-tight">{movie.title}</h1>

              <p className="text-white text-lg wrap-break-word">{movie.genres.join(', ')}</p>

              <p className="flex gap-1 items-center text-white text-lg">
                <MdStar className="text-[#aa7600] text-sm shrink-0" />
                {movie.rating !== null ? movie.rating.toFixed(1) : 'N/A'}
              </p>
            </div>
          </div>
          <div className=" flex flex-col m-3 gap-3  text-white text-lg">
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
      </div>
      <div className="flex flex-col items-center md:flex-row gap-2 text-gray-400 font-semibold">
        Rate this Movie:
        <div className="flex gap-1">
          {rateButtons.map((button) => {
            return (
              <button key={button} onClick={() => handleRating(button)}>
                <TbStarFilled
                  className={`text-2xl cursor-pointer ${button <= rating ? 'text-[#aa7600]' : 'text-gray-400 hover:text-gray-500'}`}
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
      <div className="w-2/3 flex flex-col gap-3 justify-center items-center md:w-1/3">
        <Button
          onClick={handleFavorites}
          variant={'outline'}
          className="w-full border border-[#aa7600] text-[#aa7600] bg-[#141414]"
        >
          {isFavoriteMovie ? 'Remove from Favorites' : 'Add to Favorites'}{' '}
          {isFavoriteMovie ? (
            <IoMdBookmark className={`text-lg text-[#aa7600]`} />
          ) : (
            <IoBookmarkOutline className="text-lg text-[#aa7600]" />
          )}
        </Button>

        <Button
          asChild
          variant={'secondary'}
          size={'lg'}
          className="w-full bg-[#aa7600] text-[#141414]"
        >
          <Link href={`/movies/${movie.id.toString()}/edit`}>
            Edit this Movie
            <FaEdit />
          </Link>
        </Button>
      </div>
      <AlertDialog>
        <div className="w-2/3 md:w-1/3 flex items-center justify-center">
          <AlertDialogTrigger asChild>
            <Button variant={'destructive'} size={'lg'} className="w-full">
              Delete this Movie
            </Button>
          </AlertDialogTrigger>
        </div>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this movie.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => handleDelete(movie.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

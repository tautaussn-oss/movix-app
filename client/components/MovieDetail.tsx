'use client'
import { Movie } from '@/types/movies';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TbStarFilled } from "react-icons/tb";
import { GoHeartFill } from "react-icons/go";
import { FaEdit } from "react-icons/fa";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { MovieGrid } from './MovieGrid';

const rateButtons=[1,2,3,4,5] as const;

export function MovieDetail({
  movie,
  prevMovie,
  nextMovie,
  relatedMovies
}: {
  movie: Movie;
  prevMovie: Movie | null;
  nextMovie: Movie | null;
  relatedMovies: Movie[] | null;
}) {
  const router = useRouter();
  const [rating, setRating]=useState(0);
  const [isFavorite, setIsFavorite]=useState(false);

  useEffect(()=>{
    const stored=localStorage.getItem('favorites');
    const arr:number[]=stored?JSON.parse(stored):[];
    setIsFavorite(arr.includes(movie.id))
  },[movie.id])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`https://movix-app-az3n.onrender.com/api/movies/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete movie');
      }

      router.push('/movies');
    } catch (error) {
      console.error(error);
    }
  };
  const handleFavorites=()=>{
    const stored=localStorage.getItem('favorites');
    const arr:number[]=stored?JSON.parse(stored):[];
    let newArr=[];
    if(!arr.includes(movie.id)){
      newArr=[...arr,movie.id];
      localStorage.setItem('favorites',JSON.stringify(newArr));
      setIsFavorite(true);
    }
    else{
      newArr=arr.filter(id=>id!==movie.id);
      localStorage.setItem('favorites',JSON.stringify(newArr));
      setIsFavorite(false);
    }
  }
  
  return (
    <div className="flex flex-col gap-5 w-full items-center p-3">
      <div className="w-full flex justify-between">
        {prevMovie ? (
          <Link
            href={`/movies/${prevMovie.id}`}
            className="w-1/3 bg-white rounded-full py-2 flex gap-3 items-center justify-center"
          >
            <MdArrowBackIosNew/>Previous Movie
          </Link>
        ) : (
          <button disabled className="w-1/3 bg-gray-300 rounded-full py-2 text-gray-500 flex gap-3 items-center justify-center">
            <MdArrowBackIosNew/>Previous Movie
          </button>
        )}

        {nextMovie ? (
          <Link
            href={`/movies/${nextMovie.id}`}
            className="w-1/3 bg-white rounded-full py-2 flex gap-3 items-center justify-center"
          >
            Next Movie<MdArrowForwardIos/>
          </Link>
        ) : (
          <button disabled className="w-1/3 bg-gray-300 rounded-full py-2 text-gray-500 flex gap-3 items-center justify-center">
            Next Movie<MdArrowForwardIos/>
          </button>
        )}
      </div>
      <button className='py-2 w-1/4 rounded-full bg-red-500 text-white' onClick={()=>handleDelete(movie.id)}>Delete this Movie</button>

      <div className="w-1/2 h-full flex flex-col md:flex-row text-black rounded-2xl shadow-lg bg-white">
        <Image
          src={movie.poster}
          alt={movie.title}
          width={400}
          height={550}
          priority
          className="object-cover rounded-l-2xl"
        />
        <div className="flex flex-col justify-between">
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
      <div className='flex gap-2 text-white font-semibold'> Rate this Movie:
        {rateButtons.map(button=>{
        return <button key={button} onClick={()=>setRating(button)}><TbStarFilled className={`text-2xl ${button<=rating?'text-yellow-400':'text-gray-400' }`} /></button>
      })}
        <span className=""> Rating:</span>
            {movie.rating !== null ? movie.rating : 'N/A'} / 5
      </div>
      <button className='flex gap-3 items-center justify-center w-1/4 py-2 px-2 rounded-full text-white border border-white' onClick={handleFavorites}>{isFavorite?'Remove from Favorites':'Add to Favorites'} <GoHeartFill className={`${isFavorite && 'text-red-500'}`}/></button>
      <button className='flex gap-3 items-center justify-center w-1/4 py-2 px-2 rounded-full bg-white text-black '>Edit this Movie<FaEdit/></button>
      <div className='w-full flex flex-col'>
        <h1 className='w-full border-b border-gray-300 text-white font-semibold text-2xl p-5'>Related Movies</h1>
        {relatedMovies!==null && <div>
          <MovieGrid moviesList={relatedMovies}/>
        </div>}
      </div>
    </div>
  );
}

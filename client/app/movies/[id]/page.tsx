import movies from '@/data/movies.json'
import Image from 'next/image';

export default async function MovieDetails({params}:{params: Promise<{id:string}>}){
    const {id}=await params;
    const movie=movies.find(movie=>movie.id===Number(id));
    if(movie===undefined) return <p>Movie not found!</p>
    return (
        <div className='p-10'>
            <h1 className='text-3xl font-bold m-3'>{movie.title}</h1>
            <p className='border-b border-gray-500 m-3'>{movie.year}, {movie.genres.map(genre=><span key={genre}>{genre} </span>)}, {movie.duration} minutes</p>
            <p className='border-b border-gray-500 m-3'>{movie.description}</p>
            <div className='grid grid-cols-2 m-3'>
                <Image src={movie.poster} alt={movie.title} width={300} height={150} priority/>
                <div>
                    <p>Rating: {movie.rating}</p>
                    <p>Director: {movie.director}</p>
                </div>

            </div>
        </div>
    )
}
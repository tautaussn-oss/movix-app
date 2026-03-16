import { Movie } from "@/types/movies";
import Image from "next/image";
import Link from "next/link";

export function MovieCard({movie}:{movie:Movie}){
   
    return (
        <div className="rounded shadow-2xl bg-gray-700 p-3">
            <Image src={movie.poster} alt={movie.title} width={300} height={150} priority/>
            <h1>{movie.title}</h1>
            <p>{movie.year}</p>
            <p>{movie.genres.map(genre=><span key={genre}>{genre} </span>)}</p>
            <p>{movie.rating}</p>
            <Link href={`/movies/${movie.id}`}>
                <button>Show details</button>
            </Link>
        </div>
    )
}
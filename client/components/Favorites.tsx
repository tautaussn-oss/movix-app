'use client'

import { Movie } from "@/types/movies";
import { useEffect, useState } from "react"
import { MovieGrid } from "./MovieGrid";

export function Favorites({movies}:{movies:Movie[]|null}){
    const [favorites, setFavorites]=useState<number[]>([]);
    useEffect(()=>{
        const stored=localStorage.getItem('favorites');
        const arr:number[]=stored?JSON.parse(stored):[];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFavorites(arr);
    },[]);
    
    if(movies===null) return <p>No movies!</p>
    const favoriteMovies=movies.filter(m=>favorites.includes(m.id))
    return (
        <MovieGrid moviesList={favoriteMovies}/>
    )
}
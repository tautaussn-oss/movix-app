'use client'
import { MovieCard } from '@/components/MovieCard';
import { SearcBar } from '@/components/SearchBar';
import { SortSelect } from '@/components/SortSelect';
import movies from '@/data/movies.json';
import { useState } from 'react';

export default function MoviesPage(){
    const moviesList=movies;
    const [searchQuery, setSearchQuery]=useState<string>('');
    const [sortOption, setSortOption]=useState('');
    // useEffect(() => {
    //     const fetchMovies = async () => {
    //         try {
    //         const response = await fetch("https://movix-app-az3n.onrender.com/api/movies");

    //         if (!response.ok) {
    //             throw new Error("Failed to fetch movies");
    //         }

    //         const data = await response.json();
    //         setMoviesList(data.movies);
    //         } catch (error) {
    //         console.error("Error fetching movies:", error);
    //         }
    //     };
    //     fetchMovies();
    //     }, []);

    const handleSearch=(title:string)=>{
        setSearchQuery(title);
    }
    const handleSort=(sortingType:string)=>{
        setSortOption(sortingType);
    }
    const filteredMovies= searchQuery===''?moviesList: moviesList.filter(movie=>movie.title.toLowerCase().trim().includes(searchQuery.toLowerCase().trim()));
    const sortedMovies =
        sortOption === ""
            ? filteredMovies
            : sortOption === "A-Z"
            ? [...filteredMovies].sort((a, b) => a.title.localeCompare(b.title))
            : sortOption === "high-low"
            ? [...filteredMovies].sort((a, b) => b.rating - a.rating)
            : [...filteredMovies].sort((a, b) => b.year - a.year);
    if(sortedMovies.length===0) return <p>No movies found!</p>
    return (
        <div>
            <div className='flex gap-5'>
                <SearcBar onSearch={handleSearch}/>
                <SortSelect onSort={handleSort}/>
            </div>
            <div className='grid grid-cols-3 gap-5'>
                {sortedMovies.map(movie=>{
                    return(
                        <MovieCard key={movie.id} movie={movie}/>
                    )
                })}
            </div>
        </div>
        
        
    )
}
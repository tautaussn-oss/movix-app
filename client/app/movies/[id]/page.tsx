import { MovieDetail } from '@/components/MovieDetail';
import { getData, getMovieByID } from '@/lib/movies';

export default async function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const movie = await getMovieByID(id);
  if (movie === null) return <p>Movie not found!</p>;

  const movies = await getData('movies');

  let prevMovie = null;
  let nextMovie = null;
  let relatedMovies=null;

  if (movies !== null) {
    const currentIndex = movies.findIndex((m) => m.id === movie.id);

    if (currentIndex > 0) {
      prevMovie = movies[currentIndex - 1];
    }

    if (currentIndex < movies.length - 1) {
      nextMovie = movies[currentIndex + 1];
    }
  }
  if(movie!=null && movies!==null){
    relatedMovies=movies.filter(m=>m.id!==movie.id && m.genres.some((genre)=>movie.genres.includes(genre)));

  }
  return (
    <div className="flex justify-center w-full">
      <MovieDetail movie={movie} prevMovie={prevMovie} nextMovie={nextMovie} relatedMovies={relatedMovies}/>
    </div>
  );
}

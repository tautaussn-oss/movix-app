import { DataMap, Movie } from '@/types/movies';

export async function getData<T extends keyof DataMap>(dataType: T): Promise<DataMap[T] | null> {
  const response = await fetch(`https://movix-app-az3n.onrender.com/api/${dataType}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${dataType} not found!`);
  const data = await response.json();
  const returnData: DataMap[T] = data[dataType];
  return returnData;
}
export async function getMovieByID(id: string): Promise<Movie | null> {
  const response = await fetch(`https://movix-app-az3n.onrender.com/api/movies/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch movies!');
  const movie: Movie = await response.json();
  return movie;
}
export async function getMoviesByGenreId(id:string):Promise<Movie[] | null>{
  const response=await fetch(`https://movix-app-az3n.onrender.com/api/genres/${id}`);
  if(response.status===404) return null;
  if(!response.ok) throw new Error('Failed to fetch movies for this genre!');
  const data=await response.json();
  const movies=data.movies;
  return movies;
}

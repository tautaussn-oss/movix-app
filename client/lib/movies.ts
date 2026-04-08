import { DataMap, Director, FilterMoviesParams, Movie } from '@/types/movies';

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
export async function getFilteredMovies({
  search = '',
  genres = [],
  featured = false,
  sortBy = '',
}: FilterMoviesParams): Promise<Movie[] | null> {
  const params = new URLSearchParams();
  if (search.trim() !== '') params.append('search', search.trim());

  genres.forEach((genre) => {
    params.append('genre[]', genre);
  });

  if (featured) params.append('featured', 'true');
  if (sortBy) params.append('sort_by', sortBy);

  const response = await fetch(
    `https://movix-app-az3n.onrender.com/api/movies?${params.toString()}`,
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch filtered movies!');
  const data = await response.json();
  return data.movies;
}
export async function createMovie(data: FormData) {
  const response = await fetch('https://movix-app-az3n.onrender.com/api/movies', {
    method: 'POST',
    body: data,
  });
  if (!response.ok) throw new Error('Failed to create Movie!');
  return response;
}
export async function getDirectors(): Promise<Director[] | null> {
  const response = await fetch('https://movix-app-az3n.onrender.com/api/directors');
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('No directors found!');
  const data = await response.json();
  return data.directors;
}
export async function getPrevNextMovie(id: string, option: string): Promise<number | null> {
  const response = await fetch(`https://movix-app-az3n.onrender.com/api/movies/${id}/${option}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('No prev/next');
  const newId = await response.json();
  return newId ? newId.id : null;
}
export async function getRelatedMovies(id: string): Promise<Movie[] | null> {
  const response = await fetch(`https://movix-app-az3n.onrender.com/api/movies/${id}/related`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('No Related Movies found!');
  const data = await response.json();
  return data.movies;
}
export async function editMovie(id: string, data: FormData) {
  const response = await fetch(`https://movix-app-az3n.onrender.com/api/movies/${id}`, {
    method: 'PUT',
    body: data,
  });
  if (!response.ok) throw new Error('Failed to edit Movie!');
  return response;
}

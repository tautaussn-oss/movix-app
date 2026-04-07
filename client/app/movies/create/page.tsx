import { MovieForm } from '@/components/MovieForm';
import { StatusMessage } from '@/components/StatusMessage';
import { getData } from '@/lib/movies';

export default async function CreateMovie() {
  let genres;
  try{
    genres=await getData('genres');
  } catch {
    return <StatusMessage type='error' message='Genres not found!'/>
  }
  return (
    <div className='w-full h-full p-5 flex justify-center'>
      <MovieForm genres={genres} />
    </div>
  );
}

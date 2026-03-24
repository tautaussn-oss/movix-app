import { Genre, SelectBarProp } from '@/types/movies';
import { StatusMessage } from './StatusMessage';
export function SelectBar({
 genres,
  onSelect,
}:{genres:Genre[]|null}& SelectBarProp) {
  if(genres===null) return <StatusMessage message='No genres found!'/>
  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="mx-5 w-1/2 md:w-1/3 rounded-full bg-gray-200 shadow-lg px-3 py-1 text-gray-500 cursor-pointer"
    >
      <option value={''} >
        Filter By Genre
      </option>
      {genres.map((genre) => {
        return (
          <option key={genre.id} value={genre.id}>
            {genre.genre}
          </option>
        );
      })}
    </select>
  );
}

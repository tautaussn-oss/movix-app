import { SelectGenreProp } from '@/types/movies';

export function GenreSelect({ onSelect, genres }: SelectGenreProp & { genres: string[] }) {
  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="w-1/3 rounded-full bg-gray-200 shadow-lg px-3 py-1 text-gray-500"
    >
      <option value={''}>Filter by genre</option>
      {genres.map((genre) => {
        return (
          <option key={genre} value={genre}>
            {genre}
          </option>
        );
      })}
    </select>
  );
}

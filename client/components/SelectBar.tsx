import { Genre, SelectBarProp } from '@/types/movies';
export function SelectBar({ genres, onSelect }: { genres: Genre[] | null } & SelectBarProp) {
  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="mx-5 w-1/2 md:w-1/3 rounded-full bg-gray-200 shadow-lg px-3 py-1 text-gray-500 cursor-pointer"
    >
      <option value={''}>Filter By Genre</option>
      {genres !== null ? (
        genres.map((genre) => {
          return (
            <option key={genre.id} value={genre.id}>
              {genre.genre}
            </option>
          );
        })
      ) : (
        <option disabled>No genres found!</option>
      )}
    </select>
  );
}

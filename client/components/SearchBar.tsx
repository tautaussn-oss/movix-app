import { SearchBarProp } from '@/types/movies';
import { Input } from './ui/input';

export function SearchBar({ searchText, onSearch, onChange }: SearchBarProp) {
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 flex gap-3">
      <Input
        placeholder="Search for movies"
        type="text"
        value={searchText}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 w-full rounded-lg bg-gray-200"
      />
      <button
        type="button"
        className="bg-[#c08600] text-white rounded-lg px-3 py-2 hover:bg-[#aa7600] "
        onClick={() => onSearch(searchText)}
      >
        Search
      </button>
    </div>
  );
}

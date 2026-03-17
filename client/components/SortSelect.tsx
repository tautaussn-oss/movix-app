import { SortingType, SortSelectProp } from '@/types/movies';

export function SortSelect({ onSort }: SortSelectProp) {
  return (
    <select
      onChange={(e) => onSort(e.target.value as SortingType)}
      className="w-1/3 rounded-full bg-gray-200 shadow-lg px-3 py-1 text-gray-500"
    >
      <option value={''}>Sort by</option>
      <option value={'A-Z'}>Title (A–Z)</option>
      <option value={'high-low'}>Rating (Highest)</option>
      <option value={'newest-first'}>Year (Newest)</option>
    </select>
  );
}

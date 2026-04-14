import { SelectBarProp } from '@/types/movies';
export function SelectBar({ placeholder, selected, options, onSelect }: SelectBarProp) {
  return (
    <select
      value={selected ?? ''}
      onChange={(e) => onSelect(e.target.value)}
      disabled={options.length === 0}
      className="w-full rounded-lg bg-amber-100 text-center px-3 py-2 text-black cursor-pointer"
    >
      <option value={''}>{placeholder}</option>
      {options.map((option) => {
        return (
          <option key={option} value={option}>
            {option}
          </option>
        );
      })}
    </select>
  );
}

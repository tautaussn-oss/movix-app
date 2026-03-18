import { SelectBarProp, SelectType } from '@/types/movies';
export function SelectBar({
  type,
  options,
  onSelect,
}: { type: SelectType } & { options: string[] } & SelectBarProp) {
  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="w-1/3 rounded-full bg-gray-200 shadow-lg px-3 py-1 text-gray-500"
    >
      <option value={''}>
        {type === 'sort' ? 'Sort by' : type === 'year' ? 'Filter by year' : 'Filter by genre'}
      </option>
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

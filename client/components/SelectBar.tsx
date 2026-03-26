import { SelectBarProp } from '@/types/movies';
export function SelectBar({ placeholder, options, onSelect }: SelectBarProp ){
  
  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      disabled={options.length===0}
      className="w-full md:w-1/2 lg:w-1/3 rounded-full bg-gray-200 px-3 py-1 text-gray-500 cursor-pointer"
    >
      <option value={''}>{placeholder}</option>
      { 
        options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })
      }
    </select>
  );
}

import { SelectBarProp } from '@/types/movies';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SelectBarNew({ placeholder, selected, options, onSelect }: SelectBarProp) {
  return (
    <Select
      value={selected || '__all__'}
      onValueChange={(value) => onSelect(value === '__all__' ? '' : value)}
      disabled={options.length === 0}
    >
      <SelectTrigger className="w-full bg-amber-100 text-black rounded-lg">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className='rounded-lg bg-amber-100'>
        <SelectItem value="__all__" className=''>{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option} className=''>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

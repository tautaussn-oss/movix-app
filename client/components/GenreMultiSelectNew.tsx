'use client';

import { useState } from 'react';
import { GenreMultiSelectProp } from '@/types/movies';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md';

export function GenreMultiSelectNew({ genres, selected, onSelect }: GenreMultiSelectProp) {
  const [open, setOpen] = useState(false);

  if (genres === null) return null;

  const handleSelect = (genre: string, checked: boolean) => {
    let updatedSelected: string[];

    if (checked) {
      if (selected) updatedSelected = [...selected, genre];
      else updatedSelected = [genre];
    } else {
      updatedSelected = selected?.filter((g) => g !== genre) ?? [];
    }

    onSelect(updatedSelected);
  };

  let buttonText = 'Choose genres';

  if (selected && selected.length > 0) {
    if (selected.length <= 2) {
      buttonText = selected.join(', ');
    } else {
      buttonText = `${selected.length} genres selected`;
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between bg-amber-100 border-none rounded-lg"
        >
          <span className="truncate">{buttonText}</span>
          {open ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-3">
        <div className="flex flex-col gap-2">
          <div className="max-h-48 overflow-y-auto pr-1">
            {genres.map(({ id, genre }) => (
              <div key={id} className="flex items-center gap-3 rounded-md px-2 py-1 hover:bg-muted">
                <Checkbox
                  id={genre}
                  checked={selected ? selected.includes(genre) : false}
                  onCheckedChange={(checked) => handleSelect(genre, checked === true)}
                />
                <label htmlFor={genre} className="cursor-pointer text-sm">
                  {genre}
                </label>
              </div>
            ))}
          </div>

          <div className="mt-2 border-t pt-2">
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-center"
              onClick={() => {
                onSelect([]);
                setOpen(false);
              }}
            >
              Clear all
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

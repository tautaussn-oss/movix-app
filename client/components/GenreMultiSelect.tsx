'use client';
import { GenreMultiSelectProp } from '@/types/movies';
import { useState } from 'react';
import { MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

export function GenreMultiSelect({ genres, selected, onSelect }: GenreMultiSelectProp) {
  const [isActive, setIsActive] = useState(false);

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
  if (genres === null) return null;
  return (
    <div
      className={`bg-amber-100 flex flex-col max-h-25 overflow-y-scroll rounded-lg w-full text-black px-3 py-2`}
    >
      <button
        className="flex justify-center gap-1 items-center"
        onClick={() => setIsActive(!isActive)}
      >
        <span>Choose genres:</span>
        {isActive ? (
          <MdOutlineKeyboardArrowUp className="font-bold" />
        ) : (
          <MdOutlineKeyboardArrowDown />
        )}
      </button>
      <div className="flex flex-col gap-1">
        {isActive &&
          genres.map(({ id, genre }) => {
            return (
              <div key={id} className=" flex gap-3">
                <input
                  type="checkbox"
                  id={genre}
                  checked={selected ? selected.includes(genre) : false}
                  onChange={(e) => handleSelect(genre, e.target.checked)}
                />
                <label htmlFor={genre}>{genre}</label>
              </div>
            );
          })}
      </div>
    </div>
  );
}

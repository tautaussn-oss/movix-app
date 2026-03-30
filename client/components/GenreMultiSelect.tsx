'use client';
import { GenreMultiSelectProp } from '@/types/movies';
import { useState } from 'react';
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

export function GenreMultiSelect({ genres, onSelect }: GenreMultiSelectProp) {
  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (genre: string, checked: boolean) => {
    let updatedSelected: string[];

    if (checked) {
      updatedSelected = [...selected, genre];
    } else {
      updatedSelected = selected.filter((g) => g !== genre);
    }

    setSelected(updatedSelected);
    onSelect(updatedSelected);
  };

  return (
    <div
      className={`bg-white flex flex-col max-h-25 md:w-1/2 lg:w-1/3 overflow-y-scroll ${isActive ? 'rounded-2xl gap-3' : 'rounded-full'} w-full text-gray-500 px-3 py-2`}
    >
      <p className="flex justify-between items-center" onClick={() => setIsActive(!isActive)}>
        <span>Select genres:</span>
        {isActive?<MdOutlineKeyboardArrowUp/>:<MdOutlineKeyboardArrowDown/>}
      </p>
      <div className="flex flex-col gap-1">
        {isActive &&
          genres.map((genre) => {
            return (
              <div key={genre} className=" flex gap-3">
                <input
                  type="checkbox"
                  id={genre}
                  checked={selected.includes(genre)}
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

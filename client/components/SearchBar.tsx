import { SearchBarProp } from '@/types/movies';
import React from 'react';

export function SearchBar({ onSearch }: SearchBarProp) {
  return (
    <div className="w-2/4 rounded-full bg-gray-200 shadow-lg">
      <input
        type="text"
        placeholder="Search Movie Title"
        onChange={(e) => onSearch(e.target.value)}
        className="px-3 py-1 w-full rounded-full"
      />
    </div>
  );
}

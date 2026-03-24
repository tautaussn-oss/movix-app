'use client'
import { SearchBarProp } from '@/types/movies';
import React, { useState } from 'react';

export function SearchBar({ onSearch }: SearchBarProp) {
  const [searchText, setSearchText]=useState('');
  return (
    <div className="w-1/2 rounded-full flex gap-3">
      <input
        type="text"
        placeholder="Search Movie Title"
        onChange={(e) => setSearchText(e.target.value)}
        className="px-3 py-1 w-full rounded-full bg-gray-200"
      />
      <button className='bg-blue-400 text-white rounded-full px-3 py-1 hover:bg-blue-500 ' onClick={()=>onSearch(searchText)}>Search</button>
    </div>
  );
}

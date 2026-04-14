'use client';

import { useState } from 'react';
import { MoviesViewSwitchProp } from '@/types/movies';
import { MovieGrid } from './MovieGrid';
import { StatusMessage } from './StatusMessage';
import { Favorites } from './Favorites';

const SHOW_OPTIONS = ['Featured', 'Popular', 'Favorites'] as const;

export function MoviesViewSwitch({ movies, featured, popular }: MoviesViewSwitchProp) {
  const [selected, setSelected] = useState('Featured');

  return (
    <div className=" flex flex-col items-center gap-5 p-5">
      <div className="flex gap-1">
        <label htmlFor="select-el" className="text-white text-lg cursor-pointer">
          Show:
        </label>
        <select
          value={selected}
          id="select-el"
          className="text-[#AA7600] text-lg focus:outline-none focus:ring-0 cursor-pointer"
          onChange={(e) => setSelected(e.target.value)}
        >
          {SHOW_OPTIONS.map((o) => {
            return <option key={o}>{o}</option>;
          })}
        </select>
      </div>

      {selected === 'Featured' &&
        (featured !== null ? (
          <MovieGrid moviesList={featured} />
        ) : (
          <StatusMessage type="empty" message="No Featured Movies!" />
        ))}

      {selected === 'Popular' &&
        (popular !== null ? (
          <MovieGrid moviesList={popular} />
        ) : (
          <StatusMessage type="empty" message="No Popular Movies found!" />
        ))}

      {selected === 'Favorites' &&
        (movies !== null ? (
          <Favorites movies={movies} />
        ) : (
          <StatusMessage type="empty" message="No Favorite Movies Found!" />
        ))}
    </div>
  );
}

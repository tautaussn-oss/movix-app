'use client';
import { CreatePageProps } from '@/types/movies';
import { GenreMultiSelect } from './GenreMultiSelect';
import { useEffect, useState } from 'react';
import { Switch } from './Switch';
import { createMovie } from '@/lib/movies';
import { SelectBar } from './SelectBar';
import Image from 'next/image';

export function CreateMoviePage({ genres, directors }:CreatePageProps) {

  const [movieName, setMovieName] = useState('');
  const [year, setYear] = useState<string>('');
  const [genreArr, setGenreArr] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<string>('');
  const [poster, setPoster] = useState<File | null>(null);
  const [posterPreview, setPosterPreview]=useState('');
  const [featured, setFeatured] = useState(false);
  const [director, setDirector]=useState('');
  const [error, setError] = useState('');
  const genreNames = genres !== null ? genres.map((g) => g.genre) : [];
  const directorNames=directors!==null? directors.map(d=>d.full_name):[];

  useEffect(()=>{
    if(!poster){
      setPosterPreview('');
      return;
    }
    const objectUrl=URL.createObjectURL(poster);
    setPosterPreview(objectUrl);

    return ()=>URL.revokeObjectURL(objectUrl);

  },[poster])

  const handleGenres = (selectedGenres: string[]) => {
    setGenreArr(selectedGenres);
  };
  const handleFeatured = (checked: boolean) => {
    setFeatured(checked);
  };
  const handleDirectors=(director:string)=>{
    setDirector(director.trim());
  }
  const handleAddingMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', movieName);
    formData.append('year', year);
    formData.append('duration', duration);
    formData.append('description', description);
    formData.append('director', director);
    formData.append('featured', featured.toString());
    genreArr.forEach((genre) => formData.append('genres[]', genre));
    if (poster) formData.append('poster', poster);
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    try {
      const result = await createMovie(formData);
      if (result.ok) {
      }
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError('Something went wrong!');
    }
  };

  return (
    <form className="flex flex-col items-center justify-center md:flex-row p-5 gap-5 md:p-10" onSubmit={handleAddingMovie}>
      {error && <p className='text-red-500 text-center text-sm'>{error}</p>}
      <div className=''>
        <label htmlFor='poster-upload'
        className="w-56 h-70 rounded-2xl bg-white overflow-hidden cursor-pointer border border-gray-300 flex items-center justify-center"
        >
          {posterPreview ? (
          <div className="relative w-full h-full">
            <Image
              src={posterPreview}
              alt="Poster preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 text-center px-4">
            <span className="font-medium">Upload poster</span>
            <span className="text-sm">Tap to choose an image</span>
          </div>
        )}

        </label>
        <input
          type="file"
          id={'poster-upload'}
          className="hidden"
          required
          onChange={(e) => setPoster(e.target.files?.[0] || null)}
        />
      </div>
      <div className='flex flex-col gap-3 w-[70%] items-center'>
        <input
          type="text"
          value={movieName}
          placeholder="Enter Movie Name"
          className="px-3 py-2 bg-white w-full rounded-full md:w-1/2 lg:w-1/3"
          required
          onChange={(e) => setMovieName(e.target.value)}
        />
        <input
          type="number"
          value={year}
          placeholder="Enter year"
          required
          className="px-3 py-2 bg-white w-full rounded-full md:w-1/2 lg:w-1/3"
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="number"
          required
          placeholder="Enter Movie duration"
          onChange={(e) => setDuration(e.target.value)}
          className="px-3 py-2 bg-white rounded-full w-full md:w-1/2 lg:w-1/3"
        />
        <SelectBar placeholder='Select Director' options={directorNames} onSelect={handleDirectors}/>
        <GenreMultiSelect genres={genreNames} onSelect={handleGenres} />
        <textarea
          value={description}
          className="px-3 py-2 bg-white w-full rounded-2xl md:w-1/2 lg:w-1/3"
          placeholder="Enter Description"
          required
          onChange={(e) => setDescription(e.target.value)}
        />
        <Switch label="Featured Movie" checked={featured} onChange={handleFeatured} />
        <button
          type="submit"
          className="rounded-full px-3 py-2 bg-blue-400 hover:bg-blue-500 text-white font-bold"
        >
          Save Movie
        </button>
      </div>
    </form>
  );
}

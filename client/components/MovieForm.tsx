'use client';
import { MovieFormProps } from '@/types/movies';
// import { GenreMultiSelect } from './GenreMultiSelect';
import { GenreMultiSelectNew } from './GenreMultiSelectNew';
import { useEffect, useState } from 'react';
import { Switch } from './Switch';
import { createMovie, editMovie } from '@/lib/movies';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function MovieForm({ movie, genres }: MovieFormProps) {
  const [movieName, setMovieName] = useState(movie?.title ?? '');
  const [year, setYear] = useState(movie?.year?.toString() ?? '');
  const [genreArr, setGenreArr] = useState<string[]>(movie?.genres ?? []);
  const [description, setDescription] = useState(movie?.description ?? '');
  const [duration, setDuration] = useState(movie?.duration?.toString() ?? '');
  const [poster, setPoster] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState(movie?.poster ?? '');
  const [featured, setFeatured] = useState(movie?.featured ?? false);
  const [director, setDirector] = useState(movie?.director ?? '');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!poster) {
      return;
    }
    const objectUrl = URL.createObjectURL(poster);
    setPosterPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [poster]);

  const handleGenres = (selectedGenres: string[]) => {
    setGenreArr(selectedGenres);
  };
  const handleFeatured = (checked: boolean) => {
    setFeatured(checked);
  };
  const handleAddingMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData();
    formData.append('title', movieName);
    formData.append('year', year);
    formData.append('duration', duration);
    formData.append('description', description);
    formData.append('director', director);
    formData.append('featured', featured.toString());
    genreArr.forEach((genre) => formData.append('genres[]', genre));
    if (poster) formData.append('poster', poster);
    if (movie && !poster) formData.append('poster', movie.poster);

    if (movie) {
      try {
        await editMovie(movie.id.toString(), formData);
        router.push(`/movies/${movie.id}`);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else setError('Editing failed!');
      }
    } else {
      try {
        await createMovie(formData);
        router.push('/movies');
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else setError('Creating movie failed!');
      }
    }
  };

  return (
  <form
    className="w-full max-w-5xl p-5 md:p-8 border border-gray-700 rounded-xl bg-[#1f1f1f] text-gray-400"
    onSubmit={handleAddingMovie}
  >
    {error && (
      <p className="mb-5 text-red-500 text-center text-sm px-3 py-2 border border-red-500 rounded-xl">
        {error}
      </p>
    )}

    <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-gray-400 text-lg">
            Movie Name
          </label>
          <input
            type="text"
            value={movieName}
            id="title"
            className="px-3 py-2 bg-[#2a2a2a] w-full rounded-xl"
            required
            onChange={(e) => setMovieName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="director" className="text-gray-400 text-lg">
            Director
          </label>
          <input
            type="text"
            id="director"
            value={director}
            className="px-3 py-2 bg-[#2a2a2a] w-full rounded-xl"
            onChange={(e) => setDirector(e.target.value)}
          />
        </div>

        <div className="flex gap-3 w-full">
          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="duration" className="text-gray-400 text-lg">
              Duration
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              required
              className="px-3 py-2 bg-[#2a2a2a] w-full rounded-xl"
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="year" className="text-gray-400 text-lg">
              Year
            </label>
            <input
              type="number"
              id="year"
              value={year}
              required
              className="px-3 py-2 bg-[#2a2a2a] w-full rounded-xl"
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-400 text-lg">Genre</label>
          <GenreMultiSelectNew genres={genres} selected={genreArr} onSelect={handleGenres} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-gray-400 text-lg">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            className="px-3 py-2 bg-[#2a2a2a] w-full rounded-2xl min-h-32"
            placeholder="Description"
            required
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-5">
        <label
          htmlFor="poster-upload"
          className="w-56 h-70 rounded-2xl bg-[#2a2a2a] overflow-hidden cursor-pointer flex items-center justify-center"
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
            <div className="flex flex-col items-center justify-center text-gray-400 text-center px-4">
              <span className="font-medium">Upload poster</span>
              <span className="text-sm">Tap to choose an image</span>
            </div>
          )}
        </label>

        <input
          type="file"
          id="poster-upload"
          className="hidden"
          onChange={(e) => setPoster(e.target.files?.[0] || null)}
        />

        <Switch
          id="formswitch"
          label="Featured Movie"
          checked={featured}
          onChange={handleFeatured}
        />

        <button
          type="submit"
          className="w-full rounded-full px-3 py-2 bg-[#aa7600] hover:bg-[#996a00] text-white font-bold"
        >
          Save Movie Details
        </button>
      </div>
    </div>
  </form>
);
}

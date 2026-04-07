'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#141414]  text-white">
      <div className="flex justify-between items-center p-3 md:p-5">
        <div className="flex items-center gap-3">
          <Image src="/movieLogo.png" alt="logo" width={70} height={25} className="rounded-full" />
          <h1 className="text-2xl font-bold hidden md:block">Movix</h1>
        </div>

        <div className="hidden md:flex gap-3 items-center">
          <Link href="/" className="font-bold hover:text-gray-400">
            Home
          </Link>
          <div className="h-6 w-0.5 bg-gray-400"></div>
          <Link href="/movies" className="font-bold hover:text-gray-400">
            Movies
          </Link>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden flex flex-col gap-1`}>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col items-center w-full gap-3">
          <Link
            href="/"
            className="w-full text-center font-bold border-y border-gray-400 p-3"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/movies"
            className="w-full text-center border-b border-gray-400 font-bold pb-3"
            onClick={() => setIsOpen(false)}
          >
            Movies
          </Link>
        </div>
      )}
    </nav>
  );
}

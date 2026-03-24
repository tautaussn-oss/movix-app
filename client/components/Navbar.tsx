'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black border-b border-gray-400 mb-5 text-white">
      <div className="flex justify-between items-center p-5 md:p-10">
        <div className="flex gap-5 items-center">
          <Image src="/logo.png" alt="logo" width={70} height={30} className="rounded" />
          <h1 className="text-2xl font-bold hidden md:block">Movie Library</h1>
        </div>

        <div className="hidden md:flex gap-3 items-center">
          <Link href="/" className="font-bold hover:-translate-y-1 transition">
            Home
          </Link>
          <div className="h-6 w-0.5 bg-gray-400"></div>
          <Link href="/movies" className="font-bold hover:-translate-y-1 transition">
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
        <div className="md:hidden flex flex-col text-end w-full px-5 pb-5 gap-3">
          <Link href="/" className="font-bold" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/movies" className="font-bold" onClick={() => setIsOpen(false)}>
            Movies
          </Link>
        </div>
      )}
    </nav>
  );
}

import Link from 'next/link';

export function Navbar() {
  return (
    <div className="w-full p-10 mb-5 flex justify-between bg-amber-100 text-gray-500 shadow-2xl">
      <h1 className="text-2xl font-bold">Movie Library</h1>
      <nav className="flex justify-evenly gap-5">
        <Link
          href={'/'}
          className="px-3 py-1 rounded shadow-lg hover:bg-amber-50 hover:-translate-y-1 transition"
        >
          Home
        </Link>
        <Link
          href={'/movies'}
          className="px-3 py-1 rounded shadow-lg hover:bg-amber-50 hover:-translate-y-1 transition"
        >
          Movies List
        </Link>
      </nav>
    </div>
  );
}

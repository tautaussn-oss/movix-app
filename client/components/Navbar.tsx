import Link from 'next/link';
import Image from 'next/image';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Navbar() {
  return (
    <nav className="bg-[#141414] text-white">
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

        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden flex flex-col gap-1">
              <span className="w-6 h-0.5 bg-white"></span>
              <span className="w-6 h-0.5 bg-white"></span>
              <span className="w-6 h-0.5 bg-white"></span>
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="bg-[#141414] w-1/3 text-amber-100 border-l border-[#aa7600] p-5"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

            <div className="mt-10 flex flex-col gap-4">
              <SheetClose asChild>
                <Link href="/" className="font-bold text-lg hover:text-[#aa7600] transition">
                  Home
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/movies"
                  className="font-bold text-lg hover:text-[#aa7600] transition"
                >
                  Movies
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

import Link from "next/link";

export function Navbar(){
    return (
        <div className="w-full p-10 flex justify-between">
            <h1 className="text-2xl font-bold">Movies</h1>
            <nav className="flex justify-evenly gap-5">
                <Link href={'/'}>Home</Link>
                <Link href={'/movies'}>Movies List</Link>
            </nav>
        </div>
    )
}
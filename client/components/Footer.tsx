'use client';

import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { GoPlus } from 'react-icons/go';
import { MdKeyboardArrowUp } from 'react-icons/md';

const footerSections = [
  'ABOUT US',
  'MOVIES',
  'PROMOTIONS',
  'ONLINE SERVICES',
  'COMPANY',
  'RESOURCES',
];

const bottomLinks = ['About Us', 'Privacy Policy', 'Help', 'Conditions of Use', 'Publisher Index'];

export function Footer() {
  return (
    <footer className="w-full bg-[#141414] text-white border-t border-gray-700 mt-10">
      <div className="mx-auto px-6 py-10 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-6 w-full">
          <h2 className="text-3xl font-bold tracking-wide">STORE</h2>

          <div className="flex items-center justify-center gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="w-14 h-14 rounded-xl border border-gray-700 bg-[#1b1b1b] flex items-center justify-center text-2xl hover:border-[#aa7600] transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="w-14 h-14 rounded-xl border border-gray-700 bg-[#1b1b1b] flex items-center justify-center text-2xl hover:border-[#aa7600] transition"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-14 h-14 rounded-xl border border-gray-700 bg-[#1b1b1b] flex items-center justify-center text-2xl hover:border-[#aa7600] transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        <div className="w-full flex flex-col">
          {footerSections.map((section) => (
            <button
              key={section}
              type="button"
              className="w-full flex items-center justify-between py-5 border-b border-gray-700 text-left font-bold text-xl"
            >
              <span>{section}</span>
              <GoPlus className="text-3xl shrink-0" />
            </button>
          ))}
        </div>

        <p className="text-center text-gray-500 text-lg leading-9">© 2026, Movies Library</p>

        <div className="w-full flex flex-wrap justify-center gap-x-8 gap-y-4 text-gray-500 text-xl">
          {bottomLinks.map((item) => (
            <Link key={item} href="#" className="hover:text-white transition">
              {item}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 rounded-lg border border-[#e5c46b] bg-[#aa7600] px-5 py-3 text-xl text-white hover:bg-[#996a00] transition"
        >
          <span>Back to top</span>
          <MdKeyboardArrowUp />
        </button>
      </div>
    </footer>
  );
}

import React from 'react';
import Link from 'next/link';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const toggleTheme = () => {
    const html = document.querySelector('html');
    const currentTheme = html?.getAttribute('data-theme');
    html?.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          CodeSynth
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost rounded-btn">
            Platforms
          </label>
          <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
            <li><Link href="/platform/codeforces">Codeforces</Link></li>
            <li><Link href="/platform/atcoder">AtCoder</Link></li>
          </ul>
        </div>
        <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
          <SunIcon className="h-5 w-5 hidden dark:block" />
          <MoonIcon className="h-5 w-5 block dark:hidden" />
        </button>
      </div>
    </div>
  );
};

export default Navbar; 
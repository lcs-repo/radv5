'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link href="/">Radiology Dashboard</Link>
      {session ? (
        <div className="flex items-center gap-4">
          <span>{session.user?.name}</span>
          <button onClick={() => signOut()} className="bg-red-500 px-3 py-1 rounded">
            Sign Out
          </button>
        </div>
      ) : (
        <Link href="/login">Sign In</Link>
      )}
    </nav>
  );
}
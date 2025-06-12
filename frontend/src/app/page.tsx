'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="p-8 text-center text-black dark:text-white">
      <h1 className="text-3xl font-bold">Velkommen til FreelancerCRM</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Logg inn for å komme i gang.</p>
      <div className="mt-6 space-x-4">
        <Link href="/login" className="text-blue-500 hover:underline">
          Logg inn
        </Link>
        <Link href="/register" className="text-blue-500 hover:underline">
          Registrer
        </Link>
      </div>
    </div>
  );
}

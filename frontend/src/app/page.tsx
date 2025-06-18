'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="p-8 text-center text-black dark:text-white">
      <h1 className="text-3xl font-bold">Welcome to FreelancerCRM</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Sign in to get started.</p>
      <div className="mt-6 space-x-4">
        <Link href="/login" className="text-blue-500 hover:underline">
          Sign in
        </Link>
        <Link href="/register" className="text-blue-500 hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}

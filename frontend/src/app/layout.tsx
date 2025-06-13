'use client';

import '../styles/globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '@/components/Navbar';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
      <body className="flex flex-col min-h-screen transition-colors duration-300">
        <DndProvider backend={HTML5Backend}>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </DndProvider>
      </body>
    </html>
  );
}

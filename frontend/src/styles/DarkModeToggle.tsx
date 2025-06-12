'use client'

import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  // Hent lagret modus fra localStorage ved første innlasting
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') setIsDark(true)
  }, [])

  // Oppdater HTML og lagre i localStorage hver gang isDark endres
  useEffect(() => {
    const html = document.documentElement
    if (isDark) {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return (
    <button
      onClick={() => setIsDark(prev => !prev)}
      className="px-3 py-1 rounded border text-sm hover:bg-gray-200 dark:hover:bg-gray-800"
    >
      {isDark ? 'Lys modus' : 'Mørk modus'}
    </button>
  )
}

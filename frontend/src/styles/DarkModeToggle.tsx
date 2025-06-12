'use client'

import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    if (isDark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [isDark])

  return (
    <button
      onClick={() => setIsDark((prev) => !prev)}
      className="px-3 py-1 rounded border text-sm hover:bg-gray-200 dark:hover:bg-gray-800"
    >
      {isDark ? 'Lys modus' : 'Mørk modus'}
    </button>
  )
}

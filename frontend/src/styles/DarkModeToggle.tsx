// DarkModeToggle.tsx
import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [dark])

  return (
    <button onClick={() => setDark(!dark)}
            className="px-2 py-1 border rounded">
      {dark ? '☀︎' : '☾'}
    </button>
  )
}

// Client/src/context/ThemeContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react'

// Define aapke available themes
export type Theme =
  | 'default'
  | 'dark'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'high-contrast'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('appTheme') as Theme | null
    // Agar browser dark mode prefer karta hai aur koi theme stored nahi hai toh 'dark' use karein
    // Warna stored theme ya 'default'
    if (storedTheme) {
      return storedTheme
    }
    // Optional: Check for prefers-color-scheme: dark
    // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !storedTheme) {
    //   return 'dark';
    // }
    return 'default'
  })

  useEffect(() => {
    const root = document.documentElement // Apply class to <html>

    // Pehle saari possible theme classes remove karein
    root.classList.remove(
      'theme-default',
      'dark',
      'theme-protanopia',
      'theme-deuteranopia',
      'theme-tritanopia',
      'theme-high-contrast',
    )

    // Current theme class add karein
    if (theme === 'dark') {
      root.classList.add('dark') // For existing Tailwind dark mode
    } else if (theme === 'default') {
      root.classList.add('theme-default') // Explicit default for clarity
    } else {
      root.classList.add(`theme-${theme}`) // For other color-blind themes
    }

    localStorage.setItem('appTheme', theme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

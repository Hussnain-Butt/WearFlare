// Client/src/components/ThemeSwitcher.tsx
import React from 'react'
import { useTheme, Theme } from '../context/ThemeContext' // Path adjust karein agar zaroorat ho
import { Sun, Moon, Contrast, Eye } from 'lucide-react' // Example icons

// Optional: Mapping themes to icons and more descriptive names
const themeOptionsConfig: { value: Theme; label: string; icon?: React.ElementType }[] = [
  { value: 'default', label: 'Default (Light)', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'protanopia', label: 'Protanopia', icon: Eye }, // Using Eye for general color blindness
  { value: 'deuteranopia', label: 'Deuteranopia', icon: Eye },
  { value: 'tritanopia', label: 'Tritanopia', icon: Eye },
  { value: 'high-contrast', label: 'High Contrast', icon: Contrast },
]

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as Theme)
  }

  // Find the current theme's icon, if configured
  const CurrentThemeIcon = themeOptionsConfig.find((opt) => opt.value === theme)?.icon

  return (
    <div
      className="
        fixed bottom-5 right-5 z-50 
        p-3 bg-card text-card-foreground 
        border border-border 
        rounded-lg shadow-lg 
        flex items-center space-x-2
        transition-all duration-300 ease-in-out
        hover:shadow-xl
      "
      // Removed inline styles, using Tailwind classes
    >
      {CurrentThemeIcon && <CurrentThemeIcon className="w-5 h-5 text-muted-foreground" />}{' '}
      {/* Show current theme icon */}
      <label htmlFor="theme-select" className="text-sm font-medium text-muted-foreground sr-only">
        {' '}
        {/* sr-only for accessibility, visually hidden */}
        Theme:
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={handleThemeChange}
        className="
          bg-input text-foreground 
          border border-border rounded-md 
          text-sm font-medium
          py-1.5 pl-2 pr-7  /* Adjusted padding for better look with arrow */
          focus:ring-2 focus:ring-ring focus:border-primary 
          appearance-none /* Remove default OS arrow */
          cursor-pointer
          transition-colors duration-200
        "
        // Removed inline styles, using Tailwind classes
        // Style for the select arrow using background SVG (Tailwind doesn't do this by default easily for <select>)
        // You might need to add this style directly or use a custom select component for full control
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='hsl(var(--muted-foreground))' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.25em 1.25em',
        }}
      >
        {themeOptionsConfig.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ThemeSwitcher

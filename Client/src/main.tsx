// Client/src/main.tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css' // Global styles (ab theme variables ke saath)
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext' // Import ThemeProvider

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <ThemeProvider>
      {' '}
      {/* ThemeProvider ko sabse bahar ya AuthProvider ke andar/bahar rakh sakte hain */}
      <AuthProvider>
        <CartProvider>
          <App />
          {/* Aap ThemeSwitcher ko App.tsx mein ya kisi layout component mein add karenge */}
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

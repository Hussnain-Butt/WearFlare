// src/context/CartContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { toast } from 'react-hot-toast' // Import toast if you want add-to-cart confirmation

// Interface for a single item in the cart
interface CartItem {
  _id: string
  title: string
  price: number // Use number for calculations
  image: string
  quantity: number
  selectedSize: string | null // Include selected attributes
  selectedColor?: string | null
}

// Interface for the Cart Context state and functions
interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void // Keep original signature for adding
  removeFromCart: (itemId: string, size: string | null, color?: string | null) => void
  updateQuantity: (
    itemId: string,
    quantity: number,
    size: string | null,
    color?: string | null,
  ) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  lastVisitedUrl: string // *** NEW: URL to return to ***
}

// Local storage key constants
const CART_STORAGE_KEY = 'wearflare_cart'
const LAST_VISITED_URL_KEY = 'wearflare_last_visited_url'
const DEFAULT_SHOP_URL = '/shop' // Fallback URL

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart Provider Component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- State Initialization ---
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const localData = localStorage.getItem(CART_STORAGE_KEY)
      return localData ? JSON.parse(localData) : []
    } catch (error) {
      console.error('Error reading cart from local storage', error)
      return []
    }
  })

  // *** NEW: State for last visited URL ***
  const [lastVisitedUrl, setLastVisitedUrl] = useState<string>(() => {
    try {
      const localUrl = localStorage.getItem(LAST_VISITED_URL_KEY)
      return localUrl || DEFAULT_SHOP_URL // Default to shop page if not found
    } catch (error) {
      console.error('Error reading last visited URL from local storage', error)
      return DEFAULT_SHOP_URL
    }
  })
  // --- End State Initialization ---

  // --- Effects ---
  // Persist cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (error) {
      console.error('Error saving cart to local storage', error)
    }
  }, [cart])

  // *** NEW: Persist last visited URL to local storage ***
  useEffect(() => {
    try {
      // Only save if it's a valid-looking path (starts with /)
      if (lastVisitedUrl && lastVisitedUrl.startsWith('/')) {
        localStorage.setItem(LAST_VISITED_URL_KEY, lastVisitedUrl)
      }
    } catch (error) {
      console.error('Error saving last visited URL to local storage', error)
    }
  }, [lastVisitedUrl])
  // --- End Effects ---

  // --- Cart Calculations ---
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // --- Cart Functions ---

  // *** UPDATED: Add item to cart AND store current URL ***
  const addToCart = (itemToAdd: CartItem) => {
    // Capture the current page's pathname *before* updating the cart
    // Exclude cart and checkout pages themselves
    const currentPath = window.location.pathname
    if (!['/cart', '/checkout'].includes(currentPath) && currentPath.startsWith('/')) {
      setLastVisitedUrl(currentPath) // Update the state
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item._id === itemToAdd._id &&
          item.selectedSize === itemToAdd.selectedSize &&
          item.selectedColor === itemToAdd.selectedColor,
      )

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += itemToAdd.quantity
        return updatedCart
      } else {
        // Add new item
        return [...prevCart, { ...itemToAdd }]
      }
    })
    // Optional: Show confirmation toast
    // toast.success(`${itemToAdd.title} added to cart!`);
  }

  // Remove item (signature updated if needed for uniqueness)
  const removeFromCart = (itemId: string, size: string | null, color?: string | null) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item._id === itemId && item.selectedSize === size && item.selectedColor === color),
      ),
    )
  }

  // Update quantity (signature updated if needed for uniqueness)
  const updateQuantity = (
    itemId: string,
    quantity: number,
    size: string | null,
    color?: string | null,
  ) => {
    const newQuantity = Math.max(1, quantity) // Ensure quantity is at least 1
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === itemId && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    )
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
    // Don't clear lastVisitedUrl here
    toast.success('Cart cleared!')
  }
  // --- End Cart Functions ---

  // Value provided by the context
  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    lastVisitedUrl, // *** Expose the URL ***
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

// Custom hook to use the Cart Context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

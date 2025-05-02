// src/context/CartContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
// Removed useLocation import as it's not strictly needed here anymore for this feature
import { toast } from 'react-hot-toast'

// Interface for a single item in the cart (Keep as is)
interface CartItem {
  _id: string
  title: string
  price: number
  image: string
  quantity: number
  selectedSize: string | null
  selectedColor?: string | null
}

// Interface for the Cart Context state and functions
interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
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

  // --- STATE FOR RETURNING TO PRODUCT ROW & CATEGORY ---
  lastProductListUrl: string | null // URL of the listing page (e.g., /men, /women)
  lastViewedProductId: string | null // ID of the product whose details were viewed
  lastSelectedCategory: string | null // *** NEW: Category filter active on listing page ***
  setLastProductOrigin: (url: string, productId: string, category: string) => void // *** Updated function signature ***
}

// Local storage key constants (Keep as is)
const CART_STORAGE_KEY = 'wearflare_cart_v2'
const DEFAULT_SHOP_URL = '/shop'

// Create the context (Keep as is)
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart Provider Component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- State Initialization ---
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const localData = localStorage.getItem(CART_STORAGE_KEY)
      return localData ? JSON.parse(localData) : []
    } catch (error) {
      console.error('Error reading cart from local storage:', error)
      localStorage.removeItem(CART_STORAGE_KEY)
      return []
    }
  })

  // --- State for tracking the specific product origin ---
  const [lastProductListUrl, setLastProductListUrlState] = useState<string | null>(null)
  const [lastViewedProductId, setLastViewedProductIdState] = useState<string | null>(null)
  const [lastSelectedCategory, setLastSelectedCategoryState] = useState<string | null>(null) // *** NEW STATE ***

  // --- Effects ---
  // Persist cart to local storage (Keep as is)
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (error) {
      console.error('Error saving cart to local storage:', error)
    }
  }, [cart])

  // --- Cart Calculations (Keep as is) ---
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // --- Cart Functions ---

  // --- UPDATED: Function to explicitly set the product origin including category ---
  const setLastProductOrigin = (url: string, productId: string, category: string) => {
    if (url && url.startsWith('/') && productId && category) {
      setLastProductListUrlState(url)
      setLastViewedProductIdState(productId)
      setLastSelectedCategoryState(category) // *** Store category ***
      console.log(
        `🛒 Set last product origin: URL=${url}, ProductID=${productId}, Category=${category}`,
      )
    } else {
      console.warn('🛒 Attempted to set invalid product origin:', { url, productId, category })
    }
  }

  // --- Other Cart Functions (addToCart, removeFromCart, updateQuantity, clearCart) ---
  // Keep these functions as they were in the previous correct version
  const addToCart = (itemToAdd: CartItem) => {
    /* ... (no changes needed here) ... */
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item._id === itemToAdd._id &&
          item.selectedSize === itemToAdd.selectedSize &&
          item.selectedColor === itemToAdd.selectedColor,
      )
      let updatedCart
      if (existingItemIndex > -1) {
        updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += itemToAdd.quantity
      } else {
        updatedCart = [...prevCart, { ...itemToAdd }]
      }
      return updatedCart
    })
    toast.success(`${itemToAdd.title} added to cart!`)
  }

  const removeFromCart = (itemId: string, size: string | null, color?: string | null) => {
    /* ... (no changes needed here) ... */
    setCart((prevCart) => {
      const itemToRemove = prevCart.find(
        (item) => item._id === itemId && item.selectedSize === size && item.selectedColor === color,
      )
      if (itemToRemove) {
        toast.error(`${itemToRemove.title} removed from cart.`)
      }
      return prevCart.filter(
        (item) =>
          !(item._id === itemId && item.selectedSize === size && item.selectedColor === color),
      )
    })
  }

  const updateQuantity = (
    itemId: string,
    quantity: number,
    size: string | null,
    color?: string | null,
  ) => {
    /* ... (no changes needed here) ... */
    const newQuantity = Math.max(1, quantity)
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item._id === itemId && item.selectedSize === size && item.selectedColor === color) {
          return { ...item, quantity: newQuantity }
        }
        return item
      }),
    )
  }

  const clearCart = () => {
    /* ... (no changes needed here) ... */
    setCart([])
    // Optional: Reset origin state when clearing cart?
    // setLastProductListUrlState(null);
    // setLastViewedProductIdState(null);
    // setLastSelectedCategoryState(null);
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
    // --- Provide the specific origin state and setter ---
    lastProductListUrl,
    lastViewedProductId,
    lastSelectedCategory, // *** Provide category ***
    setLastProductOrigin, // *** Provide updated setter ***
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

// Custom hook to use the Cart Context (Keep as is)
export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

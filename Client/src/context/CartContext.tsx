// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react'

// Interface for the product structure as received from the backend/Men.tsx
interface ProductFromBackend {
  _id: string // Use _id from MongoDB
  title: string
  price: string // Keep as string if backend sends it this way
  image: string
  // Add other potential fields if needed by the cart context itself
  category?: string
  gender?: string
}

// Interface for items specifically within the cart, extending ProductFromBackend
export interface CartItem extends ProductFromBackend {
  // Export CartItem interface
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: ProductFromBackend) => void // Expects product with _id
  removeFromCart: (id: string) => void // Expects the _id string
  updateQuantity: (id: string, quantity: number) => void // Added for better control
  clearCart: () => void // Added utility
  totalItems: number
  totalPrice: number
  // Helper to check if an item is in the cart
  isInCart: (id: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Helper function to load cart from local storage
const loadCartFromLocalStorage = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem('shoppingCart')
    return storedCart ? JSON.parse(storedCart) : []
  } catch (error) {
    console.error('Error loading cart from local storage:', error)
    return []
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize cart state from local storage
  const [cart, setCart] = useState<CartItem[]>(loadCartFromLocalStorage)

  // Effect to save cart to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('shoppingCart', JSON.stringify(cart))
    } catch (error) {
      console.error('Error saving cart to local storage:', error)
    }
  }, [cart])

  const addToCart = (product: ProductFromBackend) => {
    setCart((prevCart) => {
      // Find item using the correct property: _id
      const existingItem = prevCart.find((item) => item._id === product._id)

      if (existingItem) {
        // If exists, map and update quantity for the item with matching _id
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        // If new, add the product with quantity 1
        // Ensure only necessary properties are added to the cart item if needed
        const newCartItem: CartItem = {
          _id: product._id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
          category: product.category, // Include category/gender if needed later
          gender: product.gender,
        }
        return [...prevCart, newCartItem]
      }
    })
  }

  // removeFromCart now completely removes an item line regardless of quantity
  const removeFromCart = (id: string) => {
    setCart(
      (prevCart) => prevCart.filter((item) => item._id !== id), // Filter out by _id
    )
    console.log(`Attempting to remove item with _id: ${id}`) // Add console log
  }

  // Function to update quantity (can be used for increment, decrement, direct set)
  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        // If quantity is 0 or less, remove the item
        return prevCart.filter((item) => item._id !== id)
      } else {
        // Otherwise, update the quantity
        return prevCart.map((item) => (item._id === id ? { ...item, quantity: quantity } : item))
      }
    })
  }

  // Function to clear the entire cart
  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Improved price parsing robustness (handles potential non-numeric values)
  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0
    // Remove currency symbols, commas, letters (like Rs, PKR), and whitespace
    const numericString = String(priceStr).replace(/[^0-9.]/g, '') // Ensure it's a string first
    const parsed = parseFloat(numericString)
    return isNaN(parsed) ? 0 : parsed // Return 0 if parsing fails
  }

  const totalPrice = cart.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0)

  // Helper function to check if an item is in the cart
  const isInCart = (id: string): boolean => {
    return cart.some((item) => item._id === id)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

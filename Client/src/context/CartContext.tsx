// src/context/CartContext.tsx
// Keep the complete code from the previous correct answer.
// The validation check inside addToCart is correct, it just wasn't receiving
// the 'availableStock' property from the calling component.

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { toast } from 'react-hot-toast' // Using react-hot-toast for notifications

// Interface for a single item in the cart - Includes availableStock
interface CartItem {
  _id: string
  title: string
  price: number // Keep as number for calculations
  image: string
  quantity: number
  selectedSize: string | null
  selectedColor?: string | null
  availableStock: number // **** Stores the stock quantity for the selectedSize ****
}

// Interface for the Cart Context state and functions
interface CartContextType {
  cart: CartItem[]
  addToCart: (itemToAdd: CartItem) => void // Expects the full CartItem including availableStock
  removeFromCart: (itemId: string, size: string | null, color?: string | null) => void
  updateQuantity: (
    itemId: string,
    quantity: number, // The desired new quantity
    size: string | null,
    color?: string | null,
  ) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  lastProductListUrl: string | null
  lastViewedProductId: string | null
  lastSelectedCategory: string | null
  setLastProductOrigin: (
    url: string | null,
    productId: string | null,
    category: string | null,
  ) => void // Allow nulls
}

// Local storage key constants
const CART_STORAGE_KEY = 'wearflare_cart_v3' // Updated key if structure changes significantly

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart Provider Component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- State Initialization ---
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const localData = localStorage.getItem(CART_STORAGE_KEY)
      if (localData) {
        const parsedData = JSON.parse(localData)
        if (Array.isArray(parsedData)) {
          return parsedData
        }
      }
      return []
    } catch (error) {
      console.error('Error reading cart from local storage:', error)
      localStorage.removeItem(CART_STORAGE_KEY)
      return []
    }
  })

  // State for tracking the specific product origin
  const [lastProductListUrl, setLastProductListUrlState] = useState<string | null>(null)
  const [lastViewedProductId, setLastViewedProductIdState] = useState<string | null>(null)
  const [lastSelectedCategory, setLastSelectedCategoryState] = useState<string | null>(null)

  // --- Effects ---
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (error) {
      console.error('Error saving cart to local storage:', error)
    }
  }, [cart])

  // --- Cart Calculations ---
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // --- Cart Functions ---
  const setLastProductOrigin = (
    url: string | null,
    productId: string | null,
    category: string | null,
  ) => {
    if (url === null || (typeof url === 'string' && url.startsWith('/'))) {
      setLastProductListUrlState(url)
    } else {
      console.warn('🛒 Invalid URL provided to setLastProductOrigin:', url)
    }
    setLastViewedProductIdState(productId)
    setLastSelectedCategoryState(category)
  }

  const addToCart = (itemToAdd: CartItem) => {
    // *** This validation is CORRECT, the error happened because itemToAdd was missing availableStock ***
    if (
      !itemToAdd ||
      !itemToAdd._id ||
      itemToAdd.quantity <= 0 ||
      itemToAdd.availableStock === undefined ||
      itemToAdd.availableStock < 0
    ) {
      console.error('Invalid item passed to addToCart:', itemToAdd) // Log the invalid item
      toast.error('Could not add item to cart (Invalid data).')
      return // Stop execution if item data is invalid
    }

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
        const existingItem = updatedCart[existingItemIndex]
        const potentialNewQuantity = existingItem.quantity + itemToAdd.quantity
        const newQuantity = Math.min(potentialNewQuantity, existingItem.availableStock) // Clamp to stock

        if (potentialNewQuantity > existingItem.availableStock) {
          toast.error(
            `Only ${existingItem.availableStock - existingItem.quantity} more available for ${
              existingItem.title
            } (Size: ${existingItem.selectedSize || 'N/A'}). Quantity adjusted.`,
            { duration: 4000 },
          )
        } else if (newQuantity > existingItem.quantity) {
          toast.success(`${itemToAdd.quantity} x ${itemToAdd.title} added/updated in cart!`)
        }

        updatedCart[existingItemIndex] = { ...existingItem, quantity: newQuantity }
      } else {
        const initialQuantity = Math.min(itemToAdd.quantity, itemToAdd.availableStock) // Clamp initial add

        if (itemToAdd.quantity > itemToAdd.availableStock) {
          toast.error(
            `Only ${itemToAdd.availableStock} available for ${itemToAdd.title} (Size: ${
              itemToAdd.selectedSize || 'N/A'
            }). Added ${initialQuantity} to cart.`,
            { duration: 4000 },
          )
        } else {
          toast.success(`${initialQuantity} x ${itemToAdd.title} added to cart!`)
        }
        updatedCart = [...prevCart, { ...itemToAdd, quantity: initialQuantity }]
      }
      return updatedCart
    })
  }

  const removeFromCart = (itemId: string, size: string | null, color?: string | null) => {
    let itemRemovedTitle = 'Item'
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => {
        const match =
          item._id === itemId && item.selectedSize === size && item.selectedColor === color
        if (match) {
          itemRemovedTitle = item.title
        }
        return !match
      })
      if (newCart.length < prevCart.length) {
        toast.error(`${itemRemovedTitle} removed from cart.`)
      }
      return newCart
    })
  }

  const updateQuantity = (
    itemId: string,
    newQuantity: number,
    size: string | null,
    color?: string | null,
  ) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item._id === itemId && item.selectedSize === size && item.selectedColor === color) {
          const validatedQuantity = Math.max(1, newQuantity) // Min quantity is 1

          if (validatedQuantity > item.availableStock) {
            toast.error(
              `Max stock (${item.availableStock}) reached for ${item.title} (Size: ${
                size || 'N/A'
              }).`,
              { id: `stock-limit-${itemId}-${size}` },
            )
            return { ...item, quantity: item.availableStock } // Clamp to max stock
          } else {
            return { ...item, quantity: validatedQuantity } // Update to valid quantity
          }
        }
        return item
      }),
    )
  }

  const clearCart = () => {
    if (cart.length > 0) {
      setCart([])
      toast.success('Cart cleared!')
    }
  }

  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    lastProductListUrl,
    lastViewedProductId,
    lastSelectedCategory,
    setLastProductOrigin,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

import React from "react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, totalItems, totalPrice } = useCart();

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-4">Your Cart</h2>
      <p className="text-lg font-medium">Total Items: {totalItems}</p>
      <p className="text-lg font-medium">Total Price: PKR {totalPrice.toFixed(2)}</p>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center border p-4">
              <img src={item.image} alt={item.title} className="w-24 h-24 object-cover mr-4" />
              <div>
                <p className="font-medium">{item.title}</p>
                <p>Price: {item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <button
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;

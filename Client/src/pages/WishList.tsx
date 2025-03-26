import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([
    { id: 1, name: "Elegant Dress", price: "$120", image: "/images/dress.jpg" },
    { id: 2, name: "Stylish Shoes", price: "$85", image: "/images/shoes.jpg" },
  ]);

  const removeItem = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">
        My Wishlist <Heart color="red" />
      </h2>
      <AnimatePresence>
        {wishlist.length > 0 ? (
          wishlist.map((item) => (
            <motion.div
              key={item.id}
              className="wishlist-item"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <img src={item.image} alt={item.name} className="wishlist-image" />
              <div className="wishlist-info">
                <h4>{item.name}</h4>
                <p>{item.price}</p>
              </div>
              <motion.button
                className="remove-btn"
                onClick={() => removeItem(item.id)}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 color="red" />
              </motion.button>
            </motion.div>
          ))
        ) : (
          <p className="empty-message">Your wishlist is empty.</p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wishlist;

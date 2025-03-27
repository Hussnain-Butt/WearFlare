// src/pages/Men.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import kurta1 from "/kurta1.png";
import kurta2 from "/kurta2.png";
import kurta3 from "/kurta3.png";
import kurta4 from "/kurta4.png";
import kameez1 from "/kameez1.png"
import kameez2 from "/kameez2.png"
import kameez3 from "/kameez3.png"
import kameez4 from "/kameez 4.png"
import wedding1 from "/wedding1.png"
import wedding2 from "/wedding2.png"
import wedding3 from "/wedding3.png"
import wedding4 from "/weding4.png"
import shirt1 from "/shirt1.png"
import shirt2 from "/shirt2.png"
import shirt3 from "/shirt3.png"
import shirt4 from "/shirt4.png"
import MensComponents from "@/components/MensComponents";
import NewsLetter from "@/components/NewsLetter";

interface Product {
  id: number;
  title: string;
  price: string;
  category: string;
  image: string;
}


export const menProducts = [
  // Kurta
  { id: 1, title: "BLACK BLENDED KURTA", price: "PKR 3,592.00", category: "Kurta", image: kurta1},
  { id: 2, title: "GRAY BLENDED FORMAL KURTA", price: "PKR 18,990.00", category: "Kurta", image: kurta2},
  { id: 3, title: "NAVY BLUE COTTON KURTA", price: "PKR 3,192.00", category: "Kurta", image: kurta3 },
  { id: 4, title: "WHITE EMBROIDERED KURTA", price: "PKR 5,200.00", category: "Kurta", image: kurta4   },

  // Shalwar Kameez
  { id: 5, title: "CLASSIC SHALWAR KAMEEZ", price: "PKR 4,500.00", category: "Shalwar Kameez", image: kameez1 },
  { id: 6, title: "ELEGANT WHITE SHALWAR KAMEEZ", price: "PKR 6,800.00", category: "Shalwar Kameez", image: kameez2},
  { id: 7, title: "BROWN COTTON SHALWAR KAMEEZ", price: "PKR 3,900.00", category: "Shalwar Kameez", image:kameez3  },
  { id: 8, title: "FORMAL BLACK SHALWAR KAMEEZ", price: "PKR 7,500.00", category: "Shalwar Kameez", image: kameez4},

  // Wedding
  { id: 9, title: "ELEGANT WEDDING ATTIRE", price: "PKR 25,000.00", category: "Wedding", image: wedding1 },
  { id: 10, title: "ROYAL BLUE WEDDING SHERWANI", price: "PKR 35,000.00", category: "Wedding", image: wedding2 },
  { id: 11, title: "GOLDEN EMBROIDERED WEDDING SHERWANI", price: "PKR 40,000.00", category: "Wedding", image:wedding3 },
  { id: 12, title: "TRADITIONAL MAROON WEDDING SUIT", price: "PKR 30,000.00", category: "Wedding", image: wedding4 },

  // Sweatshirt
  { id: 13, title: "COMFY SWEATSHIRT", price: "PKR 2,999.00", category: "Sweatshirt", image:shirt1  },
  { id: 14, title: "STYLISH HOODED SWEATSHIRT", price: "PKR 4,200.00", category: "Sweatshirt", image:shirt2 },
  { id: 15, title: "CASUAL GREY SWEATSHIRT", price: "PKR 3,800.00", category: "Sweatshirt", image:shirt3 },
  { id: 16, title: "OVERSIZED BLACK SWEATSHIRT", price: "PKR 5,000.00", category: "Sweatshirt", image: shirt4}
];

const categories = ["All", "Shalwar Kameez", "Sweatshirt", "Wedding", "Kurta"];

const Men: React.FC = () => {
  
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { addToCart, totalItems } = useCart();


  const filteredProducts =
    selectedCategory === "All"
      ? menProducts
      : menProducts.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#eee8e3]">
     <div className="w-full py-3 px-8 bg-[#e5dfd8] flex justify-between">
        <div className="flex justify-between">
          <Link to="/" className="text-sm text-gray-700">HOME</Link>
          <ChevronRight className="h-5" />
          <Link to="/men" className="text-sm text-gray-700">MEN</Link>
        </div>
        <Link to="/cart" className="relative">
          🛒 Cart ({totalItems})
        </Link>
       
      </div>

      <section className="w-full py-10 px-6 md:px-12 bg-[#D3C5B8] mt-10 my-32">
        <h2 className="text-4xl font-medium text-center mb-8 text-[#725D45]">Men's Western</h2>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center mb-6 gap-3">
  {categories.map((category) => (
    <button 
      key={category} 
      className={`px-4 py-2 rounded-full transition-all duration-300 ${
        selectedCategory === category 
          ? "bg-[#6b5745] text-white" 
          : "bg-white text-black hover:bg-[#6b5745] hover:text-white"
      }`} 
      onClick={() => setSelectedCategory(category)}
    >
      {category}
    </button>
  ))}
</div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="flex flex-col items-center">
              <div className="bg-white p-4 w-full">
                <img src={product.image} alt={product.title} className="w-full object-cover" />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-800 font-medium">{product.title}</p>
                <p className="text-sm font-medium mt-1">{product.price}</p>
                <button
                  className="mt-2 px-4 py-2 bg-[#6b5745] text-white rounded-full hover:bg-[#5d4c3b]"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart 🛒
                </button>
                <button className="mt-2 ml-2 px-4 py-2 bg-[#8B4513] text-white rounded-full hover:bg-[#70421e]">Try Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>
       <MensComponents/>
       <NewsLetter/>

    </div>
  );
};

export default Men;



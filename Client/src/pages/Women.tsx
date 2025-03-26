// src/pages/Men.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import sweater1 from "../../public/women/sweater/ws24401a_off-white_2.webp";
import sweater2 from "../../public/women/sweater/ws24407_black_5.webp";
import sweater3 from "../../public/women/sweater/ws24409_black_8.jpg";
import sweater4 from "../../public/women/sweater/ws24410_charcoal_6.webp";
import hoodie1 from "../../public/women/hoodie/wct246018x_multi_7.webp"
import hoodie2 from "../../public/women/hoodie/wct246019y_multi_7.webp"
import hoodie3 from "../../public/women/hoodie/wct246020y_multi_2.webp"
import hoodie4 from "../../public/women/hoodie/wct246023y_multi_1.webp"
import hoodie5 from "../../public/women/hoodie/wct246024x_multi_7.webp"
import hoodie6 from "../../public/women/hoodie/ws24402_black_7.webp"
import pants1 from "../../public/women/pants/5ASWD340-BLU_1.webp"
import pants2 from "../../public/women/pants/5ASWP326-KHK_1.webp"
import pants3 from "../../public/women/pants/F0098208404_3.webp"
import pants4 from "../../public/women/pants/F0171209625_1.webp"
import pants5 from "../../public/women/pants/F0178208720_2.webp"
import pants6 from "../../public/women/pants/F0202209625_1.webp"
import pants7 from "../../public/women/pants/F0216209630_1.webp"
import pants8 from "../../public/women/pants/F0241208001.webp"
import pants9 from "../../public/women/pants/F0253208908_2_copy.webp"
import pants10 from "../../public/women/pants/F0255208801_3.webp"
import pants11 from "../../public/women/pants/F0297209903_1.jpg"
import pants12 from "../../public/women/pants/F0309209625_3.webp"
import pants13 from "../../public/women/pants/F0375209628_2_copy.webp"
import pants14 from "../../public/women/pants/F0379209628_2_copy.webp"
import pants15 from "../../public/women/pants/F0533108901_2_copy_2048x2048.webp"

import shirt1 from "../../public/women/shirt/Dazy-Less Solid Drop Shoulder Tee.jpg"
import shirt2 from "../../public/women/shirt/F0098208404_lowersM_1.webp"
import shirt3 from "../../public/women/shirt/F0242208002LOWER_1.webp"
import shirt4 from "../../public/women/shirt/F0374209620_2.webp"
import shirt5 from "../../public/women/shirt/Lookbook  _ Lana Official _ Casual Wear 22 Collect.jpg"
import shirt6 from "../../public/women/shirt/wc24409a_multi_2.jpg"
import shirt7 from "../../public/women/shirt/wc24409b_multi_1.webp"
import shirt8 from "../../public/women/shirt/wc24414_multi_1.jpg"
import shirt9 from "../../public/women/shirt/wcb24210_multi_5.webp"
import shirt10 from "../../public/women/shirt/wcb24211_multi_7.jpg"
import shirt11 from "../../public/women/shirt/wsct24208y_multi_6.jpg"
import shirt12 from "../../public/women/shirt/wsct24224x_multi_6.jpg"
import shirt13 from "../../public/women/shirt/wsct24226x_black_2.webp"
import shirt14 from "../../public/women/shirt/wsct24231x_multi_7.webp"
import shirt15 from "../../public/women/shirt/wsct24233by_multi_1.webp"

import sweatshirt1 from "../../public/women/sweatshirts/wcb246013y_multi_2.webp"
import sweatshirt2 from "../../public/women/sweatshirts/wco246012x_multi_7.jpg"
import sweatshirt3 from "../../public/women/sweatshirts/wco246014y_multi_6.webp"
import sweatshirt4 from "../../public/women/sweatshirts/wct246011x_multi_1.webp"
import sweatshirt5 from "../../public/women/sweatshirts/wct246011y_multi_1.webp"
import sweatshirt6 from "../../public/women/sweatshirts/wct246015x_multi_7.webp"
import sweatshirt7 from "../../public/women/sweatshirts/wct246021x_multi_1.webp"
import sweatshirt8 from "../../public/women/sweatshirts/wct246022y_multi_7.webp"
import women_banner from "/women_banner.png"
import NewsLetter from "@/components/NewsLetter";
import Features from "@/components/Features";
import WomensComponents from "@/components/WomensComponent";

interface Product {
  id: number;
  title: string;
  price: string;
  category: string;
  image: string;
}


export const womenProducts = [
  // Hoodies
  { id: 1, title: "CASUAL PINK HOODIE", price: "PKR 4,500.00", category: "Hoodie", image: hoodie1 },
  { id: 2, title: "OVERSIZED BLACK HOODIE", price: "PKR 5,800.00", category: "Hoodie", image: hoodie2 },
  { id: 3, title: "TRENDY CROP HOODIE", price: "PKR 4,200.00", category: "Hoodie", image: hoodie3 },
  { id: 4, title: "GRAPHIC PRINT HOODIE", price: "PKR 6,000.00", category: "Hoodie", image: hoodie4 },
  { id: 5, title: "ZIP-UP GREY HOODIE", price: "PKR 5,000.00", category: "Hoodie", image: hoodie5 },
  { id: 6, title: "SPORTS STYLE HOODIE", price: "PKR 4,800.00", category: "Hoodie", image: hoodie6 },

  // Pants
  { id: 7, title: "SKINNY FIT JEANS", price: "PKR 3,800.00", category: "Pants", image: pants1 },
  { id: 8, title: "STRAIGHT LEG COTTON PANTS", price: "PKR 3,500.00", category: "Pants", image: pants2 },
  { id: 9, title: "HIGH-WAISTED CARGO PANTS", price: "PKR 4,200.00", category: "Pants", image: pants3 },
  { id: 10, title: "WIDE-LEG TROUSERS", price: "PKR 4,000.00", category: "Pants", image: pants4 },
  { id: 11, title: "JOGGER STYLE PANTS", price: "PKR 3,900.00", category: "Pants", image: pants5 },
  { id: 12, title: "FORMAL SLIM PANTS", price: "PKR 4,500.00", category: "Pants", image: pants6 },
  { id: 13, title: "DENIM FLARED PANTS", price: "PKR 4,800.00", category: "Pants", image: pants7 },
  { id: 14, title: "TAPERED LEG PANTS", price: "PKR 3,600.00", category: "Pants", image: pants8 },
  { id: 15, title: "BASIC BLACK LEGGINGS", price: "PKR 2,800.00", category: "Pants", image: pants9 },
  { id: 16, title: "CLASSIC CHINOS", price: "PKR 4,300.00", category: "Pants", image: pants10 },
  { id: 17, title: "BAGGY CARGO PANTS", price: "PKR 4,600.00", category: "Pants", image: pants11 },
  { id: 18, title: "PAPERBAG WAIST PANTS", price: "PKR 3,700.00", category: "Pants", image: pants12 },
  { id: 19, title: "COTTON LOUNGE PANTS", price: "PKR 3,200.00", category: "Pants", image: pants13 },
  { id: 20, title: "ANKLE-LENGTH PANTS", price: "PKR 4,100.00", category: "Pants", image: pants14 },
  { id: 21, title: "PLEATED WORK PANTS", price: "PKR 4,500.00", category: "Pants", image: pants15 },

  // Shirts
  { id: 22, title: "CLASSIC WHITE SHIRT", price: "PKR 3,200.00", category: "Shirt", image: shirt1 },
  { id: 23, title: "FLORAL PRINT BLOUSE", price: "PKR 3,800.00", category: "Shirt", image: shirt2 },
  { id: 24, title: "BUTTON-UP DENIM SHIRT", price: "PKR 4,000.00", category: "Shirt", image: shirt3 },
  { id: 25, title: "PUFF SLEEVE SHIRT", price: "PKR 3,600.00", category: "Shirt", image: shirt4 },
  { id: 26, title: "OVERSIZED COTTON SHIRT", price: "PKR 4,200.00", category: "Shirt", image: shirt5 },
  { id: 27, title: "LACE DETAIL BLOUSE", price: "PKR 4,500.00", category: "Shirt", image: shirt6 },
  { id: 28, title: "CHECKERED CASUAL SHIRT", price: "PKR 3,900.00", category: "Shirt", image: shirt7 },
  { id: 29, title: "SILK OFFICE SHIRT", price: "PKR 5,000.00", category: "Shirt", image: shirt8 },
  { id: 30, title: "CROP BUTTON-UP SHIRT", price: "PKR 3,500.00", category: "Shirt", image: shirt9 },
  { id: 31, title: "RUFFLE NECK BLOUSE", price: "PKR 4,700.00", category: "Shirt", image: shirt10 },
  { id: 32, title: "SLEEVELESS COLLAR SHIRT", price: "PKR 3,300.00", category: "Shirt", image: shirt11 },
  { id: 33, title: "PRINTED CHIFFON BLOUSE", price: "PKR 4,600.00", category: "Shirt", image: shirt12 },
  { id: 34, title: "SATIN PARTY WEAR SHIRT", price: "PKR 5,300.00", category: "Shirt", image: shirt13 },
  { id: 35, title: "TIE-FRONT CASUAL SHIRT", price: "PKR 3,700.00", category: "Shirt", image: shirt14 },
  { id: 36, title: "ELEGANT SHEER BLOUSE", price: "PKR 4,800.00", category: "Shirt", image: shirt15 },

  // Sweaters
  { id: 37, title: "WOOLEN TURTLENECK SWEATER", price: "PKR 5,500.00", category: "Sweater", image: sweater1 },
  { id: 38, title: "CHUNKY KNIT SWEATER", price: "PKR 6,200.00", category: "Sweater", image: sweater2 },
  { id: 39, title: "CABLE KNIT CARDIGAN", price: "PKR 5,800.00", category: "Sweater", image: sweater3 },
  { id: 40, title: "FLEECE WARM SWEATER", price: "PKR 5,300.00", category: "Sweater", image: sweater4 },

  // Sweatshirts
  { id: 41, title: "BASIC WHITE SWEATSHIRT", price: "PKR 3,500.00", category: "Sweatshirt", image: sweatshirt1 },
  { id: 42, title: "TRENDY OVERSIZED SWEATSHIRT", price: "PKR 4,000.00", category: "Sweatshirt", image: sweatshirt2 },
  { id: 43, title: "SPORTS CREWNECK SWEATSHIRT", price: "PKR 3,900.00", category: "Sweatshirt", image: sweatshirt3 },
  { id: 44, title: "GRAPHIC PRINT SWEATSHIRT", price: "PKR 4,300.00", category: "Sweatshirt", image: sweatshirt4 },
  { id: 45, title: "ZIP-UP PULLOVER SWEATSHIRT", price: "PKR 4,600.00", category: "Sweatshirt", image: sweatshirt5 },
  { id: 46, title: "VINTAGE STYLE SWEATSHIRT", price: "PKR 5,200.00", category: "Sweatshirt", image: sweatshirt6 },
  { id: 47, title: "NEUTRAL TONE SWEATSHIRT", price: "PKR 3,800.00", category: "Sweatshirt", image: sweatshirt7 },
  { id: 48, title: "BOLD COLOR SWEATSHIRT", price: "PKR 4,700.00", category: "Sweatshirt", image: sweatshirt8 }
];

const categories = ["All", "Hoodie", "Pants", "Shirt", "Sweater", "Sweatshirt"];


const Women: React.FC = () => {
  
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { addToCart, totalItems } = useCart();


  const filteredProducts =
    selectedCategory === "All"
      ? womenProducts
      : womenProducts.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#eee8e3]">
     <div className="w-full py-3 px-8 bg-[#e5dfd8] flex justify-between">
        <div className="flex justify-between">
          <Link to="/" className="text-sm text-gray-700">HOME</Link>
          <ChevronRight className="h-5" />
          <Link to="/women" className="text-sm text-gray-700">WOMEN</Link>
        </div>
        <Link to="/cart" className="relative">
          🛒 Cart ({totalItems})
        </Link>
       
      </div>

      <section className="w-full py-10 px-6 md:px-12 bg-[#D3C5B8] mt-10 my-32">
        <h2 className="text-4xl font-medium text-center mb-8 text-[#725D45]">Women's Western Collection</h2>

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
              <div className="bg-white  h-full p-4 w-full">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
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

      <div className="my-24">
      <img src={women_banner} alt="" />
      </div>
       <WomensComponents/>
       <Features/>
       <NewsLetter/>

    </div>
  );
};

export default Women;



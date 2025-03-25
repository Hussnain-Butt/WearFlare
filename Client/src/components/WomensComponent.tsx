import sweater1 from "../../public/women/sweater/ws24401a_off-white_2.webp";
import hoodie4 from "../../public/women/hoodie/wct246023y_multi_1.webp"
import pants7 from "../../public/women/pants/F0216209630_1.webp"
import shirt7 from "../../public/women/shirt/wc24409b_multi_1.webp"
import sweatshirt8 from "../../public/women/sweatshirts/wct246022y_multi_7.webp"

const WomensComponents = () => {
  return (
    <div>
        
{/* Main Grid Layout */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-[#e5dfd8] my-24">
        {/* Jackets image */}
        <div className="relative bg-[#c9c2b8] p-1">
          <img 
            src={sweater1} 
            alt="Man wearing jacket" 
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-5 right-5 text-left">
            <p className="text-black font-medium text-lg mb-1">Sweaters</p>
            
          </div>
        </div>
        
        {/* Shirt image */}
        <div className="relative bg-[#c9c2b8] p-1">
          <img 
            src={shirt7} 
            alt="Man wearing shirt" 
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-5 right-5 text-right">
            <p className="text-black font-medium text-lg mb-1">SHIRT</p>
            
          </div>
        </div>
        
        {/* Pants image */}
        <div className="relative bg-[#c9c2b8] p-1">
          <img 
            src={pants7}
            alt="Pants" 
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-5 right-5 text-left">
            <p className="text-black font-medium text-lg mb-1">Pants</p>
            
          </div>
        </div>
        
        {/* Sweatshirt image */}
        <div className="relative bg-[#c9c2b8] p-1">
          <img 
            src={sweatshirt8} 
            alt="Man wearing sweatshirt" 
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-5 right-5 text-right">
            <p className="text-black font-medium text-lg mb-1">SWEATSHIRT</p>
            
          </div>
        </div>
      </div>


    </div>
  )
}

export default WomensComponents
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import arrival_image from '../../public/new_arrival.png'
import tradtional_image from "../../public/tradtional_image.png"
import boys from "../../public/image-1.png"
import boy from "../../public/img1-virtual-fitting-room.png"
import boySection from "../../public/Group 47.png"
import boy1 from "../../public/img1-virtual-fitting-room.png";




const Men = () => {
  return (
    <div className="min-h-screen bg-[#eee8e3]">
 
      <div className="w-full py-3 px-8 bg-[#e5dfd8] flex ">
        <Link to={"/"} className="text-sm text-gray-700">HOME</Link>
        <ChevronRight className='h-5' />
        <Link to={"/men"} className="text-sm text-gray-700">MEN</Link>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-[#e5dfd8] my-24">
        {/* Jackets image */}
        <div className="relative bg-[#c9c2b8] p-1">
          <img 
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1287&auto=format&fit=crop" 
            alt="Man wearing jacket" 
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-5 right-5 text-left">
            <p className="text-black font-medium text-lg mb-1">Jackets</p>
            <p className="text-black text-xs font-medium">SHOP NOW</p>
          </div>
        </div>
        
        {/* Shirt image */}
        <div className="relative bg-[#c9c2b8] p-1">
          <img 
            src="https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1287&auto=format&fit=crop" 
            alt="Man wearing shirt" 
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-5 right-5 text-right">
            <p className="text-black font-medium text-lg mb-1">SHIRT</p>
            <p className="text-black text-xs font-medium">SHOP NOW</p>
          </div>
        </div>
        
        {/* Pants image */}
        <div className="relative bg-[#c9c2b8] p-1">
          <img 
            src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1287&auto=format&fit=crop" 
            alt="Pants" 
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-5 right-5 text-left">
            <p className="text-black font-medium text-lg mb-1">Pants</p>
            <p className="text-black text-xs font-medium">SHOP NOW</p>
          </div>
        </div>
        
        {/* Sweatshirt image */}
        <div className="relative bg-[#c9c2b8] p-1">
          <img 
            src="https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1287&auto=format&fit=crop" 
            alt="Man wearing sweatshirt" 
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-5 right-5 text-right">
            <p className="text-black font-medium text-lg mb-1">SWEATSHIRT</p>
            <p className="text-black text-xs font-medium">SHOP NOW</p>
          </div>
        </div>
      </div>


      {/* New Arrival Section */}
      <div className="my-24">
      <img src={arrival_image} alt="" />
      </div>


      <section className="w-full py-10 px-6 md:px-12 bg-[#D3C5B8] mt-10 my-32">
        <h2 className="text-4xl font-medium text-center mb-8 text-[#725D45]">Men's Traditional</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product 1 */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 w-full">
              <img 
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                alt="Black Banded Kurta"
                className="w-full object-cover"
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-800 font-medium">BLACK BLENDED KURTA</p>
              <p className="text-sm font-medium mt-1">PKR 3,592.00</p>
            </div>
          </div>
          
          {/* Product 2 */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 w-full h-full">
              <img 
                src={tradtional_image} 
                alt="Gray Blended Formal Kurta"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-800 font-medium">GRAY BLENDED FORMAL KURTA</p>
              <p className="text-sm font-medium mt-1">PKR 18,990.00</p>
            </div>
          </div>
          
          {/* Product 3 */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 w-full">
              <img 
                src="https://images.unsplash.com/photo-1516826957135-700dedea698c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                alt="Navy Blue Cotton Kurta"
                className="w-full object-cover"
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-800 font-medium">NAVY BLUE COTTON KURTA</p>
              <p className="text-sm font-medium mt-1">PKR 3,192.00</p>
            </div>
          </div>
        </div>
      </section>


    

      {/* Newsletter Subscription */}
      <div className="bg-[#d3cac0] p-12 text-center border-t border-b border-gray-500">
        <h3 className="text-[40px] font-serif text-[#3a3a3a] mb-2 text-2xl font-bold">BE THE FIRST</h3>
        <p className="text-[#3a3a3a] mb-6 max-w-xl mx-auto text-xl font-semibold  ">
          New arrivals. Exclusive previews. First access to sales. Sign up to stay in the know.
        </p>
        
        <div className=" flex-col flex md:flex-row justify-center gap-2 max-w-md mx-auto ">
          <div className="relative flex-1">
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-[#a68c76] border-0 text-white placeholder:text-white/70 h-12 rounded-full pl-6"
            />
          </div>

          <Button className="bg-[#6b5745] hover:bg-[#5d4c3b] text-white rounded-full px-6 h-12">
            SIGN UP
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Men;

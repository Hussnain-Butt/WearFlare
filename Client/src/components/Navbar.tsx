
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag } from 'lucide-react';

const Navbar = () => { 
  return (
    <nav className="flex justify-between text-white w-full items-center px-8 py-6 relative z-10">
      <div className="flex gap-8 items-center">
        <Link to="/" className="mr-4"> 
          <div className="flex bg-transparent border-[#B8860B] border-2 h-16 justify-center rounded-full w-16 items-center">
            <span className="text-[#B8860B] text-2xl font-bold font-serif">WF</span>
          </div>
        </Link>
        <Link to="/" className="font-bold">HOME</Link>
        <Link to="#" className="font-bold">MEN</Link>
        <Link to="#" className="font-bold t">WOMEN</Link>
        <Link to="/virtual-fitting-room-creation" className="font-bold">VIRTUAL FITTING ROOM CREATION</Link>
        <Link to="/virtual-fitting-room" className="font-bold">VIRTUAL FITTING ROOM</Link>
        <Link to="/3d-avatar-customization" className="font-bold">3D AVATAR CUSTOMIZATION</Link>
      </div>
      <div className="flex gap-6 items-center">
        <Link to="#"><Search className="h-6 w-6" /></Link>
        <Link to="#"><Heart className="h-6 w-6" /></Link>
        <Link to="#"><User className="h-6 w-6" /></Link>
        <Link to="#"><ShoppingBag className="h-6 w-6" /></Link>
      </div>
    </nav>
  );
};

export default Navbar;

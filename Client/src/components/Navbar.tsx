import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-10xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <div className="flex border-2 border-[#B8860B] h-12 w-12 rounded-full justify-center items-center">
              <span className="text-[#B8860B] text-2xl font-bold font-serif">WF</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 flex-grow justify-center">
            <Link to="/" className="font-bold hover:text-[#B8860B] capitalize">Home</Link>
            <Link to="/men" className="font-bold hover:text-[#B8860B] capitalize">Men</Link>
            <Link to="/women" className="font-bold hover:text-[#B8860B] capitalize">Women</Link>
            <Link to="/virtual-fitting-room-creation" className="font-bold hover:text-[#B8860B] capitalize">Virtual Fitting Room Creation</Link>
            <Link to="/virtual-fitting-room" className="font-bold hover:text-[#B8860B] capitalize">Virtual Fitting Room</Link>
          
            {/* Pages Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="font-bold flex items-center hover:text-[#B8860B] capitalize"
              >
                Pages <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {dropdownOpen && (
                <div className="absolute mt-2 w-40 bg-white shadow-md rounded-md z-50">
            <Link to="/3d-avatar-customization" className="block px-4 py-2 hover:bg-gray-100">3D Avatar Customization</Link>

                  <Link to="/account" className="block px-4 py-2 hover:bg-gray-100">My Account</Link>
                  <Link to="/wishlist" className="block px-4 py-2 hover:bg-gray-100">Wishlist</Link>
                </div>
              )}
            </div>
          </div>

          {/* Icons & Signup Button */}
          <div className="hidden md:flex gap-6 items-center flex-shrink-0">
            <Link to="/search">
              <Search className="h-6 w-6 hover:text-[#B8860B]" />
            </Link>
            <Link to="/cart">
              <ShoppingBag className="h-6 w-6 hover:text-[#B8860B]" />
            </Link>
            <Link to="/signup" className="bg-[#B8860B] text-white px-4 py-2 rounded-md hover:bg-[#996F0B] transition">
              Signup
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-8 pb-10 mt-10">
            <Link to="/" className="font-bold hover:text-[#B8860B] capitalize hover:bg-slate-200 w-full py-3 px-5 transition-all">Home</Link>
            <Link to="/men" className="font-bold hover:text-[#B8860B] capitalize hover:bg-slate-200 w-full py-3 px-5 transition-all">Men</Link>
            <Link to="/women" className="font-bold hover:text-[#B8860B] capitalize hover:bg-slate-200 w-full py-3 px-5 transition-all">Women</Link>
            <Link to="/virtual-fitting-room-creation" className="font-bold hover:text-[#B8860B] capitalize hover:bg-slate-200 w-full py-3 px-5 transition-all">Virtual Fitting Room Creation</Link>
            <Link to="/virtual-fitting-room" className="font-bold hover:text-[#B8860B] capitalize hover:bg-slate-200 w-full py-3 px-5 transition-all">Virtual Fitting Room</Link>
           

            {/* Pages Dropdown in Mobile Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="font-bold flex items-center justify-between w-full py-3 px-5 hover:bg-slate-200 transition-all"
              >
                Pages <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {dropdownOpen && (
                <div className="bg-white shadow-md rounded-md">
                   <Link to="/3d-avatar-customization" className="block px-4 py-2 hover:bg-gray-100">3D Avatar Customization</Link>
                  <Link to="/account" className="block px-4 py-2 hover:bg-gray-100">My Account</Link>
                  <Link to="/wishlist" className="block px-4 py-2 hover:bg-gray-100">Wishlist</Link>
                 
                </div>
              )}
            </div>

            {/* Mobile Icons & Signup */}
            <div className="flex gap-6 mt-4 px-5">
              <Link to="/search">
                <Search className="h-6 w-6 hover:text-[#B8860B]" />
              </Link>
              <Link to="/cart">
                <ShoppingBag className="h-6 w-6 hover:text-[#B8860B]" />
              </Link>
              <Link to="/signup" className="bg-[#B8860B] text-white px-4 py-2 rounded-md hover:bg-[#996F0B] transition w-full text-center">
                Signup
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

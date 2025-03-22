import { Heart, Search, ShoppingBag, User } from "lucide-react";
import FashionShowcase from "@/components/FashionShowcase";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* main navbar  */}
      <nav className="flex justify-between text-black w-full items-center px-8 py-6 relative z-10">
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

      {/* Navbar */}
      <nav className="flex justify-between items-center py-4 px-6 md:px-12">
        <div className="flex items-center gap-8">
          <img 
            src="/lovable-uploads/834c4203-b1ea-4cb0-8dbe-044cbc51ec0c.png" 
            alt="WearFlare Logo" 
            className="h-10" 
          />
          <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
            <li className="cursor-pointer hover:text-black">Home</li>
            <li className="cursor-pointer hover:text-black">Shop</li>
            <li className="cursor-pointer hover:text-black">About</li>
            <li className="cursor-pointer hover:text-black">Contact</li>
          </ul>
        </div>
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none" 
          />
          <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600">
            <Search className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full py-6 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-5xl font-medium text-[#333] tracking-tight mb-2">
              Find Your Style 
              <span className="text-[#C19A6B] font-medium ml-1">Here</span>
            </h1>
            <p className="text-gray-600 mb-4">
              Explore the latest fashion trends and express yourself through stylish outfits.
            </p>
            <button className="bg-[#C19A6B] text-white py-2 px-6 rounded-lg hover:bg-[#a77f57]">
              Shop Now
            </button>
          </div>
          <div>
            <img 
              src="/Brown Elegant Tender Aesthetic Spring Moodboard Photo Collage Desktop Wallpaper 1.png" 
              alt="Autumn Fashion" 
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Fashion Showcase */}
      <FashionShowcase />
    </div>
  );
};

export default Home;

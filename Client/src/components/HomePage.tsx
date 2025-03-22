import { Heart, Search, ShoppingBag, User } from "lucide-react";
import FashionShowcase from "@/components/FashionShowcase";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>

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

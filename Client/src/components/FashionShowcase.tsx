import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import girl from "../../public/image.png"
import boys from "../../public/image-1.png"
import boy from "../../public/img1-virtual-fitting-room.png"

const FashionShowcase: React.FC = () => {
  const circleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!circleRef.current) return;
      
      // Subtle movement of the circle based on mouse position
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Calculate distance from center (normalized)
      const moveX = (clientX - centerX) / centerX * 15;
      const moveY = (clientY - centerY) / centerY * 15;
      
      // Apply subtle transform to the circle
      circleRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-fashion-beige px-6">
      {/* Background circle */}
      <div 
        ref={circleRef}
        className="absolute w-[800px] h-[800px] border border-fashion-brown/20 rounded-full animate-rotate-slow"
      />
      
      <div className="absolute w-[600px] h-[600px] border border-fashion-brown/10 rounded-full" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left sidebar */}
          <div className="md:col-span-3 space-y-6 animate-slide-in">
            <div className="overflow-hidden rounded-sm">
              <img 
                src={boys} 
                alt="Brown outfit detail" 
                className="object-cover  w-full transition-transform duration-700 hover:scale-105"
              />
            </div>
            
            <div className="bg-white p-4 space-y-2">
              <div className="uppercase text-xs tracking-widest font-medium text-fashion-charcoal">Brown Coat</div>
              <div className="text-lg font-light">$49</div>
              <div className="flex flex-col gap-2">
                <button className="fashion-button">Quick View</button>
                <button className="fashion-button">Add to Cart</button>
              </div>
              <div className="pt-2">
                <button className="fashion-button border border-fashion-lightgray w-full">See More Collection</button>
              </div>
            </div>
          </div>
          
          {/* Center main content */}
          <div className="md:col-span-6 text-center flex flex-col items-center animate-fade-in">
            <h1 className="font-display uppercase text-5xl md:text-7xl font-light tracking-wider mb-6 leading-none">
              <div>Studio</div>
              <div className="font-semibold">Shodwe</div>
            </h1>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-fashion-beige/40 rounded-full"></div>
              <img 
                src={girl}
                alt="Model with coat" 
                className="rounded-full w-80 object-cover object-center"
              />
              <button className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-fashion-charcoal font-light text-xs uppercase tracking-widest py-2 px-6 rounded-full hover:bg-fashion-charcoal hover:text-white transition-all duration-300">
                New Collection
              </button>
            </div>
          </div>
          
          {/* Right sidebar */}
          <div className="md:col-span-3 flex flex-col gap-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="overflow-hidden rounded-sm">
              <img 
                src={boy}
                alt="Black outfit detail" 
                className="object-cover  w-full transition-transform duration-700 hover:scale-105"
              />
            </div>
            
            <div className="bg-white p-4">
              <div className="space-y-3">
                <p className="text-sm text-fashion-charcoal leading-relaxed">
                  Our latest clothing collection is special for autumn.
                </p>
                <button className="group flex items-center text-sm text-fashion-charcoal">
                  Discover more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionShowcase;
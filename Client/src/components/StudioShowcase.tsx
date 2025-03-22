
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const StudioShowcase = () => {
  return (
    <section className="w-full bg-[#f0ece5] py-16 px-8 md:px-12 relative overflow-hidden">
      {/* Large circular border */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border border-gray-300"></div>
      
      {/* Studio Title */}
      <div className="text-center relative z-10 mb-10">
        <h2 className="text-5xl md:text-7xl font-bold text-center tracking-wider">
          STUDIO
        </h2>
        <h2 className="text-5xl md:text-7xl font-bold text-center tracking-wider -mt-2 md:-mt-4">
          SHODWE
        </h2>
      </div>
      
      {/* Carousel */}
      <div className="relative z-10">
        <Carousel className="w-full">
          <CarouselContent>
            {/* Item 1 */}
            <CarouselItem className="md:basis-1/4">
              <div className="flex flex-col p-1">
                <div className="overflow-hidden">
                  <img 
                    src="/lovable-uploads/6fce2c18-93dd-4f02-af1a-5f62ea1b1c37.png" 
                    alt="Brown Coat"
                    className="w-full h-60 object-cover object-top"
                  />
                </div>
                <div className="mt-3">
                  <div className="flex flex-col">
                    <span className="text-gray-600 uppercase text-sm">BROWN</span>
                    <span className="text-gray-600 uppercase text-sm">COAT</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">$49</span>
                    <span className="text-xs text-gray-500">QUICK VIEW</span>
                    <button className="bg-white text-xs border border-gray-300 rounded-full px-3 py-1">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            </CarouselItem>
            
            {/* Item 2 (Center featured item) */}
            <CarouselItem className="md:basis-2/4">
              <div className="flex flex-col items-center p-1">
                <div className="overflow-hidden bg-white rounded-full w-full aspect-square flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/6fce2c18-93dd-4f02-af1a-5f62ea1b1c37.png" 
                    alt="New Collection"
                    className="w-4/5 h-4/5 object-cover object-top"
                  />
                </div>
                <div className="mt-4 flex justify-center">
                  <Button className="bg-white text-black hover:bg-gray-100 rounded-full px-6">
                    NEW COLLECTION
                  </Button>
                </div>
              </div>
            </CarouselItem>
            
            {/* Item 3 */}
            <CarouselItem className="md:basis-1/4">
              <div className="flex flex-col p-1">
                <div className="overflow-hidden">
                  <img 
                    src="/lovable-uploads/6fce2c18-93dd-4f02-af1a-5f62ea1b1c37.png" 
                    alt="Autumn Collection"
                    className="w-full h-60 object-cover object-top"
                  />
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-600">
                    Our latest clothing collection is special for autumn.
                  </p>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          
          <CarouselPrevious className="hidden md:flex absolute left-2 bg-white border-none" />
          <CarouselNext className="hidden md:flex absolute right-2 bg-white border-none" />
        </Carousel>
      </div>
      
      {/* "See More Collection" button */}
      <div className="flex justify-center mt-8">
        <Link to="/collection">
          <Button variant="outline" className="rounded-full border-gray-500 text-gray-700 hover:bg-transparent hover:text-gray-900">
            See More Collection
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default StudioShowcase;

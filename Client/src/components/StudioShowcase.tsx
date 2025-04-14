import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button' // Assuming standard shadcn button import
import Jackets from '../assets/mens jackets/jacket-1.jpg'
import Shirts from '../assets/mens shirts/shirt-1.jpg'
import Pants from '../assets/men pents/pant-1.jpg'
import SweatShirt from '../assets/men sweatshirts/sweatshirt-1.jpg'
// If you are using lucide-react icons: import { ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious, // Keep if you want both arrows
} from '@/components/ui/carousel' // Assuming standard shadcn carousel import

const StudioShowcase = () => {
  // Placeholder data - replace with your actual data/images
  const carouselItems = [
    {
      type: 'product',
      imgSrc: Jackets, // Replace with actual image path
      title: 'BROWN COAT',
      price: '$49',
    },
    {
      type: 'feature',
      imgSrc: Shirts, // Replace with actual image path
    },
    {
      type: 'info',
      imgSrc: Pants, // Replace with actual image path
      description: 'Our latest clothing collection is special for autumn.',
    },
    {
      type: 'image_only', // For partially visible items
      imgSrc: SweatShirt, // Replace with actual image path
    },
    {
      type: 'image_only', // Add more if needed for the carousel loop
      imgSrc: Jackets, // Replace with actual image path
    },
  ]

  return (
    // Section styling matching Figma background
    <section className="w-full bg-[#f0ece5] py-16 px-4 sm:px-8 md:px-12 overflow-hidden">
      {/* Studio Title - Centered above carousel */}
      <div className="text-center mb-10 md:mb-12">
        {/* Using slightly smaller text size than before, adjust as needed */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-800 tracking-wider">
          STUDIO
        </h2>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-800 tracking-wider -mt-1 sm:-mt-2 md:-mt-3">
          SHODWE
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/*
          Adjust Carousel options:
          - `opts={{ align: "start", loop: true }}` common for this style
          - `className="w-full max-w-6xl mx-auto"` to control max width if needed
        */}
        <Carousel
          opts={{
            align: 'start', // Align items to the start
            loop: true, // Enable looping
          }}
          className="w-full max-w-7xl mx-auto" // Limit width and center
        >
          {/*
            Adjust CarouselContent spacing if needed:
            - Remove default negative margin `-ml-4` if it causes issues
            - Add `px-4` or similar if items need padding from edges
          */}
          <CarouselContent className="-ml-2 md:-ml-4 items-center">
            {' '}
            {/* Use items-center to vertically align different height items */}
            {carouselItems.map((item, index) => (
              <CarouselItem
                key={index}
                // Adjust basis for different item types - needs fine-tuning!
                // These are examples, experiment for best fit:
                className={`
                  pl-2 md:pl-4
                  ${item.type === 'feature' ? 'basis-1/2 sm:basis-2/5 md:basis-1/3' : ''}
                  ${item.type === 'product' ? 'basis-3/4 sm:basis-1/2 md:basis-1/4' : ''}
                  ${item.type === 'info' ? 'basis-3/4 sm:basis-1/2 md:basis-1/4' : ''}
                  ${item.type === 'image_only' ? 'basis-3/4 sm:basis-1/2 md:basis-1/4' : ''}
                `}
              >
                <div className="p-1 h-full flex flex-col">
                  {' '}
                  {/* Ensure items stretch */}
                  {/* Conditional Rendering based on item type */}
                  {/* Product Item */}
                  {item.type === 'product' && (
                    <div className="flex flex-col bg-white/50 p-3 rounded-lg shadow-sm h-full">
                      <div className="overflow-hidden rounded-md mb-3">
                        <img
                          src={item.imgSrc}
                          alt={item.title || 'Product Image'}
                          className="w-full h-48 sm:h-56 md:h-64 object-cover object-center transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-col mt-auto">
                        {' '}
                        {/* Push content down */}
                        <span className="text-neutral-700 uppercase text-xs sm:text-sm font-medium">
                          {item.title}
                        </span>
                        <span className="text-neutral-900 font-semibold text-sm sm:text-base mt-1">
                          {item.price}
                        </span>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {/* Use Button component for consistency */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs rounded-full border-neutral-400 text-neutral-600 hover:bg-neutral-100 flex-grow sm:flex-grow-0"
                          >
                            QUICK VIEW
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs rounded-full border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100 flex-grow sm:flex-grow-0"
                          >
                            ADD TO CART
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Feature Item (Center) */}
                  {item.type === 'feature' && (
                    <div className="flex flex-col items-center">
                      {/* Make this image larger */}
                      <div className="overflow-hidden rounded-lg shadow-md mb-4 w-full">
                        <img
                          src={item.imgSrc}
                          alt="New Collection Feature"
                          // Adjust height to be larger than others
                          className="w-full h-64 sm:h-80 md:h-96 object-cover object-center transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <Button className="bg-white text-black hover:bg-gray-100 rounded-full px-6 shadow">
                        NEW COLLECTION
                      </Button>
                    </div>
                  )}
                  {/* Info Item */}
                  {item.type === 'info' && (
                    <div className="flex flex-col bg-white/50 p-3 rounded-lg shadow-sm h-full">
                      <div className="overflow-hidden rounded-md mb-3">
                        <img
                          src={item.imgSrc}
                          alt="Collection Info Image"
                          className="w-full h-48 sm:h-56 md:h-64 object-cover object-center transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-600 mt-auto leading-relaxed">
                        {item.description}
                      </p>
                      {/* Optional: Add a link/button here if needed */}
                      {/*
                       <Link to="/autumn-collection" className="mt-2 text-xs text-blue-600 hover:underline">
                         Discover more →
                       </Link>
                       */}
                    </div>
                  )}
                  {/* Simple Image Item (for sides/looping) */}
                  {item.type === 'image_only' && (
                    <div className="overflow-hidden rounded-lg shadow-sm h-full">
                      <img
                        src={item.imgSrc}
                        alt="Collection Item"
                        // Match height of product/info items
                        className="w-full h-48 sm:h-56 md:h-64 object-cover object-center transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons - Styled like Figma */}
          {/* Hide Previous button if not needed/shown in Figma */}
          {/* <CarouselPrevious className="absolute left-[-15px] sm:left-[-20px] md:left-[-50px] bg-white text-neutral-700 rounded-md shadow-md w-8 h-8 sm:w-10 sm:h-10 border-none hover:bg-gray-100" /> */}
          <CarouselNext className="absolute right-[-15px] sm:right-[-20px] md:right-2 bg-white text-neutral-700 rounded-md shadow-md w-8 h-8 sm:w-10 sm:h-10 border-none hover:bg-gray-100" />
        </Carousel>
      </div>

      {/* "See More Collection" button - Centered below */}
      <div className="flex justify-center mt-10 md:mt-12">
        <Link to="/collection">
          {/* Styled button matching Figma */}
          <Button
            variant="outline"
            className="rounded-full border-neutral-500 text-neutral-700 hover:bg-white/50 hover:text-neutral-900 px-6 py-2 text-sm"
          >
            See More Collection
          </Button>
        </Link>
      </div>
    </section>
  )
}

export default StudioShowcase

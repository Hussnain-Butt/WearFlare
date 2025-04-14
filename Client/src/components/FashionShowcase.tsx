import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button' // Assuming standard shadcn button import
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious, // Import CarouselPrevious
} from '@/components/ui/carousel' // Assuming standard shadcn carousel import

// Import your images - Make sure paths are correct
import Jackets from '../assets/mens jackets/jacket-1.jpg'
import Shirts from '../assets/mens shirts/shirt-1.jpg'
import Pants from '../assets/men pents/pant-1.jpg'
import SweatShirt from '../assets/men sweatshirts/sweatshirt-1.jpg'
// Add any other images needed for the carousel loop
import ExtraImage from '../assets/men sweatshirts/sweatshirt-2.jpg' // Example
import AnimatedSection from './AnimatedSection'

const FashionShowcase: React.FC = () => {
  // Define the carousel items array
  const carouselItems = [
    // This order defines the sequence for looping and indexing
    {
      type: 'image_only', // Index 0
      imgSrc: ExtraImage,
    },
    {
      type: 'product', // Index 1
      imgSrc: Jackets,
      title: 'BROWN COAT',
      price: '9999 Rs',
    },
    {
      type: 'feature', // Index 2 (TARGET STARTING CENTER ITEM)
      imgSrc: Shirts,
    },
    {
      type: 'info', // Index 3
      imgSrc: Pants,
      description: 'Our latest clothing collection is special for autumn.',
    },
    {
      type: 'image_only', // Index 4
      imgSrc: SweatShirt,
    },
  ]

  // Find the index of the desired starting item ('feature')
  const featureItemIndex = carouselItems.findIndex((item) => item.type === 'feature')
  const startIndex = featureItemIndex !== -1 ? featureItemIndex : 0

  return (
    <section className="relative w-full bg-[#f0ece5] py-16 sm:py-24 px-4 overflow-hidden">
      <AnimatedSection direction="right">
        {/* Background Circles */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          <div className="w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] border border-neutral-400/20 rounded-full" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          <div className="w-[85vw] h-[85vw] max-w-[1000px] max-h-[1000px] border border-neutral-400/15 rounded-full" />
        </div>

        {/* Main Content Container */}
        <div className="relative max-w-7xl mx-auto z-10">
          {/* Overlaid Studio Title */}
          <div className="absolute inset-x-0 top-[10%] sm:top-[15%] md:top-[20%] text-center z-20 pointer-events-none">
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-[0.15em] uppercase"
              style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}
            >
              STUDIO
            </h1>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-[0.15em] uppercase -mt-1 sm:-mt-2 md:-mt-3"
              style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}
            >
              SHODWE
            </h1>
          </div>

          {/* Carousel Container */}
          <Carousel
            opts={{
              align: 'center',
              loop: true,
              startIndex: startIndex,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4 items-center">
              {carouselItems.map((item, index) => (
                <CarouselItem
                  key={index}
                  className={`
                  pl-2 md:pl-4 flex flex-col
                  ${
                    item.type === 'feature'
                      ? 'basis-1/2 sm:basis-2/5 md:basis-[45%] lg:basis-2/5' // Feature: Large
                      : 'basis-3/4 sm:basis-1/2 md:basis-[25%] lg:basis-1/4' // Others: Smaller
                  }
                `}
                >
                  {/* Product Item */}
                  {item.type === 'product' && (
                    <div className="flex flex-col h-full p-2 sm:p-3">
                      <div className="overflow-hidden rounded-lg shadow-md mb-3">
                        <img
                          src={item.imgSrc}
                          alt={item.title || 'Product Image'}
                          className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-col mt-auto">
                        <span className="text-neutral-700 uppercase text-xs sm:text-sm font-medium tracking-wider">
                          {item.title}
                        </span>
                        <span className="text-neutral-900 font-semibold text-sm sm:text-base mt-1">
                          {item.price}
                        </span>
                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs rounded-full border-neutral-400 text-neutral-600 hover:bg-neutral-100 px-4 py-1 h-auto"
                          >
                            QUICK VIEW
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs rounded-full border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100 px-4 py-1 h-auto"
                          >
                            ADD TO CART
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Feature Item (Center) */}
                  {item.type === 'feature' && (
                    <div className="flex flex-col items-center h-full relative p-1">
                      <div className="overflow-hidden rounded-lg shadow-xl w-full flex-grow mb-10">
                        <img
                          src={item.imgSrc}
                          alt="New Collection Feature"
                          className="w-full h-64 sm:h-80 md:h-96 lg:h-[30rem] object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <Button className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-black hover:bg-gray-100 rounded-full px-5 py-2 shadow-md text-xs font-medium tracking-wide">
                        NEW COLLECTION
                      </Button>
                    </div>
                  )}

                  {/* Info Item */}
                  {item.type === 'info' && (
                    <div className="flex flex-col h-full p-2 sm:p-3">
                      <div className="overflow-hidden rounded-lg shadow-md mb-3">
                        <img
                          src={item.imgSrc}
                          alt="Collection Info Image"
                          className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-600 mt-auto leading-relaxed mb-1">
                        {item.description}
                      </p>
                    </div>
                  )}

                  {/* Simple Image Item */}
                  {item.type === 'image_only' && (
                    <div className="overflow-hidden rounded-lg shadow-md h-full p-1">
                      <img
                        src={item.imgSrc}
                        alt="Collection Item"
                        className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* --- Navigation Buttons --- */}
            <CarouselPrevious className="absolute left-0 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white text-neutral-700 rounded-md shadow-md w-8 h-8 sm:w-9 sm:h-9 border-none hover:bg-gray-100 z-10" />
            <CarouselNext className="absolute right-0 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white text-neutral-700 rounded-md shadow-md w-8 h-8 sm:w-9 sm:h-9 border-none hover:bg-gray-100 z-10" />
          </Carousel>
        </div>

        {/* "See More Collection" button */}
        <div className="flex justify-center mt-12 md:mt-16 relative z-10">
          <Link to="/shop">
            <Button
              variant="outline"
              className="rounded-full border-neutral-400 text-neutral-700 hover:bg-white/70 hover:text-neutral-900 px-6 py-2 text-sm font-medium tracking-wider"
            >
              See More Collection
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </section>
  )
}

export default FashionShowcase

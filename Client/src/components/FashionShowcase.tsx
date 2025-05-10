// src/components/FashionShowcase.tsx
import React from 'react'
import { Link } from 'react-router-dom' // Link is not used in the current JSX, can be removed if not planned
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

// Assuming these UI components are from shadcn/ui or similar
import { Button } from './ui/button' // Check path if needed. Button is currently commented out in JSX.
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel' // Check path if needed

// Make sure these paths are correct relative to FashionShowcase.tsx
import Jackets from '../assets/mens jackets/jacket-1.jpg' // Path check
import Shirts from '../assets/mens shirts/shirt-1.jpg' // Path check
import Pants from '../assets/men pents/pant-1.jpg' // Path check
import SweatShirt from '../assets/men sweatshirts/sweatshirt-1.jpg' // Path check
import ExtraImage from '../assets/men sweatshirts/sweatshirt-2.jpg' // Path check

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.1, when: 'beforeChildren' },
  },
}

const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 },
  },
}

const carouselItemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const textVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const FashionShowcase: React.FC = () => {
  const carouselItems = [
    { type: 'image_only', imgSrc: ExtraImage, alt: 'Stylish Sweatshirt' },
    { type: 'product', imgSrc: Jackets, title: 'BROWN COAT', alt: 'Brown Coat' },
    { type: 'feature', imgSrc: Shirts, alt: 'Featured Shirt' },
    {
      type: 'info',
      imgSrc: Pants,
      description: 'Our latest clothing collection is special for autumn.',
      alt: 'Stylish Pants',
    },
    { type: 'image_only', imgSrc: SweatShirt, alt: 'Grey Sweatshirt' },
  ]

  const featureItemIndex = carouselItems.findIndex((item) => item.type === 'feature')
  const startIndex = featureItemIndex !== -1 ? featureItemIndex : 0

  return (
    <motion.section
      // bg-white -> bg-background
      className="relative w-full bg-background sm:py-24 px-4 overflow-hidden font-inter"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Background Circles */}
      {/* border-trendzone-light-blue/15 -> border-accent/15 (or border-primary/15) */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <div className="w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] border border-accent/15 rounded-full" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <div className="w-[85vw] h-[85vw] max-w-[1000px] max-h-[1000px] border border-accent/10 rounded-full" />
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto z-10">
        {/* Overlaid Studio Title */}
        <motion.div
          className="absolute inset-x-0 top-[40%] sm:top-[15%] md:top-[20%] text-center z-20 pointer-events-none mt-32"
          variants={titleVariants}
        >
          {/* text-trendzone-dark-blue/80 -> text-primary/80 (or text-foreground/80) */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-primary/80 tracking-[0.15em] uppercase">
            STUDIO
          </h1>
          {/* text-trendzone-dark-blue -> text-primary (or text-foreground) */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary tracking-[0.15em] uppercase -mt-1 sm:-mt-2 md:-mt-3">
            SHODWE {/* Assuming SHODWE is intentional, might be SHOWCASE or similar */}
          </h1>
        </motion.div>

        {/* Carousel Container */}
        <Carousel
          opts={{
            align: 'center',
            loop: true,
            startIndex: startIndex,
          }}
          className="w-full pt-16 sm:pt-24 md:pt-32"
        >
          <CarouselContent className="-ml-2 md:-ml-4 items-center">
            {carouselItems.map((item, index) => (
              <CarouselItem
                key={index}
                className={`
                  pl-2 md:pl-4 flex flex-col
                  motion-safe:animate-fadeIn 
                  ${
                    /* Using animate-fadeIn from tailwindcss-animate if you have it, otherwise remove */ ''
                  }
                  ${
                    item.type === 'feature'
                      ? 'basis-1/2 sm:basis-2/5 md:basis-[45%] lg:basis-2/5'
                      : 'basis-3/4 sm:basis-1/2 md:basis-[25%] lg:basis-1/4'
                  }
                `}
              >
                {/* Product Item */}
                {item.type === 'product' && (
                  <motion.div
                    className="flex flex-col h-full p-2 sm:p-3"
                    variants={carouselItemVariants}
                  >
                    {/* bg-white -> bg-card */}
                    <div className="overflow-hidden rounded-lg shadow-md mb-3 bg-card">
                      <img
                        src={item.imgSrc}
                        alt={item.alt}
                        className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <motion.div className="flex flex-col mt-auto" variants={textVariants}>
                      {/* text-trendzone-dark-blue -> text-foreground (or text-card-foreground) */}
                      <span className="text-foreground uppercase text-xs sm:text-sm font-medium tracking-wider">
                        {item.title}
                      </span>
                    </motion.div>
                  </motion.div>
                )}

                {/* Feature Item (Center) */}
                {item.type === 'feature' && (
                  <motion.div
                    className="flex flex-col items-center h-full relative p-1"
                    variants={carouselItemVariants}
                  >
                    {/* bg-white -> bg-card */}
                    <div className="overflow-hidden rounded-lg shadow-xl w-full flex-grow mb-10 bg-card">
                      <img
                        src={item.imgSrc}
                        alt={item.alt}
                        className="w-full h-64 sm:h-80 md:h-96 lg:h-[30rem] object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Info Item */}
                {item.type === 'info' && (
                  <motion.div
                    className="flex flex-col h-full p-2 sm:p-3"
                    variants={carouselItemVariants}
                  >
                    {/* bg-white -> bg-card */}
                    <div className="overflow-hidden rounded-lg shadow-md mb-3 bg-card">
                      <img
                        src={item.imgSrc}
                        alt={item.alt}
                        className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <motion.p
                      // text-gray-700 -> text-muted-foreground (or text-secondary-foreground)
                      className="text-xs sm:text-sm text-muted-foreground mt-auto leading-relaxed mb-1"
                      variants={textVariants}
                    >
                      {item.description}
                    </motion.p>
                  </motion.div>
                )}

                {/* Simple Image Item */}
                {item.type === 'image_only' && (
                  // bg-white -> bg-card
                  <motion.div
                    className="overflow-hidden rounded-lg shadow-md h-full p-1 bg-card"
                    variants={carouselItemVariants}
                  >
                    <img
                      src={item.imgSrc}
                      alt={item.alt}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </motion.div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons */}
          <CarouselPrevious
            // bg-trendzone-dark-blue -> bg-primary
            // text-white -> text-primary-foreground
            // hover:bg-trendzone-light-blue -> hover:bg-primary/80 (or hover:bg-accent)
            // focus-visible:ring-trendzone-light-blue -> focus-visible:ring-ring
            className="absolute left-0 sm:left-2 md:left-4 top-1/2 -translate-y-1/2
                       bg-primary text-primary-foreground rounded-md shadow-md
                       w-8 h-8 sm:w-9 sm:h-9 border-none
                       hover:bg-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
                       transition-colors duration-200 z-10"
            icon={<ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />}
          />
          <CarouselNext
            // bg-trendzone-dark-blue -> bg-primary
            // text-white -> text-primary-foreground
            // hover:bg-trendzone-light-blue -> hover:bg-primary/80 (or hover:bg-accent)
            // focus-visible:ring-trendzone-light-blue -> focus-visible:ring-ring
            className="absolute right-0 sm:right-2 md:right-4 top-1/2 -translate-y-1/2
                       bg-primary text-primary-foreground rounded-md shadow-md
                       w-8 h-8 sm:w-9 sm:h-9 border-none
                       hover:bg-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
                       transition-colors duration-200 z-10"
            icon={<ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />}
          />
        </Carousel>
      </div>

      {/* "See More Collection" button */}
      <motion.div
        className="flex justify-center mt-12 md:mt-16 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {/* "See More Collection" button ko bhi themeable banayein agar uncomment karte hain */}
        {/* Example: */}
        {/* <Link to="/shop">
          <Button
            variant="outline" // Outline variant often uses border color
            className="rounded-full border-primary text-primary hover:bg-accent hover:text-accent-foreground px-6 py-2 text-sm font-medium tracking-wider"
          >
            See More Collection
          </Button>
        </Link> */}
      </motion.div>
    </motion.section>
  )
}

export default FashionShowcase

// src/components/FashionRevolution.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Edit3 } from 'lucide-react' // ArrowRight agar kahin use nahi ho raha toh hata sakte hain

import modelVideo from '../assets/model.mp4' // Path check karein

// professionalDiscoverImageUrl is not used in this component, can be removed if not needed elsewhere
// const professionalDiscoverImageUrl =
//   'https://images.pexels.com/photos/13466292/pexels-photo-13466292.png?auto=compress&cs=tinysrgb&w=600&lazy=load'

// Animation Variants - No changes needed here
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
      when: 'beforeChildren',
    },
  },
}

const textBlockVariants = (fromLeft: boolean = true, delay: number = 0) => ({
  hidden: { opacity: 0, x: fromLeft ? -50 : 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: 'easeOut', delay },
  },
})

const videoVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.3 } },
}

// overlayContentVariants and headlineWordVariants are not used in this component based on the provided code.
// If they are intended for another part of this component or a different component, keep them.
// Otherwise, they can be removed for cleanliness.

const FashionRevolution: React.FC = () => {
  // animatedHeadlineText and words are not used in the JSX, can be removed if not planned for use.
  // const animatedHeadlineText = 'Unveil Your Signature Look'
  // const words = animatedHeadlineText.split(' ')

  return (
    // Removed overflow-x-hidden from here as it's usually better on the body or main app container
    // if needed globally, otherwise individual sections can handle their own overflow if necessary.
    <div className="font-inter">
      {/* Top Section - Join the Revolution */}
      <motion.section
        // bg-white -> bg-background
        className="w-full min-h-[80vh] md:min-h-screen flex flex-col md:flex-row items-center bg-background"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="md:w-1/2 w-full p-8 sm:p-12 md:p-16 lg:p-24 flex flex-col justify-center text-left order-2 md:order-1"
          variants={textBlockVariants(true)} // Delay can be added here if needed, e.g., textBlockVariants(true, 0.2)
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 md:mb-6">
            {/* text-trendzone-dark-blue -> text-primary (or text-foreground) */}
            Join the Revolution
          </h2>
          {/* text-gray-700 -> text-muted-foreground (or text-secondary-foreground) */}
          <p className="text-muted-foreground text-base sm:text-lg lg:text-xl leading-relaxed mb-8 md:mb-10">
            Don't just wear clothes; wear your personality! Join the WearFlare revolution and
            express yourself like never before. Let's make fashion fun again!
          </p>
          <motion.div variants={buttonVariants} className="self-start">
            <Link
              to="/avatar-creation" // Ensure this route exists
              // bg-trendzone-dark-blue -> bg-primary
              // text-white -> text-primary-foreground
              // hover:bg-trendzone-light-blue -> hover:bg-primary/80 (or hover:bg-accent)
              className="inline-flex items-center justify-center px-8 py-3 sm:px-10 sm:py-3.5 bg-primary text-primary-foreground text-sm sm:text-base font-semibold rounded-full hover:bg-primary/80 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2.5" />
              Create Now
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          // bg-gray-100 -> bg-muted or bg-card if you want a distinct fallback color for video container
          // Using bg-background makes it blend with the section if video fails to load and poster is transparent
          className="md:w-1/2 w-full h-[50vh] md:h-auto md:min-h-screen relative overflow-hidden order-1 md:order-2 bg-muted"
          variants={videoVariants}
        >
          <video
            src={modelVideo}
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="/placeholder-video-poster.jpg" // Ensure this poster is theme-neutral or looks good on dark/light muted backgrounds
          />
        </motion.div>
      </motion.section>
    </div>
  )
}

export default FashionRevolution

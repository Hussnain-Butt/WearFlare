// src/components/FashionRevolution.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Edit3 } from 'lucide-react'

import modelVideo from '../assets/model.mp4'

const professionalDiscoverImageUrl =
  'https://images.pexels.com/photos/13466292/pexels-photo-13466292.png?auto=compress&cs=tinysrgb&w=600&lazy=load'

// Animation Variants
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
  // Added delay parameter
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

const overlayContentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

// New variants for the animated headline text
const headlineWordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    // Custom function to access index for staggered delay
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15, // Stagger each word
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
}

const FashionRevolution: React.FC = () => {
  const animatedHeadlineText = 'Unveil Your Signature Look'
  const words = animatedHeadlineText.split(' ')

  return (
    <div className="font-inter overflow-x-hidden">
      {/* Top Section - Join the Revolution (remains the same) */}
      <motion.section
        className="w-full min-h-[80vh] md:min-h-screen flex flex-col md:flex-row items-center bg-white"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="md:w-1/2 w-full p-8 sm:p-12 md:p-16 lg:p-24 flex flex-col justify-center text-left order-2 md:order-1"
          variants={textBlockVariants(true)}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-trendzone-dark-blue mb-4 md:mb-6">
            Join the Revolution
          </h2>
          <p className="text-gray-700 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 md:mb-10">
            Don't just wear clothes; wear your personality! Join the WearFlare revolution and
            express yourself like never before. Let's make fashion fun again!
          </p>
          <motion.div variants={buttonVariants} className="self-start">
            <Link
              to="/avatar-creation"
              className="inline-flex items-center justify-center px-8 py-3 sm:px-10 sm:py-3.5 bg-trendzone-dark-blue text-white text-sm sm:text-base font-semibold rounded-full hover:bg-trendzone-light-blue transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2.5" />
              Create Now
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className="md:w-1/2 w-full h-[50vh] md:h-auto md:min-h-screen relative overflow-hidden order-1 md:order-2 bg-gray-100"
          variants={videoVariants}
        >
          <video
            src={modelVideo}
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="/placeholder-video-poster.jpg"
          />
        </motion.div>
      </motion.section>
    </div>
  )
}

export default FashionRevolution

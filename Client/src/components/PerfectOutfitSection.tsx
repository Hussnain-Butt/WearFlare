// src/components/PerfectOutfitSection.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import video1 from '../assets/video 1.mp4' // Path check karein
import video2 from '../assets/video 2.mp4' // Path check karein

const centralImageUrl =
  'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?auto=compress&cs=tinysrgb&w=600'
const topRightVideoUrl = video1
const leftVideoUrl = video2

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

const titleTextVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const imageVariants = (delay: number = 0) => ({
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: 'easeOut', delay },
  },
})

const contentBlockVariants = (fromRight: boolean = false) => ({
  hidden: { opacity: 0, x: fromRight ? 50 : -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
})

const overlayTextVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } },
}

const PerfectOutfitSection: React.FC = () => {
  return (
    <motion.section
      // CHANGED: bg-muted/10 to bg-background for consistent dark theme background
      className="bg-background py-16 md:py-24 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center justify-center font-inter"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="max-w-6xl w-full mx-auto">
        <motion.div
          className="mb-12 md:mb-16 lg:mb-20 text-left md:text-left lg:pl-4"
          variants={titleTextVariants}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-wider uppercase text-primary">
            Choose The
          </h2>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider uppercase text-primary mt-1">
            Perfect Outfit
          </h1>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
          <motion.div
            className="md:col-span-3 lg:col-span-3 order-2 md:order-1 self-center md:mt-20 lg:mt-32 z-10"
            variants={imageVariants(0.2)}
            whileHover={{ scale: 1.05, zIndex: 15 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
              <video
                className="w-full h-full object-cover"
                src={leftVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                poster="/placeholder-video-poster.jpg"
              ></video>
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-6 lg:col-span-5 order-1 md:order-2 relative z-0 mx-auto"
            variants={imageVariants(0)}
            whileHover={{ scale: 1.03, zIndex: 5, boxShadow: '0px 20px 30px rgba(0,0,0,0.15)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={centralImageUrl}
                alt="Stylish woman for autumn collection"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <motion.div
              className="absolute bottom-6 right-6 md:bottom-8 md:right-8 text-right"
              variants={overlayTextVariants}
            >
              <span
                className="block text-4xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase leading-none tracking-tight"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
              >
                Autumn
              </span>
              <span
                className="block text-5xl sm:text-6xl md:text-7xl font-extrabold text-white uppercase leading-none tracking-tight"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
              >
                2025
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="md:col-span-3 lg:col-span-4 order-3 md:order-3 self-start md:self-auto space-y-6 z-10"
            variants={contentBlockVariants(true)}
          >
            <motion.div
              className="aspect-[16/10] rounded-2xl overflow-hidden shadow-xl"
              variants={imageVariants(0.4)}
              whileHover={{ scale: 1.05, zIndex: 15 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <video
                className="w-full h-full object-cover"
                src={topRightVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                poster="/placeholder-video-poster.jpg"
              ></video>
            </motion.div>

            <div className="p-1">
              <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-3 tracking-wide">
                THE COLLECTION
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4">
                Discover curated styles designed to inspire. Our latest collection blends timeless
                elegance with modern trends, ensuring you always look your best.
              </p>
              <Link
                to="/men"
                className="inline-flex items-center text-sm font-medium text-primary hover:text-accent group transition-colors duration-300"
              >
                Discover More
                <ArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default PerfectOutfitSection

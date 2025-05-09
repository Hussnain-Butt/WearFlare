import React from 'react'
import { Link } from 'react-router-dom'
import { Play, Plus, ArrowRight, ChevronRight, Quote, Sun } from 'lucide-react'
import { motion } from 'framer-motion' // Import motion

// Updated data structure for static images in each cell
const staticImageGridData = [
  // Cell 0 (Top-Left Taller)
  {
    id: 'img0',
    src: 'https://images.pexels.com/photos/31969150/pexels-photo-31969150/free-photo-of-joyful-woman-stretching-by-window.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Model in vibrant orange outfit',
    baseClassName: 'h-[300px] md:h-[380px]',
  },
  // Cell 1 (Bottom-Left Shorter)
  {
    id: 'img1',
    src: 'https://images.pexels.com/photos/31961165/pexels-photo-31961165/free-photo-of-stylish-assorted-sweatpants-flat-lay.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Model in a bright, patterned suit',
    baseClassName: 'h-[180px] md:h-[220px]',
  },
  // Cell 2 (Central Large, Green Coat Style)
  {
    id: 'img2',
    src: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Woman in a chic green overcoat',
    baseClassName: 'h-[400px] md:h-[520px]',
  },
  // Cell 3 (Central Medium, Yellow Hat Style, below button)
  {
    id: 'img3',
    src: 'https://images.pexels.com/photos/20279385/pexels-photo-20279385/free-photo-of-close-up-of-woman-hands-zipping-jeans.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    alt: 'Man wearing a stylish yellow hat',
    baseClassName: 'h-[280px] md:h-[360px]',
  },
  // Cell 4 (Right of Center, White Outfit Style)
  {
    id: 'img4',
    src: 'https://images.pexels.com/photos/20755907/pexels-photo-20755907/free-photo-of-model-in-blue-denim-jacket-and-jeans.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    alt: 'Man in a crisp all-white outfit',
    baseClassName: 'h-[380px] md:h-[480px]',
  },
  // Cell 5 (Top-Right Taller, Heart Sunglasses Style)
  {
    id: 'img5',
    src: 'https://images.pexels.com/photos/17334651/pexels-photo-17334651/free-photo-of-young-man-posing-in-city.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    alt: 'Woman wearing heart-shaped sunglasses',
    baseClassName: 'h-[300px] md:h-[380px]',
  },
  // Cell 6 (Bottom-Right Shorter, Green Suit Man Style)
  {
    id: 'img6',
    src: 'https://images.pexels.com/photos/6765655/pexels-photo-6765655.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    alt: 'Man in a stylish green suit',
    baseClassName: 'h-[180px] md:h-[220px]',
  },
]

const avatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
]

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger children animations
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 12 },
  },
}

const imageVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const StyleHere: React.FC = () => {
  return (
    <motion.div // Animate the main container
      className="bg-white min-h-screen py-10 md:py-16 px-4 sm:px-6 lg:px-8 font-inter"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Top Section: Video, Headline, Avatars */}
        <motion.header // Animate the header
          className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 md:mb-16 gap-6 md:gap-0"
          variants={itemVariants} // Use itemVariants for children of the main container
        >
          <motion.div
            className="flex-shrink-0 order-2 md:order-1 self-center md:self-auto"
            variants={itemVariants} // Individual item animation
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <button
              aria-label="Learn about us through video"
              className="w-30 h-30 md:w-28 md:h-28
               border-2 border-gray-300 border-dashed rounded-full
               flex flex-col items-center justify-center text-center
               text-xs font-medium text-gray-700  p-5
               transition-all duration-300 ease-in-out group
               hover:border-trendzone-dark-blue hover:shadow-lg
               focus:outline-none focus-visible:ring-2 focus-visible:ring-trendzone-light-blue focus-visible:ring-offset-2"
            >
              <Play className="w-6 h-6 md:w-7 md:h-7 mb-1.5 text-gray-500 group-hover:text-trendzone-dark-blue transition-colors duration-300" />
              Learn about us
            </button>
          </motion.div>

          <motion.div
            className="flex-1 text-center order-1 md:order-2 px-0 md:px-8"
            variants={itemVariants}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 leading-tight">
              Elevate Your Style With
              <br />
              <motion.span
                className="block mt-1 md:mt-2 text-[#669BBC]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Bold Fashion
              </motion.span>
            </h1>
          </motion.div>

          <motion.div
            className="flex-shrink-0 flex items-center order-3 self-center md:self-auto"
            variants={itemVariants}
          >
            <div className="flex -space-x-3 rtl:space-x-reverse">
              {avatars.map((src, i) => (
                <motion.img
                  key={i}
                  className="w-10 h-10 md:w-11 md:h-11 border-2 border-white rounded-full object-cover"
                  src={src}
                  alt={`User ${i + 1}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 200 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.header>

        {/* Image Grid Section - Static Images */}
        <motion.section // Animate the image grid section
          className="mb-16 md:mb-24 relative"
          variants={containerVariants} // Use containerVariants for sections with multiple children
          initial="hidden"
          whileInView="visible" // Animate when in view
          viewport={{ once: true, amount: 0.2 }} // Trigger animation once, when 20% is visible
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 items-start">
            {/* Column 1 */}
            <motion.div className="space-y-4 md:space-y-6" variants={itemVariants}>
              <motion.div
                className={`w-full ${staticImageGridData[0].baseClassName} relative overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300`}
                variants={imageVariants}
                whileHover={{ y: -5 }}
              >
                <img
                  src={staticImageGridData[0].src}
                  alt={staticImageGridData[0].alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              <motion.div
                className={`w-full ${staticImageGridData[1].baseClassName} relative overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300`}
                variants={imageVariants}
                whileHover={{ y: -5 }}
              >
                <img
                  src={staticImageGridData[1].src}
                  alt={staticImageGridData[1].alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </motion.div>

            {/* Column 2 */}
            <motion.div className="sm:pt-10 lg:pt-0" variants={itemVariants}>
              <motion.div
                className={`w-full ${staticImageGridData[2].baseClassName} relative overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300`}
                variants={imageVariants}
                whileHover={{ y: -5 }}
              >
                <img
                  src={staticImageGridData[2].src}
                  alt={staticImageGridData[2].alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </motion.div>

            {/* Column 3 (Central button area) */}
            <motion.div
              className="flex flex-col items-center space-y-4 md:space-y-6 sm:pt-20 lg:pt-10 relative"
              variants={itemVariants}
            >
              <motion.div
                className={`w-full ${staticImageGridData[3].baseClassName} relative overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300`}
                variants={imageVariants}
                whileHover={{ y: -5 }}
              >
                <img
                  src={staticImageGridData[3].src}
                  alt={staticImageGridData[3].alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              <motion.div
                className="flex flex-col items-center mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Sun className="w-6 h-6 text-amber-500 mb-3" />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/Mens"
                    className="bg-[#669BBC] text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl"
                  >
                    Explore Collections
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Column 4 */}
            <motion.div className="sm:pt-10 lg:pt-0" variants={itemVariants}>
              <motion.div
                className={`w-full ${staticImageGridData[4].baseClassName} relative overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300`}
                variants={imageVariants}
                whileHover={{ y: -5 }}
              >
                <img
                  src={staticImageGridData[4].src}
                  alt={staticImageGridData[4].alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </motion.div>

            {/* Column 5 */}
            <motion.div className="space-y-4 md:space-y-6" variants={itemVariants}>
              <motion.div
                className={`w-full ${staticImageGridData[5].baseClassName} relative overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300`}
                variants={imageVariants}
                whileHover={{ y: -5 }}
              >
                <img
                  src={staticImageGridData[5].src}
                  alt={staticImageGridData[5].alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              <motion.div
                className={`w-full ${staticImageGridData[6].baseClassName} relative overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300`}
                variants={imageVariants}
                whileHover={{ y: -5 }}
              >
                <img
                  src={staticImageGridData[6].src}
                  alt={staticImageGridData[6].alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Bottom Section: Testimonial & Lifestyle */}
        <motion.footer // Animate the footer
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Testimonial */}
          <motion.div className="relative" variants={itemVariants}>
            <Quote className="w-10 h-10 text-gray-300 absolute -top-3 -left-3 transform -translate-x-1/2" />
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
              Wearflare styles are fresh, bold, and exactly what I needed to upgrade my wardrobe.
              Loved the quality and vibe!
            </p>
            <div className="text-right">
              <span className="font-serif italic text-xl md:text-2xl text-gray-800 relative inline-block">
                Rafi H.
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-amber-300 opacity-70"></span>
              </span>
            </div>
          </motion.div>

          {/* Lifestyle Section */}
          <motion.div className="flex items-start space-x-4" variants={itemVariants}>
            <div className="flex-shrink-0">
              <span className="text-5xl md:text-6xl font-bold text-gray-800">01</span>
            </div>
            <div className="pt-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Lifestyle</p>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                Set Up Your Fashion With The Latest Trends
              </h3>
            </div>
          </motion.div>
        </motion.footer>
      </div>
    </motion.div>
  )
}

export default StyleHere

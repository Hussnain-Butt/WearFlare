// Client/src/pages/StyleHere.tsx (ya jo bhi path hai)
import React from 'react'
import { Link } from 'react-router-dom'
import { Play, Plus, ArrowRight, ChevronRight, Quote, Sun } from 'lucide-react'
import { motion } from 'framer-motion' // Import motion

// Static image data - no changes needed here
const staticImageGridData = [
  // ... (data unchanged)
  {
    id: 'img0',
    src: 'https://images.pexels.com/photos/31969150/pexels-photo-31969150/free-photo-of-joyful-woman-stretching-by-window.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Model in vibrant orange outfit',
    baseClassName: 'h-[300px] md:h-[380px]',
  },
  {
    id: 'img1',
    src: 'https://images.pexels.com/photos/31961165/pexels-photo-31961165/free-photo-of-stylish-assorted-sweatpants-flat-lay.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Model in a bright, patterned suit',
    baseClassName: 'h-[180px] md:h-[220px]',
  },
  {
    id: 'img2',
    src: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Woman in a chic green overcoat',
    baseClassName: 'h-[400px] md:h-[520px]',
  },
  {
    id: 'img3',
    src: 'https://images.pexels.com/photos/20279385/pexels-photo-20279385/free-photo-of-close-up-of-woman-hands-zipping-jeans.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    alt: 'Man wearing a stylish yellow hat',
    baseClassName: 'h-[280px] md:h-[360px]',
  },
  {
    id: 'img4',
    src: 'https://images.pexels.com/photos/20755907/pexels-photo-20755907/free-photo-of-model-in-blue-denim-jacket-and-jeans.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    alt: 'Man in a crisp all-white outfit',
    baseClassName: 'h-[380px] md:h-[480px]',
  },
  {
    id: 'img5',
    src: 'https://images.pexels.com/photos/17334651/pexels-photo-17334651/free-photo-of-young-man-posing-in-city.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    alt: 'Woman wearing heart-shaped sunglasses',
    baseClassName: 'h-[300px] md:h-[380px]',
  },
  {
    id: 'img6',
    src: 'https://images.pexels.com/photos/31976979/pexels-photo-31976979/free-photo-of-stylish-portrait-of-woman-in-leather-jacket.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Man in a stylish green suit',
    baseClassName: 'h-[180px] md:h-[220px]',
  },
]

const avatars = [
  // ... (data unchanged)
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
]

// Animation Variants - no changes needed here
const containerVariants = {
  /* ... */
}
const itemVariants = {
  /* ... */
}
const imageVariants = {
  /* ... */
}

const StyleHere: React.FC = () => {
  return (
    <motion.div
      // bg-white -> bg-background
      className="bg-background min-h-screen py-10 md:py-16 px-4 sm:px-6 lg:px-8 font-inter"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Top Section: Video, Headline, Avatars */}
        <motion.header
          className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 md:mb-16 gap-6 md:gap-0"
          variants={itemVariants}
        >
          <motion.div
            className="flex-shrink-0 order-2 md:order-1 self-center md:self-auto"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <button
              aria-label="Learn about us through video"
              className="w-30 h-30 md:w-28 md:h-28
               border-2 border-border border-dashed rounded-full {/* border-gray-300 -> border-border */}
               flex flex-col items-center justify-center text-center
               text-xs font-medium text-muted-foreground  p-5 {/* text-gray-700 -> text-muted-foreground */}
               transition-all duration-300 ease-in-out group
               hover:border-trendzone-dark-blue hover:shadow-lg {/* Keep trendzone if controlled by HSL vars */}
               focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" // focus-visible:ring-trendzone-light-blue -> focus-visible:ring-ring
            >
              {/* text-gray-500 -> text-muted-foreground */}
              <Play className="w-6 h-6 md:w-7 md:h-7 mb-1.5 text-muted-foreground group-hover:text-trendzone-dark-blue transition-colors duration-300" />
              Learn about us
            </button>
          </motion.div>

          <motion.div
            className="flex-1 text-center order-1 md:order-2 px-0 md:px-8"
            variants={itemVariants}
          >
            {/* text-gray-900 -> text-foreground */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground leading-tight">
              Elevate Your Style With
              <br />
              <motion.span
                // text-[#669BBC] -> text-trendzone-light-blue (agar HSL var se control ho raha) ya text-accent
                className="block mt-1 md:mt-2 text-trendzone-light-blue" // Assuming this is a Trendzone color
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
                  // border-white -> border-background (to contrast with themed background)
                  className="w-10 h-10 md:w-11 md:h-11 border-2 border-background rounded-full object-cover"
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
        <motion.section
          className="mb-16 md:mb-24 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 items-start">
            {/* Columns with images - No direct color classes to change, shadows should work with background */}
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
                {/* text-amber-500: Keep or make themeable if desired */}
                <Sun className="w-6 h-6 text-amber-500 mb-3" />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/men" // Assuming this path is correct, usually `/men` or `/mens-collection`
                    // bg-[#669BBC] -> bg-trendzone-light-blue (or bg-primary, bg-accent)
                    // text-white -> text-primary-foreground (if bg is primary/accent) or text-trendzone-light-blue-text
                    // hover:bg-gray-800 -> hover:bg-primary/90 or hover:bg-foreground/20 (example)
                    className="bg-trendzone-light-blue text-trendzone-light-blue-text px-6 py-3 rounded-full text-sm font-semibold flex items-center hover:bg-trendzone-light-blue/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
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
        <motion.footer
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Testimonial */}
          <motion.div className="relative" variants={itemVariants}>
            {/* text-gray-300 -> text-muted-foreground/50 or a very light theme color */}
            <Quote className="w-10 h-10 text-muted-foreground/30 absolute -top-3 -left-3 transform -translate-x-1/2" />
            {/* text-gray-700 -> text-foreground/80 or text-secondary-foreground */}
            <p className="text-foreground/80 text-base md:text-lg leading-relaxed mb-6">
              Wearflare styles are fresh, bold, and exactly what I needed to upgrade my wardrobe.
              Loved the quality and vibe!
            </p>
            <div className="text-right">
              {/* text-gray-800 -> text-foreground */}
              <span className="font-serif italic text-xl md:text-2xl text-foreground relative inline-block">
                Rafi H.
                {/* bg-amber-300: Keep or make themeable if desired (e.g., bg-accent/70) */}
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-amber-300 opacity-70"></span>
              </span>
            </div>
          </motion.div>

          {/* Lifestyle Section */}
          <motion.div className="flex items-start space-x-4" variants={itemVariants}>
            <div className="flex-shrink-0">
              {/* text-gray-800 -> text-foreground */}
              <span className="text-5xl md:text-6xl font-bold text-foreground">01</span>
            </div>
            <div className="pt-2">
              {/* text-gray-500 -> text-muted-foreground */}
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Lifestyle
              </p>
              {/* text-gray-900 -> text-foreground */}
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
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

// src/components/Features.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { Lock, Truck, RotateCcw, MapPin } from 'lucide-react' // Import relevant icons

interface FeatureItem {
  icon: React.ElementType // Function component type for Lucide icons
  title: string
  description: string
}

const featuresData: FeatureItem[] = [
  {
    icon: Lock,
    title: 'Secure Payments',
    description:
      'Shop with confidence knowing that your transactions are safeguarded with top-tier encryption.',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description:
      'Enjoy complimentary shipping on all orders over PKR 5,000 - bringing style right to your doorstep.',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description:
      'With our hassle-free 30-day return policy, changing your mind has never been more convenient.',
  },
  {
    icon: MapPin,
    title: 'Order Tracking',
    description:
      'Stay in the loop with real-time updates using our Order Tracking feature, from checkout to delivery.',
  },
]

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.15, // Stagger feature item animations
      when: 'beforeChildren',
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15, duration: 0.5 },
  },
}

const Features: React.FC = () => {
  return (
    <motion.section // Use motion.section for animations
      className="bg-white py-16 md:py-24" // White background, increased padding
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% is visible
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-4" // Center content for all sizes initially
              variants={itemVariants} // Apply item animation variant
              whileHover={{ y: -5, scale: 1.03 }} // Subtle lift and scale on hover
              transition={{ type: 'spring', stiffness: 300 }} // Hover transition
            >
              {/* Styled Icon Container */}
              <div className="mb-4 p-3 bg-trendzone-light-blue/15 rounded-full">
                {' '}
                {/* Light blue background circle */}
                <feature.icon
                  className="w-7 h-7 md:w-8 md:h-8 text-trendzone-dark-blue"
                  strokeWidth={1.5}
                />
              </div>
              {/* Text Content */}
              <h3 className="font-semibold text-lg md:text-xl text-trendzone-dark-blue mb-2">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default Features

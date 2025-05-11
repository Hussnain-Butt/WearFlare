// src/components/Features.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { Lock, Truck, RotateCcw } from 'lucide-react' // MapPin not used, removed

interface FeatureItem {
  icon: React.ElementType
  title: string
  description: string
}

const featuresData: FeatureItem[] = [
  {
    icon: Lock,
    title: 'Cash on Delivery Available',
    description:
      'Pay when your order arrives! We offer hassle-free Cash on Delivery (COD) for your convenience and peace of mind.',
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
]

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.15,
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
    <motion.section
      // bg-white -> bg-background
      className="bg-background py-16 md:py-24"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8">
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-4"
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Styled Icon Container */}
              {/* bg-trendzone-light-blue/15 -> bg-accent/15 (or bg-primary/15) */}
              <div className="mb-4 p-3 bg-accent/15 rounded-full">
                <feature.icon
                  // text-trendzone-dark-blue -> text-accent (or text-primary)
                  className="w-7 h-7 md:w-8 md:h-8 text-trendzone-dark-blue-text-hsl"
                  strokeWidth={1.5}
                />
              </div>
              {/* Text Content */}
              {/* text-trendzone-dark-blue -> text-foreground (or text-primary) */}
              <h3 className="font-semibold text-lg md:text-xl text-foreground mb-2">
                {feature.title}
              </h3>
              {/* text-gray-600 -> text-muted-foreground (or text-secondary-foreground) */}
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
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

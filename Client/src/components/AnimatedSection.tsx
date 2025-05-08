// src/components/AnimatedSection.tsx

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

// Define the allowed animation directions as a specific type
type AnimationDirection = 'left' | 'right' | 'top' | 'bottom' | 'fade'

// Define the structure for animation variants
interface AnimationVariants {
  initial: Record<string, any> // Can be more specific e.g., { opacity: number; x?: number; y?: number }
  animate: Record<string, any>
}

// Define the props for the component
// Extends HTMLMotionProps<'div'> to allow passing standard div attributes and motion props
// Omit variants/initial/animate as we control them internally based on direction
interface AnimatedSectionProps
  extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'variants'> {
  children: React.ReactNode
  direction?: AnimationDirection // Use the specific type, optional
  delay?: number
  className?: string // Optional className specifically for the outer wrapper div
  // Removed 'as' prop for simplicity unless needed - can be added back if required
}

// Define the available animations
const animations: Record<AnimationDirection, AnimationVariants> = {
  left: { initial: { opacity: 0, x: -100 }, animate: { opacity: 1, x: 0 } }, // Reduced distance
  right: { initial: { opacity: 0, x: 100 }, animate: { opacity: 1, x: 0 } }, // Reduced distance
  top: { initial: { opacity: 0, y: -100 }, animate: { opacity: 1, y: 0 } }, // Reduced distance
  bottom: { initial: { opacity: 0, y: 100 }, animate: { opacity: 1, y: 0 } },
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
}

// Helper to check if a string is a valid AnimationDirection
const isValidDirection = (dir: string): dir is AnimationDirection => {
  return ['left', 'right', 'top', 'bottom', 'fade'].includes(dir)
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  direction = 'fade', // Default to 'fade' - often safer than a directional one
  delay = 0,
  className = '', // Default outer className to empty string
  ...rest // Capture any other props (like style, id, aria-*, etc.)
}) => {
  // --- Error Prevention ---
  // Determine the effective direction, falling back to 'fade' if invalid
  const effectiveDirection = isValidDirection(direction) ? direction : 'fade'

  // Log a warning in development if an invalid direction was provided
  if (process.env.NODE_ENV === 'development' && !isValidDirection(direction)) {
    console.warn(
      `AnimatedSection: Invalid direction prop "${direction}" provided. Falling back to "fade". Valid directions are: 'left', 'right', 'top', 'bottom', 'fade'.`,
    )
  }

  // Safely get the animation variant based on the effective direction
  const selectedAnimation = animations[effectiveDirection]
  // --- End Error Prevention ---

  return (
    // Outer div handles overflow clipping and accepts className for container styling
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        // Apply the selected animation states
        initial={selectedAnimation.initial}
        whileInView={selectedAnimation.animate} // Trigger animation when in view
        // Define transition properties
        transition={{
          type: 'spring', // Using spring for a slightly bouncier feel (optional)
          stiffness: 80,
          damping: 20,
          // duration: 0.8, // Duration is less direct with spring, controlled by stiffness/damping
          ease: 'easeOut', // Ease might be less relevant with spring
          delay,
        }}
        // Viewport settings: trigger once when 30% of the element is visible
        viewport={{ once: true, amount: 0.3 }}
        // Spread the rest of the props (e.g., style, id) onto the motion div
        {...rest}
        // --- Removed fixed width/padding - apply these via parent component ---
      >
        {children}
      </motion.div>
    </div>
  )
}

export default AnimatedSection

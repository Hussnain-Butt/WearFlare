// src/components/Footer.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react'

// Animation Variants
const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1,
      when: 'beforeChildren',
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { href: '#', icon: Twitter, label: 'Twitter' },
    { href: '#', icon: Youtube, label: 'YouTube' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Facebook, label: 'Facebook' },
  ]

  return (
    <motion.footer
      className="w-full bg-trendzone-dark-blue text-gray-300 py-12 md:py-16 font-inter" // Dark background, light text
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-10 md:mb-12">
          {/* Help Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-5 text-white uppercase tracking-wider">Help</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/terms"
                  className="hover:text-trendzone-light-blue transition-colors duration-200"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-trendzone-light-blue transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/faq"
                  className="hover:text-trendzone-light-blue transition-colors duration-200"
                >
                  FAQs
                </Link>
              </li> */}
            </ul>
          </motion.div>

          {/* Company Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-5 text-white uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/about-us"
                  className="hover:text-trendzone-light-blue transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-trendzone-light-blue transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/careers"
                  className="hover:text-trendzone-light-blue transition-colors duration-200"
                >
                  Careers
                </Link>
              </li> */}
            </ul>
          </motion.div>

          {/* Shop Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-5 text-white uppercase tracking-wider">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/men"
                  className="hover:text-trendzone-light-blue transition-colors duration-200"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  to="/women"
                  className="hover:text-trendzone-light-blue transition-colors duration-200"
                >
                  Women
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/new-arrivals"
                  className="hover:text-trendzone-light-blue transition-colors duration-200"
                >
                  New Arrivals
                </Link>
              </li> */}
            </ul>
          </motion.div>

          {/* Brand and Social Media */}
          <motion.div
            className="flex flex-col items-start sm:col-span-2 md:col-span-1 md:items-start lg:items-end text-left lg:text-right" // Adjust alignment for last column
            variants={itemVariants}
          >
            <Link
              to="/"
              className="text-2xl lg:text-3xl font-bold mb-5 text-white uppercase tracking-widest"
            >
              WearFlare {/* Changed to TrendZone to match Navbar */}
            </Link>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          className="mt-10 pt-8 border-t border-trendzone-light-blue/20 flex flex-col-reverse md:flex-row justify-between items-center text-center md:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-xs text-gray-400 mt-4 md:mt-0">
            © {currentYear} WearFlare Ltd. All Rights Reserved
          </p>
          <div className="flex space-x-5">
            <Link
              to="/terms"
              className="text-xs text-gray-400 hover:text-trendzone-light-blue transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-xs text-gray-400 hover:text-trendzone-light-blue transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer

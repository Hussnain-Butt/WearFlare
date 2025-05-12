// src/components/Footer.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
// Social icons not used in the provided JSX, can be removed if not planned for use
// import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react'

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

  // socialLinks array is defined but not used in the JSX.
  // If you plan to add social icons later, you can keep this.
  // const socialLinks = [
  //   { href: '#', icon: Twitter, label: 'Twitter' },
  //   { href: '#', icon: Youtube, label: 'YouTube' },
  //   { href: '#', icon: Instagram, label: 'Instagram' },
  //   { href: '#', icon: Facebook, label: 'Facebook' },
  // ]

  return (
    <motion.footer
      // bg-trendzone-dark-blue -> bg-primary (assuming dark blue is your primary)
      // text-gray-300 -> text-primary-foreground (or a specific light muted color for footer text)
      // If your primary color is light in the dark theme, then bg-primary won't be dark.
      // In that case, use bg-card or a specific dark background variable like --footer-background
      // For now, assuming primary is dark in light theme and light in dark theme, so bg-primary would work for text contrast.
      // A safer bet for a consistently dark footer might be:
      // className="w-full bg-[hsl(var(--trendzone-dark-blue-hsl))] text-[hsl(var(--trendzone-dark-blue-text-hsl))] py-12 md:py-16 font-inter"
      // OR, define specific footer variables: --footer-bg, --footer-text, --footer-heading, --footer-link-hover
      className="w-full bg-card text-card-foreground py-12 md:py-16 font-inter" // Using card as a dark base
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-10 md:mb-12">
          {/* Help Section */}
          <motion.div variants={itemVariants}>
            {/* text-white -> text-foreground (or text-card-foreground) */}
            <h3 className="text-lg font-semibold mb-5 text-foreground uppercase tracking-wider">
              Help
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/terms"
                  // hover:text-trendzone-light-blue -> hover:text-trendzone-light-blue
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
            </ul>
          </motion.div>

          {/* Company Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-5 text-foreground uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              {/* <li>
                <Link to="/about-us" className="hover:text-trendzone-light-blue transition-colors duration-200">
                  About Us
                </Link>
              </li> */}
              <li>
                <Link
                  to="/contact"
                  className="hover:text-trendzone-light-blue transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Shop Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-5 text-foreground uppercase tracking-wider">
              Shop
            </h3>
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
            </ul>
          </motion.div>

          {/* Brand Name */}
          <motion.div
            className="flex flex-col items-start sm:col-span-2 md:col-span-1 md:items-start lg:items-end text-left lg:text-right"
            variants={itemVariants}
          >
            <Link
              to="/"
              // text-white -> text-foreground
              className="text-2xl lg:text-3xl font-bold mb-5 text-foreground uppercase tracking-widest hover:text-trendzone-light-blue"
            >
              WearFlare
            </Link>
            {/* Add social links here if needed using the socialLinks array */}
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          // border-trendzone-light-blue/20 -> border-border/20 (or border-accent/20)
          className="mt-10 pt-8 border-t border-border/20 flex flex-col-reverse md:flex-row justify-between items-center text-center md:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* text-gray-400 -> text-muted-foreground */}
          <p className="text-xs text-muted-foreground mt-4 md:mt-0">
            © {currentYear} WearFlare Ltd. All Rights Reserved
          </p>
          <div className="flex space-x-5">
            <Link
              to="/terms"
              // text-gray-400 -> text-muted-foreground
              // hover:text-trendzone-light-blue -> hover:text-trendzone-light-blue
              className="text-xs text-muted-foreground hover:text-trendzone-light-blue transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-xs text-muted-foreground hover:text-trendzone-light-blue transition-colors duration-200"
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

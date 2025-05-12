// src/components/Faqs.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react' // Minus icon not used with this Plus rotate logic

import faqImage from '../assets/faq-image.jpg' // Example import path - Path check karein

const faqsData = [
  {
    question: 'What sizes do you offer?',
    answer:
      'We offer sizes ranging from XS to XXL across most items. Please refer to the specific product page and our comprehensive size guide for detailed measurements to ensure the perfect fit.',
  },
  {
    question: 'How can I return a product?',
    answer:
      'If you’re not satisfied with your purchase, you can request a return within 7 days of delivery. Please make sure the product is unused, in its original packaging, and includes all tags. To initiate a return, contact our customer support or follow the return instructions provided in your order confirmation email.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We accept returns within 30 days of the delivery date, provided the items are unworn, unwashed, and in their original packaging with all tags attached. Some exclusions may apply. Please visit our returns portal page for detailed instructions and to initiate a return.',
  },
  {
    question: 'Do you offer international shipping?',
    answer:
      'Yes, Wearflare ships globally! Shipping costs and estimated delivery times vary depending on the destination country and selected shipping method. Applicable duties and taxes are the responsibility of the recipient.',
  },
  {
    question: 'Can I change or cancel my order after placing it?',
    answer:
      "We process orders quickly, but we'll do our best to accommodate changes or cancellations if you contact us within 1-2 hours of placing your order. Please reach out to our customer support team immediately with your order number for assistance.",
  },
]

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const answerVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  visible: {
    opacity: 1,
    height: 'auto',
    marginTop: '1rem', // Consider using theme spacing if available
    marginBottom: '1rem', // Consider using theme spacing if available
    transition: { duration: 0.3, ease: 'easeIn' },
  },
}

const Faqs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <motion.section
      // bg-white -> bg-background
      className="bg-background py-16 md:py-24 px-4 sm:px-6 lg:px-8 font-inter"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Title and FAQs */}
        <motion.div variants={itemVariants} className="md:order-1">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 md:mb-10">
            {/* text-Wearflare-dark-blue -> text-primary (assuming Wearflare-dark-blue is your primary) */}
            Got Questions? <br className="hidden sm:block" /> We Have Answers
          </h2>
          <div className="space-y-4">
            {faqsData.map((faq, index) => (
              <motion.div
                key={index}
                // bg-gray-50/70 -> bg-card/50 or bg-muted/30 (a very light version of card/muted)
                // border-gray-200/80 -> border-border/80
                className="bg-card/50 rounded-xl overflow-hidden border border-border/80"
                variants={itemVariants}
              >
                <motion.button
                  // text-Wearflare-dark-blue -> text-foreground (or text-card-foreground if card bg is distinct)
                  // hover:bg-gray-100 -> hover:bg-muted/50
                  // focus-visible:ring-Wearflare-light-blue -> focus-visible:ring-ring (general focus ring)
                  className="w-full flex justify-between items-center px-5 py-4 sm:px-6 sm:py-5 text-left text-base sm:text-lg font-semibold text-foreground hover:bg-muted/50 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-t-xl"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  {faq.question}
                  <motion.div animate={{ rotate: openIndex === index ? 45 : 0 }}>
                    {/* text-Wearflare-light-blue -> text-accent (or text-primary for icon color) */}
                    <Plus className="w-5 h-5 text-trendzone-light-blue flex-shrink-0" />
                  </motion.div>
                </motion.button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      // text-gray-700 -> text-muted-foreground (or text-secondary-foreground)
                      className="px-5 sm:px-6 text-sm sm:text-base text-muted-foreground overflow-hidden"
                      key="content"
                      variants={answerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Image */}
        <motion.div
          className="md:order-2 flex justify-center md:justify-end items-start mt-8 md:mt-0"
          variants={itemVariants}
        >
          <div className="w-full max-w-md lg:max-w-lg aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
            <img
              src={faqImage}
              alt="Stylish person related to FAQs" // Updated alt text
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Faqs

// src/components/Faqs.tsx
import React, { useState } from 'react' // Removed useEffect if not needed
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

// Placeholder for the image - replace with your actual image import or URL
import faqImage from '../assets/faq-image.jpg' // Example import path

const faqsData = [
  {
    question: 'What sizes do you offer?',
    answer:
      'We offer sizes ranging from XS to XXL across most items. Please refer to the specific product page and our comprehensive size guide for detailed measurements to ensure the perfect fit.',
  },
  {
    question: 'How can I track my order?',
    answer:
      "Once your order is dispatched from our warehouse, you will receive a shipping confirmation email containing a tracking number and a link to the carrier's website. You can use this link to monitor your delivery status in real-time.",
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
    marginTop: '1rem',
    marginBottom: '1rem',
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
      className="bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 font-inter"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Title and FAQs */}
        <motion.div variants={itemVariants} className="md:order-1">
          <h2 className="text-3xl md:text-4xl font-bold text-Wearflare-dark-blue mb-8 md:mb-10">
            Got Questions? <br className="hidden sm:block" /> We Have Answers
          </h2>
          <div className="space-y-4">
            {faqsData.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gray-50/70 rounded-xl overflow-hidden border border-gray-200/80"
                variants={itemVariants} // Staggered entry for each FAQ item
              >
                <motion.button
                  className="w-full flex justify-between items-center px-5 py-4 sm:px-6 sm:py-5 text-left text-base sm:text-lg font-semibold text-Wearflare-dark-blue hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-Wearflare-light-blue focus-visible:ring-offset-2 rounded-t-xl"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  {faq.question}
                  <motion.div animate={{ rotate: openIndex === index ? 45 : 0 }}>
                    <Plus className="w-5 h-5 text-Wearflare-light-blue flex-shrink-0" />
                  </motion.div>
                </motion.button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      className="px-5 sm:px-6 text-sm sm:text-base text-gray-700 overflow-hidden" // Base styling, height/opacity controlled by variants
                      key="content" // Important for AnimatePresence
                      variants={answerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      // No transition prop here, it's defined in variants
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
          variants={itemVariants} // Staggered entry for the image block
        >
          <div className="w-full max-w-md lg:max-w-lg aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
            <img
              src={faqImage} // Use the imported image or direct URL
              alt="Stylish person answering questions"
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

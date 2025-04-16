import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import AnimatedSection from './AnimatedSection'

const faqs = [
  {
    question: 'What sizes do you offer?',
    answer:
      'We offer sizes ranging from XS to XXL. Please check our size guide for exact measurements.',
  },
  {
    question: 'How can I track my order?',
    answer:
      'Once your order is shipped, we will email you a tracking link so you can monitor your delivery status.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We accept returns within 30 days of purchase. Items must be unused and in original packaging. Visit our returns page for more details.',
  },
  {
    question: 'Do you offer international shipping?',
    answer:
      'Yes, we ship worldwide! Shipping costs and delivery times vary depending on your location.',
  },
  {
    question: 'Can I change or cancel my order?',
    answer:
      'You can modify or cancel your order within 24 hours after placing it. Contact our support team for assistance.',
  },
]

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="bg-[#e9e2d8] text-white py-12 px-6 md:px-16 ">
      <h2 className="text-3xl font-bold text-center text-[#c8a98a] mb-8">
        Frequently Asked Questions
      </h2>
      <AnimatedSection direction="top">
        <div className="max-w-3xl mx-auto space-y-4 rounded-xl">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white text-black  shadow-md rounded-xl">
              <button
                className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold text-[#c8a98a] hover:bg-gray-100 transition"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                {openIndex === index ? (
                  <ChevronUp className="text-[#c8a98a]" />
                ) : (
                  <ChevronDown className="text-[#c8a98a]" />
                )}
              </button>
              <div
                className={`px-5 mt-1      pb-4 text-gray-700 transition-all duration-300 ${
                  openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  )
}

export default Faqs

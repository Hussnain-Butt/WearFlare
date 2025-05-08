// src/components/ContactUs.tsx
import React, { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Send, PhoneCall, Mail, MapPin, ExternalLink, Loader2 } from 'lucide-react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app'
const CONTACT_API_ENDPOINT = `${API_BASE_URL}/api/contact`

interface ToastState {
  id: number
  message: string
  type: 'success' | 'error'
}

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
}

// Animation Variants (can be slightly adjusted for this new style)
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, staggerChildren: 0.15, when: 'beforeChildren' },
  },
}

const columnVariants = (fromLeft: boolean = true) => ({
  hidden: { opacity: 0, x: fromLeft ? -40 : 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1 },
  },
})

const textItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const formBlockVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut', delay: 0.2, staggerChildren: 0.07 },
  },
}

const formInputVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const showToast = (message: string, type: 'success' | 'error') => {
    // ... (showToast logic remains the same) ...
    const newToast = { id: Date.now(), message, type }
    setToast(newToast)
    setTimeout(
      () => setToast((currentToast) => (currentToast?.id === newToast.id ? null : currentToast)),
      4500,
    )
  }

  const validateForm = (): FormErrors => {
    // ... (validation logic remains the same) ...
    const newErrors: FormErrors = {}
    const { name, email, phone, subject, message } = formData

    if (!name.trim()) newErrors.name = 'Name is required.'
    else if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters.'

    if (!email.trim()) newErrors.email = 'Email is required.'
    else if (!/.+@.+\..+/.test(email.trim())) newErrors.email = 'Invalid email format.'

    if (phone.trim() && !/^\+?[0-9\s-()]{7,20}$/.test(phone.trim()))
      newErrors.phone = 'Invalid phone number format.'

    if (!subject.trim()) newErrors.subject = 'Subject is required.'
    else if (subject.trim().length < 3) newErrors.subject = 'Subject must be at least 3 characters.'

    if (!message.trim()) newErrors.message = 'Message is required.'
    else if (message.trim().length < 10)
      newErrors.message = 'Message must be at least 10 characters.'

    return newErrors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // ... (handleChange logic remains the same) ...
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[name as keyof FormErrors]
        return updated
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // ... (handleSubmit logic remains the same) ...
    e.preventDefault()
    setErrors({})
    setToast(null)

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      showToast('Please correct the errors below.', 'error')
      return
    }

    setIsLoading(true)
    try {
      const [firstName, ...lastNameParts] = formData.name.trim().split(' ')
      const lastName = lastNameParts.join(' ')

      const payload = {
        firstName: firstName || 'N/A',
        lastName: lastName || '',
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      }

      const response = await axios.post(CONTACT_API_ENDPOINT, payload)
      if (response.status === 200 || response.status === 201) {
        showToast("Message sent! We'll be in touch soon.", 'success')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        setErrors({})
      } else {
        throw new Error(response.data.message || 'Failed to send message.')
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Message could not be sent. Please try again.'
      showToast(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const formFields = [
    { name: 'name', type: 'text', placeholder: 'Name', error: errors.name },
    { name: 'email', type: 'email', placeholder: 'Email', error: errors.email },
    { name: 'phone', type: 'tel', placeholder: 'Phone (Optional)', error: errors.phone },
    { name: 'subject', type: 'text', placeholder: 'Subject', error: errors.subject },
  ]

  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex flex-col font-inter overflow-x-hidden" // Overall page bg
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {toast /* ... Toast styling ... */ && (
          <motion.div
            key={toast.id}
            className={`fixed top-5 right-5 px-6 py-3 rounded-lg text-white font-medium shadow-xl z-[100] text-sm`}
            style={{ backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444' }}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
            role="alert"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full flex-grow grid grid-cols-1 md:grid-cols-2">
        {/* Left Column */}
        <motion.div
          className="w-full bg-white text-trendzone-dark-blue p-8 sm:p-12 md:p-16 lg:p-24 flex flex-col justify-center"
          variants={columnVariants(true)}
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-none tracking-tighter mb-8"
            variants={textItemVariants}
          >
            Let's get
            <br />
            in touch
          </motion.h1>

          <motion.h2
            className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800"
            variants={textItemVariants}
          >
            Don't be afraid to say hello with us!
          </motion.h2>

          <motion.div
            className="space-y-5 text-sm sm:text-base text-gray-700"
            variants={textItemVariants}
          >
            <div className="flex items-center">
              <PhoneCall size={18} className="mr-3 text-trendzone-light-blue flex-shrink-0" />
              <span>
                Phone:{' '}
                <a
                  href="tel:+2578365379"
                  className="hover:text-trendzone-light-blue transition-colors"
                >
                  + (2) 578-365-379
                </a>
              </span>
            </div>
            <div className="flex items-center">
              <Mail size={18} className="mr-3 text-trendzone-light-blue flex-shrink-0" />
              <span>
                Email:{' '}
                <a
                  href="mailto:hello@trendzone.com"
                  className="hover:text-trendzone-light-blue transition-colors"
                >
                  hello@trendzone.com
                </a>
              </span>
            </div>
            <div className="flex items-start">
              <MapPin size={18} className="mr-3 mt-1 text-trendzone-light-blue flex-shrink-0" />
              <span>Office: 123 Fashion Ave, Style City, PK</span>
            </div>
            <div>
              <a
                href="https://maps.google.com/?q=123+Fashion+Ave,+Style+City,+PK"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-trendzone-dark-blue hover:text-trendzone-light-blue font-medium transition-colors group text-sm"
              >
                See on Google Map
                <ExternalLink
                  size={14}
                  className="ml-1.5 transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          className="w-full bg-white p-8 sm:p-12 md:p-16 lg:p-20 flex flex-col" // Right column now has white background
          variants={columnVariants(false)}
        >
          <motion.div className="flex items-start mb-10 md:mb-12" variants={textItemVariants}>
            {' '}
            {/* Increased bottom margin */}
            <motion.p className="text-sm text-gray-600 mr-4 leading-relaxed max-w-xs pt-1">
              {' '}
              {/* Adjusted leading and pt */}
              Great! We're excited to hear from you and let's start something special together. Call
              us for any inquiry.
            </motion.p>
            <ArrowRight
              size={28}
              className="text-trendzone-dark-blue flex-shrink-0 hidden sm:block mt-1"
            />{' '}
            {/* Adjusted size and margin */}
          </motion.div>

          <motion.div
            className="bg-trendzone-dark-blue p-8 sm:p-10 rounded-xl shadow-2xl text-white flex-grow flex flex-col" // flex-grow and flex-col
            variants={formBlockVariants}
          >
            <h3 className="text-xl sm:text-2xl font-semibold mb-8 text-center sm:text-left">
              Contact
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5 flex-grow flex flex-col" noValidate>
              {' '}
              {/* flex-grow and flex-col */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
                {' '}
                {/* Reduced gap */}
                {formFields.map((field, index) => (
                  <motion.div key={field.name} variants={formInputVariants} custom={index}>
                    {/* Removed placeholder from label, using sr-only */}
                    <label htmlFor={field.name} className="sr-only">
                      {field.placeholder}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name as keyof FormData]}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-trendzone-dark-blue placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-200 ${
                        field.error
                          ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                          : 'focus:ring-trendzone-light-blue focus:border-trendzone-light-blue'
                      }`}
                      required={field.name !== 'phone'}
                      aria-invalid={!!field.error}
                    />
                    {field.error && <p className="mt-1.5 text-xs text-red-400">{field.error}</p>}
                  </motion.div>
                ))}
              </div>
              <motion.div
                variants={formInputVariants}
                custom={formFields.length}
                className="flex-grow flex flex-col"
              >
                {' '}
                {/* flex-grow */}
                <label htmlFor="message" className="sr-only">
                  Tell us about what you're interested in
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about what you're interested in"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-trendzone-dark-blue placeholder-gray-500 focus:outline-none focus:ring-2 resize-none transition-colors duration-200 flex-grow ${
                    // flex-grow
                    errors.message
                      ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                      : 'focus:ring-trendzone-light-blue focus:border-trendzone-light-blue'
                  }`}
                  required
                  aria-invalid={!!errors.message}
                ></textarea>
                {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
              </motion.div>
              <motion.button
                type="submit"
                className="w-full bg-trendzone-light-blue text-trendzone-dark-blue py-3 px-6 rounded-lg text-sm sm:text-base font-semibold hover:bg-white transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-trendzone-dark-blue focus:ring-white disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-auto" // mt-auto
                disabled={isLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send to us'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ContactUs

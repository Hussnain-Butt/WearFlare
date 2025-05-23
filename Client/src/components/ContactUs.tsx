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

// Animation Variants - UNCHANGED
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
// END Animation Variants

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
    const newToast = { id: Date.now(), message, type }
    setToast(newToast)
    setTimeout(
      () => setToast((currentToast) => (currentToast?.id === newToast.id ? null : currentToast)),
      4500,
    )
  }

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}
    const { name, email, phone, subject, message } = formData

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required.'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.'
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/.test(name.trim())) {
      newErrors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes.'
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required.'
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
      newErrors.email = 'Invalid email format. Please enter a valid email address.'
    }

    // Phone validation (NOW REQUIRED)
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.'
    } else if (!/^\+?[\d\s\-().]{7,20}$/.test(phone.trim())) {
      newErrors.phone = 'Invalid phone number. (e.g., +1 123-456-7890 or 03001234567)'
    }

    // Subject validation
    if (!subject.trim()) {
      newErrors.subject = 'Subject is required.'
    } else if (subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters long.'
    }

    // Message validation
    if (!message.trim()) {
      newErrors.message = 'Message is required.'
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.'
    }

    return newErrors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    e.preventDefault()
    setErrors({})
    setToast(null)

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      showToast('Please correct the errors highlighted below.', 'error')
      return
    }

    setIsLoading(true)
    try {
      const trimmedName = formData.name.trim()
      const nameParts = trimmedName.split(/\s+/)
      const firstName = nameParts[0] || 'N/A'
      const lastName = nameParts.slice(1).join(' ') || ''

      const payload = {
        firstName: firstName,
        lastName: lastName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      }

      const response = await axios.post(CONTACT_API_ENDPOINT, payload)

      if (response.status === 200 || response.status === 201) {
        showToast("Message sent successfully! We'll be in touch soon.", 'success')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        setErrors({})
      } else {
        throw new Error(response.data.message || 'Failed to send message due to server response.')
      }
    } catch (error: any) {
      console.error('Contact form submission error:', error)
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Your message could not be sent. Please try again later.'
      showToast(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const formFields = [
    { name: 'name', type: 'text', placeholder: 'Full Name', error: errors.name },
    { name: 'email', type: 'email', placeholder: 'Email Address', error: errors.email },
    { name: 'phone', type: 'tel', placeholder: 'Phone Number', error: errors.phone }, // Removed (Optional)
    {
      name: 'subject',
      type: 'text',
      placeholder: 'Subject of your message',
      error: errors.subject,
    },
  ]

  return (
    <motion.div
      className="min-h-screen bg-background flex flex-col font-inter overflow-x-hidden"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className={`fixed top-5 right-5 px-6 py-3 rounded-lg font-medium shadow-xl z-[100] text-sm
              ${
                toast.type === 'success'
                  ? 'text-[hsl(var(--success-text-hsl))]'
                  : 'text-destructive-foreground'
              }`}
            style={{
              backgroundColor:
                toast.type === 'success'
                  ? 'hsl(var(--success-bg-hsl))'
                  : 'hsl(var(--destructive-bg-hsl))',
            }}
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
          className="w-full bg-card text-card-foreground p-8 sm:p-12 md:p-16 lg:p-24 flex flex-col justify-center"
          variants={columnVariants(true)}
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-none tracking-tighter mb-8 text-primary"
            variants={textItemVariants}
          >
            Let's get
            <br />
            in touch
          </motion.h1>

          <motion.h2
            className="text-xl sm:text-2xl font-semibold mb-6 text-foreground"
            variants={textItemVariants}
          >
            Don't be afraid to say hello with us!
          </motion.h2>

          <motion.div
            className="space-y-5 text-sm sm:text-base text-muted-foreground"
            variants={textItemVariants}
          >
            <div className="flex items-center">
              <PhoneCall size={18} className="mr-3 text-primary flex-shrink-0" />
              <span>
                Phone:{' '}
                <a href="tel:+2578365379" className="hover:text-accent transition-colors">
                  + (2) 578-365-379
                </a>
              </span>
            </div>
            <div className="flex items-center">
              <Mail size={18} className="mr-3 text-primary flex-shrink-0" />
              <span>
                Email:{' '}
                <a
                  href="mailto:hello@wearflare.com"
                  className="hover:text-accent transition-colors"
                >
                  hello@wearflare.com
                </a>
              </span>
            </div>
            <div className="flex items-start">
              <MapPin size={18} className="mr-3 mt-1 text-primary flex-shrink-0" />
              <span>Office: 123 Fashion Ave, Style City, PK</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          className="w-full bg-background p-8 sm:p-12 md:p-16 lg:p-20 flex flex-col"
          variants={columnVariants(false)}
        >
          <motion.div className="flex items-start mb-10 md:mb-12" variants={textItemVariants}>
            <motion.p className="text-sm text-muted-foreground mr-4 leading-relaxed max-w-xs pt-1">
              Great! We're excited to hear from you and let's start something special together. Call
              us for any inquiry.
            </motion.p>
            <ArrowRight size={28} className="text-primary flex-shrink-0 hidden sm:block mt-1" />
          </motion.div>

          <motion.div
            className="bg-card p-8 sm:p-10 rounded-xl shadow-2xl text-card-foreground flex-grow flex flex-col"
            variants={formBlockVariants}
          >
            <h3 className="text-xl sm:text-2xl font-semibold mb-8 text-center sm:text-left">
              Send Us A Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5 flex-grow flex flex-col" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
                {formFields.map((field, index) => (
                  <motion.div key={field.name} variants={formInputVariants} custom={index}>
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
                      className={`w-full px-4 py-3 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors duration-200 ${
                        field.error
                          ? 'border-destructive focus:ring-destructive focus:border-destructive'
                          : 'focus:ring-ring focus:border-primary'
                      }`}
                      required // All fields are now required
                      aria-invalid={!!field.error}
                      autoComplete={
                        field.name === 'email' ? 'email' : field.name === 'phone' ? 'tel' : 'off'
                      }
                    />
                    {field.error && (
                      <p className="mt-1.5 text-xs text-destructive">{field.error}</p>
                    )}
                  </motion.div>
                ))}
              </div>
              <motion.div
                variants={formInputVariants}
                custom={formFields.length}
                className="flex-grow flex flex-col"
              >
                <label htmlFor="message" className="sr-only">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 resize-none transition-colors duration-200 flex-grow ${
                    errors.message
                      ? 'border-destructive focus:ring-destructive focus:border-destructive'
                      : 'focus:ring-ring focus:border-primary'
                  }`}
                  required
                  aria-invalid={!!errors.message}
                  rows={4}
                ></textarea>
                {errors.message && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.message}</p>
                )}
              </motion.div>
              <motion.button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg text-sm sm:text-base font-semibold hover:bg-primary/80 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-auto"
                disabled={isLoading}
                whileHover={{ scale: !isLoading ? 1.03 : 1 }}
                whileTap={{ scale: !isLoading ? 0.97 : 1 }}
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send size={18} />}
                {isLoading ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ContactUs

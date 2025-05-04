// src/components/ContactUs.tsx
import React, { useState } from 'react'
import axios from 'axios' // *** Import axios ***
import { Mail, Phone, MapPin, Globe, Loader2 } from 'lucide-react' // Added Loader2
import AnimatedSection from './AnimatedSection' // Ensure path is correct

// Define API base URL (adjust if needed)
const API_BASE_URL = 'http://localhost:5000' // Or http://localhost:5000
const CONTACT_API_ENDPOINT = `${API_BASE_URL}/api/contact`

// Define interface for toast state
interface ToastState {
  message: string
  type: 'success' | 'error'
}

// --- Define interface for form errors ---
interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  message?: string
  // No general error needed if using toast for general messages
}

const ContactUs: React.FC = () => {
  // Use React.FC for type safety
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null) // Typed toast state
  const [errors, setErrors] = useState<FormErrors>({}) // --- State for validation errors ---

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500) // Slightly longer duration
  }

  // --- Validation Function ---
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}
    const nameRegex = /^[A-Za-z\s'-]+$/ // Allows letters, space, hyphen, apostrophe

    // Trim values before validation
    const fName = firstName.trim()
    const lName = lastName.trim()
    const mail = email.trim()
    const msg = message.trim()

    // First Name validation
    if (!fName) {
      newErrors.firstName = 'First Name is required.'
    } else if (!nameRegex.test(fName)) {
      newErrors.firstName = 'First Name can only contain letters, spaces, hyphens, and apostrophes.'
    } else if (fName.length < 2) {
      newErrors.firstName = 'First Name must be at least 2 characters.'
    }

    // Last Name validation
    if (!lName) {
      newErrors.lastName = 'Last Name is required.'
    } else if (!nameRegex.test(lName)) {
      newErrors.lastName = 'Last Name can only contain letters, spaces, hyphens, and apostrophes.'
    } else if (lName.length < 2) {
      newErrors.lastName = 'Last Name must be at least 2 characters.'
    }

    // Email validation
    if (!mail) {
      newErrors.email = 'Email Address is required.'
    } else if (!/.+@.+\..+/.test(mail)) {
      // Basic email format check
      newErrors.email = 'Please enter a valid email address.'
    }

    // Message validation
    if (!msg) {
      newErrors.message = 'Message is required.'
    } else if (msg.length < 10) {
      // Example: Minimum 10 characters
      newErrors.message = 'Message must be at least 10 characters long.'
    }

    return newErrors
  }
  // --- End Validation Function ---

  // --- UPDATED handleSubmit Function ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({}) // Clear previous errors
    setToast(null) // Clear previous toast

    // --- Validate the form ---
    const validationErrors = validateForm()

    // --- If there are errors, update state and stop submission ---
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      showToast('Please fix the errors in the form.', 'error')
      return // Stop submission
    }

    // --- If validation passes, proceed with API call ---
    setIsLoading(true)

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      message: message.trim(),
    }

    try {
      const response = await axios.post(CONTACT_API_ENDPOINT, payload)

      if (response.status === 200) {
        showToast('Message sent successfully! We will get back to you soon.', 'success')
        // Clear the form and errors on success
        setFirstName('')
        setLastName('')
        setEmail('')
        setMessage('')
        setErrors({}) // Clear errors state
      } else {
        throw new Error(response.data.message || 'Failed to send message.')
      }
    } catch (error: any) {
      console.error('Contact form submission error:', error.response?.data || error.message)
      const errorMessage =
        error.response?.data?.message || 'Could not send message. Please try again later.'
      showToast(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }
  // --- END UPDATED handleSubmit ---

  // --- Helper to clear error for a field on change ---
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: keyof FormErrors) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value)
      // Clear the specific error when the user starts typing in the field
      if (errors[fieldName]) {
        setErrors((prev) => {
          const updatedErrors = { ...prev }
          delete updatedErrors[fieldName]
          return updatedErrors
        })
      }
    }

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-[#6b5745] mb-10 text-center">
        Get in <span className="text-[#c8a98a]">Touch.</span>
      </h1>
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-6 sm:p-10 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {/* Contact Form */}
        <AnimatedSection direction="left">
          <div>
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
              {' '}
              {/* Added noValidate to prevent default HTML5 validation popups */}
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="sr-only">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    // --- Apply error class dynamically ---
                    className={`contact-input ${
                      errors.firstName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/40'
                        : 'border-gray-300 focus:border-[#c8a98a] focus:ring-[#c8a98a]/40'
                    }`}
                    value={firstName}
                    // --- Use helper for onChange ---
                    onChange={handleInputChange(setFirstName, 'firstName')}
                    required // Keep for basic browser fallback and semantics
                    aria-invalid={!!errors.firstName} // Accessibility
                    aria-describedby={errors.firstName ? 'firstName-error' : undefined} // Accessibility
                  />
                  {/* --- Display First Name Error --- */}
                  {errors.firstName && (
                    <p id="firstName-error" className="mt-1 text-xs text-red-600" role="alert">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="sr-only">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    // --- Apply error class dynamically ---
                    className={`contact-input ${
                      errors.lastName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/40'
                        : 'border-gray-300 focus:border-[#c8a98a] focus:ring-[#c8a98a]/40'
                    }`}
                    value={lastName}
                    // --- Use helper for onChange ---
                    onChange={handleInputChange(setLastName, 'lastName')}
                    required
                    aria-invalid={!!errors.lastName} // Accessibility
                    aria-describedby={errors.lastName ? 'lastName-error' : undefined} // Accessibility
                  />
                  {/* --- Display Last Name Error --- */}
                  {errors.lastName && (
                    <p id="lastName-error" className="mt-1 text-xs text-red-600" role="alert">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email" // Keep type email for mobile keyboards etc.
                  placeholder="Email Address"
                  // --- Apply error class dynamically ---
                  className={`contact-input ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/40'
                      : 'border-gray-300 focus:border-[#c8a98a] focus:ring-[#c8a98a]/40'
                  }`}
                  value={email}
                  // --- Use helper for onChange ---
                  onChange={handleInputChange(setEmail, 'email')}
                  required
                  aria-invalid={!!errors.email} // Accessibility
                  aria-describedby={errors.email ? 'email-error' : undefined} // Accessibility
                />
                {/* --- Display Email Error --- */}
                {errors.email && (
                  <p id="email-error" className="mt-1 text-xs text-red-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
              {/* Message Textarea */}
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Your Message"
                  rows={5}
                  // --- Apply error class dynamically ---
                  className={`contact-input resize-y ${
                    errors.message
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/40'
                      : 'border-gray-300 focus:border-[#c8a98a] focus:ring-[#c8a98a]/40'
                  }`}
                  value={message}
                  // --- Use helper for onChange ---
                  onChange={handleInputChange(setMessage, 'message')}
                  required
                  aria-invalid={!!errors.message} // Accessibility
                  aria-describedby={errors.message ? 'message-error' : undefined} // Accessibility
                ></textarea>
                {/* --- Display Message Error --- */}
                {errors.message && (
                  <p id="message-error" className="mt-1 text-xs text-red-600" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#c8a98a] text-white py-3 rounded-md text-lg font-medium hover:bg-[#b08d6a] transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8a98a] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    {' '}
                    <Loader2 className="animate-spin mr-2 h-5 w-5" /> Sending...{' '}
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </form>
          </div>
        </AnimatedSection>

        {/* Contact Information (Right Side) */}
        <div className="bg-[#F5EDE2] p-6 sm:p-8 rounded-lg shadow-inner">
          {' '}
          {/* Changed shadow */}
          <h2 className="text-2xl font-semibold text-[#6b5745] mb-6">Contact Us</h2>
          <p className="text-gray-700 mb-6 text-sm sm:text-base">
            Whether you have questions about our services, need support, or want to share your
            feedback, our dedicated team is here to assist you.
          </p>
          <div className="space-y-5 sm:space-y-6">
            {/* Email */}
            <div className="flex items-start gap-3 sm:gap-4">
              <Mail className="text-[#c8a98a] mt-1 flex-shrink-0" size={22} />
              <div>
                <h3 className="text-md sm:text-lg font-semibold text-[#6b5745]">Email</h3>
                <a
                  href="mailto:hello@gmail.com"
                  className="text-gray-800 text-sm sm:text-base hover:text-[#c8a98a] break-all"
                >
                  hello@gmail.com
                </a>
              </div>
            </div>
            {/* Phone */}
            <div className="flex items-start gap-3 sm:gap-4">
              <Phone className="text-[#c8a98a] mt-1 flex-shrink-0" size={22} />
              <div>
                <h3 className="text-md sm:text-lg font-semibold text-[#6b5745]">Phone</h3>
                {/* Make phone number clickable */}
                <a
                  href="tel:+9232643456"
                  className="text-gray-800 text-sm sm:text-base hover:text-[#c8a98a]"
                >
                  032643456
                </a>{' '}
                {/* Adjust format if needed */}
              </div>
            </div>
            {/* Location */}
            <div className="flex items-start gap-3 sm:gap-4">
              <MapPin className="text-[#c8a98a] mt-1 flex-shrink-0" size={22} />
              <div>
                <h3 className="text-md sm:text-lg font-semibold text-[#6b5745]">Location</h3>
                <p className="text-gray-800 text-sm sm:text-base">
                  123 Anywhere St., Any City, Pakistan
                </p>{' '}
                {/* Added country */}
              </div>
            </div>
            {/* Website */}
            <div className="flex items-start gap-3 sm:gap-4">
              <Globe className="text-[#c8a98a] mt-1 flex-shrink-0" size={22} />
              <div>
                <h3 className="text-md sm:text-lg font-semibold text-[#6b5745]">Website</h3>
                {/* Make website clickable and add protocol */}
                <a
                  href="https://Wearflaresite.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 text-sm sm:text-base hover:text-[#c8a98a]"
                >
                  Wearflaresite.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>{' '}
      {/* End main content grid */}
      {/* Toast Notification */}
      {toast && (
        <div
          // Added animation classes
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-md text-white font-medium shadow-lg transition-all duration-300 ease-out ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} // Animate in/out
          role="alert"
        >
          {toast.message}
        </div>
      )}
      {/* --- Styles --- */}
      <style jsx>{`
        .contact-input {
          display: block;
          width: 100%;
          padding: 0.75rem; /* p-3 */
          border: 1px solid #d1d5db; /* default: border-gray-300 */
          border-radius: 0.375rem; /* rounded-md */
          transition: border-color 0.2s, box-shadow 0.2s;
          font-size: 0.875rem; /* text-sm */
        }
        /* --- Updated Focus Styles --- */
        .contact-input:focus {
          outline: none;
          /* Dynamic ring/border color is handled by utility classes now */
          /* border-color: #c8a98a; */
          /* box-shadow: 0 0 0 2px rgba(200, 169, 138, 0.4); */
        }
        /* --- Add Specific Error Border Style (optional, can be done with Tailwind class 'border-red-500') --- */
        /* .contact-input.border-red-500 { border-color: #ef4444; } */

        /* --- Focus styles are now applied conditionally using Tailwind classes --- */
        /* Example for normal state: focus:border-[#c8a98a] focus:ring-[#c8a98a]/40 */
        /* Example for error state: focus:border-red-500 focus:ring-red-500/40 */

        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        /* --- Style for error text --- */
        .text-red-600 {
          color: #dc2626;
        }
        .text-xs {
          font-size: 0.75rem;
        }
        .mt-1 {
          margin-top: 0.25rem;
        }
        /* --- Style for error border (applied via className) --- */
        .border-red-500 {
          border-color: #ef4444;
        }
        /* --- Style for error focus ring (applied via className) --- */
        .focus\\:border-red-500:focus {
          border-color: #ef4444;
        }
        .focus\\:ring-red-500\\/40:focus {
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.4);
        } /* Tailwind ring color with opacity */
      `}</style>
    </div> // End Page Container
  )
}

export default ContactUs

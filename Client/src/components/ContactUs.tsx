// src/components/ContactUs.tsx
import React, { useState } from 'react'
import axios from 'axios' // *** Import axios ***
import { Mail, Phone, MapPin, Globe, Loader2 } from 'lucide-react' // Added Loader2
import AnimatedSection from './AnimatedSection' // Ensure path is correct

// Define API base URL (adjust if needed)
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // Or https://backend-production-c8ff.up.railway.app
const CONTACT_API_ENDPOINT = `${API_BASE_URL}/api/contact`

// Define interface for toast state
interface ToastState {
  message: string
  type: 'success' | 'error'
}

const ContactUs: React.FC = () => {
  // Use React.FC for type safety
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null) // Typed toast state

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500) // Slightly longer duration
  }

  // --- UPDATED handleSubmit Function ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Typed event
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill in all fields.', 'error')
      return
    }
    // Optional: Basic email format check on frontend too
    if (!/.+\@.+\..+/.test(email)) {
      showToast('Please enter a valid email address.', 'error')
      return
    }

    setIsLoading(true)
    setToast(null) // Clear previous toast

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      message: message.trim(),
    }

    try {
      // Make the POST request to the backend
      const response = await axios.post(CONTACT_API_ENDPOINT, payload)

      if (response.status === 200) {
        showToast('Message sent successfully! We will get back to you soon.', 'success')
        // Clear the form on success
        setFirstName('')
        setLastName('')
        setEmail('')
        setMessage('')
      } else {
        // Handle unexpected success statuses if backend sends them
        throw new Error(response.data.message || 'Failed to send message.')
      }
    } catch (error: any) {
      console.error('Contact form submission error:', error.response?.data || error.message)
      // Show specific error from backend if available, otherwise generic
      const errorMessage =
        error.response?.data?.message || 'Could not send message. Please try again later.'
      showToast(errorMessage, 'error')
    } finally {
      setIsLoading(false) // Stop loading indicator regardless of outcome
    }
  }
  // --- END UPDATED handleSubmit ---

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
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
                    className="contact-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required // Add HTML validation
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="sr-only">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    className="contact-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  className="contact-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                  className="contact-input resize-y" // Allow vertical resize
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
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
      {/* --- REMOVED COMMENT HERE --- */}
      <style jsx>{`
        .contact-input {
          display: block;
          width: 100%;
          padding: 0.75rem; /* p-3 */
          border: 1px solid #d1d5db; /* border-gray-300 */
          border-radius: 0.375rem; /* rounded-md */
          transition: border-color 0.2s, box-shadow 0.2s;
          font-size: 0.875rem; /* text-sm */
        }
        .contact-input:focus {
          outline: none;
          border-color: #c8a98a;
          box-shadow: 0 0 0 2px rgba(200, 169, 138, 0.4); /* focus:ring-2 focus:ring-[#c8a98a] with opacity */
        }
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
      `}</style>
    </div> // End Page Container
  )
}

export default ContactUs

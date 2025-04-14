import React, { useState } from 'react'
import { Mail, Phone, MapPin, Globe } from 'lucide-react'
import AnimatedSection from './AnimatedSection'

const ContactUs = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!firstName || !lastName || !email || !message) {
      showToast('Please fill in all fields', 'error')
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      showToast('Message sent successfully!', 'success')
      setFirstName('')
      setLastName('')
      setEmail('')
      setMessage('')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col items-center py-12 px-6">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-[#6b5745] mb-10 text-center">
        Get in <span className="text-[#c8a98a]">Touch.</span>
      </h1>

      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-10 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <AnimatedSection direction="left">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a98a]"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a98a]"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a98a]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <textarea
                placeholder="Message"
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a98a]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>

              <button
                type="submit"
                className="w-full bg-[#c8a98a] text-white py-3 rounded-md text-lg font-medium hover:bg-[#6b5745] transition duration-300 shadow-md"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>
        </AnimatedSection>

        {/* Contact Information */}
        <div className="bg-[#F5EDE2] p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-[#6b5745] mb-6">Contact Us</h2>
          <p className="text-gray-700 mb-6">
            Whether you have questions about our services, need support, or want to share your
            feedback, our dedicated team is here to assist you.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="text-[#8B4513]" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-[#6b5745]">Email</h3>
                <p className="text-gray-800">hello@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="text-[#8B4513]" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-[#6b5745]">Phone</h3>
                <p className="text-gray-800">032643456</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="text-[#8B4513]" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-[#6b5745]">Location</h3>
                <p className="text-gray-800">123 Anywhere St., Any City</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Globe className="text-[#8B4513]" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-[#6b5745]">Website</h3>
                <p className="text-gray-800">Wearflaresite.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md text-white font-medium ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default ContactUs

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const ContactUs = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !message) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsLoading(true);

    // Simulate form submission process
    setTimeout(() => {
      setIsLoading(false);
      showToast('Message sent successfully!', 'success');
      setFirstName('');
      setLastName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B8860B] via-[#A37408] to-[#8C5F06] text-white py-10">
      <div className="container mx-auto px-6 py-12">
        {/* Heading Section */}
        <h1 className="text-4xl font-bold text-center mb-16">
          Get in <span className="text-white">Touch.</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Contact Form Section */}
          <div className="w-full lg:w-7/12 bg-white/10 p-8 rounded-lg shadow-lg py-[65px]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full p-3 bg-white/20 text-white border border-white/30 rounded-md placeholder-white"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full p-3 bg-white/20 text-white border border-white/30 rounded-md placeholder-white"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 bg-white/20 text-white border border-white/30 rounded-md placeholder-white" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <textarea
                placeholder="Message"
                rows={5}
                className="w-full p-3 bg-white/20 text-white border border-white/30 rounded-md placeholder-white"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>

              <button
                type="submit"
                className="w-full bg-white text-[#B8860B] py-3 rounded-md text-lg font-medium transition-transform transform active:scale-95 placeholder-white"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>

          {/* Contact Info Section */}
          <div className="w-full lg:w-5/12 bg-white/10 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 border-b border-white/20 pb-2">Contact Us</h2>
            <p className="text-gray-300 mb-6">
              Whether you have questions about our services, need support, or want to share your feedback, our dedicated team is here to assist you.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="text-white" size={24} />
                <div>
                  <h3 className="text-lg font-semibold">Email</h3>
                  <p className="text-gray-300">hello@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="text-white" size={24} />
                <div>
                  <h3 className="text-lg font-semibold">Phone</h3>
                  <p className="text-gray-300">032643456</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <MapPin className="text-white" size={24} />
                <div>
                  <h3 className="text-lg font-semibold">Location</h3>
                  <p className="text-gray-300">123 Anywhere St., Any City</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Globe className="text-white" size={24} />
                <div>
                  <h3 className="text-lg font-semibold">Website</h3>
                  <p className="text-gray-300">Wearflaresite.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md text-white font-medium ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;


import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Navbar from './Navbar';

const ContactUs = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    <div className="min-h-screen w-full background">
      <div className="gradient-bg" />
      <div className="corner-dark-top" />
      <div className="corner-dark-bottom" />
      <div className="glow-effect" />
      
   
      {/* <nav className="relative z-10 flex justify-between items-center py-6 px-8 text-white">
        <div className="flex items-center gap-8">
          <a href="#" className="font-bold text-lg">HOME</a>
          <a href="#" className="font-bold text-lg">MEN</a>
          <a href="#" className="font-bold text-lg">WOMEN</a>
          <a href="#" className="font-bold text-lg">AVATAR CUSTOMIZATION</a>
          <a href="#" className="font-bold text-lg">VIRTUAL FITTING ROOM</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="#"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></a>
          <a href="#"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></a>
          <a href="#"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></a>
          <a href="#"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg></a>
        </div>
      </nav> */}

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-8 py-8">
        <h1 className="text-white text-6xl font-bold text-center mb-12">Get in Touch.</h1>
        
        <div className="flex flex-wrap gap-8">
          {/* Contact form section */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="flex-1 bg-white text-black rounded-md py-3 px-4 outline-none"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="flex-1 bg-white text-black rounded-md py-3 px-4 outline-none"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-white text-black rounded-md py-3 px-4 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <textarea
              placeholder="Message"
              rows={6}
              className="w-full bg-white text-black rounded-md py-3 px-4 outline-none resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#5D4D8A] text-white rounded-md py-3 px-12 font-medium hover:bg-[#7A68A6] transition-colors transform active:scale-[0.98] disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
          
          {/* Contact information section */}
          <div className="w-full lg:w-5/12 lg:ml-auto">
            <h2 className="text-white text-4xl font-bold mb-6 border-b border-white pb-2 inline-block">Contact Us</h2>
            
            <p className="text-white text-lg mb-12">
              Whether you have questions about our services, need support, or want to share your feedback, our dedicated team is here to assist you every step of the way
            </p>
            
            <div className="space-y-8">
            <div className='flex justify-between'>

              <div>
              <div className="flex items-start gap-4">
                <Mail className="text-white mt-1" size={24} />
                <div>
                  <h3 className="text-white text-xl font-medium">Email</h3>
                  <p className="text-white">hello@gmail.com</p>
                </div>
              </div>

              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Phone className="text-white mt-1" size={24} />
                </div>
                <div>
                  <h3 className="text-white text-xl font-medium">Phone</h3>
                  <p className="text-white">032643456</p>
                </div>
              </div>
              </div>
              <div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <MapPin className="text-white mt-1" size={24} />
                </div>
                <div>
                  <h3 className="text-white text-xl font-medium">Location</h3>
                  <p className="text-white">123 Anywhere St.,<br />any city</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="text-white mt-1 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white text-xl font-medium">Website</h3>
                  <p className="text-white">Wearflaresite.com</p>
                </div>
              </div>
              </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default ContactUs;

import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full">
      {/* Features Bar */}
    {/* <div className="w-full bg-[#e2d7cf] py-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6 md:px-12">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto md:mx-0">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="font-medium text-lg mb-1">Secure Payments</h3>
            <p className="text-sm text-gray-700">
              Shop with confidence knowing that your transactions are safeguarded.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto md:mx-0">
                <path d="M3 9h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                <path d="M12 3v6" />
              </svg>
            </div>
            <h3 className="font-medium text-lg mb-1">Free Shipping</h3>
            <p className="text-sm text-gray-700">
              Shopping with no extra charges - savor the liberty of complimentary shipping on every order.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto md:mx-0">
                <path d="M9 14 4 9l5-5" />
                <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
              </svg>
            </div>
            <h3 className="font-medium text-lg mb-1">Easy Returns</h3>
            <p className="text-sm text-gray-700">
              With our hassle-free Easy Returns, changing your mind has never been more convenient.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto md:mx-0">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3 className="font-medium text-lg mb-1">Order Tracking</h3>
            <p className="text-sm text-gray-700">
              Stay in the loop with our Order Tracking feature - from checkout to your doorstep.
            </p>
          </div>
        </div>
      </div> */}

      {/* Main Footer */}
      <div className="w-full bg-[#1a1a1a] text-white py-8">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Help Section */}
            <div>
              <h3 className="text-xl font-medium mb-4 text-purple-300">Help</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="hover:text-purple-300">Shipping & Return Policy</Link></li>
                <li><Link to="#" className="hover:text-purple-300">Help Center</Link></li>
                <li><Link to="#" className="hover:text-purple-300">Terms & Conditions</Link></li>
                <li><Link to="#" className="hover:text-purple-300">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Company Section */}
            <div>
              <h3 className="text-xl font-medium mb-4 text-purple-300">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="hover:text-purple-300">About Us</Link></li>
                <li><Link to="#" className="hover:text-purple-300">Contact</Link></li>
                <li><Link to="#" className="hover:text-purple-300">News</Link></li>
                <li><Link to="#" className="hover:text-purple-300">Reports</Link></li>
              </ul>
            </div>

            {/* Shop Section */}
            <div>
              <h3 className="text-xl font-medium mb-4 text-purple-300">Shop</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="hover:text-purple-300">Products</Link></li>
                <li><Link to="#" className="hover:text-purple-300">Overview</Link></li>
                <li><Link to="#" className="hover:text-purple-300">Pricing</Link></li>
              </ul>
            </div>

            {/* Brand and Social Media */}
            <div className="flex flex-col items-start md:items-end">
              <h3 className="text-2xl font-bold mb-4 text-white">WEARFLARE</h3>
              
              {/* App Store Buttons */}
              <div className="flex space-x-3 mb-4">
                <Link to="#" className="bg-black border border-gray-700 rounded-md px-3 py-1 flex items-center space-x-1">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1024px-Google_Play_Store_badge_EN.svg.png" 
                       alt="Google Play" 
                       className="h-5" />
                </Link>
                <Link to="#" className="bg-black border border-gray-700 rounded-md px-3 py-1 flex items-center space-x-1">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1280px-Download_on_the_App_Store_Badge.svg.png" 
                       alt="App Store" 
                       className="h-5" />
                </Link>
              </div>
              
              {/* Follow Us */}
              <p className="text-sm mb-2">Follow us</p>
              <div className="flex space-x-3">
                <Link to="#" className="text-blue-400 hover:text-blue-300">
                  <Twitter size={18} />
                </Link>
                <Link to="#" className="text-red-500 hover:text-red-400">
                  <Youtube size={18} />
                </Link>
                <Link to="#" className="text-pink-500 hover:text-pink-400">
                  <Instagram size={18} />
                </Link>
                <Link to="#" className="text-blue-600 hover:text-blue-500">
                  <Facebook size={18} />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Footer Bottom */}
          <div className="mt-8 pt-4 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-2 md:mb-0">
              <Link to="#" className="text-xs text-gray-400 hover:text-white">Terms</Link>
              <Link to="#" className="text-xs text-gray-400 hover:text-white">Privacy</Link>
              <Link to="#" className="text-xs text-gray-400 hover:text-white">Condition</Link>
            </div>
            <p className="text-xs text-gray-500">
              © 2023 Fashion Store Ltd. All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="w-full bg-white py-16 border-t border-gray-200">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Help Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-black">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:text-[#c8a98a]">
                  Shipping & Return Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#c8a98a]">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#c8a98a]">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#c8a98a]">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-black">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:text-[#c8a98a]">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#c8a98a]">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#c8a98a]">
                  News
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#c8a98a]">
                  Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-black">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:text-[#c8a98a]">
                  Products
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#c8a98a]">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#c8a98a]">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Brand and Social Media */}
          <div className="flex flex-col items-start md:items-end">
            <h3 className="text-2xl font-bold mb-4 text-black">WEARFLARE</h3>

            {/* App Store Buttons */}
            <div className="flex space-x-3 mb-4">
              <Link
                to="#"
                className="border border-gray-300 rounded-md px-3 py-1 flex items-center space-x-1 hover:border-[#c8a98a]"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1024px-Google_Play_Store_badge_EN.svg.png"
                  alt="Google Play"
                  className="h-5"
                />
              </Link>
              <Link
                to="#"
                className="border border-gray-300 rounded-md px-3 py-1 flex items-center space-x-1 hover:border-[#c8a98a]"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1280px-Download_on_the_App_Store_Badge.svg.png"
                  alt="App Store"
                  className="h-5"
                />
              </Link>
            </div>

            {/* Follow Us */}
            <p className="text-sm mb-2 text-gray-600">Follow us</p>
            <div className="flex space-x-3">
              <Link to="#" className="text-gray-600 hover:text-[#c8a98a] transition">
                <Twitter size={18} />
              </Link>
              <Link to="#" className="text-gray-600 hover:text-[#c8a98a] transition">
                <Youtube size={18} />
              </Link>
              <Link to="#" className="text-gray-600 hover:text-[#c8a98a] transition">
                <Instagram size={18} />
              </Link>
              <Link to="#" className="text-gray-600 hover:text-[#c8a98a] transition">
                <Facebook size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-4 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-2 md:mb-0">
            <Link to="#" className="text-xs text-gray-600 hover:text-[#c8a98a]">
              Terms
            </Link>
            <Link to="#" className="text-xs text-gray-600 hover:text-[#c8a98a]">
              Privacy
            </Link>
            <Link to="#" className="text-xs text-gray-600 hover:text-[#c8a98a]">
              Condition
            </Link>
          </div>
          <p className="text-xs text-gray-500">© 2023 WearFlare Ltd. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

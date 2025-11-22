import React from "react"
import { Facebook, Instagram, Twitter, Linkedin, Mail } from "lucide-react"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-gray-300 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#FC8019] to-[#E23744] rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-xl tracking-wide">
                QB
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">QuickBite</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Delicious food delivered fast. Explore top-rated restaurants near you
            and enjoy a seamless ordering experience with QuickBite.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-[#FC8019]">About Us</Link></li>
            <li><Link to="/careers" className="hover:text-[#FC8019]">Careers</Link></li>
            <li><Link to="/contact" className="hover:text-[#FC8019]">Contact</Link></li>
            <li><Link to="/blog" className="hover:text-[#FC8019]">Blog</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/help" className="hover:text-[#FC8019]">Help Center</Link></li>
            <li><Link to="/faq" className="hover:text-[#FC8019]">FAQs</Link></li>
            <li><Link to="/privacy" className="hover:text-[#FC8019]">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-[#FC8019]">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Connect with Us</h3>
          <div className="flex items-center gap-4 mb-4">
            <a href="#" className="hover:text-[#FC8019]"><Facebook size={18} /></a>
            <a href="#" className="hover:text-[#FC8019]"><Instagram size={18} /></a>
            <a href="#" className="hover:text-[#FC8019]"><Twitter size={18} /></a>
            <a href="#" className="hover:text-[#FC8019]"><Linkedin size={18} /></a>
            <a href="mailto:support@quickbite.com" className="hover:text-[#FC8019]"><Mail size={18} /></a>
          </div>
          <p className="text-sm text-gray-400">
            support@quickbite.com<br />
            Hyderabad, India
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="text-[#FC8019] font-semibold">QuickBite</span>. 
        All rights reserved.
      </div>
    </footer>
  )
}

export default Footer

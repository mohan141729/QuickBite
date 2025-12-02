import React from "react"
import { Facebook, Instagram, Twitter, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { Link } from "react-router-dom"

const Footer = () => {
  const companyLinks = [
    { name: "About Us", path: "/about" },
    { name: "Careers", path: "/careers" },
    { name: "Team", path: "/team" },
    { name: "QuickBite Blog", path: "/blog" },
  ]

  const supportLinks = [
    { name: "Help & Support", path: "/help" },
    { name: "Partner with us", path: "/partner" },
    { name: "Ride with us", path: "/rider" },
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
  ]

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#", color: "hover:bg-blue-600" },
    { icon: <Instagram size={20} />, href: "#", color: "hover:bg-pink-600" },
    { icon: <Twitter size={20} />, href: "#", color: "hover:bg-blue-400" },
    { icon: <Linkedin size={20} />, href: "#", color: "hover:bg-blue-700" },
  ]

  return (
    <footer className="bg-[#1A1A1A] text-gray-300 pt-16 pb-8 mt-20 border-t border-gray-800">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Brand Section */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <img src="/logo.png" alt="QuickBite" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">QuickBite</h2>
              <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">Fast. Fresh. Delivered.</p>
            </div>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            Craving something delicious? We deliver the best food from top-rated restaurants straight to your doorstep, instantly.
          </p>
          <div className="flex gap-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-1 ${social.color}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
            Company
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#FC8019] rounded-full"></span>
          </h3>
          <ul className="space-y-3">
            {companyLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className="text-sm text-gray-400 hover:text-[#FC8019] hover:pl-2 transition-all duration-300 flex items-center gap-2"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
            Support
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#FC8019] rounded-full"></span>
          </h3>
          <ul className="space-y-3">
            {supportLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className="text-sm text-gray-400 hover:text-[#FC8019] hover:pl-2 transition-all duration-300 flex items-center gap-2"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
            Get in Touch
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#FC8019] rounded-full"></span>
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-gray-400">
              <MapPin className="w-5 h-5 text-[#FC8019] flex-shrink-0 mt-0.5" />
              <span>
                123 Foodie Street, Tech Park,<br />
                Hyderabad, Telangana 500081
              </span>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Phone className="w-5 h-5 text-[#FC8019] flex-shrink-0" />
              <span>+91 1800-123-4567</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Mail className="w-5 h-5 text-[#FC8019] flex-shrink-0" />
              <span>support@quickbite.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 pt-8 pb-4">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} <span className="text-white font-semibold">QuickBite</span>. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

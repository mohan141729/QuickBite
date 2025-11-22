import React from "react"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 text-center">
      <h3 className="text-white font-semibold text-lg mb-3">
        QuickBite Partner
      </h3>
      <p className="text-sm mb-4">
        © {new Date().getFullYear()} QuickBite Technologies Pvt. Ltd.  
        All Rights Reserved.
      </p>
      <p className="text-xs text-gray-500">
        Made with ❤️ for restaurant partners.
      </p>
    </footer>
  )
}

export default Footer

import scrollbarHide from 'tailwind-scrollbar-hide';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quickbite: {
          orange: "#FC8019",   // Brand primary (Swiggy tone)
          red: "#E23744",      // Accent CTA (Zomato tone)
          bg: "#FFF8F2",       // Soft warm background
          dark: "#1C1C1C",     // Headings / body text
          gray: "#5C5C5C",     // Subtext
          border: "#E5E7EB",   // Border / subtle UI lines
          green: "#48C479",    // Success (Delivered)
          yellow: "#FFCC00",   // Preparing / Offers
        },
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.08)",
        hover: "0 6px 16px rgba(0, 0, 0, 0.12)",
      },
      backgroundImage: {
        "hero-pattern":
          "url('https://images.unsplash.com/photo-1600891964099-14f24b1b1a0e?q=80&w=1920')",
        "food-gradient":
          "linear-gradient(90deg, #FC8019 0%, #E23744 100%)",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"), // hide scrollbars for smooth carousels
  ],
}

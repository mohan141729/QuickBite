import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const SupportButton = () => {
    const location = useLocation();

    // Hide support button on help page to prevent overlap
    if (location.pathname === '/help') return null;

    return (
        <Link
            to="/help"
            className="fixed bottom-6 right-6 z-50 bg-[#FC8019] text-white p-4 rounded-full shadow-lg hover:bg-[#E23744] hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
            aria-label="Customer Support"
        >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Help & Support
            </span>
        </Link>
    );
};

export default SupportButton;

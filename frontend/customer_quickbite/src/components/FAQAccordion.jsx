import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQAccordion = ({ question, answer, isOpen, onToggle }) => {
    return (
        <div className="border-b border-gray-200 last:border-0">
            <button
                onClick={onToggle}
                className="w-full py-4 px-6 flex items-center justify-between text-left hover:bg-gray-50 transition"
            >
                <span className="font-semibold text-gray-900 pr-4">{question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'transform rotate-180' : ''
                        }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
};

export default FAQAccordion;

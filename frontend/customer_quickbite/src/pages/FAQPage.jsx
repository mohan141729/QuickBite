import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import FAQAccordion from '../components/FAQAccordion';
import { faqData, categories } from '../data/faqData';

const FAQPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [openFaqId, setOpenFaqId] = useState(null);

    // Filter FAQs based on search and category
    const filteredFaqs = faqData.filter(faq => {
        const matchesSearch =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-600">
                        Find answers to common questions about using QuickBite
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === category
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* FAQs */}
                <div className="bg-white rounded-xl shadow-sm">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq) => (
                            <FAQAccordion
                                key={faq.id}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openFaqId === faq.id}
                                onToggle={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                            />
                        ))
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            <p className="text-lg">No FAQs found matching your search.</p>
                            <p className="text-sm mt-2">Try different keywords or browse by category.</p>
                        </div>
                    )}
                </div>

                {/* Still Need Help */}
                <div className="mt-12 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Still need help?
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Our support team is here to assist you
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:support@quickbite.in"
                            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
                        >
                            Email Support
                        </a>
                        <a
                            href="tel:18001234567"
                            className="px-6 py-3 bg-white text-orange-500 border-2 border-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition"
                        >
                            Call 1800-123-4567
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;

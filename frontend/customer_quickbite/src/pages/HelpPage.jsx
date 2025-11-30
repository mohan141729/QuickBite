import React from 'react';
import { Link } from 'react-router-dom';
import {
    Package,
    CreditCard,
    User,
    HelpCircle,
    Phone,
    Mail,
    Clock,
    ShoppingBag,
    Star
} from 'lucide-react';
import Navbar from '../components/Navbar';

const HelpPage = () => {
    const topics = [
        {
            icon: Package,
            title: 'Orders & Tracking',
            description: 'Track orders, cancellations, and delivery',
            link: '/faq',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            icon: CreditCard,
            title: 'Payments & Refunds',
            description: 'Payment methods, refunds, and billing',
            link: '/faq',
            color: 'bg-green-100 text-green-600'
        },
        {
            icon: User,
            title: 'Account & Profile',
            description: 'Manage your account and preferences',
            link: '/faq',
            color: 'bg-purple-100 text-purple-600'
        },
        {
            icon: ShoppingBag,
            title: 'Restaurants & Menu',
            description: 'Browse menus, favorites, and reviews',
            link: '/faq',
            color: 'bg-orange-100 text-orange-600'
        },
        {
            icon: Star,
            title: 'Reviews & Ratings',
            description: 'How to rate and review restaurants',
            link: '/faq',
            color: 'bg-yellow-100 text-yellow-600'
        },
        {
            icon: HelpCircle,
            title: 'General FAQs',
            description: 'Common questions and answers',
            link: '/faq',
            color: 'bg-gray-100 text-gray-600'
        }
    ];

    const popularQuestions = [
        { question: 'How do I track my order?', link: '/faq' },
        { question: 'Can I cancel my order?', link: '/faq' },
        { question: 'What payment methods are accepted?', link: '/faq' },
        { question: 'How do refunds work?', link: '/faq' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        How can we help you?
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Find answers, get support, and explore helpful resources
                    </p>
                </div>

                {/* Topic Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {topics.map((topic, index) => (
                        <Link
                            key={index}
                            to={topic.link}
                            className="bg-white rounded-xl p-6 hover:shadow-lg transition group"
                        >
                            <div className={`w-12 h-12 ${topic.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                                <topic.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {topic.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {topic.description}
                            </p>
                        </Link>
                    ))}
                </div>

                {/* Popular Questions */}
                <div className="bg-white rounded-xl p-8 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Popular Questions
                    </h2>
                    <div className="space-y-4">
                        {popularQuestions.map((item, index) => (
                            <Link
                                key={index}
                                to={item.link}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition group"
                            >
                                <span className="text-gray-700 group-hover:text-orange-600">
                                    {item.question}
                                </span>
                                <HelpCircle className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
                            </Link>
                        ))}
                    </div>
                    <Link
                        to="/faq"
                        className="mt-6 inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
                    >
                        View All FAQs
                    </Link>
                </div>

                {/* Contact Section */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white">
                    <h2 className="text-2xl font-bold mb-2">Contact Support</h2>
                    <p className="mb-6 opacity-90">
                        Can't find what you're looking for? Reach out to our team
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <Mail className="w-6 h-6 flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold mb-1">Email</p>
                                <a href="mailto:support@quickbite.in" className="opacity-90 hover:opacity-100">
                                    support@quickbite.in
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="w-6 h-6 flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold mb-1">Phone</p>
                                <a href="tel:18001234567" className="opacity-90 hover:opacity-100">
                                    1800-123-4567
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="w-6 h-6 flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold mb-1">Hours</p>
                                <p className="opacity-90">Mon-Sun, 9 AM - 11 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;

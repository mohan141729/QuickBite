import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Send, Bot, User, RefreshCcw, Phone, Mail, ChevronRight, MessageSquare } from 'lucide-react';

const HelpPage = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: "Hi there! 👋 I'm your QuickBite assistant. How can I help you today?",
            options: [
                "Where is my order?",
                "I want a refund",
                "How to cancel order?",
                "Contact Support"
            ]
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (text) => {
        if (!text.trim()) return;

        // Add user message
        const userMsg = { id: Date.now(), type: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate bot delay
        setTimeout(() => {
            const botResponse = generateResponse(text);
            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', ...botResponse }]);
            setIsTyping(false);
        }, 1000);
    };

    const generateResponse = (text) => {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('order') || lowerText.includes('track') || lowerText.includes('status')) {
            return {
                text: "You can track your active orders in the 'My Orders' section. Tap the 'Track Order' button on any active order to see its real-time status.",
                options: ["Go to My Orders", "Contact Support"]
            };
        }

        if (lowerText.includes('refund') || lowerText.includes('money') || lowerText.includes('payment')) {
            return {
                text: "Refunds are processed automatically for cancelled orders. If you faced an issue with a delivered order, please go to 'My Orders' and click 'Help' on that specific order.",
                options: ["View Refund Policy", "Contact Support"]
            };
        }

        if (lowerText.includes('cancel')) {
            return {
                text: "You can cancel an order while it is still in 'Processing' or 'Accepted' state. Go to 'My Orders' and click the 'Cancel' button.",
                options: ["Go to My Orders", "I can't cancel"]
            };
        }

        if (lowerText.includes('contact') || lowerText.includes('support') || lowerText.includes('call') || lowerText.includes('email')) {
            return {
                text: "You can reach our support team directly:",
                isContact: true,
                options: ["Start Over"]
            };
        }

        return {
            text: "I'm not sure I understood that. Could you try rephrasing? Or you can choose one of these topics:",
            options: [
                "Where is my order?",
                "I want a refund",
                "How to cancel order?",
                "Contact Support"
            ]
        };
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-3xl w-full mx-auto pt-24 pb-6 px-4 flex flex-col">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden h-[calc(100vh-8rem)]">

                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-3 shadow-sm z-10">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Bot className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-900">QuickBite Support</h1>
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-3 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.type === 'user' ? 'bg-gray-900' : 'bg-orange-600'}`}>
                                        {msg.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                    </div>

                                    {/* Message Bubble */}
                                    <div className="space-y-2">
                                        <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.type === 'user'
                                                ? 'bg-gray-900 text-white rounded-tr-none'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                            }`}>
                                            {msg.text}

                                            {/* Contact Info Card */}
                                            {msg.isContact && (
                                                <div className="mt-3 bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
                                                    <a href="tel:1800123456" className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors group">
                                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                                            <Phone className="w-4 h-4 text-green-700" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 font-medium">Call Us</p>
                                                            <p className="text-sm font-bold text-gray-900">1800-123-456</p>
                                                        </div>
                                                    </a>
                                                    <a href="mailto:support@quickbite.in" className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors group">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                                            <Mail className="w-4 h-4 text-blue-700" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 font-medium">Email Us</p>
                                                            <p className="text-sm font-bold text-gray-900">support@quickbite.in</p>
                                                        </div>
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Quick Options */}
                                        {msg.options && (
                                            <div className="flex flex-wrap gap-2">
                                                {msg.options.map((option, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSend(option)}
                                                        className="px-4 py-2 bg-white border border-orange-200 text-orange-600 text-xs font-semibold rounded-full hover:bg-orange-50 hover:border-orange-300 transition-all shadow-sm"
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex gap-3 max-w-[85%]">
                                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-500 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className="p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-orange-200"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;

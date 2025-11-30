
import { SignIn } from '@clerk/clerk-react';
import { Shield } from 'lucide-react';

const SignInPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md flex flex-col items-center">
                {/* Logo/Brand */}
                <div className="text-center mb-8 animate-slide-down">
                    <div className="inline-block p-4 bg-white rounded-2xl shadow-2xl mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">QuickBite Admin</h1>
                    <p className="text-indigo-100">Secure Admin Portal</p>
                </div>

                {/* Clerk Sign In Component */}
                <div className="animate-slide-up">
                    <SignIn
                        forceRedirectUrl="/dashboard"
                        appearance={{
                            elements: {
                                rootBox: "shadow-2xl rounded-2xl",
                                card: "rounded-2xl shadow-none",
                                footer: "hidden", // Hide the footer which contains the sign-up link
                            }
                        }}
                    />
                </div>

                {/* Footer */}
                <p className="text-center text-indigo-100 mt-8 text-sm">
                    © {new Date().getFullYear()} QuickBite. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default SignInPage;

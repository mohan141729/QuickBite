import { SignIn } from '@clerk/clerk-react';

/**
 * Sign In Page for Restaurant Owners
 * Uses Clerk's pre-built SignIn component
 */
export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">QuickBite</h1>
                    <p className="text-gray-600">Restaurant Owner Portal</p>
                </div>

                <SignIn
                    signUpUrl="/sign-up"
                    afterSignInUrl="/dashboard"
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "shadow-xl"
                        }
                    }}
                />
            </div>
        </div>
    );
}

import { SignUp } from '@clerk/clerk-react';

/**
 * Sign Up Page for Restaurant Owners
 * Uses Clerk's pre-built SignUp component
 * Automatically sets role to 'restaurant_owner' via backend webhook
 */
export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">QuickBite</h1>
                    <p className="text-gray-600">Join as a Restaurant Owner</p>
                </div>

                <SignUp
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in"
                    forceRedirectUrl="/dashboard"
                    unsafeMetadata={{
                        portal: 'restaurant',
                        app: 'restaurant_quickbite'
                    }}
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

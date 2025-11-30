import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <SignIn
                routing="path"
                path="/login"
                signUpUrl="/register"
                forceRedirectUrl="/"
            />
        </div>
    );
};

export default SignInPage;

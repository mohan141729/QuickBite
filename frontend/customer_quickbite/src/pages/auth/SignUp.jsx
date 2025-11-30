import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <SignUp
                routing="path"
                path="/register"
                signInUrl="/login"
                forceRedirectUrl="/"
            />
        </div>
    );
};

export default SignUpPage;

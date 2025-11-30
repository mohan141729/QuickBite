import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">QuickBite</h1>
          <p className="text-gray-600">Delivery Partner Login</p>
        </div>
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/register"
          forceRedirectUrl="/dashboard"
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
};

export default LoginPage;

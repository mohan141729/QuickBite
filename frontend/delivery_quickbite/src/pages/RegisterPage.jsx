import { SignUp, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Role is now handled in AuthContext automatically
  useEffect(() => {
    if (user) {
      setTimeout(() => navigate('/dashboard'), 500);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">QuickBite</h1>
          <p className="text-gray-600">Join as a Delivery Partner</p>
        </div>
        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
          forceRedirectUrl="/dashboard"
          unsafeMetadata={{
            portal: 'delivery',
            app: 'delivery_quickbite'
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
};

export default RegisterPage;

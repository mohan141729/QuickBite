import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useNavigate } from "react-router-dom"
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

import { SocketProvider } from "./context/SocketContext";
import { Toaster } from "react-hot-toast";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const ClerkProviderWithRoutes = () => {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      <AuthProvider>
        <SocketProvider>
          <App />
          <Toaster position="top-center" />
        </SocketProvider>
      </AuthProvider>
    </ClerkProvider>
  )
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProviderWithRoutes />
    </BrowserRouter>
  </StrictMode>
);

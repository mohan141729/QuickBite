import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <FavoritesProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </FavoritesProvider>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)

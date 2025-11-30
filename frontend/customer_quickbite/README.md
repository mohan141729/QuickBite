# QuickBite Customer App

## 📱 Overview
The **Customer App** is the primary interface for users to interact with the QuickBite platform. It offers a seamless experience for discovering restaurants, customizing orders, and tracking deliveries in real-time.

## 🔗 Live URL
[https://quick-bite-smoky.vercel.app/](https://quick-bite-smoky.vercel.app/)

## ✨ Key Features

### 🍽️ Discovery & Ordering
- **Smart Search**: Find restaurants by cuisine, name, or dish.
- **Visual Menu**: High-quality images for every dish.
- **Customization**: Add toppings, choose sizes, and add special instructions.
- **Secure Checkout**: Integrated payment flow.

### 📦 Order Management
- **Real-time Tracking**: Live status updates via WebSockets.
- **My Orders Revamp**: 
    - **Tabs**: Separate views for Active and Past orders.
    - **Premium Cards**: Visual order summaries with restaurant logos.
    - **Actions**: One-tap "Track", "Reorder", or "Rate".

### 💬 Help & Support
- **Interactive Chatbot**: Instant answers for common queries (Refunds, Tracking).
- **Quick Actions**: Pre-defined buttons for fast support.
- **Direct Contact**: Easy access to email and phone support.

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, Framer Motion (Animations)
- **Icons**: Lucide React
- **State**: Context API
- **Auth**: Clerk

## ⚙️ Setup & Installation

1.  **Navigate to directory**:
    ```bash
    cd frontend/customer_quickbite
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create `.env.local`:
    ```env
    VITE_API_URL=http://localhost:5001
    VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

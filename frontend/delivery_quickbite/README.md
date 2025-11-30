# QuickBite Delivery Partner App

## 🚚 Overview
The **Delivery Partner App** is the essential tool for drivers to receive, track, and fulfill orders. It features real-time navigation, earnings tracking, and an incentive system to maximize driver revenue.

## 🔗 Live URL
[https://deliverypartners-quickbite.vercel.app/](https://deliverypartners-quickbite.vercel.app/)

## ✨ Key Features

### 📦 Order Fulfillment
- **Instant Alerts**: Receive push notifications for new delivery requests.
- **Smart Navigation**: Integrated maps for pickup and drop-off locations.
- **Status Updates**: One-tap updates for `Picked Up` and `Delivered`.

### 💰 Earnings & Incentives
- **Live Earnings**: Track daily income in real-time.
- **Incentive System**: View and track progress on active bonus offers (e.g., "Earn $10 extra for 5 deliveries").
- **History**: Detailed log of all completed deliveries and payouts.

### 📍 Availability & Profile
- **Online/Offline Mode**: Toggle availability with a single switch.
- **Performance Stats**: View ratings, completion rates, and feedback.

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Real-time**: Socket.io Client
- **Auth**: Clerk (Delivery Partner Role)

## ⚙️ Setup & Installation

1.  **Navigate to directory**:
    ```bash
    cd frontend/delivery_quickbite
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

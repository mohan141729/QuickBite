# QuickBite Restaurant Dashboard

## 👨‍🍳 Overview
The **Restaurant Dashboard** is the command center for restaurant partners. It provides tools to manage orders in real-time, update menus instantly, and track business performance.

## 🔗 Live URL
[https://restaurant-quickbite.vercel.app/](https://restaurant-quickbite.vercel.app/)

## ✨ Key Features

### 🛎️ Order Management
- **Live Feed**: Orders appear instantly via WebSockets.
- **Status Control**: Move orders through stages: `Pending` -> `Preparing` -> `Ready`.
- **History**: View past orders and filter by date or status.

### 📝 Menu Management
- **Dynamic Menu**: Add, edit, or delete items and categories.
- **Availability**: Toggle item availability (e.g., "Out of Stock").
- **Image Upload**: Upload food images directly to Cloudinary.

### 📊 Analytics & Insights
- **Sales Reports**: Daily, weekly, and monthly revenue charts.
- **Top Items**: Identify best-selling dishes.
- **Customer Feedback**: View ratings and reviews.

### ⚙️ Settings
- **Profile**: Update restaurant name, description, and logo.
- **Operations**: Set opening/closing hours.

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Auth**: Clerk (Restaurant Owner Role)

## ⚙️ Setup & Installation

1.  **Navigate to directory**:
    ```bash
    cd frontend/restaurant_quickbite
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

# QuickBite Admin Dashboard

## 🛡️ Overview
The **Admin Dashboard** provides full oversight and control over the QuickBite platform. Administrators can manage users, approve restaurants, configure delivery incentives, and monitor platform health.

## 🔗 Live URL
[https://admin-quickbite.vercel.app/](https://admin-quickbite.vercel.app/)

## ✨ Key Features

### 👥 User & Partner Management
- **Users**: View customer details and order history.
- **Restaurants**: Approve new registrations, manage listings, and view menus.
- **Delivery Partners**: Verify documents and monitor activity.

### 🎁 Incentive Management
- **Create Incentives**: Set up rewards for delivery partners (e.g., "Complete 10 orders").
- **Time-Bound**: Configure start and end times for incentives.
- **Targeting**: Define specific criteria for earning rewards.

### 📈 Analytics & Reporting
- **Platform Health**: Real-time stats on active orders, users, and revenue.
- **Financial Reports**: Detailed breakdown of earnings and payouts.
- **Growth Metrics**: Track user acquisition and retention.

### ⚙️ Content Moderation
- **Menu Approval**: Review and approve menu items.
- **Reviews**: Monitor and moderate customer reviews.

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Auth**: Clerk (Admin Role)

## ⚙️ Setup & Installation

1.  **Navigate to directory**:
    ```bash
    cd frontend/admin_quickbite
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

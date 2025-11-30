# QuickBite - Advanced Food Delivery Platform

## 🚀 Overview
**QuickBite** is a full-stack, multi-application food delivery ecosystem designed to streamline the connection between hungry customers, restaurants, and delivery partners. Built with modern web technologies, it features real-time updates, secure authentication, and a premium user experience across four distinct interfaces.

## 🌐 Live Applications

| Application | Role | Live URL | Description |
| :--- | :--- | :--- | :--- |
| **Customer App** | End User | [Launch App](https://quick-bite-smoky.vercel.app/) | Browse menus, place orders, track delivery, and chat with support. |
| **Restaurant Dashboard** | Partner | [Launch Dashboard](https://restaurant-quickbite.vercel.app/) | Manage menu, accept orders, and view sales analytics. |
| **Delivery App** | Partner | [Launch App](https://deliverypartners-quickbite.vercel.app/) | Receive delivery requests, navigate, and track earnings. |
| **Admin Dashboard** | Administrator | [Launch Dashboard](https://admin-quickbite.vercel.app/) | Oversee platform, manage users, and configure incentives. |
| **Backend API** | Server | [API Health](https://quickbite-05uf.onrender.com) | Centralized Node.js/Express API with Socket.io. |

## 🏗️ Architecture

The project is structured as a monorepo with a centralized backend and four decoupled frontend applications.

### Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide React, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Real-time**: Socket.io (WebSockets)
- **Authentication**: Clerk (Secure, role-based auth)
- **Deployment**: Vercel (Frontend), Render (Backend)

### Directory Structure
```
QuickBite/
├── backend/                # Node.js API Server & Socket.io
├── frontend/
│   ├── admin_quickbite/    # Admin Control Panel
│   ├── customer_quickbite/ # Customer Interface
│   ├── delivery_quickbite/ # Delivery Partner Interface
│   └── restaurant_quickbite/# Restaurant Management Interface
└── README.md               # Project Documentation
```

## ✨ Key Features

### 🔐 Authentication & Security
- **Clerk Integration**: Seamless sign-up/sign-in for all user roles.
- **Role-Based Access Control (RBAC)**: Protected routes ensuring users only access authorized apps.
- **Secure API**: JWT verification on backend endpoints.

### 🍔 Customer Experience
- **Real-time Tracking**: Watch orders move from "Preparing" to "Delivered" instantly.
- **Premium UI**: Modern, responsive design with smooth animations.
- **Smart Chatbot**: AI-powered Help & Support for instant queries.
- **Order History**: Detailed view of active and past orders.

### 👨‍🍳 Restaurant Management
- **Live Order Dashboard**: Instant notifications for new orders via WebSockets.
- **Menu Builder**: Easy-to-use interface for adding categories and items.
- **Analytics**: Visual reports on daily revenue and popular items.

### 🚚 Delivery Logistics
- **Smart Assignment**: Algorithms to assign orders to available partners.
- **Incentive System**: Time-bound rewards (e.g., "Complete 5 orders between 6-9 PM").
- **Earnings Tracker**: Daily, weekly, and monthly financial summaries.

### 🛠️ Admin Control
- **Platform Oversight**: Global view of all orders and users.
- **Incentive Management**: Create and manage dynamic incentives for delivery partners.
- **Content Moderation**: Approve or ban restaurants and users.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Clerk Account (for Auth keys)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/QuickBite.git
    cd QuickBite
    ```

2.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    # Create .env file (see backend/README.md)
    npm run dev
    ```

3.  **Frontend Setup** (Repeat for each app):
    ```bash
    cd frontend/customer_quickbite # or admin, delivery, restaurant
    npm install
    # Create .env.local file (see app specific README.md)
    npm run dev
    ```

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

---
*Built with ❤️ by the QuickBite Team*

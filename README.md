# QuickBite - Food Delivery Platform

## Overview
QuickBite is a comprehensive food delivery platform connecting customers, restaurants, and delivery partners. It features a robust backend and four distinct frontend applications to manage the entire lifecycle of a food order.

## Architecture

The project is structured as a monorepo containing:

- **Backend**: Node.js/Express server handling API requests, database interactions (MongoDB), and real-time updates (Socket.io).
- **Frontend**: Four separate React applications built with Vite and Tailwind CSS.

### Directory Structure

```
QuickBite/
├── backend/                # Node.js API Server
├── frontend/
│   ├── admin_quickbite/    # Admin Dashboard
│   ├── customer_quickbite/ # Customer Web App
│   ├── delivery_quickbite/ # Delivery Partner App
│   └── restaurant_quickbite/# Restaurant Dashboard
└── README.md               # This file
```

## Components

### 1. Admin Dashboard
*Path: `frontend/admin_quickbite`*
- **Users**: Administrators.
- **Features**:
    - Monitor platform activity (orders, revenue).
    - Manage users (customers, delivery partners).
    - Approve and manage restaurants.
    - View detailed analytics.

### 2. Customer App
*Path: `frontend/customer_quickbite`*
- **Users**: End customers.
- **Features**:
    - Browse restaurants and menus.
    - Place orders and pay online.
    - Track order status in real-time.
    - Rate and review orders.

### 3. Delivery App
*Path: `frontend/delivery_quickbite`*
- **Users**: Delivery drivers.
- **Features**:
    - Receive delivery requests.
    - Navigation to restaurant and customer.
    - Update order status (Picked Up, Delivered).
    - Track earnings.

### 4. Restaurant Dashboard
*Path: `frontend/restaurant_quickbite`*
- **Users**: Restaurant owners/managers.
- **Features**:
    - Manage menu items and categories.
    - Receive and process orders.
    - View sales reports and insights.

## Workflow

1.  **Order Placement**: Customer places an order via the **Customer App**.
2.  **Acceptance**: Restaurant accepts the order on the **Restaurant Dashboard**.
3.  **Preparation**: Restaurant prepares the food and marks it as "Ready".
4.  **Assignment**: System assigns a delivery partner via the **Delivery App**.
5.  **Pickup**: Delivery partner picks up the order.
6.  **Delivery**: Delivery partner delivers to the customer.
7.  **Completion**: Order is marked as delivered; Customer can leave feedback.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local or Atlas)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd QuickBite
    ```

2.  **Setup Backend**:
    ```bash
    cd backend
    npm install
    # Create .env file with necessary variables (PORT, MONGO_URI, etc.)
    npm run dev
    ```

3.  **Setup Frontends**:
    Open a new terminal for each frontend you want to run.

    *Admin Dashboard*:
    ```bash
    cd frontend/admin_quickbite
    npm install
    npm run dev
    ```

    *Customer App*:
    ```bash
    cd frontend/customer_quickbite
    npm install
    npm run dev
    ```

    *Delivery App*:
    ```bash
    cd frontend/delivery_quickbite
    npm install
    npm run dev
    ```

    *Restaurant Dashboard*:
    ```bash
    cd frontend/restaurant_quickbite
    npm install
    npm run dev
    ```

## Technologies

- **Frontend**: React, Vite, Tailwind CSS, Socket.io-client
- **Backend**: Node.js, Express, MongoDB, Mongoose, Socket.io, JWT
- **Tools**: Git, npm

---
*QuickBite Platform © 2025*

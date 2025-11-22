# QuickBite Backend API

The backend for the QuickBite food delivery platform, built with Node.js, Express, and MongoDB.

## Live URL
[https://quickbite-05uf.onrender.com](https://quickbite-05uf.onrender.com)

## Features

- **Authentication**: JWT-based auth for Users, Restaurants, and Admins.
- **Database**: MongoDB with Mongoose for data modeling.
- **Real-time Updates**: Socket.io for live order tracking and notifications.
- **Payment Integration**: Simulated payment processing.
- **Analytics**: Aggregated data for admin and restaurant dashboards.

## Environment Variables

Create a `.env` file in the root of the `backend` directory:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run in development mode:
    ```bash
    npm run dev
    ```

3.  Start production server:
    ```bash
    npm start
    ```

## API Structure

- `/api/auth`: Authentication routes
- `/api/users`: User management
- `/api/restaurants`: Restaurant management
- `/api/menu`: Menu items
- `/api/orders`: Order processing
- `/api/delivery`: Delivery management
- `/api/analytics`: Data analytics

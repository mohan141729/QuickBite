# QuickBite Deployment Guide

This guide outlines the steps to deploy the QuickBite frontend to Vercel and the backend to Railway or Render.

## 1. Backend Deployment

### Option A: Railway (Recommended)

1.  **Create a Railway Account**: Go to [railway.app](https://railway.app) and sign up (GitHub login recommended).
2.  **New Project**: Click "New Project" -> "Deploy from GitHub repo".
3.  **Select Repository**: Choose `QuickBite`.
4.  **Configure Service**:
    *   **Root Directory**: Go to Settings -> Root Directory and set it to `/backend`.
    *   **Build/Start Command**: Railway usually auto-detects `npm install` and `npm start` from `package.json`.
5.  **Environment Variables**:
    *   Go to the "Variables" tab.
    *   Add all variables from your `backend/.env` file (MONGO_URI, JWT_SECRET, CLERK_ keys, etc.).
    *   Set `NODE_ENV` to `production`.
6.  **Generate Domain**:
    *   Go to "Settings" -> "Networking".
    *   Click "Generate Domain" to get a public URL (e.g., `quickbite-backend.up.railway.app`).
7.  **Deploy**: It should deploy automatically.

### Option B: Render

1.  **Create a Render Account**: Go to [render.com](https://render.com) and sign up.
2.  **New Web Service**: Click "New +" and select "Web Service".
3.  **Connect GitHub**: Connect your GitHub account and select the `QuickBite` repository.
4.  **Configure Service**:
    *   **Name**: `quickbite-backend` (or similar)
    *   **Root Directory**: `backend`
    *   **Environment**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
5.  **Environment Variables**: Add the following variables (copy from your local `.env`):
    *   `MONGO_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: Your secret key for JWT.
    *   `PORT`: `5001` (Render will override this, but good to have).
    *   `NODE_ENV`: `production`
6.  **Deploy**: Click "Create Web Service". Render will build and deploy your backend.
7.  **Copy URL**: Once deployed, copy the backend URL (e.g., `https://quickbite-backend.onrender.com`).

## 2. Frontend Deployment (Vercel)

You need to deploy each frontend application (`admin_quickbite`, `customer_quickbite`, `delivery_quickbite`, `restaurant_quickbite`) separately.

### General Steps for Each Frontend:

1.  **Create a Vercel Account**: Go to [vercel.com](https://vercel.com) and sign up.
2.  **Add New Project**: Click "Add New..." -> "Project".
3.  **Import Repository**: Import the `QuickBite` repository.
4.  **Configure Project**:
    *   **Framework Preset**: Vite
    *   **Root Directory**: Select the specific frontend folder (e.g., `frontend/admin_quickbite`).
5.  **Environment Variables**:
    *   **Key**: `VITE_API_URL` (or `VITE_API_BASE_URL` for customer app)
    *   **Value**: The backend URL you copied earlier (e.g., `https://quickbite-backend.up.railway.app` or `https://quickbite-backend.onrender.com`).
    *   *Note: `customer_quickbite` uses `VITE_API_BASE_URL`, others use `VITE_API_URL`.*
6.  **Deploy**: Click "Deploy".

### Specifics per App:

*   **Admin Dashboard (`frontend/admin_quickbite`)**
    *   Root Directory: `frontend/admin_quickbite`
    *   Env Var: `VITE_API_URL`

*   **Customer App (`frontend/customer_quickbite`)**
    *   Root Directory: `frontend/customer_quickbite`
    *   Env Var: `VITE_API_BASE_URL`

*   **Restaurant App (`frontend/restaurant_quickbite`)**
    *   Root Directory: `frontend/restaurant_quickbite`
    *   Env Var: `VITE_API_URL`

*   **Delivery App (`frontend/delivery_quickbite`)**
    *   Root Directory: `frontend/delivery_quickbite`
    *   Env Var: `VITE_API_URL`

## 3. Post-Deployment

*   **Update CORS**: After deploying frontends, go back to your backend dashboard (Railway or Render) -> Environment Variables. Update `ALLOWED_ORIGINS` (if you use it) or check `server.js` to ensure the new Vercel domains are allowed in CORS settings. You might need to add the Vercel domains to the `allowedOrigins` array in `backend/src/server.js` and redeploy the backend.

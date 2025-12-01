# Image Generation Prompts

Use these prompts to generate the diagrams for the Project Completion Document.

## 1. Order Placement & Fulfillment Flow
**Prompt:**
> A flowchart showing the 'Order Placement & Fulfillment' process for a food delivery app. Steps: 1. Customer: Places Order -> (Arrow to System) 2. System: Creates Order (Pending) -> Notifies Restaurant 3. Restaurant: Accepts Order -> Updates Status (Preparing) -> Marks Ready 4. System: Broadcasts Delivery Request 5. Delivery Partner: Accepts Delivery -> Picks Up Order -> Delivers Order 6. Customer: Receives Order (Delivered). Style: Linear or swimlane flowchart, modern UI elements, clear arrows, distinct colors for each actor (Customer, Restaurant, Driver).

**Recommended Filename:** `docs/images/order_flow.png`

---

## 2. Customer App Architecture
**Prompt:**
> Architecture diagram for 'QuickBite Customer App'. Components: React Frontend (Home, Menu, Cart, Profile), Context API (Auth, Cart), Axios (API Calls), Socket.io Client (Real-time Updates), External Services (Clerk, Google Maps). Style: Modern, clean, blue theme, block diagram, professional software architecture style.

**Recommended Filename:** `docs/images/customer_app_architecture.png`

---

## 3. Restaurant Dashboard Architecture
**Prompt:**
> Architecture diagram for 'QuickBite Restaurant Dashboard'. Components: React Frontend (Dashboard, Menu Editor, Orders), Context API, Socket.io Client (Order Alerts), Axios, Cloudinary (Images), Clerk (Auth). Style: Modern, clean, orange theme, block diagram, professional software architecture style.

**Recommended Filename:** `docs/images/restaurant_app_architecture.png`

---

## 4. Delivery App Architecture
**Prompt:**
> Architecture diagram for 'QuickBite Delivery App'. Components: React Frontend (Job Board, Active Delivery, Earnings), Geolocation Tracking, Socket.io Client (Delivery Requests), Axios, Google Maps, Clerk. Style: Modern, clean, green theme, block diagram, professional software architecture style.

**Recommended Filename:** `docs/images/delivery_app_architecture.png`

---

## 5. Admin Dashboard Architecture
**Prompt:**
> Architecture diagram for 'QuickBite Admin Dashboard'. Components: React Frontend (Overview, Users, Restaurants, Settings), Recharts (Data Viz), Axios (Admin Routes), Clerk (User Mgmt). Style: Modern, clean, purple theme, block diagram, professional software architecture style.

**Recommended Filename:** `docs/images/admin_app_architecture.png`

---

## 6. Database Schema (ER Diagram)
**Prompt:**
> A comprehensive Entity-Relationship (ER) diagram for the 'QuickBite' food delivery system.
>
> **Entities & Key Fields:**
> - **User**: _id, name, email, role (customer/admin/partner), phone.
> - **Restaurant**: _id, owner (ref: User), name, location, cuisine, rating.
> - **MenuItem**: _id, restaurant (ref: Restaurant), name, price, category, image.
> - **Order**: _id, user (ref: User), restaurant (ref: Restaurant), deliveryPartner (ref: DeliveryPartner), status, totalAmount, items.
> - **DeliveryPartner**: _id, user (ref: User), currentOrder (ref: Order), status, vehicleType.
> - **Address**: _id, user (ref: User), fullAddress, city, pincode, location.
> - **Cart**: _id, user (ref: User), items (ref: MenuItem), totalPrice.
> - **Review**: _id, user (ref: User), restaurant (ref: Restaurant), rating, comment.
> - **Payment**: _id, order (ref: Order), user (ref: User), amount, status.
> - **Coupon**: _id, code, discountType, restaurantIds (ref: Restaurant).
> - **Favorite**: _id, user (ref: User), restaurants (ref: Restaurant), menuItems (ref: MenuItem).
>
> **Relationships:**
> - **User** 1:N **Address**
> - **User** 1:1 **Cart**
> - **User** 1:N **Order**
> - **User** 1:N **Review**
> - **User** 1:1 **Favorite**
> - **Restaurant** 1:N **MenuItem**
> - **Restaurant** 1:N **Order**
> - **Restaurant** 1:N **Review**
> - **Order** 1:1 **Payment**
> - **DeliveryPartner** 1:N **Order** (History) / 1:1 (Active)
>
> **Style:** Professional Crow's Foot notation or UML class diagram. Clean layout, distinct colors for different modules (User, Order, Restaurant). High resolution.

**Recommended Filename:** `docs/images/er_diagram_comprehensive.png`

---

## 7. Overall System Architecture
**Prompt:**
> A high-level System Architecture diagram for 'QuickBite', a comprehensive food delivery platform.
>
> **Layers & Components:**
> 1.  **Frontend Layer (Clients)**:
>     *   **Customer App** (React + Vite): For browsing and ordering.
>     *   **Restaurant Dashboard** (React + Vite): For menu and order management.
>     *   **Delivery App** (React + Vite): For drivers to accept/fulfill jobs.
>     *   **Admin Dashboard** (React + Vite): For platform oversight.
> 2.  **API Gateway / Backend Layer**:
>     *   **Node.js + Express Server**: Central REST API handling all business logic.
>     *   **Socket.io Server**: Real-time event bus for bi-directional communication (Order updates, Location tracking).
> 3.  **Data Layer**:
>     *   **MongoDB Atlas**: Primary NoSQL database for Users, Orders, Restaurants, MenuItems.
> 4.  **External Services**:
>     *   **Clerk**: Authentication & User Management.
>     *   **Cloudinary**: Image Storage & Optimization.
>     *   **Google Maps API**: Geolocation & Routing.
>     *   **Payment Gateway** (Mock/Stripe): Financial transactions.
>
> **Data Flow:**
> *   Frontends communicate with Backend via **REST API (Axios)** and **WebSockets**.
> *   Backend connects to **MongoDB**.
> *   Backend integrates with **Clerk** (Auth middleware) and **Cloudinary** (Uploads).
>
> **Style:** Modern Cloud Architecture diagram. Clean, professional, distinct icons for each service (React, Node, Mongo, etc.). Arrows indicating data flow direction.

**Recommended Filename:** `docs/images/system_architecture_v2.png`

---

## 8. Authentication Flow
**Prompt:**
> A detailed sequence diagram showing the 'Secure Authentication Flow' in QuickBite using Clerk.
>
> **Participants:**
> 1.  **User**: The end-user.
> 2.  **Frontend**: React Application.
> 3.  **Clerk**: External Identity Provider (Auth).
> 4.  **Backend**: Node.js API Server.
> 5.  **Database**: MongoDB.
>
> **Sequence:**
> 1.  **User** clicks 'Login' on **Frontend**.
> 2.  **Frontend** redirects User to **Clerk** hosted login page.
> 3.  **User** enters credentials (Email/Password or Google Auth).
> 4.  **Clerk** validates credentials and redirects to **Frontend** with a Session Token.
> 5.  **Frontend** attaches Token to API Request (Bearer Header) -> **Backend**.
> 6.  **Backend** verifies Token signature using Clerk SDK.
> 7.  **Backend** checks/creates User profile in **Database**.
> 8.  **Backend** returns '200 OK' (Session Active).
>
> **Style:** Modern Sequence Diagram. distinct vertical lifelines. Use lock icons for security steps. Color scheme: Blue (Frontend), Purple (Clerk), Green (Backend). Professional and clean.

**Recommended Filename:** `docs/images/auth_flow.png`

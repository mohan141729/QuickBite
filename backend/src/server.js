import 'dotenv/config';
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import incentiveRoutes from "./routes/incentiveRoutes.js";

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "https://admin.quickbite.in",
  "https://partner.quickbite.in",
  "https://quickbite.in",
];

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedRegex = [
        /^https:\/\/.*\.vercel\.app$/,
        /^https:\/\/.*\.onrender\.com$/,
        /^https:\/\/.*\.up\.railway\.app$/,
        /^https:\/\/.*\.railway\.app$/
      ];

      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedRegex.some(regex => regex.test(origin))
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "https://admin.quickbite.in",
      "https://partner.quickbite.in",
      "https://quickbite.in",
      /^https:\/\/.*\.vercel\.app$/,
      /^https:\/\/.*\.onrender\.com$/
    ],
    credentials: true,
  },
});

global.io = io;

// Webhooks
app.use("/api/webhooks", webhookRoutes);

app.use(cookieParser());
app.use(express.json());

const Port = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/debug-headers", (req, res) => {
  console.log('Debug Headers:', req.headers);
  res.json({ headers: req.headers, auth: req.auth });
});

app.get("/api/debug-clerk", (req, res) => {
  res.json({
    clerkSecretKeyExists: !!process.env.CLERK_SECRET_KEY,
    clerkSecretKeyPrefix: process.env.CLERK_SECRET_KEY?.substring(0, 10) + '...',
    nodeEnv: process.env.NODE_ENV,
    envKeysCount: Object.keys(process.env).length
  });
});

app.get("/api/debug-db", (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    readyState: mongoose.connection.readyState, // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
    uriHidden: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 15) + '...' : 'Not Set'
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/favorites", favoriteRoutes); // Favorites routes
app.use("/api/incentives", incentiveRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  socket.on('join-restaurant-room', (restaurantId) => {
    socket.join(`restaurant-${restaurantId}`);
    console.log(`🍽️ Restaurant ${restaurantId} joined their room`);
  });

  socket.on('join-delivery-room', () => {
    socket.join('delivery-partners');
    console.log(`🚚 Client ${socket.id} joined delivery-partners room`);
  });

  socket.on('update-location', (data) => {
    const { orderId, customerId, location } = data;
    if (customerId) {
      socket.to(`user-${customerId}`).emit('driver-location-updated', {
        orderId,
        location
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

connectDB().then(() => {
  httpServer.listen(Port, () => {
    console.log("🚀 Server running on port: " + Port);
    console.log("🔌 WebSocket server ready");
  });
});

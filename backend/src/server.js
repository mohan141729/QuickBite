import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js"
import restaurantRoutes from "./routes/restaurantRoutes.js"
import menuRoutes from "./routes/menuRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import deliveryRoutes from "./routes/deliveryRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express();
const httpServer = createServer(app);

// ✅ Initialize Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://admin.quickbite.in",
      "https://partner.quickbite.in",
      "https://quickbite.in",
    ],
    credentials: true,
  },
});

// ✅ Make io available globally for controllers
global.io = io;

app.use(cookieParser());
app.use(express.json());
dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "https://admin.quickbite.in",
  "https://partner.quickbite.in",
  "https://quickbite.in",
]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)

const Port = process.env.PORT || 5001

app.get("/", (req, res) => {
  res.send("API is running...")
})

//Routes
app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/restaurants", restaurantRoutes)
app.use("/api/menu", menuRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/delivery", deliveryRoutes)
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);

// ✅ Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  // Join room for specific user
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  // Join room for specific restaurant
  socket.on('join-restaurant-room', (restaurantId) => {
    socket.join(`restaurant-${restaurantId}`);
    console.log(`🍽️ Restaurant ${restaurantId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

connectDB().then(() => {
  httpServer.listen(Port, () => {
    console.log("🚀 Server running on port: " + Port);
    console.log("🔌 WebSocket server ready");
  })
})

import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/User.js"

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  return token;
}

// ✅ Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: "User already exists" })

    const user = await User.create({ name, email, password, role })
    const token = generateToken(res, user._id)
    res.status(201).json({ message: "User registered successfully", user, token })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "Invalid email or password" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" })

    const token = generateToken(res, user._id)
    res.json({ message: "Login successful", user, token })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ Logout User
export const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production", // Secure only in production
  })
  res.status(200).json({ message: "Logged out successfully" })
}

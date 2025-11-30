import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Optional for Clerk users
    clerkId: { type: String, required: true, unique: true }, // Clerk user ID
    role: {
      type: String,
      enum: ["admin", "restaurant_owner", "delivery_partner", "customer"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
    address: [{
      line1: { type: String },
      city: { type: String },
      pincode: { type: String }
    }],
    phone: { type: String, unique: true, sparse: true }, // sparse allows null/undefined to be unique
    preferences: {
      isVeg: { type: Boolean, default: false },
      spicyLevel: { type: String, enum: ["low", "medium", "high"], default: "medium" },
      allergies: [{ type: String }]
    },
    savedPaymentMethods: [{
      type: { type: String, enum: ["card", "upi", "wallet"] },
      details: { type: Object } // Encrypted or tokenized details
    }],
    deviceTokens: [{ type: String }], // For push notifications
    deleted: { type: Boolean, default: false }, // Soft delete flag
    deletedAt: { type: Date }, // Soft delete timestamp
  },
  { timestamps: true }
)

// ✅ Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// ✅ Compare passwords easily later
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User

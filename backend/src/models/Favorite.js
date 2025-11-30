import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true // One favorites document per user
    },
    restaurants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant"
    }],
    menuItems: [{
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem"
      },
      restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
      }
    }]
  },
  { timestamps: true }
);

export default mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);

import User from "../models/User.js"

export const getProfile = async (req, res) => {
  res.json(req.user)
}

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: "User not found" })

    user.name = req.body.name || user.name
    user.phone = req.body.phone || user.phone
    user.address = req.body.address || user.address

    const updatedUser = await user.save()

    // ✅ Don't reset or remove JWT cookie
    // Just respond with updated data
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
      },
    })
  } catch (error) {
    console.error("Profile update error:", error)
    res.status(500).json({ message: "Server error updating profile" })
  }
}

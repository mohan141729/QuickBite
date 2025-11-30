import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";

// ✅ Get all active coupons (public)
export const getAllActiveCoupons = async (req, res) => {
    try {
        const now = new Date();
        const coupons = await Coupon.find({
            isActive: true,
            validFrom: { $lte: now },
            validUntil: { $gte: now },
        }).select("-usedCount -usageLimit"); // Hide usage stats from public

        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Validate coupon and calculate discount
export const validateCoupon = async (req, res) => {
    try {
        const { code, subtotal, restaurantId, userId } = req.body;

        if (!code || !subtotal) {
            return res.status(400).json({ message: "Code and subtotal are required" });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid coupon code" });
        }

        // Check if active
        if (!coupon.isActive) {
            return res.status(400).json({ message: "This coupon is no longer active" });
        }

        // Check validity dates
        const now = new Date();
        if (now < coupon.validFrom || now > coupon.validUntil) {
            return res.status(400).json({ message: "This coupon has expired" });
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: "This coupon has reached its usage limit" });
        }

        // Check minimum order value
        if (subtotal < coupon.minOrderValue) {
            return res.status(400).json({
                message: `Minimum order value of ₹${coupon.minOrderValue} required`,
            });
        }

        // Check restaurant restriction
        if (coupon.restaurantIds.length > 0 && restaurantId) {
            const isValidRestaurant = coupon.restaurantIds.some(
                (id) => id.toString() === restaurantId.toString()
            );
            if (!isValidRestaurant) {
                return res.status(400).json({
                    message: "This coupon is not valid for this restaurant",
                });
            }
        }

        // Check first-time user restriction
        if (coupon.firstTimeUserOnly && userId) {
            const orderCount = await Order.countDocuments({ user: userId });
            if (orderCount > 0) {
                return res.status(400).json({
                    message: "This coupon is only valid for first-time users",
                });
            }
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discountType === "percentage") {
            discount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else if (coupon.discountType === "flat") {
            discount = coupon.discountValue;
        } else if (coupon.discountType === "free_delivery") {
            discount = 30; // Assuming delivery fee is ₹30
        }

        // Ensure discount doesn't exceed subtotal
        if (discount > subtotal) {
            discount = subtotal;
        }

        res.json({
            valid: true,
            discount: Math.round(discount),
            discountType: coupon.discountType,
            finalAmount: Math.round(subtotal - discount),
            message: `Coupon applied! You saved ₹${Math.round(discount)}`,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Create coupon (Admin only)
export const createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json({ message: "Coupon created successfully", coupon });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }
        res.status(500).json({ message: error.message });
    }
};

// ✅ Update coupon (Admin only)
export const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.json({ message: "Coupon updated successfully", coupon });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Delete coupon (Admin only)
export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.json({ message: "Coupon deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get all coupons (Admin only)
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get coupon statistics (Admin only)
export const getCouponStats = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        const ordersWithCoupon = await Order.find({ couponCode: coupon.code });
        const totalDiscount = ordersWithCoupon.reduce(
            (sum, order) => sum + (order.discount || 0),
            0
        );

        res.json({
            coupon,
            stats: {
                totalUses: coupon.usedCount,
                totalDiscountGiven: totalDiscount,
                averageDiscount: ordersWithCoupon.length > 0
                    ? totalDiscount / ordersWithCoupon.length
                    : 0,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

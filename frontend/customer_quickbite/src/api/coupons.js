import api from "./api";

// Get all active coupons
export const getAllCoupons = async () => {
    const { data } = await api.get("/api/coupons/active");
    return data;
};

// Validate coupon
export const validateCoupon = async (couponData) => {
    const { data } = await api.post("/api/coupons/validate", couponData);
    return data;
};

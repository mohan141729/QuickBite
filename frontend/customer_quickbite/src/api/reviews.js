import api from "./api";

// Submit a review
export const submitReview = async (reviewData) => {
    const { data } = await api.post("/api/reviews", reviewData);
    return data;
};

// Get reviews for a restaurant
export const getRestaurantReviews = async (restaurantId) => {
    const { data } = await api.get(`/api/reviews/${restaurantId}`);
    return data;
};

// Get my reviews
export const getMyReviews = async () => {
    const { data } = await api.get("/api/reviews/my");
    return data;
};

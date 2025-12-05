export const isRestaurantOpen = (restaurant) => {
    if (!restaurant || !restaurant.operatingHours) return false;

    // If explicitly set to closed via toggle
    if (restaurant.isOpen === false) return false;

    const { open, close, holidays } = restaurant.operatingHours;
    if (!open || !close) return true; // Default to open if no hours set

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });

    // Check holidays
    if (holidays && holidays.includes(currentDay)) return false;

    // Parse times
    const [openHour, openMinute] = open.split(':').map(Number);
    const [closeHour, closeMinute] = close.split(':').map(Number);

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const currentTimeValue = currentHour * 60 + currentMinute;
    const openTimeValue = openHour * 60 + openMinute;
    const closeTimeValue = closeHour * 60 + closeMinute;

    // Handle overnight hours (e.g., 18:00 to 02:00)
    if (closeTimeValue < openTimeValue) {
        return currentTimeValue >= openTimeValue || currentTimeValue <= closeTimeValue;
    }

    return currentTimeValue >= openTimeValue && currentTimeValue <= closeTimeValue;
};

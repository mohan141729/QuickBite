import Incentive from "../models/Incentive.js";

// Create a new incentive
export const createIncentive = async (req, res) => {
    try {
        const incentive = new Incentive(req.body);
        await incentive.save();
        res.status(201).json({ success: true, incentive });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all active incentives (for delivery app)
export const getActiveIncentives = async (req, res) => {
    try {
        const incentives = await Incentive.find({ isActive: true });
        res.json({ success: true, incentives });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all incentives (for admin)
export const getAllIncentives = async (req, res) => {
    try {
        const incentives = await Incentive.find().sort({ createdAt: -1 });
        res.json({ success: true, incentives });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update an incentive
export const updateIncentive = async (req, res) => {
    try {
        const incentive = await Incentive.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!incentive) {
            return res.status(404).json({ success: false, message: "Incentive not found" });
        }
        res.json({ success: true, incentive });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete an incentive
export const deleteIncentive = async (req, res) => {
    try {
        const incentive = await Incentive.findByIdAndDelete(req.params.id);
        if (!incentive) {
            return res.status(404).json({ success: false, message: "Incentive not found" });
        }
        res.json({ success: true, message: "Incentive deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

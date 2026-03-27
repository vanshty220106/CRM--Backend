const Complaint = require('../models/Complaint');
const AppError = require('../utils/AppError');

// ── GET ALL COMPLAINTS (For the User or All) ─────────────
exports.getComplaints = async (req, res, next) => {
  try {
    // If admin/manager, they might see all. But for now, returning user's complaints
    // Or we could return all complaints for the 'public dashboard' aspect.
    // The requirement says "public issues ... transparent tracking" so let's return all.
    const complaints = await Complaint.find().sort({ createdAt: -1 });

    // Map to frontend expected format
    const formattedComplaints = complaints.map(c => ({
      id: c._id.toString().slice(-6).toUpperCase(), // Fake short ID
      title: c.title,
      category: c.category,
      status: c.status,
      date: c.createdAt.toISOString().split('T')[0]
    }));

    res.status(200).json(formattedComplaints);
  } catch (error) {
    next(error);
  }
};

// ── GET STATS ────────────────────────────────────────────
exports.getStats = async (req, res, next) => {
  try {
    const total = await Complaint.countDocuments();
    const active = await Complaint.countDocuments({ status: { $in: ['Pending', 'In Progress', 'Escalated'] } });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const escalated = await Complaint.countDocuments({ status: 'Escalated' });

    res.status(200).json({
      total,
      active,
      resolved,
      escalated
    });
  } catch (error) {
    next(error);
  }
};

// ── CREATE COMPLAINT ─────────────────────────────────────
exports.createComplaint = async (req, res, next) => {
  try {
    const { title, category, location, description } = req.body;

    // req.user is set by auth middleware
    const newComplaint = await Complaint.create({
      title,
      category,
      location,
      description,
      user: req.user._id
    });

    const formattedComplaint = {
      id: newComplaint._id.toString().slice(-6).toUpperCase(),
      title: newComplaint.title,
      category: newComplaint.category,
      status: newComplaint.status,
      date: newComplaint.createdAt.toISOString().split('T')[0]
    };

    res.status(201).json(formattedComplaint);
  } catch (error) {
    next(error);
  }
};

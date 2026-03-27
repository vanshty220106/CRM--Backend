const Complaint = require('../models/Complaint');
const AppError = require('../utils/AppError');
const fs = require('fs');
const path = require('path');

// ── GET ALL COMPLAINTS (For the User or All) ─────────────
exports.getComplaints = async (req, res, next) => {
  try {
    // If admin/manager, they might see all. But for now, returning user's complaints
    // Or we could return all complaints for the 'public dashboard' aspect.
    // The requirement says "public issues ... transparent tracking" so let's return all.
    const complaints = await Complaint.find().sort({ createdAt: -1 });

    const formattedComplaints = complaints.map(c => ({
      id: c._id.toString().slice(-6).toUpperCase(),
      title: c.title,
      category: c.category,
      status: c.status,
      date: c.createdAt.toISOString().split('T')[0],
      userEmail: c.user ? 'User' : 'Unknown',
      image: c.image,
      proofImage: c.proofImage,
      location: c.location,
      updates: c.updates,
      description: c.description
    }));

    res.status(200).json(formattedComplaints);
  } catch (error) {
    next(error);
  }
};

// ── GET LOGGED IN USER COMPLAINTS ────────────────────────
exports.getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });

    const formattedComplaints = complaints.map(c => ({
      id: c._id.toString().slice(-6).toUpperCase(),
      title: c.title,
      category: c.category,
      status: c.status,
      date: c.createdAt.toISOString().split('T')[0],
      image: c.image,
      proofImage: c.proofImage,
      location: c.location,
      updates: c.updates,
      description: c.description
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
    const active = await Complaint.countDocuments({ status: { $in: ['Pending', 'initiated', 'under_review', 'construction_ongoing', 'In Progress', 'Escalated'] } });
    const resolved = await Complaint.countDocuments({ status: { $in: ['resolved', 'Resolved', 'fixing_issues'] } });
    const escalated = await Complaint.countDocuments({ status: 'Escalated' });

    // Aggregations for Charts
    const byCategory = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    
    const byStatus = await Complaint.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      total,
      active,
      resolved,
      escalated,
      byCategory,
      byStatus
    });
  } catch (error) {
    next(error);
  }
};

// ── CREATE COMPLAINT ─────────────────────────────────────
exports.createComplaint = async (req, res, next) => {
  try {
    let { title, category, location, description } = req.body;
    
    // Parse the geographic mixed location JSON if provided from maps
    if (typeof location === 'string' && location.startsWith('{')) {
      try { location = JSON.parse(location); } catch (e) {}
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newComplaint = await Complaint.create({
      title,
      category,
      location,
      description,
      image: imagePath,
      user: req.user._id,
      status: 'initiated',
      updates: [{
        status: 'initiated',
        message: 'Complaint successfully registered via CivicFlow Node Engine.',
        timestamp: new Date()
      }]
    });

    res.status(201).json(newComplaint);
  } catch (error) {
    next(error);
  }
};

// ── ADMIN UPDATE COMPLAINT STATUS ───────────────────────
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, message, proofImage } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) return next(new AppError('Complaint not found', 404));

    if (status) complaint.status = status;
    if (message || status) {
      complaint.updates.push({
        status: status || complaint.status,
        message: message || `Status updated to ${status}`,
        timestamp: new Date()
      });
    }
    if (proofImage) {
      complaint.proofImage = proofImage;
    }

    await complaint.save();
    res.status(200).json(complaint);
  } catch (error) {
    next(error);
  }
};

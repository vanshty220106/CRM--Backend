const { Complaint } = require('../utils/dbAdapter');
const AppError = require('../utils/AppError');

// helper: format a complaint doc for the API response
const fmt = (c) => ({
  id: c._id ? String(c._id).slice(-6).toUpperCase() : 'LOCAL',
  _id: c._id,
  title: c.title,
  category: c.category,
  status: c.status,
  date: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  userEmail: c.userEmail || 'User',
  image: c.image || null,
  proofImage: c.proofImage || null,
  location: c.location || null,
  updates: c.updates || [],
  description: c.description,
});

// ── GET ALL COMPLAINTS ────────────────────────────────────
exports.getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.status(200).json(complaints.map ? complaints.map(fmt) : []);
  } catch (error) {
    next(error);
  }
};

// ── GET LOGGED-IN USER'S COMPLAINTS ──────────────────────
exports.getMyComplaints = async (req, res, next) => {
  try {
    const userId = String(req.user._id);
    const complaints = await Complaint.find({ user: userId }).sort({ createdAt: -1 });
    const list = Array.isArray(complaints) ? complaints : [];
    res.status(200).json(list.map(fmt));
  } catch (error) {
    next(error);
  }
};

// ── GET STATS ─────────────────────────────────────────────
exports.getStats = async (req, res, next) => {
  try {
    const activeStatuses = ['Pending', 'initiated', 'under_review', 'construction_ongoing', 'In Progress', 'Escalated'];
    const resolvedStatuses = ['resolved', 'Resolved', 'fixing_issues'];

    const total    = await Complaint.countDocuments();
    const active   = await Complaint.countDocuments({ status: { $in: activeStatuses } });
    const resolved = await Complaint.countDocuments({ status: { $in: resolvedStatuses } });
    const escalated = await Complaint.countDocuments({ status: 'Escalated' });

    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const byStatus = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.status(200).json({ total, active, resolved, escalated, byCategory, byStatus });
  } catch (error) {
    next(error);
  }
};

// ── CREATE COMPLAINT ──────────────────────────────────────
exports.createComplaint = async (req, res, next) => {
  try {
    let { title, category, location, description } = req.body;

    if (typeof location === 'string' && location.startsWith('{')) {
      try { location = JSON.parse(location); } catch (e) { /* keep as string */ }
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newComplaint = await Complaint.create({
      title,
      category,
      location,
      description,
      image: imagePath,
      user: String(req.user._id),
      status: 'initiated',
      updates: [{
        status: 'initiated',
        message: 'Complaint successfully registered via CivicFlow.',
        timestamp: new Date().toISOString(),
      }],
    });

    res.status(201).json(newComplaint);
  } catch (error) {
    next(error);
  }
};

// ── ADMIN: UPDATE STATUS ──────────────────────────────────
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, message, proofImage } = req.body;

    // find by full _id or partial suffix
    let complaint = await Complaint.findById(id);

    // If not found by full id, try suffix match (local IDs are stored as full hex)
    if (!complaint) {
      const all = await Complaint.find();
      const list = Array.isArray(all) ? all : [];
      complaint = list.find(c => String(c._id).slice(-6).toUpperCase() === id.toUpperCase());
    }

    if (!complaint) return next(new AppError('Complaint not found', 404));

    if (status) complaint.status = status;
    if (message || status) {
      complaint.updates = complaint.updates || [];
      complaint.updates.push({
        status: status || complaint.status,
        message: message || `Status updated to ${status}`,
        timestamp: new Date().toISOString(),
      });
    }
    if (proofImage) complaint.proofImage = proofImage;

    await complaint.save();
    res.status(200).json(complaint);
  } catch (error) {
    next(error);
  }
};

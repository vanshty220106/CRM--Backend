const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a complaint title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: [
      'Roads & Infrastructure', 
      'Utilities', 
      'Environment', 
      'Noise', 
      'Vandalism', 
      'Other'
    ]
  },
  location: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Please add a location']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  status: {
    type: String,
    enum: ['Pending', 'initiated', 'under_review', 'construction_ongoing', 'fixing_issues', 'resolved', 'In Progress', 'Escalated', 'Resolved'],
    default: 'initiated'
  },
  updates: [{
    status: String,
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  proofImage: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);

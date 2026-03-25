const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lead title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer reference is required'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    value: {
      type: Number,
      min: [0, 'Deal value cannot be negative'],
      default: 0,
    },
    stage: {
      type: String,
      enum: {
        values: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'],
        message: 'Stage must be one of: new, contacted, qualified, proposal, negotiation, won, lost',
      },
      default: 'new',
    },
    probability: {
      type: Number,
      min: [0, 'Probability cannot be less than 0'],
      max: [100, 'Probability cannot exceed 100'],
      default: 0,
    },
    expectedCloseDate: {
      type: Date,
    },
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ──────────────────────────────────────────────
leadSchema.index({ customer: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ stage: 1 });
leadSchema.index({ expectedCloseDate: 1 });

module.exports = mongoose.model('Lead', leadSchema);

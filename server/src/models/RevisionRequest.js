import mongoose from 'mongoose';

const revisionRequestSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proposal',
      required: true,
      index: true,
    },
    proposalVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProposalVersion',
      required: true,
      index: true,
    },
    targetVersionNumber: {
      type: Number,
      required: true,
    },
    requestedChanges: {
      type: String,
      required: [true, 'Revision request description is required'],
    },
    focusAreas: [
      {
        type: String,
        enum: ['Materials & Finishes', 'Cost & Budget', 'Timeline', 'Scope of Work', 'Layout & Geometry', 'Other'],
      },
    ],
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Addressed', 'Declined'],
      default: 'Pending',
    },
    addressedInVersionNumber: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const RevisionRequest = mongoose.model('RevisionRequest', revisionRequestSchema);

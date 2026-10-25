import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    designer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    currentVersionNumber: {
      type: Number,
      default: 1,
    },
    currentVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProposalVersion',
      default: null,
    },
    status: {
      type: String,
      enum: ['Published', 'Revision Requested', 'Accepted', 'Declined'],
      default: 'Published',
    },
    acceptedVersionNumber: {
      type: Number,
      default: null,
    },
    acceptedVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProposalVersion',
      default: null,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Proposal = mongoose.model('Proposal', proposalSchema);

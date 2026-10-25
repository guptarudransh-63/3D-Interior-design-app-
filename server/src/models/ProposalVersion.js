import mongoose from 'mongoose';

const costLineItemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['Materials', 'Furniture', 'Lighting', 'Labour', 'Installation', 'Permits & Management', 'Other'],
    },
    item: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    unitCost: {
      type: Number,
      required: true,
      min: 0,
    },
    lineTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const proposalVersionSchema = new mongoose.Schema(
  {
    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proposal',
      required: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    versionNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    designConceptDescription: {
      type: String,
      required: true,
    },
    selectedFinishes: [
      {
        category: String,
        name: String,
        specDetails: String,
      },
    ],
    scopeOfWork: [
      {
        type: String,
        required: true,
      },
    ],
    costBreakdown: {
      type: [costLineItemSchema],
      default: [],
    },
    totalEstimatedCost: {
      type: Number,
      required: true,
      min: 0,
    },
    estimatedTimeline: {
      type: String,
      required: true,
    },
    designerNotes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Published', 'Revision Requested', 'Accepted', 'Declined', 'Superseded'],
      default: 'Published',
    },
    clientDecision: {
      decision: {
        type: String,
        enum: ['Accepted', 'Declined', null],
        default: null,
      },
      decisionDate: {
        type: Date,
        default: null,
      },
      decisionNotes: {
        type: String,
        default: '',
      },
      decisionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
    },
    revisionSummary: {
      type: String,
      default: '', // Designer's notes on what changed in this version compared to prior
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure versionNumber is unique per proposal
proposalVersionSchema.index({ proposal: 1, versionNumber: 1 }, { unique: true });

export const ProposalVersion = mongoose.model('ProposalVersion', proposalVersionSchema);

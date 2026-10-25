import mongoose from 'mongoose';

const projectActivitySchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    actionType: {
      type: String,
      required: true,
      enum: [
        'PROJECT_CREATED',
        'STATUS_UPDATED',
        'DESIGNER_ASSIGNED',
        'PROPOSAL_CREATED',
        'PROPOSAL_REVISED',
        'REVISION_REQUESTED',
        'PROPOSAL_ACCEPTED',
        'PROPOSAL_DECLINED',
      ],
    },
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const ProjectActivity = mongoose.model('ProjectActivity', projectActivitySchema);

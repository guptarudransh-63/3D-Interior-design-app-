import mongoose from 'mongoose';

export const PROJECT_STATUSES = [
  'Draft',
  'Submitted',
  'Under Review',
  'Proposal Ready',
  'Revision Requested',
  'Accepted',
  'Declined',
  'Completed',
];

// Valid state machine transitions
export const ALLOWED_STATUS_TRANSITIONS = {
  Draft: ['Submitted'],
  Submitted: ['Under Review', 'Declined'],
  'Under Review': ['Proposal Ready', 'Declined'],
  'Proposal Ready': ['Revision Requested', 'Accepted', 'Declined'],
  'Revision Requested': ['Under Review', 'Proposal Ready', 'Declined'],
  Accepted: ['Completed'],
  Declined: ['Under Review', 'Submitted'], // Allows reopening upon client/designer agreement
  Completed: [],
};

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assignedDesigner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    roomType: {
      type: String,
      required: true,
      enum: [
        'Living Room',
        'Bedroom',
        'Kitchen',
        'Dining Room',
        'Home Office',
        'Studio Apartment',
      ],
    },
    propertyType: {
      type: String,
      required: true,
      enum: ['Apartment', 'Townhouse', 'Penthouse', 'Single Family Villa', 'Studio', 'Commercial Space'],
      default: 'Apartment',
    },
    dimensions: {
      lengthFt: { type: Number, default: 0 },
      widthFt: { type: Number, default: 0 },
      heightFt: { type: Number, default: 0 },
      areaSqFt: { type: Number, default: 0 },
    },
    preferredStyle: {
      type: String,
      required: true,
    },
    budgetRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
    },
    timeline: {
      type: String,
      required: true,
      enum: ['1 - 2 Months', '2 - 4 Months', '4 - 6 Months', '6+ Months', 'Flexible'],
      default: '2 - 4 Months',
    },
    location: {
      city: { type: String, required: true },
      stateOrProvince: { type: String, default: '' },
      country: { type: String, default: 'United States' },
    },
    requirementsDescription: {
      type: String,
      required: [true, 'Project requirements description is required'],
    },
    referenceImages: [
      {
        type: String,
      },
    ],
    savedDesign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SavedDesign',
      default: null,
    },
    status: {
      type: String,
      enum: PROJECT_STATUSES,
      default: 'Submitted',
      index: true,
    },
    statusNotes: {
      type: String,
      default: 'Project brief submitted for review.',
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.methods.canTransitionTo = function (nextStatus) {
  if (this.status === nextStatus) return true;
  const allowed = ALLOWED_STATUS_TRANSITIONS[this.status] || [];
  return allowed.includes(nextStatus);
};

export const Project = mongoose.model('Project', projectSchema);

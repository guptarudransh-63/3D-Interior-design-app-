import mongoose from 'mongoose';

const savedDesignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Design name is required'],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    roomConcept: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoomConcept',
      required: true,
    },
    selectedMaterials: {
      flooring: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaterialOption',
        required: true,
      },
      walls: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaterialOption',
        required: true,
      },
      cabinetry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaterialOption',
        required: true,
      },
      accent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaterialOption',
        required: true,
      },
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    referenceImages: [
      {
        type: String,
      },
    ],
    customDimensions: {
      lengthFt: Number,
      widthFt: Number,
      areaSqFt: Number,
    },
    estimatedBudget: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const SavedDesign = mongoose.model('SavedDesign', savedDesignSchema);

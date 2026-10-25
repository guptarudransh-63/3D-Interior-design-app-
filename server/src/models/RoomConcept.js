import mongoose from 'mongoose';

const roomConceptSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
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
    designStyle: {
      type: String,
      required: true,
      enum: [
        'Warm Minimalist',
        'Japandi',
        'Scandinavian',
        'Modern Architectural',
        'Mediterranean Contemporary',
        'Industrial Loft',
      ],
    },
    coverImage: {
      type: String,
      required: true,
    },
    galleryImages: [
      {
        type: String,
      },
    ],
    defaultDimensions: {
      lengthFt: { type: Number, default: 18 },
      widthFt: { type: Number, default: 14 },
      heightFt: { type: Number, default: 10 },
      areaSqFt: { type: Number, default: 252 },
    },
    budgetRange: {
      min: { type: Number, default: 8000 },
      max: { type: Number, default: 25000 },
    },
    availableMaterials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaterialOption',
      },
    ],
    defaultSelections: {
      flooring: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaterialOption',
      },
      walls: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaterialOption',
      },
      cabinetry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaterialOption',
      },
      accent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaterialOption',
      },
    },
    sceneConfig: {
      cameraPosition: {
        type: [Number],
        default: [6, 4, 8],
      },
      targetPosition: {
        type: [Number],
        default: [0, 1.2, 0],
      },
      lightingWarmth: {
        type: String,
        default: '#FFF6E8',
      },
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const RoomConcept = mongoose.model('RoomConcept', roomConceptSchema);

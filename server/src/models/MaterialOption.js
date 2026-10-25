import mongoose from 'mongoose';

const materialOptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['flooring', 'walls', 'cabinetry', 'accent'],
    },
    description: {
      type: String,
      default: '',
    },
    hexCode: {
      type: String,
      required: true,
    },
    textureType: {
      type: String,
      enum: ['wood', 'stone', 'paint', 'fabric', 'metal', 'terrazzo'],
      default: 'paint',
    },
    roughness: {
      type: Number,
      default: 0.6,
      min: 0,
      max: 1,
    },
    metalness: {
      type: Number,
      default: 0.1,
      min: 0,
      max: 1,
    },
    costModifier: {
      type: Number,
      default: 0, // Additional cost per sq ft
    },
    thumbnail: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MaterialOption = mongoose.model('MaterialOption', materialOptionSchema);

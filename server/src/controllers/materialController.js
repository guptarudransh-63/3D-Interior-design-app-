import { MaterialOption } from '../models/MaterialOption.js';

// @desc    Get all material options
// @route   GET /api/material-options
// @access  Public
export const getMaterialOptions = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    const materials = await MaterialOption.find(filter).sort({ category: 1, name: 1 });

    res.json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new material option
// @route   POST /api/material-options
// @access  Private (Admin)
export const createMaterialOption = async (req, res, next) => {
  try {
    const material = await MaterialOption.create(req.body);
    res.status(201).json({
      success: true,
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update material option
// @route   PATCH /api/material-options/:id
// @access  Private (Admin)
export const updateMaterialOption = async (req, res, next) => {
  try {
    const material = await MaterialOption.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material option not found',
      });
    }

    res.json({
      success: true,
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

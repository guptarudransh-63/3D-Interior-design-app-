import { SavedDesign } from '../models/SavedDesign.js';
import { RoomConcept } from '../models/RoomConcept.js';
import { MaterialOption } from '../models/MaterialOption.js';

// @desc    Get all saved designs for current user
// @route   GET /api/designs
// @access  Private (Client / Admin)
export const getSavedDesigns = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { owner: req.user._id };

    const designs = await SavedDesign.find(filter)
      .populate('roomConcept', 'name slug roomType designStyle coverImage defaultDimensions budgetRange')
      .populate('selectedMaterials.flooring')
      .populate('selectedMaterials.walls')
      .populate('selectedMaterials.cabinetry')
      .populate('selectedMaterials.accent')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: designs.length,
      data: designs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single saved design by ID
// @route   GET /api/designs/:id
// @access  Private
export const getSavedDesignById = async (req, res, next) => {
  try {
    const design = await SavedDesign.findById(req.params.id)
      .populate('roomConcept')
      .populate('selectedMaterials.flooring')
      .populate('selectedMaterials.walls')
      .populate('selectedMaterials.cabinetry')
      .populate('selectedMaterials.accent');

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Saved design not found',
      });
    }

    // Authorization check: Must be owner or admin or authorized designer
    const isOwner = design.owner.toString() === req.user._id.toString();
    const isStaff = req.user.role === 'admin' || req.user.role === 'designer';

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this design',
      });
    }

    res.json({
      success: true,
      data: design,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new saved design configuration
// @route   POST /api/designs
// @access  Private
export const createSavedDesign = async (req, res, next) => {
  try {
    const { name, roomConceptId, selectedMaterials, notes, referenceImages, customDimensions } = req.body;

    if (!name || !roomConceptId || !selectedMaterials) {
      return res.status(400).json({
        success: false,
        message: 'Please provide design name, room concept, and material selections',
      });
    }

    // Validate room concept exists
    const roomConcept = await RoomConcept.findById(roomConceptId);
    if (!roomConcept) {
      return res.status(404).json({
        success: false,
        message: 'Room concept not found',
      });
    }

    // Verify material IDs exist
    const materialIds = [
      selectedMaterials.flooring,
      selectedMaterials.walls,
      selectedMaterials.cabinetry,
      selectedMaterials.accent,
    ].filter(Boolean);

    const materials = await MaterialOption.find({ _id: { $in: materialIds } });
    if (materials.length < materialIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more selected material options are invalid or no longer available',
      });
    }

    // Calculate estimated budget
    const area = customDimensions?.areaSqFt || roomConcept.defaultDimensions.areaSqFt || 200;
    const baseCostPerSqFt = 45; // baseline material + installation cost
    const materialCostModifier = materials.reduce((acc, m) => acc + (m.costModifier || 0), 0);
    const estimatedBudget = Math.round(area * (baseCostPerSqFt + materialCostModifier));

    const savedDesign = await SavedDesign.create({
      name,
      owner: req.user._id,
      roomConcept: roomConceptId,
      selectedMaterials: {
        flooring: selectedMaterials.flooring,
        walls: selectedMaterials.walls,
        cabinetry: selectedMaterials.cabinetry,
        accent: selectedMaterials.accent,
      },
      notes: notes || '',
      referenceImages: referenceImages || [],
      customDimensions: customDimensions || roomConcept.defaultDimensions,
      estimatedBudget,
    });

    const populatedDesign = await SavedDesign.findById(savedDesign._id)
      .populate('roomConcept')
      .populate('selectedMaterials.flooring')
      .populate('selectedMaterials.walls')
      .populate('selectedMaterials.cabinetry')
      .populate('selectedMaterials.accent');

    res.status(201).json({
      success: true,
      data: populatedDesign,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a saved design configuration
// @route   PATCH /api/designs/:id
// @access  Private (Owner only)
export const updateSavedDesign = async (req, res, next) => {
  try {
    const design = await SavedDesign.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Saved design not found',
      });
    }

    // Strict ownership check
    if (design.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot modify a design you do not own',
      });
    }

    const { name, selectedMaterials, notes, referenceImages, customDimensions } = req.body;

    if (name) design.name = name;
    if (notes !== undefined) design.notes = notes;
    if (referenceImages) design.referenceImages = referenceImages;
    if (customDimensions) design.customDimensions = customDimensions;

    if (selectedMaterials) {
      if (selectedMaterials.flooring) design.selectedMaterials.flooring = selectedMaterials.flooring;
      if (selectedMaterials.walls) design.selectedMaterials.walls = selectedMaterials.walls;
      if (selectedMaterials.cabinetry) design.selectedMaterials.cabinetry = selectedMaterials.cabinetry;
      if (selectedMaterials.accent) design.selectedMaterials.accent = selectedMaterials.accent;
    }

    await design.save();

    const updated = await SavedDesign.findById(design._id)
      .populate('roomConcept')
      .populate('selectedMaterials.flooring')
      .populate('selectedMaterials.walls')
      .populate('selectedMaterials.cabinetry')
      .populate('selectedMaterials.accent');

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate/fork an existing saved design
// @route   POST /api/designs/:id/duplicate
// @access  Private
export const duplicateSavedDesign = async (req, res, next) => {
  try {
    const original = await SavedDesign.findById(req.params.id);

    if (!original) {
      return res.status(404).json({
        success: false,
        message: 'Original design not found',
      });
    }

    const newDesign = await SavedDesign.create({
      name: `${original.name} (Copy)`,
      owner: req.user._id,
      roomConcept: original.roomConcept,
      selectedMaterials: original.selectedMaterials,
      notes: original.notes,
      referenceImages: original.referenceImages,
      customDimensions: original.customDimensions,
      estimatedBudget: original.estimatedBudget,
    });

    const populated = await SavedDesign.findById(newDesign._id)
      .populate('roomConcept')
      .populate('selectedMaterials.flooring')
      .populate('selectedMaterials.walls')
      .populate('selectedMaterials.cabinetry')
      .populate('selectedMaterials.accent');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a saved design
// @route   DELETE /api/designs/:id
// @access  Private (Owner only)
export const deleteSavedDesign = async (req, res, next) => {
  try {
    const design = await SavedDesign.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Saved design not found',
      });
    }

    if (design.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot delete a design you do not own',
      });
    }

    await SavedDesign.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Design deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

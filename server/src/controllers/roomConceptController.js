import { RoomConcept } from '../models/RoomConcept.js';
import { safeSeedCatalog } from '../services/catalogSeeder.js';

// @desc    Get all room concepts with filtering & search
// @route   GET /api/room-concepts
// @access  Public
export const getRoomConcepts = async (req, res, next) => {
  try {
    const { roomType, designStyle, search, featured, sort, limit = 20, page = 1 } = req.query;

    // Self-healing: if the catalog has fewer than 12 room concepts, populate default curated room concepts
    const currentConceptCount = await RoomConcept.countDocuments();
    if (currentConceptCount < 12) {
      try {
        await safeSeedCatalog();
      } catch (seedErr) {
        console.warn(`[RoomConcept Auto-Seed Warning]: ${seedErr.message}`);
      }
    }

    const query = {};

    // For non-admin, only show published
    if (!req.user || req.user.role !== 'admin') {
      query.isPublished = true;
    }

    if (roomType && roomType !== 'All') {
      // Case-insensitive exact match
      query.roomType = { $regex: new RegExp(`^${roomType.trim()}$`, 'i') };
    }

    if (designStyle && designStyle !== 'All') {
      // Case-insensitive exact match
      query.designStyle = { $regex: new RegExp(`^${designStyle.trim()}$`, 'i') };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { roomType: { $regex: search, $options: 'i' } },
        { designStyle: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'budget-asc') {
      sortOption = { 'budgetRange.min': 1 };
    } else if (sort === 'budget-desc') {
      sortOption = { 'budgetRange.min': -1 };
    } else if (sort === 'featured') {
      sortOption = { featured: -1, createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [concepts, total] = await Promise.all([
      RoomConcept.find(query)
        .populate('availableMaterials')
        .populate('defaultSelections.flooring')
        .populate('defaultSelections.walls')
        .populate('defaultSelections.cabinetry')
        .populate('defaultSelections.accent')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      RoomConcept.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: concepts.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: concepts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room concept by slug
// @route   GET /api/room-concepts/:slug
// @access  Public
export const getRoomConceptBySlug = async (req, res, next) => {
  try {
    let concept = await RoomConcept.findOne({ slug: req.params.slug })
      .populate('availableMaterials')
      .populate('defaultSelections.flooring')
      .populate('defaultSelections.walls')
      .populate('defaultSelections.cabinetry')
      .populate('defaultSelections.accent');

    if (!concept) {
      const currentConceptCount = await RoomConcept.countDocuments();
      if (currentConceptCount === 0) {
        try {
          await safeSeedCatalog();
          concept = await RoomConcept.findOne({ slug: req.params.slug })
            .populate('availableMaterials')
            .populate('defaultSelections.flooring')
            .populate('defaultSelections.walls')
            .populate('defaultSelections.cabinetry')
            .populate('defaultSelections.accent');
        } catch (seedErr) {
          console.warn(`[RoomConcept Auto-Seed Warning]: ${seedErr.message}`);
        }
      }
    }

    if (!concept) {
      return res.status(404).json({
        success: false,
        message: 'Room concept not found',
      });
    }

    if (!concept.isPublished && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Room concept not found or unpublished',
      });
    }

    res.json({
      success: true,
      data: concept,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new room concept
// @route   POST /api/room-concepts
// @access  Private (Admin)
export const createRoomConcept = async (req, res, next) => {
  try {
    const conceptData = {
      ...req.body,
      createdBy: req.user._id,
    };

    if (!conceptData.slug && conceptData.name) {
      conceptData.slug = conceptData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const concept = await RoomConcept.create(conceptData);

    res.status(201).json({
      success: true,
      data: concept,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room concept
// @route   PATCH /api/room-concepts/:id
// @access  Private (Admin)
export const updateRoomConcept = async (req, res, next) => {
  try {
    const concept = await RoomConcept.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('availableMaterials')
      .populate('defaultSelections.flooring')
      .populate('defaultSelections.walls')
      .populate('defaultSelections.cabinetry')
      .populate('defaultSelections.accent');

    if (!concept) {
      return res.status(404).json({
        success: false,
        message: 'Room concept not found',
      });
    }

    res.json({
      success: true,
      data: concept,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room concept
// @route   DELETE /api/room-concepts/:id
// @access  Private (Admin)
export const deleteRoomConcept = async (req, res, next) => {
  try {
    const concept = await RoomConcept.findByIdAndDelete(req.params.id);
    if (!concept) {
      return res.status(404).json({
        success: false,
        message: 'Room concept not found',
      });
    }

    res.json({
      success: true,
      message: 'Room concept deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

import { Project, ALLOWED_STATUS_TRANSITIONS } from '../models/Project.js';
import { SavedDesign } from '../models/SavedDesign.js';
import { ProjectActivity } from '../models/ProjectActivity.js';
import { Proposal } from '../models/Proposal.js';
import { safeSeedCatalog } from '../services/catalogSeeder.js';

// @desc    Create a new project brief
// @route   POST /api/projects
// @access  Private (Client)
export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      roomType,
      propertyType,
      dimensions,
      preferredStyle,
      budgetRange,
      timeline,
      location,
      requirementsDescription,
      referenceImages,
      savedDesignId,
    } = req.body;

    if (!title || !roomType || !preferredStyle || !budgetRange || !timeline || !requirementsDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required project brief fields',
      });
    }

    if (budgetRange.min > budgetRange.max) {
      return res.status(400).json({
        success: false,
        message: 'Minimum budget cannot exceed maximum budget',
      });
    }

    // Verify saved design ownership if attached
    let verifiedSavedDesignId = null;
    if (savedDesignId) {
      const design = await SavedDesign.findById(savedDesignId);
      if (!design) {
        return res.status(404).json({
          success: false,
          message: 'Referenced saved design does not exist',
        });
      }
      if (design.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Cannot attach a design belonging to another user',
        });
      }
      verifiedSavedDesignId = design._id;
    }

    const project = await Project.create({
      title,
      client: req.user._id,
      roomType,
      propertyType: propertyType || 'Apartment',
      dimensions: dimensions || { lengthFt: 0, widthFt: 0, heightFt: 0, areaSqFt: 0 },
      preferredStyle,
      budgetRange,
      timeline,
      location: location || { city: 'Unspecified', country: 'United States' },
      requirementsDescription,
      referenceImages: referenceImages || [],
      savedDesign: verifiedSavedDesignId,
      status: 'Submitted',
      statusNotes: 'Project brief submitted and queued for designer review.',
    });

    // Record activity
    await ProjectActivity.create({
      project: project._id,
      actor: req.user._id,
      actionType: 'PROJECT_CREATED',
      title: 'Project Brief Submitted',
      details: `Client submitted requirements with estimated budget $${budgetRange.min.toLocaleString()} - $${budgetRange.max.toLocaleString()}.`,
    });

    const populated = await Project.findById(project._id)
      .populate('client', 'name email phone avatar')
      .populate({
        path: 'savedDesign',
        populate: [
          { path: 'roomConcept' },
          { path: 'selectedMaterials.flooring' },
          { path: 'selectedMaterials.walls' },
          { path: 'selectedMaterials.cabinetry' },
          { path: 'selectedMaterials.accent' },
        ],
      });

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all accessible projects
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    const totalProjects = await Project.countDocuments();
    if (totalProjects === 0) {
      try {
        await safeSeedCatalog();
      } catch (seedErr) {
        console.warn(`[Projects Auto-Seed Notice]: ${seedErr.message}`);
      }
    }

    const { status, roomType, search } = req.query;
    const query = {};

    // Role-based visibility
    if (req.user.role === 'client') {
      query.client = req.user._id;
    } else if (req.user.role === 'designer') {
      // Designers see projects assigned to them OR newly submitted projects awaiting assignment
      query.$or = [{ assignedDesigner: req.user._id }, { assignedDesigner: null, status: 'Submitted' }];
    }
    // Admins see all projects

    if (status && status !== 'All') {
      query.status = status;
    }

    if (roomType && roomType !== 'All') {
      query.roomType = roomType;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const projects = await Project.find(query)
      .populate('client', 'name email phone avatar')
      .populate('assignedDesigner', 'name email phone avatar')
      .populate({
        path: 'savedDesign',
        populate: [
          { path: 'roomConcept', select: 'name coverImage slug' },
          { path: 'selectedMaterials.flooring', select: 'name hexCode category' },
          { path: 'selectedMaterials.walls', select: 'name hexCode category' },
        ],
      })
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name email phone avatar')
      .populate('assignedDesigner', 'name email phone avatar')
      .populate({
        path: 'savedDesign',
        populate: [
          { path: 'roomConcept' },
          { path: 'selectedMaterials.flooring' },
          { path: 'selectedMaterials.walls' },
          { path: 'selectedMaterials.cabinetry' },
          { path: 'selectedMaterials.accent' },
        ],
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Authorization guard
    const isClient = project.client._id.toString() === req.user._id.toString();
    const isAssignedDesigner =
      project.assignedDesigner && project.assignedDesigner._id.toString() === req.user._id.toString();
    const isStaff = req.user.role === 'admin' || (req.user.role === 'designer' && !project.assignedDesigner);

    if (!isClient && !isAssignedDesigner && !isStaff) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to access this project',
      });
    }

    // Also fetch associated proposals & audit activity
    const [proposals, activities] = await Promise.all([
      Proposal.find({ project: project._id }).populate('designer', 'name email avatar').populate('currentVersion'),
      ProjectActivity.find({ project: project._id }).populate('actor', 'name role avatar').sort({ createdAt: -1 }),
    ]);

    res.json({
      success: true,
      data: {
        project,
        proposals,
        activities,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project status via valid state transitions
// @route   PATCH /api/projects/:id/status
// @access  Private (Designer / Admin)
export const updateProjectStatus = async (req, res, next) => {
  try {
    const { nextStatus, notes } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Role check: Designer or Admin
    if (req.user.role !== 'admin' && req.user.role !== 'designer') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only authorized designers or admins can change project status directly',
      });
    }

    // State machine check
    if (!project.canTransitionTo(nextStatus)) {
      const allowed = ALLOWED_STATUS_TRANSITIONS[project.status] || [];
      return res.status(400).json({
        success: false,
        message: `Invalid transition from '${project.status}' to '${nextStatus}'. Allowed next statuses: ${allowed.join(', ') || 'None'}`,
      });
    }

    const previousStatus = project.status;
    project.status = nextStatus;
    if (notes) project.statusNotes = notes;

    // If designer claims project
    if (req.user.role === 'designer' && !project.assignedDesigner) {
      project.assignedDesigner = req.user._id;
    }

    await project.save();

    await ProjectActivity.create({
      project: project._id,
      actor: req.user._id,
      actionType: 'STATUS_UPDATED',
      title: `Status changed to ${nextStatus}`,
      details: notes || `Project progressed from ${previousStatus} to ${nextStatus}.`,
      metadata: { from: previousStatus, to: nextStatus },
    });

    const updated = await Project.findById(project._id)
      .populate('client', 'name email phone avatar')
      .populate('assignedDesigner', 'name email phone avatar');

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign a designer to a project
// @route   PATCH /api/projects/:id/assign
// @access  Private (Designer claim / Admin assignment)
export const assignDesigner = async (req, res, next) => {
  try {
    const { designerId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const targetDesignerId = req.user.role === 'admin' && designerId ? designerId : req.user._id;
    project.assignedDesigner = targetDesignerId;

    if (project.status === 'Submitted') {
      project.status = 'Under Review';
      project.statusNotes = 'Designer assigned; project requirements under active review.';
    }

    await project.save();

    await ProjectActivity.create({
      project: project._id,
      actor: req.user._id,
      actionType: 'DESIGNER_ASSIGNED',
      title: 'Designer Assigned',
      details: `Project assigned to designer for review and proposal creation.`,
    });

    const updated = await Project.findById(project._id)
      .populate('client', 'name email phone avatar')
      .populate('assignedDesigner', 'name email phone avatar');

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

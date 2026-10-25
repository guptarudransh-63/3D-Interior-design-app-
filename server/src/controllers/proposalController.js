import { Proposal } from '../models/Proposal.js';
import { ProposalVersion } from '../models/ProposalVersion.js';
import { Project } from '../models/Project.js';
import { RevisionRequest } from '../models/RevisionRequest.js';
import { ProjectActivity } from '../models/ProjectActivity.js';

// Helper to validate and calculate line items server-side
const processLineItems = (costBreakdown = []) => {
  return costBreakdown.map((item) => {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const unit = Math.max(0, Number(item.unitCost) || 0);
    const total = qty * unit;
    return {
      category: item.category || 'Materials',
      item: item.item || 'Item specification',
      quantity: qty,
      unitCost: unit,
      lineTotal: total,
    };
  });
};

// @desc    Create initial proposal (Version 1) for a project
// @route   POST /api/projects/:id/proposals
// @access  Private (Designer / Admin)
export const createInitialProposal = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Role check: Designer or Admin
    if (req.user.role !== 'designer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only designers or admins can create proposals',
      });
    }

    // Check if proposal already exists for this project
    const existingProposal = await Proposal.findOne({ project: project._id });
    if (existingProposal) {
      return res.status(400).json({
        success: false,
        message: 'A proposal already exists for this project. Use the revision endpoint to publish updates.',
      });
    }

    const {
      title,
      designConceptDescription,
      selectedFinishes,
      scopeOfWork,
      costBreakdown,
      estimatedTimeline,
      designerNotes,
    } = req.body;

    if (!title || !designConceptDescription || !estimatedTimeline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide proposal title, concept description, and estimated timeline',
      });
    }

    // Process line items and compute total on server
    const processedBreakdown = processLineItems(costBreakdown);
    const calculatedTotal = processedBreakdown.reduce((sum, item) => sum + item.lineTotal, 0);

    // 1. Create Proposal master document
    const proposal = await Proposal.create({
      project: project._id,
      client: project.client,
      designer: req.user._id,
      title,
      currentVersionNumber: 1,
      status: 'Published',
    });

    // 2. Create immutable Version 1 document
    const version1 = await ProposalVersion.create({
      proposal: proposal._id,
      project: project._id,
      versionNumber: 1,
      title,
      designConceptDescription,
      selectedFinishes: selectedFinishes || [],
      scopeOfWork: scopeOfWork || ['Initial design consultation', '3D space planning', 'Material schedule'],
      costBreakdown: processedBreakdown,
      totalEstimatedCost: calculatedTotal,
      estimatedTimeline,
      designerNotes: designerNotes || '',
      status: 'Published',
      createdBy: req.user._id,
    });

    proposal.currentVersion = version1._id;
    await proposal.save();

    // 3. Update project state
    project.assignedDesigner = req.user._id;
    project.status = 'Proposal Ready';
    project.statusNotes = `Proposal Version 1 published ($${calculatedTotal.toLocaleString()}).`;
    await project.save();

    // 4. Record Activity
    await ProjectActivity.create({
      project: project._id,
      actor: req.user._id,
      actionType: 'PROPOSAL_CREATED',
      title: 'Proposal Version 1 Published',
      details: `Designer published initial proposal "${title}" for $${calculatedTotal.toLocaleString()} with ${processedBreakdown.length} itemized line entries.`,
      metadata: { proposalId: proposal._id, versionNumber: 1, totalEstimatedCost: calculatedTotal },
    });

    res.status(201).json({
      success: true,
      data: {
        proposal,
        currentVersion: version1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish a new proposal version (Revision: v2, v3, etc.)
// @route   POST /api/proposals/:id/versions
// @access  Private (Designer / Admin)
export const createProposalRevision = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found',
      });
    }

    // Authorization: Assigned designer or admin
    const isAssigned = proposal.designer.toString() === req.user._id.toString();
    if (!isAssigned && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only the assigned designer or admin can publish revisions',
      });
    }

    const {
      title,
      designConceptDescription,
      selectedFinishes,
      scopeOfWork,
      costBreakdown,
      estimatedTimeline,
      designerNotes,
      revisionSummary,
    } = req.body;

    const nextVersionNumber = proposal.currentVersionNumber + 1;

    // Process line items and compute total on server
    const processedBreakdown = processLineItems(costBreakdown);
    const calculatedTotal = processedBreakdown.reduce((sum, item) => sum + item.lineTotal, 0);

    // Create new immutable version record
    const newVersion = await ProposalVersion.create({
      proposal: proposal._id,
      project: proposal.project,
      versionNumber: nextVersionNumber,
      title: title || proposal.title,
      designConceptDescription: designConceptDescription || 'Refined design concept according to client requests.',
      selectedFinishes: selectedFinishes || [],
      scopeOfWork: scopeOfWork || [],
      costBreakdown: processedBreakdown,
      totalEstimatedCost: calculatedTotal,
      estimatedTimeline: estimatedTimeline || 'Flexible',
      designerNotes: designerNotes || '',
      revisionSummary: revisionSummary || `Revised scope and cost based on client feedback.`,
      status: 'Published',
      createdBy: req.user._id,
    });

    // Mark previous current version as 'Superseded'
    if (proposal.currentVersion) {
      await ProposalVersion.findByIdAndUpdate(proposal.currentVersion, { status: 'Superseded' });
    }

    // Update proposal master
    proposal.currentVersionNumber = nextVersionNumber;
    proposal.currentVersion = newVersion._id;
    proposal.status = 'Published';
    await proposal.save();

    // Update project state
    const project = await Project.findById(proposal.project);
    if (project) {
      project.status = 'Proposal Ready';
      project.statusNotes = `Proposal Version ${nextVersionNumber} published ($${calculatedTotal.toLocaleString()}).`;
      await project.save();
    }

    // Mark any pending revision requests as Addressed
    await RevisionRequest.updateMany(
      { proposal: proposal._id, status: 'Pending' },
      { status: 'Addressed', addressedInVersionNumber: nextVersionNumber }
    );

    // Record Activity
    await ProjectActivity.create({
      project: proposal.project,
      actor: req.user._id,
      actionType: 'PROPOSAL_REVISED',
      title: `Proposal Version ${nextVersionNumber} Published`,
      details: `Designer addressed revision requests and published Version ${nextVersionNumber} ($${calculatedTotal.toLocaleString()}). Summary: ${revisionSummary || 'Updated proposal'}`,
      metadata: { proposalId: proposal._id, versionNumber: nextVersionNumber, totalEstimatedCost: calculatedTotal },
    });

    res.status(201).json({
      success: true,
      data: {
        proposal,
        currentVersion: newVersion,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all versions of a proposal
// @route   GET /api/proposals/:id/versions
// @access  Private (Client of project / Designer / Admin)
export const getProposalVersions = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found',
      });
    }

    // Authorization check
    const isClient = proposal.client.toString() === req.user._id.toString();
    const isDesigner = proposal.designer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isClient && !isDesigner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have access to this proposal history',
      });
    }

    const versions = await ProposalVersion.find({ proposal: proposal._id })
      .populate('createdBy', 'name role avatar')
      .populate('clientDecision.decisionBy', 'name')
      .sort({ versionNumber: -1 });

    const revisionRequests = await RevisionRequest.find({ proposal: proposal._id })
      .populate('submittedBy', 'name role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: versions.length,
      data: {
        proposal,
        versions,
        revisionRequests,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit revision request against a specific proposal version
// @route   POST /api/proposals/:id/versions/:versionId/revision-requests
// @access  Private (Client only)
export const submitRevisionRequest = async (req, res, next) => {
  try {
    const { requestedChanges, focusAreas } = req.body;

    if (!requestedChanges) {
      return res.status(400).json({
        success: false,
        message: 'Please describe the requested changes and revisions',
      });
    }

    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found',
      });
    }

    // Client ownership check
    if (proposal.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only the client owner can request revisions',
      });
    }

    const targetVersion = await ProposalVersion.findOne({
      _id: req.params.versionId,
      proposal: proposal._id,
    });

    if (!targetVersion) {
      return res.status(404).json({
        success: false,
        message: 'Target proposal version not found',
      });
    }

    const revision = await RevisionRequest.create({
      project: proposal.project,
      proposal: proposal._id,
      proposalVersion: targetVersion._id,
      targetVersionNumber: targetVersion.versionNumber,
      requestedChanges,
      focusAreas: focusAreas || [],
      submittedBy: req.user._id,
      status: 'Pending',
    });

    // Update target version status
    targetVersion.status = 'Revision Requested';
    await targetVersion.save();

    // Update proposal & project status
    proposal.status = 'Revision Requested';
    await proposal.save();

    const project = await Project.findById(proposal.project);
    if (project) {
      project.status = 'Revision Requested';
      project.statusNotes = `Client requested revisions for Proposal Version ${targetVersion.versionNumber}.`;
      await project.save();
    }

    // Record activity
    await ProjectActivity.create({
      project: proposal.project,
      actor: req.user._id,
      actionType: 'REVISION_REQUESTED',
      title: `Revision Requested for Version ${targetVersion.versionNumber}`,
      details: requestedChanges,
      metadata: { targetVersionNumber: targetVersion.versionNumber, focusAreas },
    });

    res.status(201).json({
      success: true,
      data: revision,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept a specific proposal version
// @route   POST /api/proposals/:id/versions/:versionId/accept
// @access  Private (Client only)
export const acceptProposalVersion = async (req, res, next) => {
  try {
    const { notes } = req.body;
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found',
      });
    }

    // Client ownership check
    if (proposal.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only the client owner can accept a proposal',
      });
    }

    const targetVersion = await ProposalVersion.findOne({
      _id: req.params.versionId,
      proposal: proposal._id,
    });

    if (!targetVersion) {
      return res.status(404).json({
        success: false,
        message: 'Proposal version not found',
      });
    }

    // Record decision on the specific version
    targetVersion.status = 'Accepted';
    targetVersion.clientDecision = {
      decision: 'Accepted',
      decisionDate: new Date(),
      decisionNotes: notes || 'Proposal approved by client.',
      decisionBy: req.user._id,
    };
    await targetVersion.save();

    // Update master proposal
    proposal.status = 'Accepted';
    proposal.acceptedVersionNumber = targetVersion.versionNumber;
    proposal.acceptedVersion = targetVersion._id;
    proposal.acceptedAt = new Date();
    proposal.acceptedBy = req.user._id;
    await proposal.save();

    // Update project status to Accepted
    const project = await Project.findById(proposal.project);
    if (project) {
      project.status = 'Accepted';
      project.statusNotes = `Proposal Version ${targetVersion.versionNumber} accepted by client. Project moving into procurement & execution.`;
      await project.save();
    }

    // Record activity
    await ProjectActivity.create({
      project: proposal.project,
      actor: req.user._id,
      actionType: 'PROPOSAL_ACCEPTED',
      title: `Proposal Version ${targetVersion.versionNumber} Accepted`,
      details: notes || `Client formally accepted Version ${targetVersion.versionNumber} ($${targetVersion.totalEstimatedCost.toLocaleString()}).`,
      metadata: { acceptedVersionNumber: targetVersion.versionNumber, totalCost: targetVersion.totalEstimatedCost },
    });

    res.json({
      success: true,
      message: `Proposal Version ${targetVersion.versionNumber} accepted successfully`,
      data: {
        proposal,
        acceptedVersion: targetVersion,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Decline a specific proposal version
// @route   POST /api/proposals/:id/versions/:versionId/decline
// @access  Private (Client only)
export const declineProposalVersion = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found',
      });
    }

    if (proposal.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only the client owner can decline a proposal',
      });
    }

    const targetVersion = await ProposalVersion.findOne({
      _id: req.params.versionId,
      proposal: proposal._id,
    });

    if (!targetVersion) {
      return res.status(404).json({
        success: false,
        message: 'Proposal version not found',
      });
    }

    targetVersion.status = 'Declined';
    targetVersion.clientDecision = {
      decision: 'Declined',
      decisionDate: new Date(),
      decisionNotes: reason || 'Proposal declined by client.',
      decisionBy: req.user._id,
    };
    await targetVersion.save();

    proposal.status = 'Declined';
    await proposal.save();

    const project = await Project.findById(proposal.project);
    if (project) {
      project.status = 'Declined';
      project.statusNotes = `Proposal Version ${targetVersion.versionNumber} declined. Reason: ${reason || 'Not specified'}`;
      await project.save();
    }

    await ProjectActivity.create({
      project: proposal.project,
      actor: req.user._id,
      actionType: 'PROPOSAL_DECLINED',
      title: `Proposal Version ${targetVersion.versionNumber} Declined`,
      details: reason || 'Client declined this proposal version.',
      metadata: { versionNumber: targetVersion.versionNumber, reason },
    });

    res.json({
      success: true,
      message: `Proposal Version ${targetVersion.versionNumber} declined`,
      data: {
        proposal,
        declinedVersion: targetVersion,
      },
    });
  } catch (error) {
    next(error);
  }
};

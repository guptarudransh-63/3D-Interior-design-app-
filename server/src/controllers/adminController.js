import { User } from '../models/User.js';
import { RoomConcept } from '../models/RoomConcept.js';
import { Project } from '../models/Project.js';
import { Proposal } from '../models/Proposal.js';
import { SavedDesign } from '../models/SavedDesign.js';
import { ProjectActivity } from '../models/ProjectActivity.js';

// @desc    Get real platform metrics from MongoDB
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
export const getAdminMetrics = async (req, res, next) => {
  try {
    const [
      totalConcepts,
      publishedConcepts,
      totalProjects,
      submittedProjects,
      reviewProjects,
      proposalReadyProjects,
      acceptedProjects,
      totalDesigns,
      totalUsers,
      usersByRole,
      recentActivities,
    ] = await Promise.all([
      RoomConcept.countDocuments(),
      RoomConcept.countDocuments({ isPublished: true }),
      Project.countDocuments(),
      Project.countDocuments({ status: 'Submitted' }),
      Project.countDocuments({ status: 'Under Review' }),
      Project.countDocuments({ status: 'Proposal Ready' }),
      Project.countDocuments({ status: 'Accepted' }),
      SavedDesign.countDocuments(),
      User.countDocuments(),
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
          },
        },
      ]),
      ProjectActivity.find()
        .populate('actor', 'name role avatar')
        .populate('project', 'title')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    const roleBreakdown = { client: 0, designer: 0, admin: 0 };
    usersByRole.forEach((item) => {
      roleBreakdown[item._id] = item.count;
    });

    res.json({
      success: true,
      data: {
        concepts: {
          total: totalConcepts,
          published: publishedConcepts,
        },
        projects: {
          total: totalProjects,
          submitted: submittedProjects,
          underReview: reviewProjects,
          proposalReady: proposalReadyProjects,
          accepted: acceptedProjects,
        },
        designs: {
          total: totalDesigns,
        },
        users: {
          total: totalUsers,
          byRole: roleBreakdown,
        },
        recentActivities,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or status
// @route   PATCH /api/admin/users/:id
// @access  Private (Admin only)
export const updateUser = async (req, res, next) => {
  try {
    const { role, status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (role && ['client', 'designer', 'admin'].includes(role)) {
      user.role = role;
    }

    if (status && ['active', 'suspended'].includes(status)) {
      user.status = status;
    }

    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

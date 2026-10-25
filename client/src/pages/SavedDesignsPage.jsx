import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Bookmark,
  Copy,
  Trash2,
  Edit,
  ArrowRight,
  Plus,
  Box,
  Calendar,
  Layers,
  Sparkles,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';

export const SavedDesignsPage = () => {
  const { user, isAuthenticated, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [editName, setEditName] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const loadDesigns = async () => {
    try {
      setLoading(true);
      const res = await api.getSavedDesigns();
      if (res.success) {
        setDesigns(res.data);
      }
    } catch (err) {
      console.error('Error fetching saved designs:', err);
      setMessage({ text: err.message || 'Failed to fetch designs', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDesigns();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this saved design?')) return;
    try {
      setActionLoading(true);
      const res = await api.deleteSavedDesign(id);
      if (res.success) {
        setDesigns((prev) => prev.filter((d) => d._id !== id));
        setMessage({ text: 'Design configuration deleted successfully.', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: err.message || 'Failed to delete design', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      setActionLoading(true);
      const res = await api.duplicateSavedDesign(id);
      if (res.success) {
        setDesigns((prev) => [res.data, ...prev]);
        setMessage({ text: 'Design duplicated successfully as a new configuration.', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: err.message || 'Failed to duplicate design', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenEdit = (design) => {
    setEditingDesign(design);
    setEditName(design.name);
    setEditNotes(design.notes || '');
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingDesign) return;

    try {
      setActionLoading(true);
      const res = await api.updateSavedDesign(editingDesign._id, {
        name: editName,
        notes: editNotes,
      });

      if (res.success) {
        setDesigns((prev) =>
          prev.map((d) => (d._id === editingDesign._id ? res.data : d))
        );
        setEditModalOpen(false);
        setMessage({ text: 'Design updated successfully.', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: err.message || 'Failed to update design', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <Bookmark className="w-10 h-10 text-terracotta mx-auto mb-2" />
        <h2 className="font-editorial text-2xl text-charcoal-900">
          Sign In to Access Your Saved Designs
        </h2>
        <p className="text-xs text-charcoal-700 leading-relaxed font-light">
          SpaceCraft stores your customized 3D room configurations persistently in MongoDB. Sign in as a client to manage your saved designs or start a proposal brief.
        </p>
        <div className="flex justify-center space-x-3 pt-3">
          <button
            onClick={() => quickDemoLogin('client')}
            className="px-5 py-2.5 bg-charcoal-900 text-ivory-100 rounded-sm text-xs font-semibold tracking-wider uppercase hover:bg-charcoal-800"
          >
            Sign in as Demo Client (Marcus)
          </button>
          <Link
            to="/login"
            className="px-5 py-2.5 border border-charcoal-900 text-charcoal-900 rounded-sm text-xs font-semibold"
          >
            Custom Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-warm pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-semibold text-terracotta">
            Client Workspace
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal-950 mt-1">
            My Saved Room Designs
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-2 font-light max-w-xl">
            All your personalized material combinations and spatial configurations saved securely to MongoDB. Use any saved design directly to submit a project brief to an interior designer.
          </p>
        </div>

        <Link
          to="/catalog"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-charcoal-900 text-ivory-100 hover:bg-terracotta rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>New 3D Customization</span>
        </Link>
      </div>

      {/* Alert Messages */}
      {message.text && (
        <div
          className={`p-3.5 rounded-sm text-xs flex items-center justify-between ${
            message.type === 'error'
              ? 'bg-rose-50 border border-rose-200 text-rose-800'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage({ text: '', type: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-charcoal-900 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-charcoal-700">Retrieving saved design configurations from database...</p>
        </div>
      ) : designs.length === 0 ? (
        <div className="py-20 text-center bg-ivory-50 rounded-md border border-dashed border-stone-accent/60 p-8 space-y-4">
          <Bookmark className="w-10 h-10 text-charcoal-700 mx-auto" />
          <h3 className="font-editorial text-xl text-charcoal-900">
            No Saved Designs Yet
          </h3>
          <p className="text-xs text-charcoal-700 max-w-md mx-auto font-light leading-relaxed">
            Explore our room concepts catalog, customize physical materials in the interactive 3D studio, and click "Save Configuration" to preserve your vision.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal-900 text-ivory-100 rounded-sm text-xs font-semibold"
          >
            <span>Explore Room Concepts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {designs.map((design) => {
            const concept = design.roomConcept;
            const materials = design.selectedMaterials || {};

            return (
              <div
                key={design._id}
                className="group rounded-md overflow-hidden bg-ivory-50 border border-stone-accent/30 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image Header */}
                  <div className="relative h-52 overflow-hidden bg-charcoal-900">
                    <img
                      src={concept?.coverImage || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'}
                      alt={design.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                      <span className="px-2.5 py-0.5 rounded-xs bg-ivory-50/95 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider text-charcoal-900">
                        {concept?.roomType || 'Living Room'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center space-x-1 bg-charcoal-950/70 backdrop-blur-md rounded-xs p-1">
                      <button
                        onClick={() => handleOpenEdit(design)}
                        className="p-1 text-ivory-100 hover:text-terracotta transition-colors"
                        title="Edit name & notes"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(design._id)}
                        className="p-1 text-ivory-100 hover:text-terracotta transition-colors"
                        title="Duplicate configuration"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(design._id)}
                        className="p-1 text-ivory-100 hover:text-rose-400 transition-colors"
                        title="Delete design"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-editorial text-xl font-semibold text-charcoal-900 line-clamp-1">
                        {design.name}
                      </h3>
                      <p className="text-xs text-charcoal-700 mt-1 line-clamp-2 font-light">
                        {design.notes || `Configured from ${concept?.name || 'concept'}.`}
                      </p>
                    </div>

                    {/* Applied Materials Swatch Preview */}
                    <div className="p-3 bg-stone-pale rounded-sm border border-stone-accent/20 space-y-2 text-xs">
                      <span className="text-[10px] uppercase font-semibold text-charcoal-700 tracking-wider block">
                        Saved Finishes:
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-charcoal-800">
                        <div className="flex items-center space-x-1.5 truncate">
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: materials.flooring?.hexCode || '#D6C3A5' }}
                          />
                          <span className="truncate">Floor: {materials.flooring?.name?.split(' ')[0] || 'Oak'}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 truncate">
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: materials.walls?.hexCode || '#F5F2EB' }}
                          />
                          <span className="truncate">Walls: {materials.walls?.name?.split(' ')[0] || 'Alabaster'}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 truncate">
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: materials.cabinetry?.hexCode || '#4A3425' }}
                          />
                          <span className="truncate">Joinery: {materials.cabinetry?.name?.split(' ')[0] || 'Walnut'}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 truncate">
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: materials.accent?.hexCode || '#B8654D' }}
                          />
                          <span className="truncate">Accent: {materials.accent?.name?.split(' ')[0] || 'Clay'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-charcoal-700 pt-1">
                      <span>Est. Turnkey Budget</span>
                      <span className="font-semibold text-charcoal-900 text-sm">
                        ${design.estimatedBudget?.toLocaleString() || '18,500'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-6 pt-0 border-t border-stone-warm/50 flex items-center justify-between gap-3 text-xs">
                  {concept?.slug && (
                    <Link
                      to={`/concept/${concept.slug}`}
                      className="inline-flex items-center space-x-1 text-charcoal-800 hover:text-terracotta font-medium"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>Reopen 3D</span>
                    </Link>
                  )}

                  <Link
                    to={`/project-brief?savedDesignId=${design._id}&roomType=${encodeURIComponent(concept?.roomType || 'Living Room')}&preferredStyle=${encodeURIComponent(concept?.designStyle || 'Warm Minimalist')}`}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-charcoal-900 text-ivory-100 hover:bg-terracotta rounded-xs text-xs font-semibold tracking-wider uppercase transition-colors"
                  >
                    <span>Submit Brief</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Design Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/60 backdrop-blur-xs p-4">
          <div className="bg-ivory-50 rounded-md border border-stone-accent/40 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-warm pb-3">
              <h3 className="font-editorial text-lg font-semibold text-charcoal-900">
                Edit Design Configuration
              </h3>
              <button onClick={() => setEditModalOpen(false)}>
                <X className="w-5 h-5 text-charcoal-700" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">
                  Design Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2 border-t border-stone-warm">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 border border-stone-accent text-charcoal-700 hover:bg-stone-warm/50 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 rounded-sm font-semibold uppercase tracking-wider"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

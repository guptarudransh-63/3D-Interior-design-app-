import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  ShieldCheck,
  Layers,
  Briefcase,
  Users,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  History,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user, isAuthenticated, isAdmin, quickDemoLogin } = useAuth();

  const [metrics, setMetrics] = useState(null);
  const [concepts, setConcepts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'concepts' | 'users'
  const [notification, setNotification] = useState({ text: '', type: '' });

  // Concept Modal State
  const [conceptModalOpen, setConceptModalOpen] = useState(false);
  const [editingConcept, setEditingConcept] = useState(null);
  const [conceptForm, setConceptForm] = useState({
    name: '',
    roomType: 'Living Room',
    designStyle: 'Warm Minimalist',
    coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    description: '',
    budgetMin: 12000,
    budgetMax: 28000,
    lengthFt: 20,
    widthFt: 15,
    isPublished: true,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [metricsRes, conceptsRes, usersRes] = await Promise.all([
        api.getAdminMetrics(),
        api.getRoomConcepts({ limit: 50 }),
        api.getAdminUsers(),
      ]);

      if (metricsRes.success) setMetrics(metricsRes.data);
      if (conceptsRes.success) setConcepts(conceptsRes.data);
      if (usersRes.success) setUsersList(usersRes.data);
    } catch (err) {
      console.error(err);
      setNotification({ text: err.message || 'Failed to load admin data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  const handleOpenCreateConcept = () => {
    setEditingConcept(null);
    setConceptForm({
      name: '',
      roomType: 'Living Room',
      designStyle: 'Warm Minimalist',
      coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      description: '',
      budgetMin: 12000,
      budgetMax: 28000,
      lengthFt: 20,
      widthFt: 15,
      isPublished: true,
    });
    setConceptModalOpen(true);
  };

  const handleOpenEditConcept = (concept) => {
    setEditingConcept(concept);
    setConceptForm({
      name: concept.name,
      roomType: concept.roomType,
      designStyle: concept.designStyle,
      coverImage: concept.coverImage,
      description: concept.description,
      budgetMin: concept.budgetRange?.min || 10000,
      budgetMax: concept.budgetRange?.max || 25000,
      lengthFt: concept.defaultDimensions?.lengthFt || 20,
      widthFt: concept.defaultDimensions?.widthFt || 15,
      isPublished: concept.isPublished,
    });
    setConceptModalOpen(true);
  };

  const handleSaveConcept = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: conceptForm.name,
        roomType: conceptForm.roomType,
        designStyle: conceptForm.designStyle,
        coverImage: conceptForm.coverImage,
        description: conceptForm.description,
        budgetRange: { min: Number(conceptForm.budgetMin), max: Number(conceptForm.budgetMax) },
        defaultDimensions: {
          lengthFt: Number(conceptForm.lengthFt),
          widthFt: Number(conceptForm.widthFt),
          heightFt: 10,
          areaSqFt: Number(conceptForm.lengthFt) * Number(conceptForm.widthFt),
        },
        isPublished: conceptForm.isPublished,
      };

      let res;
      if (editingConcept) {
        res = await api.updateRoomConcept(editingConcept._id, payload);
      } else {
        res = await api.createRoomConcept(payload);
      }

      if (res.success) {
        setConceptModalOpen(false);
        setNotification({
          text: editingConcept ? 'Concept updated successfully.' : 'New room concept published to catalog.',
          type: 'success',
        });
        loadData();
      }
    } catch (err) {
      setNotification({ text: err.message || 'Failed to save concept', type: 'error' });
    }
  };

  const handleDeleteConcept = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room concept?')) return;
    try {
      const res = await api.deleteRoomConcept(id);
      if (res.success) {
        setNotification({ text: 'Concept deleted.', type: 'success' });
        setConcepts((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      setNotification({ text: err.message, type: 'error' });
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const res = await api.updateAdminUser(userId, { role: newRole });
      if (res.success) {
        setUsersList((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
        setNotification({ text: 'User role updated successfully.', type: 'success' });
      }
    } catch (err) {
      setNotification({ text: err.message, type: 'error' });
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await api.updateAdminUser(userId, { status: nextStatus });
      if (res.success) {
        setUsersList((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: nextStatus } : u))
        );
        setNotification({ text: `User marked as ${nextStatus}.`, type: 'success' });
      }
    } catch (err) {
      setNotification({ text: err.message, type: 'error' });
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <ShieldCheck className="w-10 h-10 text-terracotta mx-auto mb-2" />
        <h2 className="font-editorial text-2xl text-charcoal-900">
          Admin Studio Access Required
        </h2>
        <p className="text-xs text-charcoal-700 leading-relaxed font-light">
          This area is restricted to SpaceCraft platform administrators to inspect live MongoDB metrics, manage room concepts, and govern role permissions.
        </p>
        <button
          onClick={() => quickDemoLogin('admin')}
          className="mt-3 px-5 py-2.5 bg-charcoal-900 text-ivory-100 rounded-sm text-xs font-semibold tracking-wider uppercase hover:bg-charcoal-800"
        >
          Sign in as Demo Administrator (Elena)
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-warm pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-semibold text-terracotta">
            Platform Administration
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal-950 mt-1">
            Admin Studio & Database Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-2 font-light max-w-xl">
            Live metrics from MongoDB collections, room concept catalog curation, user role governance, and audit activity logs.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-stone-pale rounded-sm text-xs font-medium border border-stone-accent/30">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xs transition-colors ${
              activeTab === 'overview'
                ? 'bg-charcoal-900 text-ivory-100 shadow-2xs font-semibold'
                : 'text-charcoal-700 hover:text-charcoal-950'
            }`}
          >
            Live Telemetry
          </button>
          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-3 py-1.5 rounded-xs transition-colors ${
              activeTab === 'concepts'
                ? 'bg-charcoal-900 text-ivory-100 shadow-2xs font-semibold'
                : 'text-charcoal-700 hover:text-charcoal-950'
            }`}
          >
            Room Concepts ({concepts.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-xs transition-colors ${
              activeTab === 'users'
                ? 'bg-charcoal-900 text-ivory-100 shadow-2xs font-semibold'
                : 'text-charcoal-700 hover:text-charcoal-950'
            }`}
          >
            Users ({usersList.length})
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification.text && (
        <div
          className={`p-3.5 rounded-sm text-xs flex items-center justify-between ${
            notification.type === 'error'
              ? 'bg-rose-50 border border-rose-200 text-rose-800'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}
        >
          <span>{notification.text}</span>
          <button onClick={() => setNotification({ text: '', type: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. OVERVIEW TELEMETRY TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Metrics Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-ivory-50 rounded-md border border-stone-accent/30 shadow-2xs space-y-1">
              <span className="text-[10px] text-charcoal-700 uppercase font-semibold block">
                Total Room Concepts
              </span>
              <div className="text-3xl font-editorial font-bold text-charcoal-900">
                {metrics?.concepts?.total || 0}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium block">
                {metrics?.concepts?.published || 0} Published & Live
              </span>
            </div>

            <div className="p-5 bg-ivory-50 rounded-md border border-stone-accent/30 shadow-2xs space-y-1">
              <span className="text-[10px] text-charcoal-700 uppercase font-semibold block">
                Total Projects
              </span>
              <div className="text-3xl font-editorial font-bold text-charcoal-900">
                {metrics?.projects?.total || 0}
              </div>
              <span className="text-[11px] text-terracotta font-medium block">
                {metrics?.projects?.submitted || 0} Awaiting Review
              </span>
            </div>

            <div className="p-5 bg-ivory-50 rounded-md border border-stone-accent/30 shadow-2xs space-y-1">
              <span className="text-[10px] text-charcoal-700 uppercase font-semibold block">
                Proposals Ready / Decided
              </span>
              <div className="text-3xl font-editorial font-bold text-charcoal-900">
                {metrics?.projects?.proposalReady || 0}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium block">
                {metrics?.projects?.accepted || 0} Accepted Proposals
              </span>
            </div>

            <div className="p-5 bg-ivory-50 rounded-md border border-stone-accent/30 shadow-2xs space-y-1">
              <span className="text-[10px] text-charcoal-700 uppercase font-semibold block">
                Registered Users
              </span>
              <div className="text-3xl font-editorial font-bold text-charcoal-900">
                {metrics?.users?.total || 0}
              </div>
              <span className="text-[11px] text-charcoal-700 block">
                {metrics?.users?.byRole?.client || 0} Clients • {metrics?.users?.byRole?.designer || 0} Designers
              </span>
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="p-6 rounded-md bg-ivory-50 border border-stone-accent/30 shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-stone-warm pb-3">
              <History className="w-4 h-4 text-terracotta" />
              <h3 className="font-editorial text-lg font-bold text-charcoal-900">
                Recent Real Database Audit Activity
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              {metrics?.recentActivities?.map((act) => (
                <div key={act._id} className="flex items-start space-x-3 text-charcoal-800">
                  <span className="w-2 h-2 rounded-full bg-terracotta mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-charcoal-900">{act.title}</span>
                      <span className="text-[10px] text-charcoal-700">
                        {new Date(act.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal-700 mt-0.5">{act.details}</p>
                    <span className="text-[10px] text-stone-accent font-medium mt-0.5 block">
                      Actor: {act.actor?.name} ({act.actor?.role}) • Project: {act.project?.title || 'System'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. CONCEPTS MANAGEMENT TAB */}
      {activeTab === 'concepts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-editorial text-xl font-bold text-charcoal-900">
              Manage Room Concepts
            </h3>
            <button
              onClick={handleOpenCreateConcept}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-charcoal-900 text-ivory-100 hover:bg-terracotta rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Room Concept</span>
            </button>
          </div>

          <div className="bg-ivory-50 rounded-md border border-stone-accent/30 shadow-2xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-warm/50 text-[10px] uppercase text-charcoal-700 font-semibold border-b border-stone-warm">
                <tr>
                  <th className="p-3">Concept Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Style</th>
                  <th className="p-3">Budget Range</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-warm/40 text-charcoal-800">
                {concepts.map((concept) => (
                  <tr key={concept._id} className="hover:bg-stone-pale/60">
                    <td className="p-3 font-medium flex items-center space-x-2">
                      <img
                        src={concept.coverImage}
                        alt=""
                        className="w-8 h-8 rounded-xs object-cover"
                      />
                      <span className="line-clamp-1">{concept.name}</span>
                    </td>
                    <td className="p-3">{concept.roomType}</td>
                    <td className="p-3">{concept.designStyle}</td>
                    <td className="p-3">
                      ${concept.budgetRange?.min?.toLocaleString()} - ${concept.budgetRange?.max?.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          concept.isPublished
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-stone-warm text-charcoal-700 border border-stone-accent'
                        }`}
                      >
                        {concept.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditConcept(concept)}
                        className="p-1 text-charcoal-700 hover:text-charcoal-950"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteConcept(concept._id)}
                        className="p-1 text-charcoal-700 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. USERS MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <h3 className="font-editorial text-xl font-bold text-charcoal-900">
            Registered Platform Accounts
          </h3>

          <div className="bg-ivory-50 rounded-md border border-stone-accent/30 shadow-2xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-warm/50 text-[10px] uppercase text-charcoal-700 font-semibold border-b border-stone-warm">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3 text-right">Role Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-warm/40 text-charcoal-800">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-stone-pale/60">
                    <td className="p-3 font-medium flex items-center space-x-2">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="p-3 text-charcoal-700">{u.email}</td>
                    <td className="p-3 font-semibold capitalize text-charcoal-900">{u.role}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleUserStatus(u._id, u.status)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
                        }`}
                        title="Click to toggle status"
                      >
                        {u.status}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                        className="px-2 py-1 bg-ivory-100 border border-stone-accent/30 rounded-xs text-[11px]"
                      >
                        <option value="client">Client</option>
                        <option value="designer">Designer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Concept Create / Edit Modal */}
      {conceptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-ivory-50 rounded-md border border-stone-accent/40 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-warm pb-3">
              <h3 className="font-editorial text-lg font-bold text-charcoal-900">
                {editingConcept ? 'Edit Room Concept' : 'Publish New Room Concept'}
              </h3>
              <button onClick={() => setConceptModalOpen(false)}>
                <X className="w-5 h-5 text-charcoal-700" />
              </button>
            </div>

            <form onSubmit={handleSaveConcept} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">
                  Concept Name *
                </label>
                <input
                  type="text"
                  required
                  value={conceptForm.name}
                  onChange={(e) => setConceptForm({ ...conceptForm, name: e.target.value })}
                  placeholder="e.g., Nordic Pavilion Living Room"
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-800 mb-1">
                    Room Type *
                  </label>
                  <select
                    value={conceptForm.roomType}
                    onChange={(e) => setConceptForm({ ...conceptForm, roomType: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none"
                  >
                    {['Living Room', 'Bedroom', 'Kitchen', 'Dining Room', 'Home Office', 'Studio Apartment'].map(
                      (t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-800 mb-1">
                    Design Style *
                  </label>
                  <select
                    value={conceptForm.designStyle}
                    onChange={(e) => setConceptForm({ ...conceptForm, designStyle: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none"
                  >
                    {['Warm Minimalist', 'Japandi', 'Scandinavian', 'Modern Architectural', 'Mediterranean Contemporary', 'Industrial Loft'].map(
                      (s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={conceptForm.coverImage}
                  onChange={(e) => setConceptForm({ ...conceptForm, coverImage: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={conceptForm.description}
                  onChange={(e) => setConceptForm({ ...conceptForm, description: e.target.value })}
                  placeholder="Architectural overview of space, light, and materiality..."
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-800 mb-1">
                    Min Budget ($)
                  </label>
                  <input
                    type="number"
                    value={conceptForm.budgetMin}
                    onChange={(e) => setConceptForm({ ...conceptForm, budgetMin: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-800 mb-1">
                    Max Budget ($)
                  </label>
                  <input
                    type="number"
                    value={conceptForm.budgetMax}
                    onChange={(e) => setConceptForm({ ...conceptForm, budgetMax: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="publishedCheckbox"
                  checked={conceptForm.isPublished}
                  onChange={(e) => setConceptForm({ ...conceptForm, isPublished: e.target.checked })}
                  className="rounded text-charcoal-900"
                />
                <label htmlFor="publishedCheckbox" className="font-medium text-charcoal-800">
                  Publish to Public Concept Showcase Immediately
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-stone-warm">
                <button
                  type="button"
                  onClick={() => setConceptModalOpen(false)}
                  className="px-4 py-2 border border-stone-accent text-charcoal-700 hover:bg-stone-warm/50 rounded-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 rounded-sm font-semibold uppercase tracking-wider"
                >
                  {editingConcept ? 'Update Concept' : 'Publish Concept'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

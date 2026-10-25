import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Briefcase,
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  History,
  Layers,
  Sparkles,
  ArrowRight,
  MessageSquare,
  DollarSign,
  Maximize2,
  Trash2,
  X,
  Send,
  User,
} from 'lucide-react';

const CATEGORIES = ['Materials', 'Furniture', 'Lighting', 'Labour', 'Installation', 'Permits & Management', 'Other'];

export const DesignerDashboardPage = () => {
  const { user, isAuthenticated, quickDemoLogin } = useAuth();

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [proposalHistory, setProposalHistory] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({ text: '', type: '' });

  // Proposal Creation / Revision Builder Form State
  const [builderOpen, setBuilderOpen] = useState(false);
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formConceptDesc, setFormConceptDesc] = useState('');
  const [formTimeline, setFormTimeline] = useState('6 - 8 Weeks');
  const [formNotes, setFormNotes] = useState('');
  const [formRevisionSummary, setFormRevisionSummary] = useState('');
  const [scopeList, setScopeList] = useState([
    'Architectural concept consultation',
    '3D spatial planning and lighting schedule',
    'Procurement coordination and site supervision',
  ]);
  const [newScopeItem, setNewScopeItem] = useState('');
  const [lineItems, setLineItems] = useState([
    { category: 'Materials', item: 'Select architectural materials & plaster', quantity: 250, unitCost: 20 },
    { category: 'Furniture', item: 'Curated architectural seating & table suite', quantity: 1, unitCost: 6500 },
    { category: 'Lighting', item: 'Museum-grade warm directional spotlights', quantity: 1, unitCost: 2200 },
    { category: 'Labour', item: 'Artisan installation & specialist joiner', quantity: 60, unitCost: 45 },
  ]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      const res = await api.getProjects(params);
      if (res.success) {
        setProjects(res.data);
        if (res.data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
      setNotification({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, statusFilter]);

  // Load active project details and proposal version history
  useEffect(() => {
    if (!selectedProjectId) {
      setProjectDetails(null);
      setProposalHistory(null);
      return;
    }

    const loadDetails = async () => {
      try {
        setLoadingDetails(true);
        const res = await api.getProjectById(selectedProjectId);
        if (res.success) {
          setProjectDetails(res.data);

          if (res.data.proposals && res.data.proposals.length > 0) {
            const propId = res.data.proposals[0]._id;
            const historyRes = await api.getProposalVersions(propId);
            if (historyRes.success) {
              setProposalHistory(historyRes.data);
            }
          } else {
            setProposalHistory(null);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDetails(false);
      }
    };

    loadDetails();
  }, [selectedProjectId]);

  const handleClaimProject = async () => {
    if (!selectedProjectId) return;
    try {
      setActionLoading(true);
      const res = await api.assignDesigner(selectedProjectId);
      if (res.success) {
        setNotification({ text: 'Project assigned to your designer workspace.', type: 'success' });
        const refreshed = await api.getProjectById(selectedProjectId);
        if (refreshed.success) setProjectDetails(refreshed.data);
        fetchProjects();
      }
    } catch (err) {
      setNotification({ text: err.message || 'Failed to claim project', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenInitialProposal = () => {
    setIsRevisionMode(false);
    setFormTitle(`${projectDetails.project.title} — Proposal Specification`);
    setFormConceptDesc(
      `Bespoke architectural spatial transformation for ${projectDetails.project.roomType}, harmonizing client requirements with durable natural materials and optimized illumination.`
    );
    setBuilderOpen(true);
  };

  const handleOpenRevision = () => {
    const latest = proposalHistory?.versions?.[0];
    setIsRevisionMode(true);
    setFormTitle(`${projectDetails.project.title} — Proposal Specification (Revised)`);
    setFormConceptDesc(latest?.designConceptDescription || '');
    setFormTimeline(latest?.estimatedTimeline || '6 - 8 Weeks');
    setFormRevisionSummary('Addressed client revision feedback regarding material choices and expenditure.');
    if (latest?.costBreakdown?.length > 0) {
      setLineItems(
        latest.costBreakdown.map((item) => ({
          category: item.category,
          item: item.item,
          quantity: item.quantity,
          unitCost: item.unitCost,
        }))
      );
    }
    if (latest?.scopeOfWork?.length > 0) {
      setScopeList([...latest.scopeOfWork]);
    }
    setBuilderOpen(true);
  };

  const handleAddLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { category: 'Materials', item: 'New line item', quantity: 1, unitCost: 500 },
    ]);
  };

  const handleRemoveLineItem = (index) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateLineItem = (index, field, value) => {
    setLineItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddScope = () => {
    if (!newScopeItem.trim()) return;
    setScopeList((prev) => [...prev, newScopeItem.trim()]);
    setNewScopeItem('');
  };

  const handlePublishProposal = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    try {
      setActionLoading(true);
      const payload = {
        title: formTitle,
        designConceptDescription: formConceptDesc,
        estimatedTimeline: formTimeline,
        designerNotes: formNotes,
        scopeOfWork: scopeList,
        costBreakdown: lineItems.map((item) => ({
          category: item.category,
          item: item.item,
          quantity: Number(item.quantity) || 1,
          unitCost: Number(item.unitCost) || 0,
        })),
        revisionSummary: isRevisionMode ? formRevisionSummary : undefined,
      };

      let res;
      if (isRevisionMode && proposalHistory?.proposal?._id) {
        res = await api.createProposalRevision(proposalHistory.proposal._id, payload);
      } else {
        res = await api.createInitialProposal(selectedProjectId, payload);
      }

      if (res.success) {
        setBuilderOpen(false);
        setNotification({
          text: isRevisionMode
            ? `Proposal Version ${res.data.currentVersion.versionNumber} published successfully!`
            : 'Initial Proposal Version 1 published and queued for client review.',
          type: 'success',
        });
        // Refresh details
        const refreshed = await api.getProjectById(selectedProjectId);
        if (refreshed.success) setProjectDetails(refreshed.data);
        if (refreshed.data.proposals && refreshed.data.proposals.length > 0) {
          const propId = refreshed.data.proposals[0]._id;
          const historyRes = await api.getProposalVersions(propId);
          if (historyRes.success) setProposalHistory(historyRes.data);
        }
        fetchProjects();
      }
    } catch (err) {
      setNotification({ text: err.message || 'Failed to publish proposal', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const calculatedTotal = lineItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1) * (Number(item.unitCost) || 0),
    0
  );

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <Briefcase className="w-10 h-10 text-terracotta mx-auto mb-2" />
        <h2 className="font-editorial text-2xl text-charcoal-900">
          Designer Workspace Portal
        </h2>
        <p className="text-xs text-charcoal-700 leading-relaxed font-light">
          Interior designers review customer briefs, configure itemized scopes of work, and author versioned proposals.
        </p>
        <button
          onClick={() => quickDemoLogin('designer')}
          className="mt-3 px-5 py-2.5 bg-charcoal-900 text-ivory-100 rounded-sm text-xs font-semibold tracking-wider uppercase hover:bg-charcoal-800"
        >
          Sign in as Demo Designer (Julian)
        </button>
      </div>
    );
  }

  const currentProject = projectDetails?.project;
  const latestVersion = proposalHistory?.versions?.[0];
  const allVersions = proposalHistory?.versions || [];
  const pendingRevision = proposalHistory?.revisionRequests?.find((r) => r.status === 'Pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-warm pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-semibold text-terracotta">
            Architect & Designer Workspace
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal-950 mt-1">
            Project Management & Proposal Authoring
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-2 font-light max-w-xl">
            Review incoming client briefs, claim unassigned projects, build itemized cost schedules, and publish sequential proposal versions (v1, v2...).
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-stone-pale rounded-sm text-xs font-medium border border-stone-accent/30 overflow-x-auto">
          {['All', 'Submitted', 'Under Review', 'Proposal Ready', 'Revision Requested', 'Accepted'].map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-xs transition-colors shrink-0 ${
                  statusFilter === st
                    ? 'bg-charcoal-900 text-ivory-100 font-semibold shadow-2xs'
                    : 'text-charcoal-700 hover:text-charcoal-950'
                }`}
              >
                {st}
              </button>
            )
          )}
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

      {/* Main Grid: Projects Column Left, Management Pane Right */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-charcoal-900 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-charcoal-700">Loading designer project board...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-20 text-center bg-ivory-50 rounded-md border border-dashed border-stone-accent/60 p-8 space-y-3">
          <Briefcase className="w-10 h-10 text-charcoal-700 mx-auto" />
          <h3 className="font-editorial text-xl text-charcoal-900">
            No Projects in Selected Filter
          </h3>
          <p className="text-xs text-charcoal-700 max-w-md mx-auto">
            There are currently no active or submitted briefs matching "{statusFilter}".
          </p>
          <button
            onClick={() => setStatusFilter('All')}
            className="px-4 py-2 bg-charcoal-900 text-ivory-100 rounded-sm text-xs font-semibold"
          >
            Show All Projects
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Projects Queue */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 px-1">
              Authorized Projects ({projects.length})
            </h3>

            <div className="space-y-2">
              {projects.map((proj) => {
                const isSelected = proj._id === selectedProjectId;
                const isUnassigned = !proj.assignedDesigner;

                return (
                  <button
                    key={proj._id}
                    onClick={() => setSelectedProjectId(proj._id)}
                    className={`w-full text-left p-4 rounded-md border transition-all space-y-2 ${
                      isSelected
                        ? 'border-charcoal-900 bg-stone-pale shadow-2xs ring-1 ring-charcoal-900'
                        : 'border-stone-accent/30 bg-ivory-50 hover:border-stone-accent/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-editorial font-semibold text-sm text-charcoal-900 line-clamp-1">
                        {proj.title}
                      </span>
                      <StatusBadge status={proj.status} />
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-charcoal-700">
                      <span>{proj.roomType}</span>
                      <span>•</span>
                      <span>Client: {proj.client?.name}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-charcoal-700 pt-1 border-t border-stone-warm/50">
                      <span>Budget: ${proj.budgetRange?.min?.toLocaleString()} - ${proj.budgetRange?.max?.toLocaleString()}</span>
                      {isUnassigned && (
                        <span className="text-terracotta font-semibold uppercase">Awaiting Claim</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Project Details & Proposal Actions */}
          <div className="lg:col-span-8 space-y-6">
            {loadingDetails ? (
              <div className="p-12 text-center bg-ivory-50 rounded-md border border-stone-accent/30">
                <div className="inline-block w-6 h-6 border-2 border-charcoal-900 border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-xs text-charcoal-700">Loading project records and proposals...</p>
              </div>
            ) : currentProject ? (
              <>
                {/* 1. Client Brief & Requirements Pane */}
                <div className="p-6 rounded-md bg-ivory-50 border border-stone-accent/30 shadow-2xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-warm pb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta">
                          Client Brief Analysis
                        </span>
                        <span className="text-charcoal-700">•</span>
                        <span className="text-xs text-charcoal-700">{currentProject.propertyType}</span>
                      </div>
                      <h2 className="font-editorial text-2xl font-bold text-charcoal-950">
                        {currentProject.title}
                      </h2>
                    </div>

                    <div className="flex items-center space-x-2">
                      <StatusBadge status={currentProject.status} className="text-xs px-3 py-1" />
                      {!currentProject.assignedDesigner && (
                        <button
                          onClick={handleClaimProject}
                          disabled={actionLoading}
                          className="px-3 py-1.5 bg-terracotta text-ivory-100 hover:bg-terracotta-dark rounded-xs text-xs font-semibold"
                        >
                          Claim Project
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Client Overview Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-charcoal-700 uppercase block font-semibold">Client Name</span>
                      <span className="font-medium text-charcoal-900 text-sm">{currentProject.client?.name}</span>
                      <span className="text-[10px] text-charcoal-700 block mt-0.5">{currentProject.client?.email}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-charcoal-700 uppercase block font-semibold">Client Budget</span>
                      <span className="font-bold text-charcoal-900 text-sm">
                        ${currentProject.budgetRange?.min?.toLocaleString()} – ${currentProject.budgetRange?.max?.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-charcoal-700 uppercase block font-semibold">Target Timeline</span>
                      <span className="font-medium text-charcoal-900 text-sm">{currentProject.timeline}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-charcoal-700 uppercase block font-semibold">Floor Area</span>
                      <span className="font-medium text-charcoal-900 text-sm">
                        {currentProject.dimensions?.areaSqFt} sq ft
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-charcoal-700 uppercase block font-semibold mb-1">
                      Client Requirements
                    </span>
                    <p className="text-xs text-charcoal-800 leading-relaxed font-light bg-stone-pale p-3 rounded-sm border border-stone-accent/20">
                      {currentProject.requirementsDescription}
                    </p>
                  </div>

                  {/* Attached Saved Design Spec */}
                  {currentProject.savedDesign && (
                    <div className="p-3.5 rounded-sm bg-stone-pale border border-stone-accent/30 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-charcoal-900">
                          Client Saved 3D Configuration: {currentProject.savedDesign.name}
                        </span>
                        {currentProject.savedDesign.roomConcept?.slug && (
                          <a
                            href={`/concept/${currentProject.savedDesign.roomConcept.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-terracotta hover:underline font-medium"
                          >
                            Open Concept in New Tab ↗
                          </a>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-charcoal-800">
                        <div>Floor: {currentProject.savedDesign.selectedMaterials?.flooring?.name || 'Oak'}</div>
                        <div>Walls: {currentProject.savedDesign.selectedMaterials?.walls?.name || 'Alabaster'}</div>
                        <div>Joinery: {currentProject.savedDesign.selectedMaterials?.cabinetry?.name || 'Walnut'}</div>
                        <div>Accent: {currentProject.savedDesign.selectedMaterials?.accent?.name || 'Boucle'}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Pending Client Revision Notice (If Any) */}
                {pendingRevision && (
                  <div className="p-5 rounded-md bg-amber-50 border border-amber-300 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-amber-900 font-semibold text-xs">
                        <MessageSquare className="w-4 h-4 text-amber-700" />
                        <span>Client Revision Requested on Version {pendingRevision.targetVersionNumber}</span>
                      </div>
                      <button
                        onClick={handleOpenRevision}
                        className="px-3 py-1 bg-charcoal-900 text-ivory-100 hover:bg-terracotta rounded-xs text-xs font-semibold uppercase tracking-wider"
                      >
                        Publish Version {allVersions.length + 1} to Address
                      </button>
                    </div>
                    <p className="text-xs text-amber-950 font-light bg-amber-100/60 p-3 rounded-sm border border-amber-200">
                      "{pendingRevision.requestedChanges}"
                    </p>
                    <div className="text-[10px] text-amber-800 flex items-center space-x-2">
                      <span>Focus: {pendingRevision.focusAreas?.join(', ')}</span>
                      <span>•</span>
                      <span>Submitted: {new Date(pendingRevision.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* 3. Proposal Status & Action Buttons */}
                <div className="p-6 rounded-md bg-ivory-50 border border-stone-accent/30 shadow-2xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-warm pb-4">
                    <div>
                      <h3 className="font-editorial text-xl font-bold text-charcoal-900">
                        Proposal Management & Versions
                      </h3>
                      <p className="text-xs text-charcoal-700 mt-1 font-light">
                        Create initial proposal (v1) or publish sequential revisions without overwriting earlier historical versions.
                      </p>
                    </div>

                    {!proposalHistory || allVersions.length === 0 ? (
                      <button
                        onClick={handleOpenInitialProposal}
                        className="inline-flex items-center space-x-2 px-4 py-2.5 bg-charcoal-900 text-ivory-100 hover:bg-terracotta rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors shadow-2xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Author Proposal (Version 1)</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleOpenRevision}
                        className="inline-flex items-center space-x-2 px-4 py-2.5 bg-charcoal-900 text-ivory-100 hover:bg-terracotta rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors shadow-2xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Publish Version {allVersions.length + 1}</span>
                      </button>
                    )}
                  </div>

                  {/* Published Versions List */}
                  {allVersions.length > 0 ? (
                    <div className="space-y-4">
                      {allVersions.map((version) => (
                        <div
                          key={version._id}
                          className="p-5 rounded-sm bg-ivory-100 border border-stone-accent/40 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-charcoal-900">
                                Version {version.versionNumber}
                              </span>
                              <StatusBadge status={version.status} />
                              {version.revisionSummary && (
                                <span className="text-[10px] text-terracotta font-medium italic">
                                  ({version.revisionSummary})
                                </span>
                              )}
                            </div>
                            <span className="text-base font-bold text-terracotta">
                              ${version.totalEstimatedCost?.toLocaleString()}
                            </span>
                          </div>

                          <p className="text-xs text-charcoal-800 font-light leading-relaxed">
                            {version.designConceptDescription}
                          </p>

                          {/* Line items mini summary */}
                          <div className="text-[11px] text-charcoal-700 border-t border-stone-warm/50 pt-2 flex items-center justify-between">
                            <span>{version.costBreakdown?.length || 0} Line Items Itemized</span>
                            <span>Timeline: {version.estimatedTimeline}</span>
                            <span>Published: {new Date(version.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-stone-pale rounded-sm border border-dashed border-stone-accent/50 space-y-2">
                      <Clock className="w-8 h-8 text-charcoal-700 mx-auto" />
                      <p className="text-xs text-charcoal-700">
                        No proposals published for this project yet. Click "Author Proposal" to begin Version 1.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Proposal Authoring / Revision Modal Builder */}
      {builderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-ivory-50 rounded-md border border-stone-accent/40 shadow-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-warm pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta">
                  {isRevisionMode ? `Revision Builder — Version ${allVersions.length + 1}` : 'Initial Proposal Builder — Version 1'}
                </span>
                <h3 className="font-editorial text-xl font-bold text-charcoal-900">
                  {isRevisionMode ? 'Publish Sequential Proposal Revision' : 'Create Initial Proposal Specification'}
                </h3>
              </div>
              <button onClick={() => setBuilderOpen(false)}>
                <X className="w-5 h-5 text-charcoal-700" />
              </button>
            </div>

            <form onSubmit={handlePublishProposal} className="space-y-6 text-xs">
              {/* Proposal Title */}
              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">
                  Proposal Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900"
                />
              </div>

              {/* Revision summary if in revision mode */}
              {isRevisionMode && (
                <div>
                  <label className="block font-semibold text-terracotta mb-1">
                    Revision Summary (What changed in this version?) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formRevisionSummary}
                    onChange={(e) => setFormRevisionSummary(e.target.value)}
                    placeholder="e.g., Swapped terrazzo for White Oak planks, reduced furniture budget by $2,400"
                    className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900"
                  />
                </div>
              )}

              {/* Design Concept Description */}
              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">
                  Design & Spatial Concept Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formConceptDesc}
                  onChange={(e) => setFormConceptDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900 resize-none"
                />
              </div>

              {/* Timeline & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal-800 mb-1">
                    Estimated Timeline *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTimeline}
                    onChange={(e) => setFormTimeline(e.target.value)}
                    placeholder="e.g., 6 - 8 Weeks"
                    className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-800 mb-1">
                    Designer Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="e.g., Site access requires building elevator booking"
                    className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Itemized Cost Breakdown Table */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-stone-warm pb-1">
                  <span className="font-semibold text-charcoal-900">
                    Itemized Cost Line Items (Server-Validated)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-terracotta hover:underline font-semibold inline-flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Line Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {lineItems.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-stone-pale p-2 rounded-sm border border-stone-accent/20">
                      <select
                        value={item.category}
                        onChange={(e) => handleUpdateLineItem(idx, 'category', e.target.value)}
                        className="px-2 py-1 bg-ivory-100 border border-stone-accent/30 rounded-xs text-[11px] w-28"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) => handleUpdateLineItem(idx, 'item', e.target.value)}
                        placeholder="Description..."
                        className="flex-1 px-2 py-1 bg-ivory-100 border border-stone-accent/30 rounded-xs text-[11px]"
                      />

                      <div className="w-16">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateLineItem(idx, 'quantity', e.target.value)}
                          placeholder="Qty"
                          className="w-full px-2 py-1 bg-ivory-100 border border-stone-accent/30 rounded-xs text-[11px] text-right"
                        />
                      </div>

                      <div className="w-24">
                        <input
                          type="number"
                          min="0"
                          value={item.unitCost}
                          onChange={(e) => handleUpdateLineItem(idx, 'unitCost', e.target.value)}
                          placeholder="Unit ($)"
                          className="w-full px-2 py-1 bg-ivory-100 border border-stone-accent/30 rounded-xs text-[11px] text-right"
                        />
                      </div>

                      <div className="w-20 text-right font-semibold text-charcoal-900 text-[11px]">
                        ${((Number(item.quantity) || 1) * (Number(item.unitCost) || 0)).toLocaleString()}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveLineItem(idx)}
                        className="p-1 text-charcoal-700 hover:text-rose-600"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Total Cost Display */}
                <div className="flex justify-end items-center space-x-2 pt-2 border-t border-stone-warm">
                  <span className="text-xs uppercase text-charcoal-700 font-semibold">Total Estimated Cost:</span>
                  <span className="text-base font-bold text-terracotta">
                    ${calculatedTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Scope of Work */}
              <div className="space-y-2 pt-2">
                <span className="font-semibold text-charcoal-900 block border-b border-stone-warm pb-1">
                  Scope of Work Checklist
                </span>
                <ul className="space-y-1">
                  {scopeList.map((scope, i) => (
                    <li key={i} className="flex items-center justify-between bg-stone-pale px-3 py-1.5 rounded-sm">
                      <span>• {scope}</span>
                      <button
                        type="button"
                        onClick={() => setScopeList(scopeList.filter((_, idx) => idx !== i))}
                        className="text-charcoal-700 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newScopeItem}
                    onChange={(e) => setNewScopeItem(e.target.value)}
                    placeholder="Add scope deliverable..."
                    className="flex-1 px-3 py-1.5 bg-ivory-100 border border-stone-accent/40 rounded-xs text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddScope}
                    className="px-3 py-1.5 bg-stone-warm text-charcoal-900 hover:bg-stone-warm/80 rounded-xs text-xs font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Submit / Publish Button */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-stone-warm">
                <button
                  type="button"
                  onClick={() => setBuilderOpen(false)}
                  className="px-4 py-2 border border-stone-accent text-charcoal-700 hover:bg-stone-warm/50 rounded-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2 bg-charcoal-900 text-ivory-100 hover:bg-terracotta rounded-sm font-semibold uppercase tracking-wider disabled:opacity-50"
                >
                  {actionLoading
                    ? 'Publishing...'
                    : isRevisionMode
                    ? `Publish Version ${allVersions.length + 1}`
                    : 'Publish Version 1'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

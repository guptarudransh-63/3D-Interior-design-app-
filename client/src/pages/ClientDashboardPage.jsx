import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import confetti from 'canvas-confetti';
import {
  Briefcase,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  History,
  Layers,
  Sparkles,
  ArrowRight,
  ChevronRight,
  MessageSquare,
  DollarSign,
  Maximize2,
  Calendar,
  X,
  FileCheck,
} from 'lucide-react';

export const ClientDashboardPage = () => {
  const { user, isAuthenticated, quickDemoLogin } = useAuth();

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [proposalHistory, setProposalHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({ text: '', type: '' });

  // Revision Modal State
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionTargetVersion, setRevisionTargetVersion] = useState(null);
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [revisionFocusArea, setRevisionFocusArea] = useState('Materials & Finishes');

  // Accept/Decline confirmation
  const [decisionNotes, setDecisionNotes] = useState('');
  const [acceptingVersionId, setAcceptingVersionId] = useState(null);

  // Compare versions drawer
  const [compareOpen, setCompareOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.getProjects();
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
  }, [isAuthenticated]);

  // When selected project changes, fetch full details, proposals, and versions
  useEffect(() => {
    if (!selectedProjectId) {
      setProjectDetails(null);
      setProposalHistory(null);
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoadingDetails(true);
        const res = await api.getProjectById(selectedProjectId);
        if (res.success) {
          setProjectDetails(res.data);

          // If there is an active proposal, fetch its complete immutable version history
          if (res.data.proposals && res.data.proposals.length > 0) {
            const proposalId = res.data.proposals[0]._id;
            const historyRes = await api.getProposalVersions(proposalId);
            if (historyRes.success) {
              setProposalHistory(historyRes.data);
            }
          } else {
            setProposalHistory(null);
          }
        }
      } catch (err) {
        console.error(err);
        setNotification({ text: err.message, type: 'error' });
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [selectedProjectId]);

  const handleOpenRevision = (version) => {
    setRevisionTargetVersion(version);
    setRevisionFeedback('');
    setRevisionModalOpen(true);
  };

  const handleSubmitRevision = async (e) => {
    e.preventDefault();
    if (!proposalHistory?.proposal?._id || !revisionTargetVersion?._id || !revisionFeedback.trim()) return;

    try {
      setActionLoading(true);
      const res = await api.submitRevisionRequest(
        proposalHistory.proposal._id,
        revisionTargetVersion._id,
        {
          requestedChanges: revisionFeedback,
          focusAreas: [revisionFocusArea],
        }
      );

      if (res.success) {
        setRevisionModalOpen(false);
        setNotification({
          text: `Revision request for Proposal Version ${revisionTargetVersion.versionNumber} submitted to designer.`,
          type: 'success',
        });
        // Refresh project details
        const refreshed = await api.getProjectById(selectedProjectId);
        if (refreshed.success) setProjectDetails(refreshed.data);
        const refreshedHistory = await api.getProposalVersions(proposalHistory.proposal._id);
        if (refreshedHistory.success) setProposalHistory(refreshedHistory.data);
      }
    } catch (err) {
      setNotification({ text: err.message || 'Failed to submit revision', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptVersion = async (version) => {
    if (!proposalHistory?.proposal?._id || !version?._id) return;
    if (!window.confirm(`Formally accept Proposal Version ${version.versionNumber} for $${version.totalEstimatedCost.toLocaleString()}?`)) return;

    try {
      setActionLoading(true);
      const res = await api.acceptProposalVersion(
        proposalHistory.proposal._id,
        version._id,
        decisionNotes || `Client accepted Version ${version.versionNumber}.`
      );

      if (res.success) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        setNotification({
          text: `Proposal Version ${version.versionNumber} successfully accepted! Project is now moving to execution.`,
          type: 'success',
        });
        // Refresh
        const refreshed = await api.getProjectById(selectedProjectId);
        if (refreshed.success) setProjectDetails(refreshed.data);
        const refreshedHistory = await api.getProposalVersions(proposalHistory.proposal._id);
        if (refreshedHistory.success) setProposalHistory(refreshedHistory.data);
      }
    } catch (err) {
      setNotification({ text: err.message || 'Failed to accept proposal', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineVersion = async (version) => {
    const reason = prompt(`Please specify why Proposal Version ${version.versionNumber} is being declined:`);
    if (!reason) return;

    try {
      setActionLoading(true);
      const res = await api.declineProposalVersion(proposalHistory.proposal._id, version._id, reason);
      if (res.success) {
        setNotification({ text: `Proposal Version ${version.versionNumber} declined.`, type: 'info' });
        const refreshed = await api.getProjectById(selectedProjectId);
        if (refreshed.success) setProjectDetails(refreshed.data);
        const refreshedHistory = await api.getProposalVersions(proposalHistory.proposal._id);
        if (refreshedHistory.success) setProposalHistory(refreshedHistory.data);
      }
    } catch (err) {
      setNotification({ text: err.message || 'Failed to decline proposal', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <Briefcase className="w-10 h-10 text-terracotta mx-auto mb-2" />
        <h2 className="font-editorial text-2xl text-charcoal-900">
          Client Workspace Portal
        </h2>
        <p className="text-xs text-charcoal-700 font-light leading-relaxed">
          Log in as a client to manage your submitted project briefs, review versioned proposals from interior designers, and approve architectural contracts.
        </p>
        <button
          onClick={() => quickDemoLogin('client')}
          className="mt-3 px-5 py-2.5 bg-charcoal-900 text-ivory-100 rounded-sm text-xs font-semibold tracking-wider uppercase hover:bg-charcoal-800"
        >
          Sign in as Demo Client (Marcus)
        </button>
      </div>
    );
  }

  const currentProject = projectDetails?.project;
  const latestVersion = proposalHistory?.versions?.[0];
  const allVersions = proposalHistory?.versions || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-warm pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-semibold text-terracotta">
            Client Portal
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal-950 mt-1">
            Projects & Proposals Workspace
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-2 font-light max-w-xl">
            Review your project briefs, track designer milestones, and examine versioned proposal contracts with itemized line items.
          </p>
        </div>

        <Link
          to="/project-brief"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-charcoal-900 text-ivory-100 hover:bg-terracotta rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 shadow-2xs"
        >
          <span>Submit New Brief</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
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

      {/* Main Grid: Projects List on Left, Active Project Details on Right */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-charcoal-900 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-charcoal-700">Loading your project portfolio...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-20 text-center bg-ivory-50 rounded-md border border-dashed border-stone-accent/60 p-8 space-y-4">
          <Briefcase className="w-10 h-10 text-charcoal-700 mx-auto" />
          <h3 className="font-editorial text-xl text-charcoal-900">
            No Submitted Projects Found
          </h3>
          <p className="text-xs text-charcoal-700 max-w-md mx-auto font-light leading-relaxed">
            You haven't submitted a project brief yet. Start by browsing 3D room concepts, configuring materials, and submitting your requirements.
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Projects Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 px-1">
              My Submitted Projects ({projects.length})
            </h3>

            <div className="space-y-2">
              {projects.map((proj) => {
                const isSelected = proj._id === selectedProjectId;
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
                      <span>${proj.budgetRange?.min?.toLocaleString()} - ${proj.budgetRange?.max?.toLocaleString()}</span>
                    </div>

                    <div className="text-[10px] text-charcoal-700 flex items-center justify-between pt-1 border-t border-stone-warm/50">
                      <span>Submitted: {new Date(proj.createdAt).toLocaleDateString()}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-charcoal-700" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Project Detail & Versioned Proposals */}
          <div className="lg:col-span-8 space-y-6">
            {loadingDetails ? (
              <div className="p-12 text-center bg-ivory-50 rounded-md border border-stone-accent/30">
                <div className="inline-block w-6 h-6 border-2 border-charcoal-900 border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-xs text-charcoal-700">Loading project details and proposal versions...</p>
              </div>
            ) : currentProject ? (
              <>
                {/* 1. Project Brief Snapshot Card */}
                <div className="p-6 rounded-md bg-ivory-50 border border-stone-accent/30 shadow-2xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-warm pb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta">
                          Project Brief
                        </span>
                        <span className="text-charcoal-700">•</span>
                        <span className="text-xs text-charcoal-700">{currentProject.roomType} ({currentProject.propertyType})</span>
                      </div>
                      <h2 className="font-editorial text-2xl font-bold text-charcoal-950">
                        {currentProject.title}
                      </h2>
                    </div>

                    <div className="flex items-center space-x-3">
                      <StatusBadge status={currentProject.status} className="text-xs px-3 py-1" />
                    </div>
                  </div>

                  {/* Requirements & Budget Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-charcoal-700 uppercase block font-semibold">Budget Range</span>
                      <span className="font-bold text-charcoal-900 text-sm">
                        ${currentProject.budgetRange?.min?.toLocaleString()} – ${currentProject.budgetRange?.max?.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-charcoal-700 uppercase block font-semibold">Timeline</span>
                      <span className="font-medium text-charcoal-900 text-sm">
                        {currentProject.timeline}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-charcoal-700 uppercase block font-semibold">Dimensions</span>
                      <span className="font-medium text-charcoal-900 text-sm">
                        {currentProject.dimensions?.areaSqFt} sq ft
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-charcoal-700 uppercase block font-semibold">Assigned Designer</span>
                      <span className="font-medium text-charcoal-900 text-sm truncate block">
                        {currentProject.assignedDesigner?.name || 'Awaiting Assignment'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-charcoal-700 uppercase block font-semibold mb-1">
                      Submitted Requirements
                    </span>
                    <p className="text-xs text-charcoal-800 leading-relaxed font-light bg-stone-pale p-3 rounded-sm border border-stone-accent/20">
                      {currentProject.requirementsDescription}
                    </p>
                  </div>

                  {/* Attached Saved Design Pill */}
                  {currentProject.savedDesign && (
                    <div className="p-3 rounded-sm bg-stone-pale border border-stone-accent/30 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <Bookmark className="w-4 h-4 text-terracotta" />
                        <div>
                          <span className="font-semibold text-charcoal-900 block">
                            Attached 3D Design: {currentProject.savedDesign.name}
                          </span>
                          <span className="text-[10px] text-charcoal-700">
                            Based on {currentProject.savedDesign.roomConcept?.name || 'Room Concept'}
                          </span>
                        </div>
                      </div>
                      {currentProject.savedDesign.roomConcept?.slug && (
                        <Link
                          to={`/concept/${currentProject.savedDesign.roomConcept.slug}`}
                          className="px-2.5 py-1 bg-charcoal-900 text-ivory-100 hover:bg-terracotta rounded-xs text-[10px] font-medium"
                        >
                          View 3D Scene
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. PROPOSAL SYSTEM (THE CORE ENGINEERING HIGHLIGHT) */}
                <div className="p-6 rounded-md bg-ivory-50 border border-stone-accent/30 shadow-2xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-warm pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-terracotta" />
                        <h3 className="font-editorial text-xl font-bold text-charcoal-900">
                          Designer Proposal & Revisions
                        </h3>
                      </div>
                      <p className="text-xs text-charcoal-700 mt-1 font-light">
                        Proposals are published as sequential, immutable versions. Revisions preserve prior history.
                      </p>
                    </div>

                    {allVersions.length > 1 && (
                      <button
                        onClick={() => setCompareOpen(!compareOpen)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-stone-accent rounded-sm text-xs font-semibold text-charcoal-800 hover:bg-stone-warm"
                      >
                        <Layers className="w-3.5 h-3.5 text-terracotta" />
                        <span>{compareOpen ? 'Close Version Diff' : `Compare Versions (${allVersions.length})`}</span>
                      </button>
                    )}
                  </div>

                  {/* Version Comparison Drawer */}
                  {compareOpen && allVersions.length > 1 && (
                    <div className="p-4 rounded-sm bg-stone-pale border border-stone-accent/40 space-y-4 animate-in fade-in duration-150">
                      <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-800 block">
                        Sequential Version Evolution Comparison:
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {allVersions.slice(0, 2).map((ver) => (
                          <div
                            key={ver._id}
                            className="p-3 bg-ivory-100 rounded-sm border border-stone-accent/40 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-charcoal-900">
                                Version {ver.versionNumber}
                              </span>
                              <StatusBadge status={ver.status} />
                            </div>
                            <div className="text-xs text-charcoal-700">
                              Published: {new Date(ver.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-base font-bold text-terracotta">
                              Total: ${ver.totalEstimatedCost?.toLocaleString()}
                            </div>
                            <p className="text-[11px] text-charcoal-700 line-clamp-2">
                              {ver.revisionSummary || ver.designConceptDescription}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* If no proposal published yet */}
                  {!proposalHistory || allVersions.length === 0 ? (
                    <div className="p-8 text-center bg-stone-pale/50 rounded-sm border border-dashed border-stone-accent/50 space-y-2">
                      <Clock className="w-8 h-8 text-charcoal-700 mx-auto" />
                      <h4 className="font-editorial text-base font-medium text-charcoal-900">
                        Proposal in Preparation
                      </h4>
                      <p className="text-xs text-charcoal-700 max-w-md mx-auto">
                        Your assigned interior designer is analyzing your floorplan dimensions and material preferences. Version 1 will be published here shortly.
                      </p>
                    </div>
                  ) : (
                    /* Display Latest Version Card */
                    <div className="space-y-6">
                      <div className="p-5 rounded-sm bg-ivory-100 border-2 border-stone-accent/50 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-warm pb-3">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded-full bg-charcoal-900 text-ivory-100 text-xs font-bold">
                              Version {latestVersion.versionNumber} (Latest)
                            </span>
                            <h4 className="font-editorial text-lg font-bold text-charcoal-900">
                              {latestVersion.title}
                            </h4>
                          </div>

                          <div className="flex items-center space-x-2">
                            <StatusBadge status={latestVersion.status} />
                          </div>
                        </div>

                        {/* Concept Description */}
                        <div>
                          <span className="text-[10px] text-charcoal-700 uppercase font-semibold block mb-1">
                            Spatial & Design Concept
                          </span>
                          <p className="text-xs text-charcoal-800 leading-relaxed font-light">
                            {latestVersion.designConceptDescription}
                          </p>
                        </div>

                        {/* Itemized Cost Breakdown Table (Server-computed) */}
                        <div>
                          <span className="text-[10px] text-charcoal-700 uppercase font-semibold block mb-2">
                            Itemized Scope & Cost Breakdown
                          </span>
                          <div className="overflow-x-auto border border-stone-warm rounded-sm">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-stone-warm/50 text-[10px] uppercase text-charcoal-700 font-semibold border-b border-stone-warm">
                                <tr>
                                  <th className="p-2.5">Category</th>
                                  <th className="p-2.5">Item Description</th>
                                  <th className="p-2.5 text-right">Qty</th>
                                  <th className="p-2.5 text-right">Unit ($)</th>
                                  <th className="p-2.5 text-right">Line Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-warm/50 text-charcoal-800">
                                {latestVersion.costBreakdown?.map((item, idx) => (
                                  <tr key={idx} className="hover:bg-ivory-50">
                                    <td className="p-2.5 font-medium">{item.category}</td>
                                    <td className="p-2.5">{item.item}</td>
                                    <td className="p-2.5 text-right">{item.quantity}</td>
                                    <td className="p-2.5 text-right">${item.unitCost?.toLocaleString()}</td>
                                    <td className="p-2.5 text-right font-semibold">
                                      ${item.lineTotal?.toLocaleString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot className="bg-stone-warm/60 border-t border-stone-warm font-bold">
                                <tr>
                                  <td colSpan="4" className="p-2.5 text-right uppercase text-[10px] text-charcoal-700">
                                    Total Estimated Investment:
                                  </td>
                                  <td className="p-2.5 text-right text-sm text-terracotta">
                                    ${latestVersion.totalEstimatedCost?.toLocaleString()}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>

                        {/* Scope of Work Points */}
                        {latestVersion.scopeOfWork?.length > 0 && (
                          <div>
                            <span className="text-[10px] text-charcoal-700 uppercase font-semibold block mb-1">
                              Included Scope of Work
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-xs text-charcoal-800 font-light">
                              {latestVersion.scopeOfWork.map((scope, i) => (
                                <li key={i}>{scope}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Client Decision Actions */}
                        {latestVersion.status === 'Published' && (
                          <div className="pt-3 border-t border-stone-warm flex flex-col sm:flex-row items-center justify-between gap-3">
                            <span className="text-xs text-charcoal-700 font-light">
                              Review this proposal version. You may request revisions or formally accept.
                            </span>

                            <div className="flex items-center space-x-2 w-full sm:w-auto">
                              <button
                                onClick={() => handleOpenRevision(latestVersion)}
                                className="flex-1 sm:flex-none px-4 py-2 border border-terracotta text-terracotta hover:bg-terracotta/10 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
                              >
                                Request Changes
                              </button>
                              <button
                                onClick={() => handleAcceptVersion(latestVersion)}
                                disabled={actionLoading}
                                className="flex-1 sm:flex-none px-5 py-2 bg-charcoal-900 text-ivory-100 hover:bg-emerald-700 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
                              >
                                Accept Version {latestVersion.versionNumber}
                              </button>
                            </div>
                          </div>
                        )}

                        {latestVersion.status === 'Accepted' && (
                          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-sm text-emerald-900 text-xs flex items-center space-x-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>
                              You formally accepted Version {latestVersion.versionNumber} on{' '}
                              {new Date(latestVersion.clientDecision?.decisionDate || latestVersion.updatedAt).toLocaleDateString()}.
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Prior Versions Accordion / Log */}
                      {allVersions.length > 1 && (
                        <div className="space-y-3 pt-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block">
                            Historical Immutable Versions ({allVersions.length - 1} prior):
                          </span>

                          {allVersions.slice(1).map((priorVer) => (
                            <div
                              key={priorVer._id}
                              className="p-3.5 rounded-sm bg-stone-pale border border-stone-accent/30 text-xs space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-charcoal-900">
                                    Version {priorVer.versionNumber}
                                  </span>
                                  <span className="text-charcoal-700 text-[10px]">
                                    ({new Date(priorVer.createdAt).toLocaleDateString()})
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold text-charcoal-900">
                                    ${priorVer.totalEstimatedCost?.toLocaleString()}
                                  </span>
                                  <StatusBadge status={priorVer.status} />
                                </div>
                              </div>
                              <p className="text-[11px] text-charcoal-700 font-light">
                                {priorVer.designConceptDescription}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Project Audit Activity Trail */}
                {projectDetails.activities?.length > 0 && (
                  <div className="p-6 rounded-md bg-ivory-50 border border-stone-accent/30 shadow-2xs space-y-4">
                    <div className="flex items-center space-x-2 border-b border-stone-warm pb-3">
                      <History className="w-4 h-4 text-terracotta" />
                      <h3 className="font-editorial text-lg font-bold text-charcoal-900">
                        Project Activity & Milestone History
                      </h3>
                    </div>

                    <div className="space-y-3 text-xs">
                      {projectDetails.activities.map((act) => (
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Structured Revision Request Modal */}
      {revisionModalOpen && revisionTargetVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/60 backdrop-blur-xs p-4">
          <div className="bg-ivory-50 rounded-md border border-stone-accent/40 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-warm pb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-terracotta" />
                <h3 className="font-editorial text-lg font-semibold text-charcoal-900">
                  Request Revision for Version {revisionTargetVersion.versionNumber}
                </h3>
              </div>
              <button onClick={() => setRevisionModalOpen(false)}>
                <X className="w-5 h-5 text-charcoal-700" />
              </button>
            </div>

            <form onSubmit={handleSubmitRevision} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">
                  Primary Focus Area
                </label>
                <select
                  value={revisionFocusArea}
                  onChange={(e) => setRevisionFocusArea(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none"
                >
                  <option value="Materials & Finishes">Materials & Finishes (e.g., substitute oak for terrazzo)</option>
                  <option value="Cost & Budget">Cost & Budget (e.g., reduce total expenditure)</option>
                  <option value="Timeline">Timeline (e.g., expedite completion)</option>
                  <option value="Scope of Work">Scope of Work (e.g., add or remove items)</option>
                  <option value="Layout & Geometry">Layout & Geometry (e.g., seating arrangement)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">
                  Specific Requested Changes & Feedback *
                </label>
                <textarea
                  rows={4}
                  required
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  placeholder="Detail precisely what you would like the designer to adjust in the next proposal version..."
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none resize-none"
                />
              </div>

              <div className="p-3 rounded-sm bg-stone-pale border border-stone-accent/20 text-[11px] text-charcoal-700">
                Submitting this request transitions project status to <strong>"Revision Requested"</strong>. Version {revisionTargetVersion.versionNumber} remains immutable while your designer prepares Version {revisionTargetVersion.versionNumber + 1}.
              </div>

              <div className="flex justify-end space-x-3 pt-2 border-t border-stone-warm">
                <button
                  type="button"
                  onClick={() => setRevisionModalOpen(false)}
                  className="px-4 py-2 border border-stone-accent text-charcoal-700 hover:bg-stone-warm/50 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-terracotta text-ivory-100 hover:bg-terracotta-dark rounded-sm font-semibold uppercase tracking-wider disabled:opacity-50"
                >
                  {actionLoading ? 'Submitting...' : 'Submit Revision Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

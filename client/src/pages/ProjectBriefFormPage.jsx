import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileCheck,
  Bookmark,
  DollarSign,
  Maximize2,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const ROOM_TYPES = ['Living Room', 'Bedroom', 'Kitchen', 'Dining Room', 'Home Office', 'Studio Apartment'];
const PROPERTY_TYPES = ['Apartment', 'Townhouse', 'Penthouse', 'Single Family Villa', 'Studio', 'Commercial Space'];
const STYLES = ['Warm Minimalist', 'Japandi', 'Scandinavian', 'Modern Architectural', 'Mediterranean Contemporary', 'Industrial Loft'];
const TIMELINES = ['1 - 2 Months', '2 - 4 Months', '4 - 6 Months', '6+ Months', 'Flexible'];

export const ProjectBriefFormPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, quickDemoLogin } = useAuth();

  const [savedDesigns, setSavedDesigns] = useState([]);
  const [loadingDesigns, setLoadingDesigns] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [roomType, setRoomType] = useState(searchParams.get('roomType') || 'Living Room');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [preferredStyle, setPreferredStyle] = useState(searchParams.get('preferredStyle') || 'Warm Minimalist');
  const [selectedSavedDesignId, setSelectedSavedDesignId] = useState(searchParams.get('savedDesignId') || '');

  // Dimensions
  const [lengthFt, setLengthFt] = useState(20);
  const [widthFt, setWidthFt] = useState(15);
  const [heightFt, setHeightFt] = useState(10);

  // Budget
  const [budgetMin, setBudgetMin] = useState(15000);
  const [budgetMax, setBudgetMax] = useState(30000);

  // Timeline & Location
  const [timeline, setTimeline] = useState('2 - 4 Months');
  const [city, setCity] = useState('New York');
  const [stateOrProvince, setStateOrProvince] = useState('NY');
  const [country, setCountry] = useState('United States');

  // Requirements description
  const [requirementsDescription, setRequirementsDescription] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  const areaSqFt = lengthFt * widthFt;

  useEffect(() => {
    if (isAuthenticated) {
      const fetchDesigns = async () => {
        try {
          setLoadingDesigns(true);
          const res = await api.getSavedDesigns();
          if (res.success) {
            setSavedDesigns(res.data);
            // If query param passed, check and select it
            const queryDesignId = searchParams.get('savedDesignId');
            if (queryDesignId && res.data.some((d) => d._id === queryDesignId)) {
              setSelectedSavedDesignId(queryDesignId);
              const matched = res.data.find((d) => d._id === queryDesignId);
              if (matched) {
                setTitle(`${matched.name} — Execution Brief`);
                if (matched.roomConcept?.roomType) setRoomType(matched.roomConcept.roomType);
                if (matched.roomConcept?.designStyle) setPreferredStyle(matched.roomConcept.designStyle);
                if (matched.notes) setRequirementsDescription(matched.notes);
              }
            } else if (!title) {
              setTitle('Penthouse Spatial Redesign Project');
            }
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingDesigns(false);
        }
      };
      fetchDesigns();
    } else {
      setTitle('Architectural Interior Redesign Brief');
    }
  }, [isAuthenticated, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isAuthenticated) {
      // Auto login as demo client for seamless demonstration
      await quickDemoLogin('client');
    }

    if (!title.trim() || !requirementsDescription.trim()) {
      setErrorMsg('Please complete the project title and detailed requirements.');
      return;
    }

    if (Number(budgetMin) > Number(budgetMax)) {
      setErrorMsg('Minimum budget cannot exceed maximum budget.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title,
        roomType,
        propertyType,
        dimensions: {
          lengthFt: Number(lengthFt),
          widthFt: Number(widthFt),
          heightFt: Number(heightFt),
          areaSqFt,
        },
        preferredStyle,
        budgetRange: {
          min: Number(budgetMin),
          max: Number(budgetMax),
          currency: 'USD',
        },
        timeline,
        location: {
          city: city.trim(),
          stateOrProvince: stateOrProvince.trim(),
          country: country.trim(),
        },
        requirementsDescription,
        referenceImages: referenceImageUrl ? [referenceImageUrl.trim()] : [],
        savedDesignId: selectedSavedDesignId || undefined,
      };

      const res = await api.createProject(payload);
      if (res.success) {
        setSuccessData(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit project brief');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="border-b border-stone-warm pb-6">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-terracotta">
          Step 03 — Collaboration Initiation
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal-950 mt-1">
          Submit Project Brief & Budget
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-700 mt-2 font-light max-w-2xl leading-relaxed">
          Provide your property dimensions, target budget range, and spatial requirements. Our verified interior designers will analyze your brief and prepare an itemized, versioned proposal.
        </p>
      </div>

      {/* Confirmation Screen on Success */}
      {successData ? (
        <div className="p-8 rounded-md bg-ivory-50 border border-stone-accent/40 shadow-sm space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="font-editorial text-2xl font-bold text-charcoal-900">
              Project Brief Successfully Submitted
            </h2>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              Your project record has been persisted in MongoDB with status <span className="font-semibold text-charcoal-900">"Submitted"</span>. It is now queued for designer review in the workspace.
            </p>
          </div>

          <div className="p-4 rounded-sm bg-stone-pale border border-stone-accent/30 text-xs max-w-md mx-auto text-left space-y-1.5">
            <div className="flex justify-between">
              <span className="text-charcoal-700">Project Title:</span>
              <span className="font-medium text-charcoal-900">{successData.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-700">Room Type:</span>
              <span className="font-medium text-charcoal-900">{successData.roomType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-700">Budget Range:</span>
              <span className="font-semibold text-terracotta">
                ${successData.budgetRange?.min?.toLocaleString()} – ${successData.budgetRange?.max?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-700">Expected Timeline:</span>
              <span className="font-medium text-charcoal-900">{successData.timeline}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              to="/client/dashboard"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              <span>View in Client Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Project Identity */}
          <div className="p-6 bg-ivory-50 rounded-md border border-stone-accent/30 shadow-2xs space-y-4">
            <h3 className="font-editorial text-lg font-semibold text-charcoal-900 border-b border-stone-warm pb-2">
              1. Project Overview
            </h3>

            <div>
              <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., TriBeCa Loft Living Room Renovation"
                className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-xs text-charcoal-900 focus:outline-none focus:border-charcoal-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Room Typology *
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-xs text-charcoal-900 focus:outline-none focus:border-charcoal-900"
                >
                  {ROOM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Property Type *
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-xs text-charcoal-900 focus:outline-none focus:border-charcoal-900"
                >
                  {PROPERTY_TYPES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Target Design Style *
                </label>
                <select
                  value={preferredStyle}
                  onChange={(e) => setPreferredStyle(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-xs text-charcoal-900 focus:outline-none focus:border-charcoal-900"
                >
                  {STYLES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Attach Saved Design Selector */}
            {savedDesigns.length > 0 && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-charcoal-800 mb-1 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-terracotta" />
                    <span>Attach Saved 3D Design Configuration (Optional)</span>
                  </span>
                  <span className="text-[10px] text-charcoal-700 font-normal">
                    Connects your selected materials
                  </span>
                </label>
                <select
                  value={selectedSavedDesignId}
                  onChange={(e) => setSelectedSavedDesignId(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-xs text-charcoal-900 focus:outline-none focus:border-charcoal-900"
                >
                  <option value="">-- No saved design attached --</option>
                  {savedDesigns.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.roomConcept?.name || 'Custom'})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 2. Room Spatial Dimensions */}
          <div className="p-6 bg-ivory-50 rounded-md border border-stone-accent/30 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-warm pb-2">
              <h3 className="font-editorial text-lg font-semibold text-charcoal-900">
                2. Approximate Room Dimensions
              </h3>
              <span className="text-xs font-semibold text-terracotta">
                Calculated Area: {areaSqFt} sq ft
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">
                  Length (ft)
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={lengthFt}
                  onChange={(e) => setLengthFt(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">
                  Width (ft)
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={widthFt}
                  onChange={(e) => setWidthFt(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">
                  Ceiling Height (ft)
                </label>
                <input
                  type="number"
                  min="7"
                  max="30"
                  value={heightFt}
                  onChange={(e) => setHeightFt(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900"
                />
              </div>
            </div>
          </div>

          {/* 3. Budget & Timeline */}
          <div className="p-6 bg-ivory-50 rounded-md border border-stone-accent/30 shadow-2xs space-y-4">
            <h3 className="font-editorial text-lg font-semibold text-charcoal-900 border-b border-stone-warm pb-2">
              3. Investment Budget & Timeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">
                  Target Minimum Budget (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-700">$</span>
                  <input
                    type="number"
                    step="500"
                    min="1000"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">
                  Target Maximum Budget (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-700">$</span>
                  <input
                    type="number"
                    step="500"
                    min="1000"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">
                  Expected Completion Timeline *
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900"
                >
                  {TIMELINES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">
                  Project Location (City) *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Seattle, Chicago, Austin"
                  className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900"
                />
              </div>
            </div>
          </div>

          {/* 4. Requirements & Inspiration */}
          <div className="p-6 bg-ivory-50 rounded-md border border-stone-accent/30 shadow-2xs space-y-4">
            <h3 className="font-editorial text-lg font-semibold text-charcoal-900 border-b border-stone-warm pb-2">
              4. Requirements & Architectural Vision
            </h3>

            <div>
              <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                Detailed Spatial Requirements *
              </label>
              <textarea
                rows={5}
                required
                value={requirementsDescription}
                onChange={(e) => setRequirementsDescription(e.target.value)}
                placeholder="Describe your daily usage patterns, functional storage needs, lighting requirements, existing architectural features, and any materials or furnishings you love..."
                className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-xs text-charcoal-900 focus:outline-none focus:border-charcoal-900 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                Reference Image URL (Optional)
              </label>
              <input
                type="url"
                value={referenceImageUrl}
                onChange={(e) => setReferenceImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-xs text-charcoal-900 focus:outline-none focus:border-charcoal-900"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-charcoal-700 font-light">
              Submitting registers a persistent project record in MongoDB with verified user ownership.
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-charcoal-900 text-ivory-100 hover:bg-terracotta rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Submitting to MongoDB...' : 'Submit Project Brief →'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

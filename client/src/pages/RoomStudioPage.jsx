import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RoomCanvas } from '../components/3d/RoomCanvas';
import {
  Bookmark,
  Share2,
  FileCheck,
  Check,
  Sparkles,
  Info,
  DollarSign,
  Maximize2,
  Layers,
  ArrowRight,
  AlertCircle,
  X,
} from 'lucide-react';

export const RoomStudioPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, quickDemoLogin } = useAuth();

  const [concept, setConcept] = useState(null);
  const [allMaterials, setAllMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState({
    flooring: null,
    walls: null,
    cabinetry: null,
    accent: null,
  });
  const [activeCategory, setActiveCategory] = useState('flooring');
  const [loading, setLoading] = useState(true);

  // Save Modal state
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [designName, setDesignName] = useState('');
  const [designNotes, setDesignNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadConceptData = async () => {
      try {
        const [conceptRes, materialsRes] = await Promise.all([
          api.getRoomConceptBySlug(slug),
          api.getMaterialOptions(),
        ]);

        if (conceptRes.success) {
          const room = conceptRes.data;
          setConcept(room);
          setDesignName(`${room.name} — Customized Configuration`);

          // Set initial materials from default selections
          if (room.defaultSelections) {
            setSelectedMaterials({
              flooring: room.defaultSelections.flooring || null,
              walls: room.defaultSelections.walls || null,
              cabinetry: room.defaultSelections.cabinetry || null,
              accent: room.defaultSelections.accent || null,
            });
          }
        }

        if (materialsRes.success) {
          setAllMaterials(materialsRes.data);
        }
      } catch (err) {
        console.error('Error loading studio concept:', err);
        setErrorMsg('Failed to load room concept studio.');
      } finally {
        setLoading(false);
      }
    };

    loadConceptData();
  }, [slug]);

  const handleMaterialChange = (category, material) => {
    setSelectedMaterials((prev) => ({
      ...prev,
      [category]: material,
    }));
  };

  // Calculate dynamic estimated budget based on selected materials
  const calculateEstimatedTotal = () => {
    if (!concept) return 0;
    const area = concept.defaultDimensions?.areaSqFt || 300;
    const baseRate = 45;
    const modifiers = Object.values(selectedMaterials).reduce(
      (acc, m) => acc + (m?.costModifier || 0),
      0
    );
    return Math.round(area * (baseRate + modifiers));
  };

  const handleOpenSaveModal = () => {
    if (!isAuthenticated) {
      // Auto login as demo client for seamless evaluation if requested
      quickDemoLogin('client').then(() => setSaveModalOpen(true));
      return;
    }
    setSaveModalOpen(true);
  };

  const handleSaveDesign = async (e) => {
    e.preventDefault();
    if (!designName.trim()) return;

    setSaving(true);
    setErrorMsg('');
    try {
      const payload = {
        name: designName,
        roomConceptId: concept._id,
        selectedMaterials: {
          flooring: selectedMaterials.flooring?._id,
          walls: selectedMaterials.walls?._id,
          cabinetry: selectedMaterials.cabinetry?._id,
          accent: selectedMaterials.accent?._id,
        },
        notes: designNotes,
        customDimensions: concept.defaultDimensions,
      };

      const res = await api.createSavedDesign(payload);
      if (res.success) {
        setSaveSuccess(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save design');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="inline-block w-8 h-8 border-2 border-charcoal-900 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-charcoal-700">Loading 3D interior studio & spatial scene...</p>
      </div>
    );
  }

  if (!concept) {
    return (
      <div className="py-24 max-w-lg mx-auto text-center px-4">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h2 className="font-editorial text-2xl text-charcoal-900">Room Concept Not Found</h2>
        <p className="text-xs text-charcoal-700 mt-2">
          The concept you requested could not be located.
        </p>
        <Link
          to="/catalog"
          className="mt-4 inline-block px-4 py-2 bg-charcoal-900 text-ivory-100 rounded-sm text-xs font-medium"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const categoryMaterials = allMaterials.filter((m) => m.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-warm pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-charcoal-700 mb-1">
            <Link to="/catalog" className="hover:text-charcoal-900">
              Room Concepts
            </Link>
            <span>/</span>
            <span className="text-terracotta font-medium">{concept.roomType}</span>
            <span>/</span>
            <span className="text-charcoal-900">{concept.designStyle}</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl text-charcoal-950 font-medium">
            {concept.name}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenSaveModal}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-ivory-50 border border-stone-accent/50 hover:border-charcoal-900 rounded-sm text-xs font-semibold text-charcoal-900 transition-colors shadow-2xs"
          >
            <Bookmark className="w-3.5 h-3.5 text-terracotta" />
            <span>Save Configuration</span>
          </button>

          <Link
            to={`/project-brief?roomType=${encodeURIComponent(concept.roomType)}&preferredStyle=${encodeURIComponent(concept.designStyle)}`}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm"
          >
            <span>Submit Brief</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive 3D Room Viewer */}
        <div className="lg:col-span-8 space-y-4">
          <RoomCanvas
            selectedMaterials={selectedMaterials}
            roomConcept={concept}
            fallbackImage={concept.coverImage}
          />

          {/* Room Specs & Details */}
          <div className="p-5 rounded-md bg-ivory-50 border border-stone-accent/30 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-charcoal-700 uppercase block font-semibold">Dimensions</span>
              <span className="font-medium text-charcoal-900 text-sm">
                {concept.defaultDimensions?.lengthFt}′ × {concept.defaultDimensions?.widthFt}′
              </span>
              <span className="text-[10px] text-charcoal-700 block mt-0.5">
                ({concept.defaultDimensions?.areaSqFt} sq ft)
              </span>
            </div>

            <div>
              <span className="text-[10px] text-charcoal-700 uppercase block font-semibold">Design Aesthetic</span>
              <span className="font-medium text-charcoal-900 text-sm block truncate">
                {concept.designStyle}
              </span>
              <span className="text-[10px] text-charcoal-700 block mt-0.5">Curated Palette</span>
            </div>

            <div>
              <span className="text-[10px] text-charcoal-700 uppercase block font-semibold">Base Budget Range</span>
              <span className="font-medium text-charcoal-900 text-sm">
                ${concept.budgetRange?.min?.toLocaleString()} – ${concept.budgetRange?.max?.toLocaleString()}
              </span>
              <span className="text-[10px] text-charcoal-700 block mt-0.5">Turnkey Estimate</span>
            </div>

            <div>
              <span className="text-[10px] text-charcoal-700 uppercase block font-semibold">Dynamic Total</span>
              <span className="font-semibold text-terracotta text-sm">
                ${calculateEstimatedTotal().toLocaleString()}
              </span>
              <span className="text-[10px] text-charcoal-700 block mt-0.5">With Selected Finishes</span>
            </div>
          </div>
        </div>

        {/* Right Column: Material Customizer Palette */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-md bg-ivory-50 border border-stone-accent/40 shadow-xs space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta">
                  Material Palette
                </span>
                <span className="text-xs text-charcoal-700 font-light">Interactive PBR</span>
              </div>
              <h3 className="font-editorial text-xl font-semibold text-charcoal-900 mt-1">
                Customize Finishes
              </h3>
              <p className="text-xs text-charcoal-700 mt-1 font-light">
                Select a category to swap finishes live in the 3D interior scene.
              </p>
            </div>

            {/* Category Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-stone-warm/50 rounded-sm text-xs font-medium">
              {[
                { id: 'flooring', label: 'Flooring' },
                { id: 'walls', label: 'Walls' },
                { id: 'cabinetry', label: 'Joinery' },
                { id: 'accent', label: 'Accent' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`py-1.5 rounded-xs transition-colors capitalize ${
                    activeCategory === cat.id
                      ? 'bg-charcoal-900 text-ivory-100 shadow-2xs font-semibold'
                      : 'text-charcoal-700 hover:text-charcoal-950'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Swatch Selector Cards */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {categoryMaterials.map((material) => {
                const isSelected = selectedMaterials[activeCategory]?._id === material._id;

                return (
                  <button
                    key={material._id}
                    onClick={() => handleMaterialChange(activeCategory, material)}
                    className={`w-full text-left p-3 rounded-sm border transition-all flex items-start space-x-3 ${
                      isSelected
                        ? 'border-charcoal-900 bg-stone-pale shadow-2xs'
                        : 'border-stone-accent/30 bg-ivory-100 hover:border-stone-accent'
                    }`}
                  >
                    {/* Color Swatch Circle */}
                    <div
                      className="w-10 h-10 rounded-full border-2 border-ivory-50 shadow-sm shrink-0 flex items-center justify-center relative mt-0.5"
                      style={{ backgroundColor: material.hexCode }}
                    >
                      {isSelected && <Check className="w-4 h-4 text-charcoal-900 drop-shadow-sm" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs text-charcoal-900 truncate">
                          {material.name}
                        </span>
                        {material.costModifier > 0 && (
                          <span className="text-[10px] text-terracotta font-semibold ml-2 shrink-0">
                            +${material.costModifier}/sq ft
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-charcoal-700 line-clamp-2 mt-0.5 font-light">
                        {material.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1.5 text-[9px] uppercase tracking-wider text-charcoal-700">
                        <span>Texture: {material.textureType}</span>
                        <span>•</span>
                        <span>Roughness: {material.roughness}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Summary Card */}
            <div className="p-3.5 rounded-sm bg-stone-pale border border-stone-accent/30 text-xs space-y-2">
              <span className="text-[10px] uppercase font-semibold text-charcoal-700 block tracking-wider">
                Current Configuration Snapshot:
              </span>
              <div className="space-y-1 text-[11px] text-charcoal-800">
                <div className="flex justify-between">
                  <span className="text-charcoal-700">Flooring:</span>
                  <span className="font-medium truncate max-w-[170px]">
                    {selectedMaterials.flooring?.name || 'Standard'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-700">Walls:</span>
                  <span className="font-medium truncate max-w-[170px]">
                    {selectedMaterials.walls?.name || 'Standard'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-700">Joinery:</span>
                  <span className="font-medium truncate max-w-[170px]">
                    {selectedMaterials.cabinetry?.name || 'Standard'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-700">Accent:</span>
                  <span className="font-medium truncate max-w-[170px]">
                    {selectedMaterials.accent?.name || 'Standard'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenSaveModal}
              className="w-full py-3 bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <Bookmark className="w-3.5 h-3.5 text-terracotta" />
              <span>Save This Configuration to MongoDB</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Configuration Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/60 backdrop-blur-xs p-4">
          <div className="bg-ivory-50 rounded-md border border-stone-accent/40 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-warm pb-3">
              <div className="flex items-center space-x-2">
                <Bookmark className="w-4 h-4 text-terracotta" />
                <h3 className="font-editorial text-xl font-semibold text-charcoal-900">
                  Save Custom Design
                </h3>
              </div>
              <button
                onClick={() => {
                  setSaveModalOpen(false);
                  setSaveSuccess(null);
                }}
                className="text-charcoal-700 hover:text-charcoal-950 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
                  <div className="flex items-center space-x-2 font-semibold text-sm">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>Design Saved Successfully!</span>
                  </div>
                  <p className="text-emerald-800 pt-1">
                    "{saveSuccess.name}" has been persisted to MongoDB under your account. You can reopen it anytime or use it directly for your project brief.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    to="/saved-designs"
                    className="flex-1 py-2.5 text-center bg-ivory-100 border border-stone-accent text-charcoal-900 hover:bg-stone-warm rounded-sm text-xs font-semibold"
                  >
                    View in Saved Designs
                  </Link>
                  <Link
                    to={`/project-brief?savedDesignId=${saveSuccess._id}`}
                    className="flex-1 py-2.5 text-center bg-charcoal-900 text-ivory-100 hover:bg-terracotta rounded-sm text-xs font-semibold"
                  >
                    Attach to Project Brief →
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveDesign} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-sm">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Configuration Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={designName}
                    onChange={(e) => setDesignName(e.target.value)}
                    placeholder="e.g., Japandi Living Room with Sage Accents"
                    className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-xs text-charcoal-900 focus:outline-none focus:border-charcoal-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Design Notes & Requirements (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={designNotes}
                    onChange={(e) => setDesignNotes(e.target.value)}
                    placeholder="Any specific instructions regarding acoustics, lighting, or room flow..."
                    className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-xs text-charcoal-900 focus:outline-none focus:border-charcoal-900 resize-none"
                  />
                </div>

                <div className="p-3 rounded-sm bg-stone-pale border border-stone-accent/20 text-xs space-y-1">
                  <span className="font-semibold text-charcoal-800 text-[11px] block">
                    Estimated Turnkey Budget:
                  </span>
                  <span className="text-base font-bold text-terracotta">
                    ${calculateEstimatedTotal().toLocaleString()}
                  </span>
                  <span className="text-[10px] text-charcoal-700 block">
                    Based on {concept.defaultDimensions?.areaSqFt} sq ft and selected material grades.
                  </span>
                </div>

                <div className="flex justify-end space-x-3 pt-2 border-t border-stone-warm">
                  <button
                    type="button"
                    onClick={() => setSaveModalOpen(false)}
                    className="px-4 py-2 border border-stone-accent text-xs font-medium text-charcoal-700 hover:bg-stone-warm/50 rounded-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 rounded-sm text-xs font-semibold tracking-wider uppercase disabled:opacity-50"
                  >
                    {saving ? 'Saving to Database...' : 'Save Configuration'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

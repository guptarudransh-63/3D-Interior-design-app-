import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Search, Filter, ArrowRight, SlidersHorizontal, Sparkles } from 'lucide-react';

const ROOM_TYPES = ['All', 'Living Room', 'Bedroom', 'Kitchen', 'Dining Room', 'Home Office', 'Studio Apartment'];
const DESIGN_STYLES = ['All', 'Warm Minimalist', 'Japandi', 'Scandinavian', 'Modern Architectural', 'Mediterranean Contemporary', 'Industrial Loft'];

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedRoomType, setSelectedRoomType] = useState(searchParams.get('roomType') || 'All');
  const [selectedStyle, setSelectedStyle] = useState(searchParams.get('designStyle') || 'All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchConcepts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (selectedRoomType !== 'All') params.roomType = selectedRoomType;
        if (selectedStyle !== 'All') params.designStyle = selectedStyle;
        if (sortBy === 'budget-asc') params.sort = 'budget-asc';
        if (sortBy === 'budget-desc') params.sort = 'budget-desc';

        const res = await api.getRoomConcepts(params);
        if (res.success) {
          setConcepts(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch concepts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConcepts();
  }, [search, selectedRoomType, selectedStyle, sortBy]);

  const handleRoomTypeChange = (type) => {
    setSelectedRoomType(type);
    if (type === 'All') {
      searchParams.delete('roomType');
    } else {
      searchParams.set('roomType', type);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-warm pb-6">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-terracotta">
          Curated Catalog
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal-950 mt-1">
          Explore Room Concepts
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-700 mt-2 font-light max-w-2xl">
          Discover architectural concepts tailored across modern typologies. Select any concept to enter the interactive 3D studio, test material pairings, and save custom configurations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-ivory-50 p-4 rounded-md border border-stone-accent/30 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-charcoal-700 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts by name, style, or features..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-xs text-charcoal-900 placeholder-charcoal-700/50 focus:outline-none focus:border-charcoal-900"
            />
          </div>

          {/* Style Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-xs text-charcoal-900 focus:outline-none focus:border-charcoal-900"
            >
              <option value="All">All Design Styles</option>
              {DESIGN_STYLES.filter((s) => s !== 'All').map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-xs text-charcoal-900 focus:outline-none focus:border-charcoal-900"
            >
              <option value="newest">Recently Added</option>
              <option value="budget-asc">Budget: Low to High</option>
              <option value="budget-desc">Budget: High to Low</option>
            </select>
          </div>
        </div>

        {/* Room Type Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-[10px] uppercase font-semibold text-charcoal-700 tracking-wider shrink-0 mr-1">
            Room Type:
          </span>
          {ROOM_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleRoomTypeChange(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors ${
                selectedRoomType === type
                  ? 'bg-charcoal-900 text-ivory-100'
                  : 'bg-stone-warm/50 text-charcoal-700 hover:bg-stone-warm'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Results */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-charcoal-900 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-charcoal-700">Loading architectural room concepts...</p>
        </div>
      ) : concepts.length === 0 ? (
        <div className="py-20 text-center bg-ivory-50 rounded-md border border-dashed border-stone-accent/60 p-8">
          <SlidersHorizontal className="w-8 h-8 text-charcoal-700 mx-auto mb-2" />
          <h3 className="font-editorial text-lg font-medium text-charcoal-900">
            No matching room concepts found
          </h3>
          <p className="text-xs text-charcoal-700 mt-1">
            Try adjusting your search query or relaxing your room type and design style filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedRoomType('All');
              setSelectedStyle('All');
            }}
            className="mt-4 px-4 py-2 bg-charcoal-900 text-ivory-100 rounded-sm text-xs font-medium"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {concepts.map((concept) => (
            <div
              key={concept._id}
              className="group rounded-md overflow-hidden bg-ivory-50 border border-stone-accent/30 shadow-2xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-64 overflow-hidden bg-charcoal-900">
                <img
                  src={concept.coverImage}
                  alt={concept.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-xs bg-ivory-50/95 backdrop-blur-md text-[10px] font-semibold tracking-wider uppercase text-charcoal-900 shadow-xs">
                    {concept.roomType}
                  </span>
                  <span className="px-2 py-1 rounded-xs bg-charcoal-900/80 backdrop-blur-md text-[10px] font-medium text-ivory-100 shadow-xs">
                    {concept.designStyle}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-editorial text-xl font-semibold text-charcoal-900 group-hover:text-terracotta transition-colors">
                    {concept.name}
                  </h3>
                  <p className="text-xs text-charcoal-700 mt-2 line-clamp-3 leading-relaxed">
                    {concept.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-warm flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-charcoal-700 block uppercase">Estimated Budget</span>
                    <span className="font-semibold text-charcoal-900">
                      ${concept.budgetRange?.min?.toLocaleString()} – ${concept.budgetRange?.max?.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={`/concept/${concept.slug}`}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-charcoal-900 text-ivory-100 hover:bg-terracotta rounded-xs text-xs font-medium transition-colors"
                  >
                    <span>Open 3D Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

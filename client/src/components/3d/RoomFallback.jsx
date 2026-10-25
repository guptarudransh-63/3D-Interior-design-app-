import React from 'react';
import { Box, Layers, AlertCircle, Sparkles } from 'lucide-react';

export const RoomFallback = ({
  roomConcept = {},
  selectedMaterials = {},
  fallbackImage = '',
  onSwitchTo3D = () => {},
  hasWebGLError = false,
}) => {
  const displayImage =
    fallbackImage ||
    roomConcept?.coverImage ||
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="relative w-full h-[520px] lg:h-[620px] rounded-lg overflow-hidden bg-charcoal-900 border border-stone-accent/30 shadow-inner group">
      {/* High-Resolution Room Photograph */}
      <img
        src={displayImage}
        alt={roomConcept?.name || 'Room Concept'}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-charcoal-950/30" />

      {/* Switch to 3D Button (if WebGL is supported) */}
      {!hasWebGLError && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onSwitchTo3D}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-ivory-50/90 backdrop-blur-md rounded-md border border-stone-accent/40 shadow-sm text-xs font-medium text-charcoal-800 hover:bg-stone-warm transition-colors"
          >
            <Box className="w-3.5 h-3.5 text-terracotta" />
            <span>Switch to Interactive 3D Room</span>
          </button>
        </div>
      )}

      {/* WebGL notice if unavailable */}
      {hasWebGLError && (
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 px-3 py-1.5 bg-amber-500/90 text-charcoal-950 rounded-md text-xs font-medium shadow-sm">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>WebGL Acceleration Disabled — Displaying Editorial Photograph</span>
        </div>
      )}

      {/* Active Material Overlay Card */}
      <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 p-5 rounded-md bg-ivory-50/95 backdrop-blur-md border border-stone-accent/30 shadow-lg">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta">
              Editorial Showcase
            </span>
            <span className="text-charcoal-700">•</span>
            <span className="text-xs text-charcoal-700">{roomConcept?.designStyle || 'Warm Minimalist'}</span>
          </div>
          <h3 className="font-editorial text-xl font-bold text-charcoal-900">
            {roomConcept?.name || 'Architectural Concept'}
          </h3>
          <p className="text-xs text-charcoal-700 mt-1 max-w-lg line-clamp-2">
            {roomConcept?.description}
          </p>
        </div>

        {/* Selected Swatches Preview */}
        <div className="flex items-center space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-warm">
          {Object.entries(selectedMaterials).map(([key, mat]) => {
            if (!mat) return null;
            return (
              <div
                key={key}
                className="flex flex-col items-center group/swatch"
                title={`${key}: ${mat.name}`}
              >
                <div
                  className="w-7 h-7 rounded-full border-2 border-ivory-50 shadow-sm transition-transform group-hover/swatch:scale-110"
                  style={{ backgroundColor: mat.hexCode }}
                />
                <span className="text-[9px] capitalize text-charcoal-700 mt-1 truncate max-w-[45px]">
                  {key}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

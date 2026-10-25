import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { ArchitecturalRoomScene } from './ArchitecturalRoomScene';
import { RoomFallback } from './RoomFallback';
import { Eye, RotateCcw, Box, Compass, Layers, AlertCircle } from 'lucide-react';

const CAMERA_PRESETS = {
  perspective: {
    label: 'Hero View',
    position: [6.5, 4.2, 7.8],
    target: [0, 1.1, 0],
  },
  isometric: {
    label: 'Isometric',
    position: [8.5, 7.5, 8.5],
    target: [0, 0.8, 0],
  },
  floorplan: {
    label: 'Top-Down Plan',
    position: [0.1, 10.5, 0.1],
    target: [0, 0, 0],
  },
  detail: {
    label: 'Furniture Detail',
    position: [2.8, 2.0, 3.2],
    target: [0.5, 0.9, 1.2],
  },
};

// Helper controller inside canvas to smoothly animate camera to preset positions
const CameraRig = ({ activePreset }) => {
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current && activePreset) {
      const preset = CAMERA_PRESETS[activePreset] || CAMERA_PRESETS.perspective;
      controlsRef.current.object.position.set(...preset.position);
      controlsRef.current.target.set(...preset.target);
      controlsRef.current.update();
    }
  }, [activePreset]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      minDistance={3.5}
      maxDistance={14.0}
      maxPolarAngle={Math.PI / 2.05} // Restrict camera from going below floor
      target={[0, 1.1, 0]}
    />
  );
};

export const RoomCanvas = ({
  selectedMaterials = {},
  sceneConfig = {},
  roomConcept = {},
  fallbackImage = '',
  className = '',
}) => {
  const [activePreset, setActivePreset] = useState('perspective');
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const [webGLError, setWebGLError] = useState(false);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLError(true);
        setUseFallbackMode(true);
      }
    } catch (e) {
      setWebGLError(true);
      setUseFallbackMode(true);
    }
  }, []);

  if (useFallbackMode) {
    return (
      <RoomFallback
        roomConcept={roomConcept}
        selectedMaterials={selectedMaterials}
        fallbackImage={fallbackImage || roomConcept?.coverImage}
        onSwitchTo3D={() => setUseFallbackMode(false)}
        hasWebGLError={webGLError}
      />
    );
  }

  return (
    <div className={`relative w-full h-[520px] lg:h-[620px] rounded-lg overflow-hidden bg-[#EAE4D9] border border-stone-accent/30 shadow-inner group ${className}`}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [6.5, 4.2, 7.8], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        className="cursor-grab active:cursor-grabbing w-full h-full"
      >
        <CameraRig activePreset={activePreset} />
        <ArchitecturalRoomScene
          selectedMaterials={selectedMaterials}
          sceneConfig={sceneConfig || roomConcept?.sceneConfig}
        />
      </Canvas>

      {/* Floating View Control Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-1.5 p-1.5 bg-ivory-50/90 backdrop-blur-md rounded-md border border-stone-accent/40 shadow-sm text-xs">
        <span className="px-2 py-1 text-[10px] font-semibold tracking-wider text-charcoal-700 uppercase">
          Camera Views:
        </span>
        {Object.entries(CAMERA_PRESETS).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActivePreset(key)}
            className={`px-2.5 py-1 rounded transition-colors font-medium ${
              activePreset === key
                ? 'bg-charcoal-900 text-ivory-100 shadow-2xs'
                : 'text-charcoal-800 hover:bg-stone-warm/60'
            }`}
          >
            {config.label}
          </button>
        ))}

        <div className="w-px h-4 bg-stone-warm mx-1" />

        <button
          onClick={() => setActivePreset('perspective')}
          className="p-1 rounded text-charcoal-700 hover:text-charcoal-900 hover:bg-stone-warm/60 transition-colors"
          title="Reset Camera"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mode Switcher Button (3D vs 2D Render) */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setUseFallbackMode(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-ivory-50/90 backdrop-blur-md rounded-md border border-stone-accent/40 shadow-sm text-xs font-medium text-charcoal-800 hover:bg-stone-warm/80 transition-colors"
          title="Switch to high-resolution 2D photography view"
        >
          <Layers className="w-3.5 h-3.5 text-terracotta" />
          <span>2D Render View</span>
        </button>
      </div>

      {/* Live Active Material Legend Indicator */}
      <div className="absolute bottom-4 left-4 z-10 p-3 bg-ivory-50/90 backdrop-blur-md rounded-md border border-stone-accent/40 shadow-sm text-xs max-w-sm hidden sm:block">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-Time Applied Finishes</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-charcoal-800">
          <div className="flex items-center space-x-1.5 truncate">
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: selectedMaterials.flooring?.hexCode || '#D6C3A5' }}
            />
            <span className="truncate">Floor: {selectedMaterials.flooring?.name?.split(' ')[0] || 'Oak'}</span>
          </div>
          <div className="flex items-center space-x-1.5 truncate">
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: selectedMaterials.walls?.hexCode || '#F5F2EB' }}
            />
            <span className="truncate">Walls: {selectedMaterials.walls?.name?.split(' ')[0] || 'Alabaster'}</span>
          </div>
          <div className="flex items-center space-x-1.5 truncate">
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: selectedMaterials.cabinetry?.hexCode || '#4A3425' }}
            />
            <span className="truncate">Joinery: {selectedMaterials.cabinetry?.name?.split(' ')[0] || 'Walnut'}</span>
          </div>
          <div className="flex items-center space-x-1.5 truncate">
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: selectedMaterials.accent?.hexCode || '#B8654D' }}
            />
            <span className="truncate">Accent: {selectedMaterials.accent?.name?.split(' ')[0] || 'Clay'}</span>
          </div>
        </div>
      </div>

      {/* Orbit Tip Hint */}
      <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1 bg-charcoal-900/70 text-ivory-100 backdrop-blur-sm rounded text-[10px] pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};

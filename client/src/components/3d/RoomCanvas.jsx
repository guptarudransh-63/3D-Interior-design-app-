import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { ArchitecturalRoomScene } from './ArchitecturalRoomScene';
import { RoomFallback } from './RoomFallback';
import { RotateCcw, Layers } from 'lucide-react';

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
    label: 'Top-Down',
    position: [0.1, 10.5, 0.1],
    target: [0, 0, 0],
  },
  detail: {
    label: 'Detail',
    position: [3.2, 2.2, 3.2],
    target: [0, 1.0, 0.2],
  },
};

const AVAILABLE_ROOM_AREAS = [
  { id: 'Living Room', label: 'Living / Hall', icon: '🛋️' },
  { id: 'Bedroom', label: 'Bedroom', icon: '🛏️' },
  { id: 'Kitchen', label: 'Kitchen', icon: '🍳' },
  { id: 'Dining Room', label: 'Dining', icon: '🍽️' },
  { id: 'Home Office', label: 'Office', icon: '💼' },
];

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
      minDistance={3.2}
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
  roomType = '',
  onRoomTypeChange,
  fallbackImage = '',
  className = '',
}) => {
  const [activePreset, setActivePreset] = useState('perspective');
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const [webGLError, setWebGLError] = useState(false);

  // Initialize room type from props or concept
  const initialRoom = roomType || roomConcept?.roomType || 'Living Room';
  const [currentRoomType, setCurrentRoomType] = useState(initialRoom);

  // Sync if roomConcept or roomType changes
  useEffect(() => {
    if (roomType) {
      setCurrentRoomType(roomType);
    } else if (roomConcept?.roomType) {
      setCurrentRoomType(roomConcept.roomType);
    }
  }, [roomType, roomConcept?.roomType]);

  const handleSelectRoomArea = (newRoom) => {
    setCurrentRoomType(newRoom);
    if (onRoomTypeChange) {
      onRoomTypeChange(newRoom);
    }
  };

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
          roomType={currentRoomType}
        />
      </Canvas>

      {/* TOP HEADER CONTROLS BAR: Room Selector (Left) & 2D Render Toggle (Right) */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
        {/* Left: Room Area Selector Pills */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 bg-ivory-50/95 backdrop-blur-md rounded-md border border-stone-accent/40 shadow-sm text-xs overflow-x-auto max-w-[calc(100%-140px)]">
          <span className="px-2 py-1 text-[10px] font-bold tracking-wider text-charcoal-700 uppercase shrink-0">
            Room:
          </span>
          {AVAILABLE_ROOM_AREAS.map((area) => {
            const isActive =
              currentRoomType.toLowerCase() === area.id.toLowerCase() ||
              (area.id === 'Living Room' &&
                (currentRoomType.toLowerCase().includes('living') ||
                  currentRoomType.toLowerCase().includes('hall') ||
                  currentRoomType.toLowerCase().includes('salon')));

            return (
              <button
                key={area.id}
                onClick={() => handleSelectRoomArea(area.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-charcoal-900 text-ivory-100 shadow-2xs font-semibold'
                    : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-stone-warm/50'
                }`}
              >
                <span>{area.icon}</span>
                <span>{area.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Mode Switcher Button (3D vs 2D Render) */}
        <div className="pointer-events-auto shrink-0">
          <button
            onClick={() => setUseFallbackMode(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-ivory-50/95 backdrop-blur-md rounded-md border border-stone-accent/40 shadow-sm text-xs font-medium text-charcoal-800 hover:bg-stone-warm/80 transition-colors whitespace-nowrap"
            title="Switch to high-resolution 2D photography view"
          >
            <Layers className="w-3.5 h-3.5 text-terracotta shrink-0" />
            <span className="hidden sm:inline">2D Render View</span>
            <span className="sm:hidden">2D</span>
          </button>
        </div>
      </div>

      {/* BOTTOM CONTROLS BAR: Live Finishes Legend (Left) & Camera Views (Right) */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 pointer-events-none">
        {/* Bottom Left: Live Active Material Legend Indicator */}
        <div className="pointer-events-auto p-2.5 bg-ivory-50/95 backdrop-blur-md rounded-md border border-stone-accent/40 shadow-sm text-xs max-w-sm hidden md:block">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active Finishes</span>
            </div>
            <span className="text-[10px] text-terracotta font-medium truncate">
              {currentRoomType}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-charcoal-800">
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

        {/* Bottom Right: Camera Views Toolbar */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 bg-ivory-50/95 backdrop-blur-md rounded-md border border-stone-accent/40 shadow-sm text-xs self-end">
          <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-charcoal-700 uppercase shrink-0">
            Camera:
          </span>
          {Object.entries(CAMERA_PRESETS).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActivePreset(key)}
              className={`px-2 py-1 rounded transition-colors font-medium text-[11px] whitespace-nowrap ${
                activePreset === key
                  ? 'bg-charcoal-900 text-ivory-100 shadow-2xs font-semibold'
                  : 'text-charcoal-800 hover:bg-stone-warm/60'
              }`}
            >
              {config.label}
            </button>
          ))}

          <div className="w-px h-3.5 bg-stone-warm mx-0.5" />

          <button
            onClick={() => setActivePreset('perspective')}
            className="p-1 rounded text-charcoal-700 hover:text-charcoal-900 hover:bg-stone-warm/60 transition-colors"
            title="Reset Camera View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

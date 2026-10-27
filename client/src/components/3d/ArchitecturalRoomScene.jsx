import React, { useMemo } from 'react';
import * as THREE from 'three';
import { LivingRoomScene3D } from './rooms/LivingRoomScene3D';
import { BedroomScene3D } from './rooms/BedroomScene3D';
import { KitchenScene3D } from './rooms/KitchenScene3D';
import { DiningRoomScene3D } from './rooms/DiningRoomScene3D';
import { HomeOfficeScene3D } from './rooms/HomeOfficeScene3D';
import { StudioApartmentScene3D } from './rooms/StudioApartmentScene3D';

export const ArchitecturalRoomScene = ({
  selectedMaterials = {},
  sceneConfig = {},
  roomType = 'Living Room',
}) => {
  // Normalize roomType for accurate scene dispatch
  const normalizedRoomType = useMemo(() => {
    const t = (roomType || '').toLowerCase();
    if (t.includes('studio') || t.includes('apartment') || t.includes('loft')) return 'studio';
    if (t.includes('bed')) return 'bedroom';
    if (t.includes('kitch')) return 'kitchen';
    if (t.includes('din')) return 'dining';
    if (t.includes('office') || t.includes('study')) return 'office';
    return 'living'; // default to living room / hall / salon
  }, [roomType]);

  // Material parameter resolvers based on selectedMaterials or fallback defaults
  const floorConfig = useMemo(() => {
    const mat = selectedMaterials.flooring;
    return {
      color: mat?.hexCode || '#D6C3A5',
      roughness: mat?.roughness ?? 0.55,
      metalness: mat?.metalness ?? 0.05,
    };
  }, [selectedMaterials.flooring]);

  const wallConfig = useMemo(() => {
    const mat = selectedMaterials.walls;
    return {
      color: mat?.hexCode || '#F5F2EB',
      roughness: mat?.roughness ?? 0.85,
      metalness: mat?.metalness ?? 0.0,
    };
  }, [selectedMaterials.walls]);

  const cabinetryConfig = useMemo(() => {
    const mat = selectedMaterials.cabinetry;
    return {
      color: mat?.hexCode || '#4A3425',
      roughness: mat?.roughness ?? 0.45,
      metalness: mat?.metalness ?? 0.08,
    };
  }, [selectedMaterials.cabinetry]);

  const accentConfig = useMemo(() => {
    const mat = selectedMaterials.accent;
    return {
      color: mat?.hexCode || '#B8654D',
      roughness: mat?.roughness ?? 0.8,
      metalness: mat?.metalness ?? 0.05,
    };
  }, [selectedMaterials.accent]);

  return (
    <group position={[0, -1, 0]}>
      {/* Dynamic Dedicated Room Sub-Scene */}
      {normalizedRoomType === 'bedroom' && (
        <BedroomScene3D
          floorConfig={floorConfig}
          wallConfig={wallConfig}
          cabinetryConfig={cabinetryConfig}
          accentConfig={accentConfig}
        />
      )}

      {normalizedRoomType === 'kitchen' && (
        <KitchenScene3D
          floorConfig={floorConfig}
          wallConfig={wallConfig}
          cabinetryConfig={cabinetryConfig}
          accentConfig={accentConfig}
        />
      )}

      {normalizedRoomType === 'dining' && (
        <DiningRoomScene3D
          floorConfig={floorConfig}
          wallConfig={wallConfig}
          cabinetryConfig={cabinetryConfig}
          accentConfig={accentConfig}
        />
      )}

      {normalizedRoomType === 'office' && (
        <HomeOfficeScene3D
          floorConfig={floorConfig}
          wallConfig={wallConfig}
          cabinetryConfig={cabinetryConfig}
          accentConfig={accentConfig}
        />
      )}

      {normalizedRoomType === 'studio' && (
        <StudioApartmentScene3D
          floorConfig={floorConfig}
          wallConfig={wallConfig}
          cabinetryConfig={cabinetryConfig}
          accentConfig={accentConfig}
        />
      )}

      {normalizedRoomType === 'living' && (
        <LivingRoomScene3D
          floorConfig={floorConfig}
          wallConfig={wallConfig}
          cabinetryConfig={cabinetryConfig}
          accentConfig={accentConfig}
        />
      )}

      {/* SHARED ARCHITECTURAL LIGHTING SYSTEM */}
      <ambientLight color={sceneConfig.lightingWarmth || '#FFF6E8'} intensity={0.75} />

      {/* Sun / Exterior Window Directional Light with soft shadows */}
      <directionalLight
        castShadow
        position={[-8, 6, 4]}
        intensity={1.8}
        color="#FFF9ED"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0005}
      />

      {/* Ceiling Warm Spotlight focused onto central activity area */}
      <spotLight
        position={[0, 4.8, 0.2]}
        target-position={[0, 0, 0.2]}
        intensity={18}
        color="#FFEED6"
        angle={Math.PI / 4}
        penumbra={0.6}
        castShadow
      />
    </group>
  );
};

import React from 'react';
import * as THREE from 'three';

export const BedroomScene3D = ({
  floorConfig,
  wallConfig,
  cabinetryConfig,
  accentConfig,
}) => {
  return (
    <group>
      {/* 1. ROOM SHELL */}

      {/* Main Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial
          color={floorConfig.color}
          roughness={floorConfig.roughness}
          metalness={floorConfig.metalness}
        />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#FAF8F5" roughness={0.9} />
      </mesh>

      {/* Back Wall */}
      <mesh receiveShadow position={[0, 2.5, -6]}>
        <boxGeometry args={[14, 5, 0.4]} />
        <meshStandardMaterial
          color={wallConfig.color}
          roughness={wallConfig.roughness}
          metalness={wallConfig.metalness}
        />
      </mesh>

      {/* Architectural Bed Feature Wall Plinth / Backing Panel */}
      <mesh receiveShadow position={[0, 2.5, -5.75]}>
        <boxGeometry args={[8.5, 4.8, 0.08]} />
        <meshStandardMaterial
          color={wallConfig.color}
          roughness={Math.min(1.0, wallConfig.roughness + 0.1)}
          metalness={wallConfig.metalness}
        />
      </mesh>

      {/* Left Wall with Floor-to-Ceiling Balcony Glazing */}
      <group position={[-6, 2.5, 0]}>
        <mesh receiveShadow position={[0, 0, -4.5]}>
          <boxGeometry args={[0.4, 5, 3]} />
          <meshStandardMaterial color={wallConfig.color} roughness={wallConfig.roughness} />
        </mesh>
        <mesh receiveShadow position={[0, 0, 4.5]}>
          <boxGeometry args={[0.4, 5, 3]} />
          <meshStandardMaterial color={wallConfig.color} roughness={wallConfig.roughness} />
        </mesh>
        <mesh receiveShadow position={[0, 4.2, 0]}>
          <boxGeometry args={[0.4, 1.6, 6]} />
          <meshStandardMaterial color={wallConfig.color} roughness={wallConfig.roughness} />
        </mesh>

        {/* Window Glass Pane */}
        <mesh position={[0, 1.7, 0]}>
          <boxGeometry args={[0.08, 3.4, 5.8]} />
          <meshPhysicalMaterial
            transmission={0.92}
            opacity={1}
            transparent
            roughness={0.05}
            ior={1.5}
            color="#EBF4F6"
          />
        </mesh>

        {/* Sleek Dark Mullions */}
        <mesh position={[0, 1.7, 0]}>
          <boxGeometry args={[0.12, 3.4, 0.08]} />
          <meshStandardMaterial color="#1C1917" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.7, -1.9]}>
          <boxGeometry args={[0.12, 3.4, 0.08]} />
          <meshStandardMaterial color="#1C1917" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.7, 1.9]}>
          <boxGeometry args={[0.12, 3.4, 0.08]} />
          <meshStandardMaterial color="#1C1917" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* Baseboard */}
      <mesh position={[0, 0.1, -5.78]}>
        <boxGeometry args={[13.9, 0.2, 0.05]} />
        <meshStandardMaterial color="#EAE3D5" roughness={0.7} />
      </mesh>

      {/* 2. BEDROOM FURNITURE */}

      {/* Plush Woven Bedroom Area Rug */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -1.2]}>
        <planeGeometry args={[8.5, 7.5]} />
        <meshStandardMaterial color="#E8E2D6" roughness={0.98} />
      </mesh>

      {/* KING PLATFORM BED ASSEMBLY */}
      <group position={[0, 0, -2.2]}>
        {/* Low Profile Bed Plinth Platform (Reacts to Cabinetry!) */}
        <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
          <boxGeometry args={[4.4, 0.36, 4.8]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>

        {/* Architectural Low Headboard Support Board (Reacts to Cabinetry) */}
        <mesh castShadow receiveShadow position={[0, 1.1, -2.35]}>
          <boxGeometry args={[6.8, 1.9, 0.16]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>

        {/* Upholstered Headboard Center Cushion */}
        <mesh castShadow receiveShadow position={[0, 1.15, -2.22]}>
          <boxGeometry args={[4.0, 1.4, 0.14]} />
          <meshStandardMaterial color="#F2EFE8" roughness={0.9} />
        </mesh>

        {/* Thick Mattress */}
        <mesh castShadow receiveShadow position={[0, 0.55, 0.05]}>
          <boxGeometry args={[3.8, 0.45, 4.4]} />
          <meshStandardMaterial color="#FDFBF7" roughness={0.85} />
        </mesh>

        {/* Luxurious Duvet / Comforter */}
        <mesh castShadow receiveShadow position={[0, 0.72, 0.35]}>
          <boxGeometry args={[3.86, 0.2, 3.6]} />
          <meshStandardMaterial color="#F5F1E8" roughness={0.95} />
        </mesh>

        {/* Folded Accent Throw Blanket at foot of bed (Reacts to Accent!) */}
        <mesh castShadow receiveShadow position={[0, 0.82, 1.5]}>
          <boxGeometry args={[3.9, 0.08, 1.2]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
            metalness={accentConfig.metalness}
          />
        </mesh>

        {/* Sleeping Pillows - Left Row */}
        <mesh castShadow position={[-1.0, 0.88, -1.65]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[1.2, 0.24, 0.7]} />
          <meshStandardMaterial color="#FAF8F5" roughness={0.9} />
        </mesh>
        {/* Sleeping Pillows - Right Row */}
        <mesh castShadow position={[1.0, 0.88, -1.65]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[1.2, 0.24, 0.7]} />
          <meshStandardMaterial color="#FAF8F5" roughness={0.9} />
        </mesh>

        {/* Decorative Front Accent Pillows (Reacts to Accent!) */}
        <mesh castShadow position={[-0.85, 0.95, -1.35]} rotation={[-0.35, 0.1, 0]}>
          <boxGeometry args={[0.8, 0.35, 0.2]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
            metalness={accentConfig.metalness}
          />
        </mesh>
        <mesh castShadow position={[0.85, 0.95, -1.35]} rotation={[-0.35, -0.1, 0]}>
          <boxGeometry args={[0.8, 0.35, 0.2]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
            metalness={accentConfig.metalness}
          />
        </mesh>
      </group>

      {/* FLOATING NIGHTSTANDS */}

      {/* Left Nightstand (Reacts to Cabinetry!) */}
      <group position={[-2.7, 0, -4.3]}>
        <mesh castShadow receiveShadow position={[0, 0.65, 0]}>
          <boxGeometry args={[1.0, 0.35, 0.7]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>
        {/* Drawer Face Detail Line */}
        <mesh position={[0, 0.65, 0.36]}>
          <boxGeometry args={[0.9, 0.25, 0.02]} />
          <meshStandardMaterial color="#1C1917" roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Carafe & Glass */}
        <mesh castShadow position={[0.1, 0.92, -0.05]}>
          <cylinderGeometry args={[0.07, 0.09, 0.22, 16]} />
          <meshPhysicalMaterial transmission={0.9} roughness={0.1} ior={1.5} color="#EBF4F6" />
        </mesh>
      </group>

      {/* Right Nightstand (Reacts to Cabinetry!) */}
      <group position={[2.7, 0, -4.3]}>
        <mesh castShadow receiveShadow position={[0, 0.65, 0]}>
          <boxGeometry args={[1.0, 0.35, 0.7]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>
        {/* Drawer Face Detail Line */}
        <mesh position={[0, 0.65, 0.36]}>
          <boxGeometry args={[0.9, 0.25, 0.02]} />
          <meshStandardMaterial color="#1C1917" roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Books on Nightstand */}
        <mesh castShadow position={[-0.05, 0.88, 0]}>
          <boxGeometry args={[0.45, 0.08, 0.35]} />
          <meshStandardMaterial color="#2E241E" roughness={0.7} />
        </mesh>
      </group>

      {/* TWIN BEDSIDE PENDANT SCONCES */}

      {/* Left Bedside Pendant */}
      <group position={[-2.7, 0, -4.3]}>
        {/* Cord */}
        <mesh position={[0, 3.2, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 3.4, 8]} />
          <meshStandardMaterial color="#1C1917" roughness={0.3} />
        </mesh>
        {/* Brass Fitting */}
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.12, 16]} />
          <meshStandardMaterial color="#C5A059" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Glowing Opal Glass Sphere */}
        <mesh position={[0, 1.45, 0]}>
          <sphereGeometry args={[0.15, 24, 24]} />
          <meshStandardMaterial
            color="#FFF4DD"
            emissive="#FFE0A0"
            emissiveIntensity={1.8}
            roughness={0.2}
          />
        </mesh>
        <pointLight position={[0, 1.45, 0]} color="#FFE6B8" intensity={12} distance={4.5} />
      </group>

      {/* Right Bedside Pendant */}
      <group position={[2.7, 0, -4.3]}>
        <mesh position={[0, 3.2, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 3.4, 8]} />
          <meshStandardMaterial color="#1C1917" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.12, 16]} />
          <meshStandardMaterial color="#C5A059" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.45, 0]}>
          <sphereGeometry args={[0.15, 24, 24]} />
          <meshStandardMaterial
            color="#FFF4DD"
            emissive="#FFE0A0"
            emissiveIntensity={1.8}
            roughness={0.2}
          />
        </mesh>
        <pointLight position={[0, 1.45, 0]} color="#FFE6B8" intensity={12} distance={4.5} />
      </group>

      {/* END-OF-BED UPHOLSTERED BENCH (Reacts to Accent!) */}
      <group position={[0, 0, 1.1]}>
        {/* Upholstered Cushion Top */}
        <mesh castShadow receiveShadow position={[0, 0.42, 0]}>
          <boxGeometry args={[3.2, 0.22, 0.9]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
            metalness={accentConfig.metalness}
          />
        </mesh>
        {/* Metal Frame Legs */}
        <mesh position={[-1.4, 0.18, -0.32]}>
          <cylinderGeometry args={[0.025, 0.025, 0.38, 12]} />
          <meshStandardMaterial color="#1C1917" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[1.4, 0.18, -0.32]}>
          <cylinderGeometry args={[0.025, 0.025, 0.38, 12]} />
          <meshStandardMaterial color="#1C1917" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[-1.4, 0.18, 0.32]}>
          <cylinderGeometry args={[0.025, 0.025, 0.38, 12]} />
          <meshStandardMaterial color="#1C1917" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[1.4, 0.18, 0.32]}>
          <cylinderGeometry args={[0.025, 0.025, 0.38, 12]} />
          <meshStandardMaterial color="#1C1917" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* FULL-HEIGHT FLUTED WARDROBE ON RIGHT WALL (Reacts to Cabinetry!) */}
      <group position={[5.6, 0, -1.0]}>
        {/* Main Wardrobe Body */}
        <mesh castShadow receiveShadow position={[0, 2.3, 0]}>
          <boxGeometry args={[1.2, 4.6, 5.2]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>

        {/* Minimalist Brass Handle Extrusions */}
        <mesh position={[-0.62, 2.1, -0.8]}>
          <boxGeometry args={[0.04, 0.9, 0.03]} />
          <meshStandardMaterial color="#C5A059" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-0.62, 2.1, 0.8]}>
          <boxGeometry args={[0.04, 0.9, 0.03]} />
          <meshStandardMaterial color="#C5A059" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* MINIMALIST ARCHITECTURAL BEDROOM ART */}
      <group position={[0, 3.6, -5.7]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.2, 1.4, 0.05]} />
          <meshStandardMaterial color="#2B2824" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[3.0, 1.2]} />
          <meshStandardMaterial color="#EAE5DB" roughness={0.9} />
        </mesh>
        {/* Soft Tonal Watercolor Wash */}
        <mesh position={[0.4, 0, 0.04]}>
          <planeGeometry args={[1.4, 0.9]} />
          <meshStandardMaterial
            color={accentConfig.color}
            opacity={0.6}
            transparent
            roughness={0.8}
          />
        </mesh>
      </group>
    </group>
  );
};

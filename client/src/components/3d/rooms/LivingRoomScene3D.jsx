import React from 'react';
import * as THREE from 'three';

export const LivingRoomScene3D = ({
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

      {/* Left Wall with Architectural Window Aperture */}
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

        {/* Minimalist Black Steel Mullions */}
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

      {/* Baseboards */}
      <mesh position={[0, 0.1, -5.78]}>
        <boxGeometry args={[13.9, 0.2, 0.05]} />
        <meshStandardMaterial color="#EAE3D5" roughness={0.7} />
      </mesh>

      {/* 2. LIVING ROOM FURNITURE */}

      {/* Woven Area Rug */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0.5]}>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color="#EDE7DB" roughness={0.95} />
      </mesh>

      {/* Modern Curved Low Sectional Sofa */}
      <group position={[0, 0, 0.5]}>
        {/* Main Base Seat */}
        <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
          <boxGeometry args={[4.2, 0.5, 1.6]} />
          <meshStandardMaterial color="#E6E0D5" roughness={0.85} />
        </mesh>
        {/* Soft Backrest */}
        <mesh castShadow receiveShadow position={[0, 0.8, -0.6]}>
          <boxGeometry args={[4.2, 0.6, 0.4]} />
          <meshStandardMaterial color="#E6E0D5" roughness={0.85} />
        </mesh>
        {/* Left Armrest */}
        <mesh castShadow receiveShadow position={[-2.1, 0.65, 0]}>
          <boxGeometry args={[0.4, 0.5, 1.6]} />
          <meshStandardMaterial color="#E6E0D5" roughness={0.85} />
        </mesh>
        {/* Right Armrest */}
        <mesh castShadow receiveShadow position={[2.1, 0.65, 0]}>
          <boxGeometry args={[0.4, 0.5, 1.6]} />
          <meshStandardMaterial color="#E6E0D5" roughness={0.85} />
        </mesh>

        {/* Accent Cushions */}
        <mesh castShadow position={[-1.2, 0.75, -0.3]} rotation={[0.1, 0.2, 0]}>
          <boxGeometry args={[0.7, 0.5, 0.2]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
            metalness={accentConfig.metalness}
          />
        </mesh>
        <mesh castShadow position={[1.2, 0.75, -0.3]} rotation={[0.1, -0.2, 0]}>
          <boxGeometry args={[0.7, 0.5, 0.2]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
            metalness={accentConfig.metalness}
          />
        </mesh>
      </group>

      {/* Sculptural Organic Coffee Table */}
      <group position={[0, 0, 2.3]}>
        <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
          <cylinderGeometry args={[1.1, 1.1, 0.08, 32]} />
          <meshStandardMaterial color="#F0EBE1" roughness={0.3} metalness={0.05} />
        </mesh>
        <mesh castShadow position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.55, 0.6, 0.34, 32]} />
          <meshStandardMaterial color="#DED6C7" roughness={0.4} />
        </mesh>

        {/* Decorative Ceramic Bowl */}
        <mesh castShadow position={[0.2, 0.44, 0.1]}>
          <cylinderGeometry args={[0.22, 0.12, 0.1, 16]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
          />
        </mesh>
      </group>

      {/* Architectural Fluted Credenza / Joinery */}
      <group position={[0, 0, -5.2]}>
        <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
          <boxGeometry args={[6.4, 1.0, 0.8]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>
        {/* Recessed Metal Support Plinth / Legs */}
        <mesh position={[-2.6, 0.1, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.2, 16]} />
          <meshStandardMaterial color="#1C1917" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[2.6, 0.1, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.2, 16]} />
          <meshStandardMaterial color="#1C1917" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.2, 16]} />
          <meshStandardMaterial color="#1C1917" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Sculptural Vase */}
        <mesh castShadow position={[2.2, 1.45, 0]}>
          <cylinderGeometry args={[0.18, 0.25, 0.5, 24]} />
          <meshStandardMaterial color="#F4EFE6" roughness={0.3} />
        </mesh>
        {/* Design Books */}
        <mesh castShadow position={[-1.8, 1.25, 0]}>
          <boxGeometry args={[0.7, 0.1, 0.5]} />
          <meshStandardMaterial color="#2B2824" roughness={0.7} />
        </mesh>
      </group>

      {/* Large Framed Architectural Canvas Art */}
      <group position={[0, 3.1, -5.75]}>
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[4.2, 2.2, 0.06]} />
          <meshStandardMaterial color="#2D2822" roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[4.0, 2.0]} />
          <meshStandardMaterial color="#EAE4D8" roughness={0.9} />
        </mesh>
        <mesh position={[-0.8, 0, 0.05]}>
          <planeGeometry args={[1.8, 1.5]} />
          <meshStandardMaterial color={accentConfig.color} roughness={0.8} opacity={0.75} transparent />
        </mesh>
      </group>

      {/* Accent Lounge Chair */}
      <group position={[3.2, 0, 1.4]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.38, 0]}>
          <boxGeometry args={[1.1, 0.25, 1.1]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
            metalness={accentConfig.metalness}
          />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.8, -0.45]}>
          <boxGeometry args={[1.1, 0.65, 0.2]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
            metalness={accentConfig.metalness}
          />
        </mesh>
        <mesh position={[-0.45, 0.18, -0.4]}>
          <cylinderGeometry args={[0.03, 0.025, 0.36, 12]} />
          <meshStandardMaterial color="#1C1917" roughness={0.5} />
        </mesh>
        <mesh position={[0.45, 0.18, -0.4]}>
          <cylinderGeometry args={[0.03, 0.025, 0.36, 12]} />
          <meshStandardMaterial color="#1C1917" roughness={0.5} />
        </mesh>
        <mesh position={[-0.45, 0.18, 0.4]}>
          <cylinderGeometry args={[0.03, 0.025, 0.36, 12]} />
          <meshStandardMaterial color="#1C1917" roughness={0.5} />
        </mesh>
        <mesh position={[0.45, 0.18, 0.4]}>
          <cylinderGeometry args={[0.03, 0.025, 0.36, 12]} />
          <meshStandardMaterial color="#1C1917" roughness={0.5} />
        </mesh>
      </group>

      {/* Potted Olive Plant in Terracotta Planter */}
      <group position={[-4.5, 0, -4.2]}>
        <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.45, 0.35, 0.9, 24]} />
          <meshStandardMaterial color="#B8654D" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.88, 0]}>
          <cylinderGeometry args={[0.43, 0.43, 0.05, 24]} />
          <meshStandardMaterial color="#2E241E" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 1.1, 12]} />
          <meshStandardMaterial color="#544738" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0.1, 2.1, 0]}>
          <sphereGeometry args={[0.55, 16, 16]} />
          <meshStandardMaterial color="#445540" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[-0.2, 2.4, 0.1]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#4D6048" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0.25, 2.5, -0.1]}>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial color="#3D4D3A" roughness={0.7} />
        </mesh>
      </group>

      {/* Floor Lamp */}
      <group position={[-3.8, 0, 1.5]}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.06, 24]} />
          <meshStandardMaterial color="#1C1917" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2.7, 16]} />
          <meshStandardMaterial color="#1C1917" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.3, 2.65, 0]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.3, 0.4, 24, 1, true]} />
          <meshStandardMaterial color="#1C1917" side={THREE.DoubleSide} />
        </mesh>
        <pointLight position={[0.3, 2.55, 0]} color="#FFE8C2" intensity={15} distance={5} />
      </group>
    </group>
  );
};

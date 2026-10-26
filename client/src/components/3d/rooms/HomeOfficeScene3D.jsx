import React from 'react';
import * as THREE from 'three';

export const HomeOfficeScene3D = ({
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

      {/* Left Wall with Architectural Window */}
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

      {/* 2. OFFICE FURNITURE */}

      {/* Office Floor Rug */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0.2]}>
        <planeGeometry args={[7.2, 5.8]} />
        <meshStandardMaterial color="#ECE6DA" roughness={0.95} />
      </mesh>

      {/* EXECUTIVE FLOATING TIMBER DESK */}
      <group position={[0, 0, 0]}>
        {/* Desk Worktop (Reacts to Cabinetry!) */}
        <mesh castShadow receiveShadow position={[0, 0.76, 0]}>
          <boxGeometry args={[4.2, 0.08, 2.0]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>

        {/* Drawer Pedestal on Right (Reacts to Cabinetry) */}
        <mesh castShadow receiveShadow position={[1.4, 0.36, 0]}>
          <boxGeometry args={[1.0, 0.68, 1.8]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>

        {/* Minimalist Steel Leg on Left */}
        <mesh position={[-1.8, 0.36, -0.7]}>
          <cylinderGeometry args={[0.03, 0.03, 0.72, 16]} />
          <meshStandardMaterial color="#1C1917" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-1.8, 0.36, 0.7]}>
          <cylinderGeometry args={[0.03, 0.03, 0.72, 16]} />
          <meshStandardMaterial color="#1C1917" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Desktop Accessories: Monitor, Laptop & Pad */}
        <mesh position={[-0.2, 0.81, -0.3]}>
          <boxGeometry args={[1.6, 0.01, 0.9]} />
          <meshStandardMaterial color="#1C1917" roughness={0.6} />
        </mesh>
        {/* Monitor Screen */}
        <group position={[-0.2, 0.82, -0.5]}>
          <mesh position={[0, 0.38, 0]}>
            <boxGeometry args={[1.4, 0.72, 0.04]} />
            <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.38, 0.022]}>
            <planeGeometry args={[1.34, 0.66]} />
            <meshStandardMaterial color="#222A30" roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.24, 16]} />
            <meshStandardMaterial color="#1C1917" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.4, 0.02, 0.3]} />
            <meshStandardMaterial color="#1C1917" metalness={0.8} />
          </mesh>
        </group>

        {/* Architectural Desk Task Lamp */}
        <group position={[1.4, 0.8, -0.4]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.03, 16]} />
            <meshStandardMaterial color="#C5A059" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[-0.1, 0.28, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.55, 12]} />
            <meshStandardMaterial color="#C5A059" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[-0.25, 0.52, 0]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.015, 0.015, 0.3, 12]} />
            <meshStandardMaterial color="#C5A059" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Lamp Head */}
          <mesh position={[-0.38, 0.58, 0]}>
            <coneGeometry args={[0.1, 0.16, 16]} />
            <meshStandardMaterial color="#1C1917" roughness={0.3} />
          </mesh>
          <pointLight position={[-0.38, 0.5, 0]} color="#FFEBC2" intensity={10} distance={3} />
        </group>
      </group>

      {/* EXECUTIVE SWIVEL CHAIR (Behind Desk) */}
      <group position={[0, 0, -1.2]}>
        {/* Seat */}
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[0.9, 0.12, 0.85]} />
          <meshStandardMaterial color="#24211E" roughness={0.6} />
        </mesh>
        {/* Contoured High Backrest */}
        <mesh castShadow receiveShadow position={[0, 0.98, -0.38]}>
          <boxGeometry args={[0.85, 0.85, 0.1]} />
          <meshStandardMaterial color="#24211E" roughness={0.6} />
        </mesh>
        {/* Armrests */}
        <mesh position={[-0.45, 0.72, 0]}>
          <boxGeometry args={[0.06, 0.32, 0.5]} />
          <meshStandardMaterial color="#1C1917" metalness={0.7} />
        </mesh>
        <mesh position={[0.45, 0.72, 0]}>
          <boxGeometry args={[0.06, 0.32, 0.5]} />
          <meshStandardMaterial color="#1C1917" metalness={0.7} />
        </mesh>
        {/* Pedestal & Casters */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.44, 16]} />
          <meshStandardMaterial color="#1C1917" metalness={0.8} />
        </mesh>
      </group>

      {/* GUEST ARMCHAIR (In front of Desk, reacts to Accent!) */}
      <group position={[-1.2, 0, 1.8]} rotation={[0, Math.PI - 0.3, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.42, 0]}>
          <boxGeometry args={[0.95, 0.18, 0.9]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
            metalness={accentConfig.metalness}
          />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.8, -0.36]}>
          <boxGeometry args={[0.95, 0.6, 0.16]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
            metalness={accentConfig.metalness}
          />
        </mesh>
        {/* Metal Legs */}
        <mesh position={[-0.38, 0.18, -0.32]}>
          <cylinderGeometry args={[0.025, 0.02, 0.36, 12]} />
          <meshStandardMaterial color="#1C1917" roughness={0.4} />
        </mesh>
        <mesh position={[0.38, 0.18, -0.32]}>
          <cylinderGeometry args={[0.025, 0.02, 0.36, 12]} />
          <meshStandardMaterial color="#1C1917" roughness={0.4} />
        </mesh>
        <mesh position={[-0.38, 0.18, 0.32]}>
          <cylinderGeometry args={[0.025, 0.02, 0.36, 12]} />
          <meshStandardMaterial color="#1C1917" roughness={0.4} />
        </mesh>
        <mesh position={[0.38, 0.18, 0.32]}>
          <cylinderGeometry args={[0.025, 0.02, 0.36, 12]} />
          <meshStandardMaterial color="#1C1917" roughness={0.4} />
        </mesh>
      </group>

      {/* 3. WALL-SPANNING LIBRARY BOOKCASE (Reacts to Cabinetry!) */}
      <group position={[0, 0, -5.3]}>
        {/* Frame Structure */}
        <mesh castShadow receiveShadow position={[0, 2.4, 0]}>
          <boxGeometry args={[6.8, 4.4, 0.7]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>

        {/* Shelving Cubbies / Display Depths */}
        {/* Row of Books (Left) */}
        <mesh castShadow position={[-2.2, 1.2, 0.2]}>
          <boxGeometry args={[1.4, 0.45, 0.4]} />
          <meshStandardMaterial color="#403228" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[-2.2, 2.3, 0.2]}>
          <boxGeometry args={[1.5, 0.5, 0.4]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
          />
        </mesh>
        <mesh castShadow position={[-2.2, 3.4, 0.2]}>
          <boxGeometry args={[1.2, 0.4, 0.4]} />
          <meshStandardMaterial color="#2B3A42" roughness={0.8} />
        </mesh>

        {/* Middle Display Objects */}
        <mesh castShadow position={[0, 1.25, 0.2]}>
          <cylinderGeometry args={[0.18, 0.26, 0.5, 20]} />
          <meshStandardMaterial color="#FAF6EE" roughness={0.3} />
        </mesh>
        <mesh castShadow position={[0, 2.35, 0.2]}>
          <sphereGeometry args={[0.22, 20, 20]} />
          <meshStandardMaterial color="#C5A059" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* Row of Books (Right) */}
        <mesh castShadow position={[2.2, 1.2, 0.2]}>
          <boxGeometry args={[1.5, 0.48, 0.4]} />
          <meshStandardMaterial color="#2C3531" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[2.2, 2.3, 0.2]}>
          <boxGeometry args={[1.3, 0.45, 0.4]} />
          <meshStandardMaterial color="#4A3425" roughness={0.8} />
        </mesh>
      </group>

      {/* 4. POTTED INDOOR PLANT */}
      <group position={[4.2, 0, 1.5]}>
        <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.42, 0.32, 0.9, 24]} />
          <meshStandardMaterial color="#FAF5ED" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.88, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 24]} />
          <meshStandardMaterial color="#2E241E" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 1.45, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 1.2, 12]} />
          <meshStandardMaterial color="#544738" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0.1, 2.05, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#3D4D3A" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[-0.15, 2.35, 0.1]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#485B45" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
};

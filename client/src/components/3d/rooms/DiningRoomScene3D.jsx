import React from 'react';
import * as THREE from 'three';

export const DiningRoomScene3D = ({
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

      {/* 2. DINING ROOM FURNITURE */}

      {/* Anchoring Dining Rug */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[8.5, 6.5]} />
        <meshStandardMaterial color="#ECE6DA" roughness={0.96} />
      </mesh>

      {/* GRAND ARCHITECTURAL DINING TABLE */}
      <group position={[0, 0, 0]}>
        {/* Tabletop (Reacts to Cabinetry!) */}
        <mesh castShadow receiveShadow position={[0, 0.76, 0]}>
          <boxGeometry args={[5.2, 0.08, 2.4]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>

        {/* Sculptural Pedestal Bases */}
        <mesh castShadow position={[-1.6, 0.36, 0]}>
          <cylinderGeometry args={[0.55, 0.65, 0.72, 32]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>
        <mesh castShadow position={[1.6, 0.36, 0]}>
          <cylinderGeometry args={[0.55, 0.65, 0.72, 32]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>

        {/* Table Centerpiece: Sculptural Vase & Branches */}
        <mesh castShadow position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.15, 0.22, 0.5, 24]} />
          <meshStandardMaterial color="#F4EFE6" roughness={0.3} />
        </mesh>
        <mesh castShadow position={[0.5, 0.83, 0]}>
          <boxGeometry args={[0.6, 0.04, 0.4]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
          />
        </mesh>
      </group>

      {/* SET OF 6 DESIGNER DINING CHAIRS */}
      {/* Front Row (3 Chairs) */}
      {[-1.6, 0, 1.6].map((xOffset, idx) => (
        <group key={`front-${idx}`} position={[xOffset, 0, 1.6]} rotation={[0, 0, 0]}>
          {/* Seat Cushion (Reacts to Accent!) */}
          <mesh castShadow receiveShadow position={[0, 0.46, 0]}>
            <boxGeometry args={[0.85, 0.1, 0.8]} />
            <meshStandardMaterial
              color={accentConfig.color}
              roughness={accentConfig.roughness}
              metalness={accentConfig.metalness}
            />
          </mesh>
          {/* Curved Backrest */}
          <mesh castShadow receiveShadow position={[0, 0.82, 0.38]}>
            <boxGeometry args={[0.85, 0.64, 0.08]} />
            <meshStandardMaterial
              color={accentConfig.color}
              roughness={accentConfig.roughness}
              metalness={accentConfig.metalness}
            />
          </mesh>
          {/* Chair Legs */}
          <mesh position={[-0.36, 0.22, -0.32]}>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 12]} />
            <meshStandardMaterial color="#1C1917" roughness={0.4} />
          </mesh>
          <mesh position={[0.36, 0.22, -0.32]}>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 12]} />
            <meshStandardMaterial color="#1C1917" roughness={0.4} />
          </mesh>
          <mesh position={[-0.36, 0.22, 0.32]}>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 12]} />
            <meshStandardMaterial color="#1C1917" roughness={0.4} />
          </mesh>
          <mesh position={[0.36, 0.22, 0.32]}>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 12]} />
            <meshStandardMaterial color="#1C1917" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Back Row (3 Chairs) */}
      {[-1.6, 0, 1.6].map((xOffset, idx) => (
        <group key={`back-${idx}`} position={[xOffset, 0, -1.6]} rotation={[0, Math.PI, 0]}>
          <mesh castShadow receiveShadow position={[0, 0.46, 0]}>
            <boxGeometry args={[0.85, 0.1, 0.8]} />
            <meshStandardMaterial
              color={accentConfig.color}
              roughness={accentConfig.roughness}
              metalness={accentConfig.metalness}
            />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.82, 0.38]}>
            <boxGeometry args={[0.85, 0.64, 0.08]} />
            <meshStandardMaterial
              color={accentConfig.color}
              roughness={accentConfig.roughness}
              metalness={accentConfig.metalness}
            />
          </mesh>
          <mesh position={[-0.36, 0.22, -0.32]}>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 12]} />
            <meshStandardMaterial color="#1C1917" roughness={0.4} />
          </mesh>
          <mesh position={[0.36, 0.22, -0.32]}>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 12]} />
            <meshStandardMaterial color="#1C1917" roughness={0.4} />
          </mesh>
          <mesh position={[-0.36, 0.22, 0.32]}>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 12]} />
            <meshStandardMaterial color="#1C1917" roughness={0.4} />
          </mesh>
          <mesh position={[0.36, 0.22, 0.32]}>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 12]} />
            <meshStandardMaterial color="#1C1917" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* 3. FLUTED SIDEBOARD BUFFET ON BACK WALL (Reacts to Cabinetry!) */}
      <group position={[0, 0, -5.2]}>
        <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
          <boxGeometry args={[5.6, 1.1, 0.75]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>
        {/* Support Plinth */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[5.2, 0.2, 0.65]} />
          <meshStandardMaterial color="#1C1917" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Ceramic Decanters on Sideboard */}
        <mesh castShadow position={[-1.8, 1.5, 0]}>
          <cylinderGeometry args={[0.14, 0.2, 0.4, 20]} />
          <meshStandardMaterial color="#FAF6EE" roughness={0.3} />
        </mesh>
        <mesh castShadow position={[1.8, 1.45, 0]}>
          <cylinderGeometry args={[0.22, 0.16, 0.3, 20]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
          />
        </mesh>
      </group>

      {/* 4. STATEMENT HORIZONTAL CHANDELIER */}
      <group position={[0, 3.2, 0]}>
        {/* Central Rod */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 1.8, 12]} />
          <meshStandardMaterial color="#C5A059" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Horizontal Beam */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 3.4, 16]} />
          <meshStandardMaterial color="#C5A059" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Glowing Opal Glass Orbs */}
        {[-1.4, -0.7, 0, 0.7, 1.4].map((xPos, idx) => (
          <group key={idx} position={[xPos, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.18, 24, 24]} />
              <meshStandardMaterial
                color="#FFF5E0"
                emissive="#FFE0A0"
                emissiveIntensity={1.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}
        {/* Warm Downward Lighting from Chandelier */}
        <pointLight position={[0, -0.3, 0]} color="#FFE6BD" intensity={22} distance={6} />
      </group>

      {/* 5. LARGE ABSTRACT WALL ART */}
      <group position={[0, 3.2, -5.75]}>
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[3.8, 2.0, 0.05]} />
          <meshStandardMaterial color="#2B2824" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[3.6, 1.8]} />
          <meshStandardMaterial color="#EFE9DD" roughness={0.9} />
        </mesh>
        <mesh position={[-0.6, 0.2, 0.04]}>
          <planeGeometry args={[1.6, 1.2]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={0.8}
            opacity={0.8}
            transparent
          />
        </mesh>
      </group>
    </group>
  );
};

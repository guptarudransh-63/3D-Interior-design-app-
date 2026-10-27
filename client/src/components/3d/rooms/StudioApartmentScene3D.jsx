import React from 'react';
import * as THREE from 'three';

export const StudioApartmentScene3D = ({
  floorConfig,
  wallConfig,
  cabinetryConfig,
  accentConfig,
}) => {
  return (
    <group>
      {/* ================= 1. ROOM SHELL ================= */}

      {/* Main Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial
          color={floorConfig.color}
          roughness={floorConfig.roughness}
          metalness={floorConfig.metalness}
        />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.2, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#FAF8F5" roughness={0.9} />
      </mesh>

      {/* Industrial Exposed Ceiling Beams */}
      {[-4, -1.5, 1, 3.5].map((zPos, idx) => (
        <mesh key={idx} position={[0, 5.05, zPos]} castShadow>
          <boxGeometry args={[16, 0.3, 0.25]} />
          <meshStandardMaterial color="#2B2927" roughness={0.7} metalness={0.4} />
        </mesh>
      ))}

      {/* Back Wall (Masonry / Lime-plaster Finish) */}
      <mesh receiveShadow position={[0, 2.6, -7]}>
        <boxGeometry args={[16, 5.2, 0.4]} />
        <meshStandardMaterial
          color={wallConfig.color}
          roughness={wallConfig.roughness}
          metalness={wallConfig.metalness}
        />
      </mesh>

      {/* Left Wall with Grand Steel Factory Mullion Windows */}
      <group position={[-7, 2.6, 0]}>
        {/* Wall Columns flanking window */}
        <mesh receiveShadow position={[0, 0, -5]}>
          <boxGeometry args={[0.4, 5.2, 4]} />
          <meshStandardMaterial color={wallConfig.color} roughness={wallConfig.roughness} />
        </mesh>
        <mesh receiveShadow position={[0, 0, 5]}>
          <boxGeometry args={[0.4, 5.2, 4]} />
          <meshStandardMaterial color={wallConfig.color} roughness={wallConfig.roughness} />
        </mesh>
        <mesh receiveShadow position={[0, 4.4, 0]}>
          <boxGeometry args={[0.4, 1.6, 6]} />
          <meshStandardMaterial color={wallConfig.color} roughness={wallConfig.roughness} />
        </mesh>

        {/* Loft Glass Pane */}
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[0.08, 3.6, 5.8]} />
          <meshPhysicalMaterial
            transmission={0.93}
            opacity={1}
            transparent
            roughness={0.08}
            ior={1.5}
            color="#EAF6FF"
          />
        </mesh>

        {/* Steel Mullion Grids */}
        {[-2, -0.7, 0.7, 2].map((zOffset, i) => (
          <mesh key={`grid-v-${i}`} position={[0.02, 1.8, zOffset]}>
            <boxGeometry args={[0.1, 3.6, 0.05]} />
            <meshStandardMaterial color="#2B2927" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        {[0.8, 1.8, 2.8].map((yOffset, j) => (
          <mesh key={`grid-h-${j}`} position={[0.02, yOffset, 0]}>
            <boxGeometry args={[0.1, 0.05, 5.8]} />
            <meshStandardMaterial color="#2B2927" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Right Wall */}
      <mesh receiveShadow position={[7, 2.6, 0]}>
        <boxGeometry args={[0.4, 5.2, 16]} />
        <meshStandardMaterial
          color={wallConfig.color}
          roughness={wallConfig.roughness}
          metalness={wallConfig.metalness}
        />
      </mesh>

      {/* ================= 2. SLEEPING ALCOVE ZONE (Right Back) ================= */}
      <group position={[4.2, 0, -4.8]}>
        {/* Raised Timber Platform Bed Base */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.5, 3.6]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>

        {/* Mattress with crisp linen wrap */}
        <mesh position={[0, 0.65, 0.1]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 0.35, 3.2]} />
          <meshStandardMaterial color="#F7F5F0" roughness={0.85} />
        </mesh>

        {/* Pillows */}
        <mesh position={[-1.1, 0.95, -1.1]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[1.3, 0.22, 0.7]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>
        <mesh position={[1.1, 0.95, -1.1]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[1.3, 0.22, 0.7]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>

        {/* Folded Designer Bed Throw (Accent Material) */}
        <mesh position={[0, 0.86, 0.8]} castShadow>
          <boxGeometry args={[3.82, 0.1, 1.2]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
            metalness={accentConfig.metalness}
          />
        </mesh>

        {/* Headboard Wall Panel with integrated Warm LED reveal */}
        <mesh position={[0, 1.6, -1.6]} receiveShadow>
          <boxGeometry args={[4.4, 2.2, 0.15]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>

        {/* Sconce Wall Lights */}
        {[-1.8, 1.8].map((xOffset, i) => (
          <group key={i} position={[xOffset, 2.0, -1.45]}>
            <mesh>
              <cylinderGeometry args={[0.06, 0.06, 0.3]} />
              <meshStandardMaterial color="#C5A059" metalness={0.8} roughness={0.2} />
            </mesh>
            <pointLight distance={3} intensity={0.8} color="#FFEDD5" />
          </group>
        ))}
      </group>

      {/* ================= 3. ARCHITECTURAL PARTITION SCREEN ================= */}
      {/* Vertical bronze/timber screen dividing sleeping alcove from lounge */}
      <group position={[1.8, 0, -4.5]}>
        {/* Frame Outer */}
        <mesh position={[0, 2.4, 0]} castShadow>
          <boxGeometry args={[0.12, 4.8, 3.8]} />
          <meshStandardMaterial color="#2B2927" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Open Display Shelves */}
        {[-1.2, 0, 1.2].map((z, idx) => (
          <group key={idx} position={[0, 1.6 + idx * 0.9, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.5, 0.05, 1.1]} />
              <meshStandardMaterial
                color={cabinetryConfig.color}
                roughness={cabinetryConfig.roughness}
                metalness={cabinetryConfig.metalness}
              />
            </mesh>
            {/* Ceramic Art Vase on shelf */}
            <mesh position={[0, 0.22, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.16, 0.38, 16]} />
              <meshStandardMaterial color="#EAE6DF" roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================= 4. CENTRAL LOUNGE ZONE ================= */}
      <group position={[-1.5, 0, -1.5]}>
        {/* Architectural Low Lounge Area Rug */}
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[6.5, 5]} />
          <meshStandardMaterial color="#E8E3D8" roughness={0.95} />
        </mesh>

        {/* Modular Low Sectional Sofa */}
        <group position={[0, 0, 0.8]}>
          {/* Main Seat Cushion */}
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[4.2, 0.45, 1.6]} />
            <meshStandardMaterial
              color={accentConfig.color}
              roughness={accentConfig.roughness}
              metalness={accentConfig.metalness}
            />
          </mesh>

          {/* Sectional Backrest */}
          <mesh position={[0, 0.95, -0.65]} castShadow>
            <boxGeometry args={[4.2, 0.65, 0.4]} />
            <meshStandardMaterial
              color={accentConfig.color}
              roughness={accentConfig.roughness}
              metalness={accentConfig.metalness}
            />
          </mesh>

          {/* Side Armrests */}
          <mesh position={[-2.15, 0.72, 0]} castShadow>
            <boxGeometry args={[0.3, 0.6, 1.6]} />
            <meshStandardMaterial
              color={accentConfig.color}
              roughness={accentConfig.roughness}
              metalness={accentConfig.metalness}
            />
          </mesh>
          <mesh position={[2.15, 0.72, 0]} castShadow>
            <boxGeometry args={[0.3, 0.6, 1.6]} />
            <meshStandardMaterial
              color={accentConfig.color}
              roughness={accentConfig.roughness}
              metalness={accentConfig.metalness}
            />
          </mesh>

          {/* Bouclé Throw Pillows */}
          <mesh position={[-1.2, 0.8, -0.3]} rotation={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.65, 0.45, 0.25]} />
            <meshStandardMaterial color="#FAF7F2" roughness={0.9} />
          </mesh>
          <mesh position={[1.2, 0.8, -0.3]} rotation={[0, -0.15, 0]} castShadow>
            <boxGeometry args={[0.65, 0.45, 0.25]} />
            <meshStandardMaterial color="#FAF7F2" roughness={0.9} />
          </mesh>
        </group>

        {/* Monolithic Sculptural Coffee Table */}
        <group position={[0, 0, -1.0]}>
          {/* Main Travertine / Wood Surface */}
          <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.2, 1.2, 0.12, 32]} />
            <meshStandardMaterial
              color={cabinetryConfig.color}
              roughness={cabinetryConfig.roughness}
              metalness={cabinetryConfig.metalness}
            />
          </mesh>
          {/* Base Cylinder */}
          <mesh position={[0, 0.13, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.7, 0.26, 32]} />
            <meshStandardMaterial color="#1E1C1A" roughness={0.6} metalness={0.2} />
          </mesh>
          {/* Architectural Art Magazine Stack */}
          <mesh position={[0.2, 0.4, 0.1]} rotation={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.5, 0.05, 0.65]} />
            <meshStandardMaterial color="#2B2927" roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* ================= 5. COMPACT KITCHENETTE BAR ZONE (Front Left) ================= */}
      <group position={[-3.8, 0, 3.2]}>
        {/* Island Counter Base */}
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 1.05, 1.3]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>

        {/* Stone Countertop with Overhang */}
        <mesh position={[0, 1.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.1, 0.1, 1.5]} />
          <meshStandardMaterial color="#EAE6DF" roughness={0.35} metalness={0.1} />
        </mesh>

        {/* Flush Induction Hob */}
        <mesh position={[-0.9, 1.18, 0]} receiveShadow>
          <boxGeometry args={[1.2, 0.015, 0.75]} />
          <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.8} />
        </mesh>

        {/* Architect Lamp / Pendant light above counter */}
        <group position={[0, 4.2, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.015, 0.015, 2]} />
            <meshStandardMaterial color="#1E1C1A" />
          </mesh>
          <mesh position={[0, -1.0, 0]} castShadow>
            <coneGeometry args={[0.3, 0.28, 24]} />
            <meshStandardMaterial color="#2B2927" metalness={0.7} roughness={0.3} />
          </mesh>
          <pointLight position={[0, -1.2, 0]} intensity={1.2} distance={4} color="#FFF1DB" />
        </group>

        {/* Bar Stools along island counter */}
        {[-0.9, 0.9].map((xOffset, idx) => (
          <group key={idx} position={[xOffset, 0, 1.25]}>
            {/* Stool Metal Legs */}
            {[-0.2, 0.2].map((x, i) =>
              [-0.2, 0.2].map((z, j) => (
                <mesh key={`${i}-${j}`} position={[x, 0.38, z]}>
                  <cylinderGeometry args={[0.018, 0.018, 0.75]} />
                  <meshStandardMaterial color="#1E1C1A" metalness={0.7} />
                </mesh>
              ))
            )}
            {/* Stool Leather Seat */}
            <mesh position={[0, 0.78, 0]} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.08, 24]} />
              <meshStandardMaterial
                color={accentConfig.color}
                roughness={accentConfig.roughness}
                metalness={accentConfig.metalness}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================= 6. ARCHITECTURAL POTTED OLIVE TREE ================= */}
      <group position={[-5.8, 0, -5.4]}>
        {/* Fluted Ceramic Planter */}
        <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.55, 0.45, 1.3, 24]} />
          <meshStandardMaterial color="#ECE7DE" roughness={0.65} />
        </mesh>
        {/* Soil */}
        <mesh position={[0, 1.26, 0]}>
          <cylinderGeometry args={[0.52, 0.52, 0.08, 24]} />
          <meshStandardMaterial color="#3D3025" roughness={0.9} />
        </mesh>
        {/* Trunk & Organic Branches */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.1, 1.9]} />
          <meshStandardMaterial color="#5C4D3C" roughness={0.8} />
        </mesh>
        {/* Soft Foliage Canopies */}
        <mesh position={[-0.2, 3.2, 0.1]} castShadow>
          <dodecahedronGeometry args={[0.85, 1]} />
          <meshStandardMaterial color="#4A5843" roughness={0.9} />
        </mesh>
        <mesh position={[0.3, 3.6, -0.2]} castShadow>
          <dodecahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial color="#55664C" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

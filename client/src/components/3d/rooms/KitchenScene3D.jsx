import React from 'react';
import * as THREE from 'three';

export const KitchenScene3D = ({
  floorConfig,
  wallConfig,
  cabinetryConfig,
  accentConfig,
}) => {
  return (
    <group>
      {/* 1. ROOM SHELL */}

      {/* Main Floor (reacts to floorConfig) */}
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

      {/* Splashback Accent Slab Wall */}
      <mesh receiveShadow position={[0, 1.8, -5.76]}>
        <boxGeometry args={[11, 2.2, 0.04]} />
        <meshStandardMaterial
          color="#ECE7DE"
          roughness={0.25}
          metalness={0.05}
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

        {/* Mullions */}
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

      {/* 2. BACK WALL KITCHEN CABINETRY RUN & APPLIANCES */}

      {/* Lower Base Counter Cabinets (Reacts to Cabinetry!) */}
      <group position={[0, 0, -5.0]}>
        <mesh castShadow receiveShadow position={[0, 0.48, 0]}>
          <boxGeometry args={[11.2, 0.96, 1.4]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>
        {/* Back Wall Stone Countertop */}
        <mesh castShadow receiveShadow position={[0, 0.98, 0]}>
          <boxGeometry args={[11.3, 0.08, 1.44]} />
          <meshStandardMaterial color="#F4EFE6" roughness={0.2} metalness={0.08} />
        </mesh>
        {/* Flush Induction Cooktop */}
        <mesh position={[-1.2, 1.03, 0]}>
          <boxGeometry args={[1.6, 0.02, 1.0]} />
          <meshStandardMaterial color="#141414" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* Tall Pantry Tower on Right (Reacts to Cabinetry!) */}
      <group position={[4.6, 0, -4.9]}>
        <mesh castShadow receiveShadow position={[0, 2.3, 0]}>
          <boxGeometry args={[2.0, 4.6, 1.6]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>

        {/* Built-in Dual Ovens (Stacked Black Glass & Stainless) */}
        <group position={[-0.2, 2.0, 0.81]}>
          {/* Upper Oven */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1.3, 0.9, 0.05]} />
            <meshStandardMaterial color="#181818" roughness={0.1} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.5, 0.03]}>
            <boxGeometry args={[0.9, 0.5, 0.02]} />
            <meshStandardMaterial color="#2E2E2E" roughness={0.2} />
          </mesh>
          {/* Lower Oven */}
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[1.3, 0.9, 0.05]} />
            <meshStandardMaterial color="#181818" roughness={0.1} metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.5, 0.03]}>
            <boxGeometry args={[0.9, 0.5, 0.02]} />
            <meshStandardMaterial color="#2E2E2E" roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Floating Open Display Shelves Above Back Counter */}
      <group position={[-1.5, 2.4, -5.3]}>
        {/* Lower Shelf (Reacts to Cabinetry) */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[6.5, 0.08, 0.5]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>
        {/* Upper Shelf (Reacts to Cabinetry) */}
        <mesh castShadow position={[0, 0.9, 0]}>
          <boxGeometry args={[6.5, 0.08, 0.5]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>

        {/* Decorative Ceramics & Tableware on Shelves */}
        <mesh castShadow position={[-2.0, 0.2, 0]}>
          <cylinderGeometry args={[0.16, 0.12, 0.3, 16]} />
          <meshStandardMaterial color="#FAF6EE" roughness={0.3} />
        </mesh>
        <mesh castShadow position={[-1.2, 0.16, 0]}>
          <cylinderGeometry args={[0.22, 0.18, 0.22, 16]} />
          <meshStandardMaterial color="#DED6C7" roughness={0.4} />
        </mesh>
        <mesh castShadow position={[0.5, 0.22, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.34, 16]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
          />
        </mesh>
        <mesh castShadow position={[2.0, 0.18, 0]}>
          <cylinderGeometry args={[0.26, 0.18, 0.24, 16]} />
          <meshStandardMaterial color="#FAF6EE" roughness={0.3} />
        </mesh>

        {/* Upper Shelf Cups & Bowls */}
        <mesh castShadow position={[-1.5, 1.05, 0]}>
          <cylinderGeometry args={[0.15, 0.1, 0.2, 16]} />
          <meshStandardMaterial color="#FAF6EE" roughness={0.3} />
        </mesh>
        <mesh castShadow position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.2, 0.14, 0.2, 16]} />
          <meshStandardMaterial color="#FAF6EE" roughness={0.3} />
        </mesh>
        <mesh castShadow position={[1.5, 1.05, 0]}>
          <cylinderGeometry args={[0.18, 0.12, 0.2, 16]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
          />
        </mesh>

        {/* Under-shelf Warm LED Strip Light */}
        <pointLight position={[0, -0.15, 0.1]} color="#FFE8C2" intensity={8} distance={3.5} />
      </group>

      {/* 3. GRAND KITCHEN ISLAND */}
      <group position={[0, 0, 0.2]}>
        {/* Island Cabinetry Base (Reacts to Cabinetry!) */}
        <mesh castShadow receiveShadow position={[0, 0.48, -0.2]}>
          <boxGeometry args={[6.2, 0.96, 2.0]} />
          <meshStandardMaterial
            color={cabinetryConfig.color}
            roughness={cabinetryConfig.roughness}
            metalness={cabinetryConfig.metalness}
          />
        </mesh>

        {/* Thick Waterfall Stone Countertop (Extends forward for seating overhang) */}
        <mesh castShadow receiveShadow position={[0, 0.98, 0]}>
          <boxGeometry args={[6.4, 0.1, 2.6]} />
          <meshStandardMaterial color="#F7F3EC" roughness={0.18} metalness={0.06} />
        </mesh>
        {/* Left Waterfall Leg */}
        <mesh castShadow receiveShadow position={[-3.15, 0.48, 0]}>
          <boxGeometry args={[0.1, 0.96, 2.6]} />
          <meshStandardMaterial color="#F7F3EC" roughness={0.18} metalness={0.06} />
        </mesh>
        {/* Right Waterfall Leg */}
        <mesh castShadow receiveShadow position={[3.15, 0.48, 0]}>
          <boxGeometry args={[0.1, 0.96, 2.6]} />
          <meshStandardMaterial color="#F7F3EC" roughness={0.18} metalness={0.06} />
        </mesh>

        {/* Undermount Prep Sink */}
        <mesh receiveShadow position={[-1.2, 0.99, -0.1]}>
          <boxGeometry args={[1.2, 0.02, 0.8]} />
          <meshStandardMaterial color="#353535" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Architectural Gooseneck Faucet */}
        <group position={[-1.2, 1.03, -0.6]}>
          {/* Base */}
          <mesh castShadow position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 0.2, 16]} />
            <meshStandardMaterial color="#222" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Vertical Stem */}
          <mesh castShadow position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.35, 16]} />
            <meshStandardMaterial color="#222" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Curved Spout Head */}
          <mesh castShadow position={[0, 0.55, 0.1]}>
            <boxGeometry args={[0.04, 0.08, 0.24]} />
            <meshStandardMaterial color="#222" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>

        {/* Styling Props on Island Counter */}
        {/* Large Marble Fruit / Salad Serving Bowl */}
        <mesh castShadow position={[1.4, 1.1, 0]}>
          <cylinderGeometry args={[0.35, 0.2, 0.16, 24]} />
          <meshStandardMaterial
            color={accentConfig.color}
            roughness={accentConfig.roughness}
            metalness={accentConfig.metalness}
          />
        </mesh>
        {/* Wooden Prep Board */}
        <mesh castShadow position={[0.2, 1.05, 0.2]}>
          <boxGeometry args={[0.9, 0.04, 0.6]} />
          <meshStandardMaterial color="#6A4E38" roughness={0.7} />
        </mesh>

        {/* 4. SET OF 3 CONTEMPORARY BARSTOOLS (Seating Overhang) */}
        {[-1.8, 0, 1.8].map((xOffset, idx) => (
          <group key={idx} position={[xOffset, 0, 1.8]}>
            {/* Upholstered Round Cushion (Reacts to Accent Material!) */}
            <mesh castShadow receiveShadow position={[0, 0.68, 0]}>
              <cylinderGeometry args={[0.36, 0.36, 0.12, 24]} />
              <meshStandardMaterial
                color={accentConfig.color}
                roughness={accentConfig.roughness}
                metalness={accentConfig.metalness}
              />
            </mesh>
            {/* Central Pedestal / Legs */}
            <mesh position={[0, 0.32, 0]}>
              <cylinderGeometry args={[0.03, 0.04, 0.62, 16]} />
              <meshStandardMaterial color="#1C1917" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Foot Plinth Base */}
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.3, 0.32, 0.04, 24]} />
              <meshStandardMaterial color="#1C1917" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Circular Footrest Ring */}
            <mesh position={[0, 0.25, 0]}>
              <torusGeometry args={[0.22, 0.015, 8, 24]} />
              <meshStandardMaterial color="#1C1917" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 5. TWIN SUSPENDED CYLINDER ISLAND PENDANTS */}
      {[-1.5, 1.5].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0, 0.2]}>
          {/* Wire */}
          <mesh position={[0, 3.8, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 2.4, 8]} />
            <meshStandardMaterial color="#1C1917" roughness={0.3} />
          </mesh>
          {/* Minimalist Matte Black Cylinder Fixture */}
          <mesh castShadow position={[0, 2.4, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.5, 24]} />
            <meshStandardMaterial color="#1C1917" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Light Bulb Spot */}
          <spotLight
            position={[0, 2.1, 0]}
            target-position={[xPos, 1.0, 0.2]}
            intensity={16}
            color="#FFF4DD"
            angle={Math.PI / 5}
            penumbra={0.5}
            distance={5}
            castShadow
          />
        </group>
      ))}
    </group>
  );
};

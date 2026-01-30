"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Html, Stars, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { floorsData, type Floor, type Zone, getStatusColor } from "@/lib/floor-data";

interface BuildingProps {
  selectedFloor: number | null;
  selectedZone: Zone | null;
  onFloorSelect: (floorId: number | null) => void;
  onZoneSelect: (zone: Zone | null, floor: Floor) => void;
}

// Floor colors by floor ID
const FLOOR_COLORS: Record<number, string> = {
  1: "#F5E6A3", // Warm cream for retail
  2: "#C8E6C9", // Light green for showrooms
  3: "#E8C4C4", // Soft pink for lifestyle
  4: "#B3C5D7", // Blue-grey for media
  5: "#D7CCC8", // Warm grey for office
  6: "#E1D4E8", // Soft purple for VIP
};

function FloorPlate({
  floor,
  yPosition,
  isSelected,
  isAboveSelected,
  onClick,
  onZoneClick,
  selectedZone,
}: {
  floor: Floor;
  yPosition: number;
  isSelected: boolean;
  isAboveSelected: boolean;
  onClick: () => void;
  onZoneClick: (zone: Zone) => void;
  selectedZone: Zone | null;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const opacity = isAboveSelected ? 0.08 : isSelected ? 1 : 0.75;
  const floorHeight = 0.05;
  const floorColor = FLOOR_COLORS[floor.id] || "#e8dcc8";

  return (
    <group position={[0, yPosition, 0]}>
      {/* Main floor plate - solid color */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        position={[0, 0, 0]}
      >
        <boxGeometry args={[4.5, floorHeight, 3.5]} />
        <meshStandardMaterial
          color={hovered ? "#fff5e6" : floorColor}
          transparent
          opacity={opacity}
          roughness={0.4}
          metalness={0.1}
          emissive={hovered || isSelected ? floorColor : "#000000"}
          emissiveIntensity={hovered ? 0.3 : isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Floor label */}
      {!isAboveSelected && (
        <Html
          position={[-2.5, 0.15, 0]}
          center
          distanceFactor={8}
          style={{ pointerEvents: "none" }}
        >
          <div className="rounded-lg bg-black/90 px-3 py-1.5 text-xs font-bold text-white whitespace-nowrap shadow-lg border border-white/10">
            {floor.id}F - {floor.coreFunction.split("、")[0]}
          </div>
        </Html>
      )}

      {/* Zones on this floor */}
      {isSelected &&
        floor.zones.map((zone) => (
          <ZoneBox
            key={zone.id}
            zone={zone}
            isSelected={selectedZone?.id === zone.id}
            onClick={() => onZoneClick(zone)}
          />
        ))}

      {/* Floor edge highlight */}
      <lineSegments position={[0, 0, 0]}>
        <edgesGeometry
          args={[new THREE.BoxGeometry(4.5, floorHeight, 3.5)]}
        />
        <lineBasicMaterial 
          color={isSelected ? "#c9a86c" : "#6b5b4a"} 
          transparent 
          opacity={opacity * 0.8}
        />
      </lineSegments>
    </group>
  );
}

function ZoneBox({
  zone,
  isSelected,
  onClick,
}: {
  zone: Zone;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && (isSelected || hovered)) {
      groupRef.current.position.y = 
        zone.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02 + 0.05;
    }
  });

  const statusColor = getStatusColor(zone.status);
  const baseColor = zone.color;
  const glowColor = isSelected ? "#fbbf24" : hovered ? "#f59e0b" : baseColor;
  
  // Standard opacity without filter
  const baseOpacity = isSelected ? 0.85 : hovered ? 0.7 : 0.5;
  const edgeOpacity = isSelected ? 1 : hovered ? 0.9 : 0.6;

  return (
    <group ref={groupRef} position={[zone.position[0], zone.position[1] + 0.05, zone.position[2]]}>
      {/* Zone volume - semi-transparent box with real presence */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        position={[0, zone.size[1] / 2, 0]}
      >
        <boxGeometry args={[zone.size[0], zone.size[1] * 2.5, zone.size[2]]} />
        <meshStandardMaterial
          color={glowColor}
          transparent
          opacity={baseOpacity}
          roughness={0.3}
          metalness={0.1}
          emissive={glowColor}
          emissiveIntensity={isSelected ? 0.4 : hovered ? 0.25 : 0.1}
        />
      </mesh>

      {/* Status indicator - glowing sphere */}
      <mesh position={[zone.size[0] / 2 - 0.06, zone.size[1] * 2 + 0.1, zone.size[2] / 2 - 0.06]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* Sleek tooltip on hover or select - black tag with white text */}
      {(hovered || isSelected) && (
        <Html
          position={[0, zone.size[1] * 2.5 + 0.3, 0]}
          center
          distanceFactor={5}
          style={{ pointerEvents: "none" }}
        >
          <div className="rounded-lg bg-black px-4 py-2 text-xs shadow-xl whitespace-nowrap border border-white/20">
            <div className="font-bold text-white">{zone.name}</div>
            <div className="text-white/70 mt-0.5">
              ¥{zone.price.toLocaleString()}/day
            </div>
          </div>
        </Html>
      )}

      {/* Edge glow for zone boundary */}
      <lineSegments position={[0, zone.size[1] / 2, 0]}>
        <edgesGeometry
          args={[new THREE.BoxGeometry(zone.size[0], zone.size[1] * 2.5, zone.size[2])]}
        />
        <lineBasicMaterial
          color={isSelected ? "#fbbf24" : hovered ? "#f59e0b" : "#8b7355"}
          transparent
          opacity={edgeOpacity}
        />
      </lineSegments>
    </group>
  );
}

// Enhanced structural pillars with better visibility
function StructuralPillars({ selectedFloor }: { selectedFloor: number | null }) {
  const pillarPositions = [
    [-2.1, 1.65], [-2.1, -1.55],
    [2.1, 1.65], [2.1, -1.55],
    [-2.1, 0.05], [2.1, 0.05],
  ];
  
  const pillarOpacity = selectedFloor ? 0.6 : 1;
  const floorSpacing = 0.5;
  const numFloors = 6;
  
  return (
    <group>
      {pillarPositions.map(([x, z], pillarIndex) => (
        <group key={`pillar-column-${pillarIndex}`}>
          {/* Full height structural column */}
          <mesh position={[x, (numFloors * floorSpacing) / 2, z]}>
            <cylinderGeometry args={[0.07, 0.09, numFloors * floorSpacing + 0.3, 8]} />
            <meshStandardMaterial
              color="#5a4a3a"
              roughness={0.3}
              metalness={0.4}
              transparent
              opacity={pillarOpacity}
              emissive="#3d3428"
              emissiveIntensity={0.15}
            />
          </mesh>
          {/* Decorative base */}
          <mesh position={[x, -0.1, z]}>
            <cylinderGeometry args={[0.12, 0.14, 0.2, 8]} />
            <meshStandardMaterial
              color="#8b7355"
              roughness={0.4}
              transparent
              opacity={pillarOpacity}
            />
          </mesh>
          {/* Decorative capital at top */}
          <mesh position={[x, numFloors * floorSpacing + 0.08, z]}>
            <cylinderGeometry args={[0.14, 0.1, 0.15, 8]} />
            <meshStandardMaterial
              color="#8b7355"
              roughness={0.4}
              transparent
              opacity={pillarOpacity}
            />
          </mesh>
        </group>
      ))}
      
      {/* Horizontal beams between pillars at each floor */}
      {Array.from({ length: numFloors }).map((_, floorIndex) => (
        <group key={`beams-floor-${floorIndex}`}>
          {/* Front beam */}
          <mesh position={[0, floorIndex * floorSpacing + 0.025, 1.65]}>
            <boxGeometry args={[4.4, 0.05, 0.08]} />
            <meshStandardMaterial
              color="#6b5b4a"
              roughness={0.4}
              transparent
              opacity={pillarOpacity * 0.85}
            />
          </mesh>
          {/* Back beam */}
          <mesh position={[0, floorIndex * floorSpacing + 0.025, -1.55]}>
            <boxGeometry args={[4.4, 0.05, 0.08]} />
            <meshStandardMaterial
              color="#6b5b4a"
              roughness={0.4}
              transparent
              opacity={pillarOpacity * 0.85}
            />
          </mesh>
          {/* Side beams */}
          <mesh position={[-2.1, floorIndex * floorSpacing + 0.025, 0.05]}>
            <boxGeometry args={[0.08, 0.05, 3.3]} />
            <meshStandardMaterial
              color="#6b5b4a"
              roughness={0.4}
              transparent
              opacity={pillarOpacity * 0.85}
            />
          </mesh>
          <mesh position={[2.1, floorIndex * floorSpacing + 0.025, 0.05]}>
            <boxGeometry args={[0.08, 0.05, 3.3]} />
            <meshStandardMaterial
              color="#6b5b4a"
              roughness={0.4}
              transparent
              opacity={pillarOpacity * 0.85}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Building base only - no glass walls
function BuildingBase() {
  return (
    <group>
      {/* Building base/foundation - stone look */}
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[5.0, 0.5, 4.0]} />
        <meshStandardMaterial 
          color="#a89880" 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Roof platform */}
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[4.8, 0.08, 3.8]} />
        <meshStandardMaterial 
          color="#6b5b4a" 
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

      {/* Roof edge trim */}
      <mesh position={[0, 3.16, 0]}>
        <boxGeometry args={[4.9, 0.04, 3.9]} />
        <meshStandardMaterial 
          color="#8b7355" 
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

function Scene({
  selectedFloor,
  selectedZone,
  onFloorSelect,
  onZoneSelect,
}: BuildingProps) {
  const floorSpacing = 0.5;

  return (
    <>
      {/* Star field background */}
      <Stars 
        radius={100} 
        depth={50} 
        count={4000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.3}
      />
      
      {/* Floating sparkles inside the building */}
      <Sparkles
        count={30}
        scale={[4, 3, 3.5]}
        position={[0, 1.5, 0]}
        size={1.2}
        speed={0.2}
        opacity={0.3}
        color="#ffeedd"
      />

      {/* Night scene lighting */}
      <ambientLight intensity={0.3} color="#e8e4dc" />
      <directionalLight position={[10, 15, 5]} intensity={0.5} color="#ffeedd" castShadow />
      
      {/* Warm interior point lights */}
      <pointLight position={[0, 1.5, 0]} intensity={1.5} color="#fff5e0" distance={10} />
      <pointLight position={[-1.5, 2, 0]} intensity={0.8} color="#fef3c7" distance={8} />
      <pointLight position={[1.5, 2, 0]} intensity={0.8} color="#fef3c7" distance={8} />

      {/* Building base and roof */}
      <BuildingBase />
      
      {/* Structural pillars */}
      <StructuralPillars selectedFloor={selectedFloor} />

      {/* Floor plates */}
      <Suspense fallback={null}>
        {floorsData.map((floor, index) => (
          <FloorPlate
            key={floor.id}
            floor={floor}
            yPosition={index * floorSpacing}
            isSelected={selectedFloor === floor.id}
            isAboveSelected={selectedFloor !== null && floor.id > selectedFloor}
            onClick={() =>
              onFloorSelect(selectedFloor === floor.id ? null : floor.id)
            }
            onZoneClick={(zone) => onZoneSelect(zone, floor)}
            selectedZone={selectedZone}
          />
        ))}
      </Suspense>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 1.2, 0]}
      />

      <Environment preset="apartment" />

      {/* Post-processing effects */}
      <EffectComposer multisampling={4}>
        <Bloom 
          luminanceThreshold={1.0}
          luminanceSmoothing={0.9}
          intensity={0.4}
          mipmapBlur
        />
        <Vignette 
          eskil={false}
          offset={0.1}
          darkness={0.4}
        />
      </EffectComposer>
    </>
  );
}

export function Building3D({
  selectedFloor,
  selectedZone,
  onFloorSelect,
  onZoneSelect,
}: BuildingProps) {
  const activeFilter = null; // Declare activeFilter here or import it as needed

  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [6, 4, 6], fov: 45 }}
        shadows
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1
        }}
        style={{ background: "linear-gradient(180deg, #0f0f1e 0%, #1a1a2e 50%, #0a0a14 100%)" }}
      >
        <Suspense fallback={null}>
          <Scene
            selectedFloor={selectedFloor}
            selectedZone={selectedZone}
            onFloorSelect={onFloorSelect}
            onZoneSelect={onZoneSelect}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

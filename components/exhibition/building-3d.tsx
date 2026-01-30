"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Html, useTexture, Stars, Sparkles, MeshTransmissionMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { floorsData, type Floor, type Zone, getStatusColor } from "@/lib/floor-data";
import { getFloorPlanImage, getZoneImage } from "@/lib/zone-images";

interface BuildingProps {
  selectedFloor: number | null;
  selectedZone: Zone | null;
  onFloorSelect: (floorId: number | null) => void;
  onZoneSelect: (zone: Zone | null, floor: Floor) => void;
}

function FloorPlateWithTexture({
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
  
  const textureUrl = getFloorPlanImage(floor.id);
  const texture = useTexture(textureUrl || "/images/floor-plan-1f.png");
  
  // Configure texture
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.rotation = Math.PI;
  texture.center.set(0.5, 0.5);

  const opacity = isAboveSelected ? 0.1 : isSelected ? 1 : 0.7;
  const floorHeight = 0.06;

  return (
    <group position={[0, yPosition, 0]}>
      {/* Main floor plate with texture */}
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
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[4.5, 3.5]} />
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          emissive={hovered ? "#fff5e6" : "#ffffff"}
          emissiveIntensity={hovered ? 0.15 : 0.05}
        />
      </mesh>

      {/* Floor base/thickness */}
      <mesh position={[0, -floorHeight / 2, 0]}>
        <boxGeometry args={[4.5, floorHeight, 3.5]} />
        <meshStandardMaterial
          color={hovered ? "#f5e6d0" : "#e8dcc8"}
          transparent
          opacity={opacity * 0.9}
          roughness={0.4}
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
          <div className="rounded-lg bg-foreground/90 px-3 py-1.5 text-xs font-semibold text-background whitespace-nowrap shadow-lg">
            {floor.id}F - {floor.coreFunction.split("、")[0]}
          </div>
        </Html>
      )}

      {/* Zones on this floor - semi-transparent overlay */}
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
      <lineSegments position={[0, -floorHeight / 2, 0]}>
        <edgesGeometry
          args={[new THREE.BoxGeometry(4.5, floorHeight, 3.5)]}
        />
        <lineBasicMaterial 
          color={isSelected ? "#c9a86c" : "#8b7355"} 
          transparent 
          opacity={opacity * 0.6}
          linewidth={2}
        />
      </lineSegments>
    </group>
  );
}

// Zone image panel component - shows interior render image
function ZoneImagePanel({ zone, isSelected }: { zone: Zone; isSelected: boolean }) {
  const imageUrl = getZoneImage(zone.id);
  const texture = useTexture(imageUrl || "/images/zone-1f-retail.jpg");
  
  // Calculate panel size based on zone dimensions
  const panelWidth = Math.min(zone.size[0], zone.size[2]) * 0.7;
  const panelHeight = panelWidth * 0.6;
  
  const emissiveIntensity = isSelected ? 0.4 : 0.15;
  
  return (
    <mesh 
      rotation={[-Math.PI / 4, 0, 0]}
      position={[0, panelHeight / 2 + 0.05, 0]}
    >
      <planeGeometry args={[panelWidth, panelHeight]} />
      <meshStandardMaterial
        map={texture}
        emissive="#ffffff"
        emissiveIntensity={emissiveIntensity}
        emissiveMap={texture}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
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
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && (isSelected || hovered)) {
      groupRef.current.position.y = 
        zone.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.015 + 0.08;
    }
  });

  const statusColor = getStatusColor(zone.status);
  const glowColor = isSelected ? "#fbbf24" : hovered ? "#f59e0b" : zone.color;
  const baseOpacity = isSelected ? 0.25 : hovered ? 0.2 : 0.08;

  return (
    <group ref={groupRef} position={[zone.position[0], zone.position[1] + 0.08, zone.position[2]]}>
      {/* Invisible hitbox for interaction */}
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
        position={[0, 0.1, 0]}
      >
        <boxGeometry args={[zone.size[0], zone.size[1] * 2, zone.size[2]]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Ground glow effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[zone.size[0] * 0.95, zone.size[2] * 0.95]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={isSelected ? 1.5 : hovered ? 1 : 0.3}
          transparent
          opacity={baseOpacity * 2}
        />
      </mesh>

      {/* Interior image panel - only show when hovered or selected */}
      {(hovered || isSelected) && (
        <Suspense fallback={null}>
          <ZoneImagePanel zone={zone} isSelected={isSelected} />
        </Suspense>
      )}

      {/* Status indicator - glowing sphere */}
      <mesh position={[zone.size[0] / 2 - 0.06, 0.05, zone.size[2] / 2 - 0.06]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Zone label on hover or select */}
      {(hovered || isSelected) && (
        <Html
          position={[0, 0.45, 0]}
          center
          distanceFactor={5}
          style={{ pointerEvents: "none" }}
        >
          <div className="rounded-xl bg-slate-900/95 px-4 py-2.5 text-xs shadow-xl border border-white/10 backdrop-blur-md whitespace-nowrap">
            <div className="font-bold text-white">{zone.name}</div>
            <div className="text-white/60 mt-0.5">{zone.area} sqm | {zone.type}</div>
          </div>
        </Html>
      )}

      {/* Edge glow for zone boundary */}
      <lineSegments position={[0, 0.1, 0]}>
        <edgesGeometry
          args={[new THREE.BoxGeometry(zone.size[0], zone.size[1] * 0.5, zone.size[2])]}
        />
        <lineBasicMaterial
          color={isSelected ? "#fbbf24" : hovered ? "#f59e0b" : "#8b7355"}
          transparent
          opacity={isSelected ? 1 : hovered ? 0.8 : 0.3}
        />
      </lineSegments>
    </group>
  );
}

// Structural pillars between floors
function StructuralPillars({ selectedFloor }: { selectedFloor: number | null }) {
  const pillarPositions = [
    [-2.1, 1.9], [-2.1, -1.6],  // Left side
    [2.1, 1.9], [2.1, -1.6],    // Right side
    [-2.1, 0], [2.1, 0],        // Middle sides
  ];
  
  const pillarOpacity = selectedFloor ? 0.4 : 0.95;
  const floorSpacing = 0.5;
  const numFloors = 6;
  
  return (
    <group>
      {pillarPositions.map(([x, z], pillarIndex) => (
        <group key={`pillar-column-${pillarIndex}`}>
          {/* Full height structural column */}
          <mesh position={[x, (numFloors * floorSpacing) / 2, z]}>
            <cylinderGeometry args={[0.06, 0.08, numFloors * floorSpacing + 0.3, 8]} />
            <meshStandardMaterial
              color="#5a4a3a"
              roughness={0.4}
              metalness={0.3}
              transparent
              opacity={pillarOpacity}
            />
          </mesh>
          {/* Decorative base */}
          <mesh position={[x, -0.08, z]}>
            <cylinderGeometry args={[0.1, 0.12, 0.16, 8]} />
            <meshStandardMaterial
              color="#8b7355"
              roughness={0.5}
              transparent
              opacity={pillarOpacity}
            />
          </mesh>
          {/* Decorative capital at top */}
          <mesh position={[x, numFloors * floorSpacing + 0.05, z]}>
            <cylinderGeometry args={[0.12, 0.08, 0.12, 8]} />
            <meshStandardMaterial
              color="#8b7355"
              roughness={0.5}
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
          <mesh position={[0, floorIndex * floorSpacing, 1.9]}>
            <boxGeometry args={[4.4, 0.04, 0.06]} />
            <meshStandardMaterial
              color="#6b5b4a"
              roughness={0.5}
              transparent
              opacity={pillarOpacity * 0.8}
            />
          </mesh>
          {/* Back beam */}
          <mesh position={[0, floorIndex * floorSpacing, -1.6]}>
            <boxGeometry args={[4.4, 0.04, 0.06]} />
            <meshStandardMaterial
              color="#6b5b4a"
              roughness={0.5}
              transparent
              opacity={pillarOpacity * 0.8}
            />
          </mesh>
          {/* Side beams */}
          <mesh position={[-2.1, floorIndex * floorSpacing, 0.15]}>
            <boxGeometry args={[0.06, 0.04, 3.6]} />
            <meshStandardMaterial
              color="#6b5b4a"
              roughness={0.5}
              transparent
              opacity={pillarOpacity * 0.8}
            />
          </mesh>
          <mesh position={[2.1, floorIndex * floorSpacing, 0.15]}>
            <boxGeometry args={[0.06, 0.04, 3.6]} />
            <meshStandardMaterial
              color="#6b5b4a"
              roughness={0.5}
              transparent
              opacity={pillarOpacity * 0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BuildingExterior({ selectedFloor }: { selectedFloor: number | null }) {
  const glassVisible = selectedFloor ? false : true;

  return (
    <group>
      {/* Structural pillars */}
      <StructuralPillars selectedFloor={selectedFloor} />
      
      {/* Building base/foundation - stone look */}
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[5.2, 0.5, 4.2]} />
        <meshStandardMaterial 
          color="#a89880" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Premium Glass exterior walls - using MeshTransmissionMaterial */}
      {glassVisible && (
        <>
          {/* Glass exterior walls - left side */}
          <mesh position={[-2.4, 1.5, 0]}>
            <boxGeometry args={[0.08, 3.2, 3.9]} />
            <MeshTransmissionMaterial
              backside
              samples={6}
              resolution={512}
              transmission={0.92}
              roughness={0.08}
              thickness={0.4}
              chromaticAberration={0.03}
              color="#aebbd4"
              distortion={0.1}
              distortionScale={0.2}
              temporalDistortion={0}
            />
          </mesh>

          {/* Glass exterior walls - right side */}
          <mesh position={[2.4, 1.5, 0]}>
            <boxGeometry args={[0.08, 3.2, 3.9]} />
            <MeshTransmissionMaterial
              backside
              samples={6}
              resolution={512}
              transmission={0.92}
              roughness={0.08}
              thickness={0.4}
              chromaticAberration={0.03}
              color="#aebbd4"
              distortion={0.1}
              distortionScale={0.2}
              temporalDistortion={0}
            />
          </mesh>

          {/* Glass exterior walls - back */}
          <mesh position={[0, 1.5, -1.95]}>
            <boxGeometry args={[4.9, 3.2, 0.08]} />
            <MeshTransmissionMaterial
              backside
              samples={6}
              resolution={512}
              transmission={0.92}
              roughness={0.08}
              thickness={0.4}
              chromaticAberration={0.03}
              color="#aebbd4"
              distortion={0.1}
              distortionScale={0.2}
              temporalDistortion={0}
            />
          </mesh>

          {/* Front facade - premium glass */}
          <mesh position={[0, 1.9, 1.95]}>
            <boxGeometry args={[4.9, 2.5, 0.06]} />
            <MeshTransmissionMaterial
              backside
              samples={6}
              resolution={512}
              transmission={0.88}
              roughness={0.05}
              thickness={0.3}
              chromaticAberration={0.02}
              color="#d4dce8"
              distortion={0.05}
              distortionScale={0.1}
              temporalDistortion={0}
            />
          </mesh>
        </>
      )}

      {/* Stone columns - front facade ground floor */}
      {[-2.0, -0.7, 0.7, 2.0].map((x, i) => (
        <mesh key={`column-${i}`} position={[x, 0.3, 1.95]}>
          <boxGeometry args={[0.2, 0.7, 0.15]} />
          <meshStandardMaterial
            color="#d4c4b0"
            roughness={0.6}
          />
        </mesh>
      ))}

      {/* Ground floor arched windows - HIGH emissive for bloom */}
      {[-1.4, -0.35, 0.7, 1.4].map((x, i) => (
        <mesh key={`arch-${i}`} position={[x, 0.35, 1.97]}>
          <boxGeometry args={[0.55, 0.55, 0.02]} />
          <meshStandardMaterial
            color="#fff5e0"
            emissive="#ffcc66"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Upper floor windows grid - HIGH emissive for bloom */}
      {[1, 2, 3, 4, 5].map((floor) =>
        [-1.8, -0.9, 0, 0.9, 1.8].map((x, i) => (
          <mesh
            key={`window-${floor}-${i}`}
            position={[x, 0.5 + floor * 0.5, 1.97]}
          >
            <boxGeometry args={[0.35, 0.3, 0.02]} />
            <meshStandardMaterial
              color="#fff8e8"
              emissive="#ffdd88"
              emissiveIntensity={2.5}
              toneMapped={false}
            />
          </mesh>
        ))
      )}

      {/* Roof with subtle detail */}
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[5.0, 0.12, 4.0]} />
        <meshStandardMaterial 
          color="#6b5b4a" 
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

      {/* Roof edge trim */}
      <mesh position={[0, 3.28, 0]}>
        <boxGeometry args={[5.1, 0.04, 4.1]} />
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
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5}
      />
      
      {/* Floating sparkles inside the building */}
      <Sparkles
        count={40}
        scale={[4, 3, 3.5]}
        position={[0, 1.5, 0]}
        size={1.5}
        speed={0.3}
        opacity={0.4}
        color="#ffeedd"
      />

      {/* Night scene lighting */}
      <ambientLight intensity={0.15} color="#0a0a1a" />
      <directionalLight position={[10, 15, 5]} intensity={0.3} color="#ffeedd" castShadow />
      
      {/* Warm interior point lights - enhanced for bloom */}
      <pointLight position={[0, 1, 0]} intensity={2} color="#fff5e0" distance={10} />
      <pointLight position={[-1.5, 2, 0]} intensity={1.2} color="#fef3c7" distance={8} />
      <pointLight position={[1.5, 2, 0]} intensity={1.2} color="#fef3c7" distance={8} />
      <pointLight position={[0, 0.5, 1.5]} intensity={1.5} color="#fff8e8" distance={6} />
      <pointLight position={[0, 2.5, 0]} intensity={0.8} color="#ffeedd" distance={8} />

      <BuildingExterior selectedFloor={selectedFloor} />

      {/* Floor plates with textures */}
      <Suspense fallback={null}>
        {floorsData.map((floor, index) => (
          <FloorPlateWithTexture
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

      {/* Post-processing effects - Premium night city vibe */}
      <EffectComposer multisampling={4}>
        <Bloom 
          luminanceThreshold={1.0}
          luminanceSmoothing={0.9}
          intensity={0.5}
          mipmapBlur
        />
        <Vignette 
          eskil={false}
          offset={0.1}
          darkness={0.5}
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
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [6, 4, 6], fov: 45 }}
        shadows
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        style={{ background: "linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f1e 100%)" }}
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

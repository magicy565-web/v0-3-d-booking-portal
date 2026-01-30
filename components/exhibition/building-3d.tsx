"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Html, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { floorsData, type Floor, type Zone, getStatusColor } from "@/lib/floor-data";
import { getFloorPlanImage } from "@/lib/zone-images";

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

  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y =
        zone.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02 + 0.12;
    }
  });

  const statusColor = getStatusColor(zone.status);
  const displayColor = isSelected ? "#fbbf24" : hovered ? "#f59e0b" : zone.color;
  const zoneOpacity = isSelected ? 0.6 : hovered ? 0.5 : 0.3;

  return (
    <group position={[zone.position[0], zone.position[1] + 0.08, zone.position[2]]}>
      {/* Zone volume - semi-transparent glass effect */}
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
        position={[0, 0.05, 0]}
      >
        <boxGeometry args={[zone.size[0], zone.size[1] * 1.5, zone.size[2]]} />
        <meshPhysicalMaterial
          color={displayColor}
          transparent
          opacity={zoneOpacity}
          roughness={0.1}
          metalness={0.1}
          transmission={0.3}
          thickness={0.5}
        />
      </mesh>

      {/* Status indicator - glowing sphere */}
      <mesh position={[zone.size[0] / 2 - 0.08, 0.18, zone.size[2] / 2 - 0.08]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Zone label on hover or select */}
      {(hovered || isSelected) && (
        <Html
          position={[0, 0.35, 0]}
          center
          distanceFactor={5}
          style={{ pointerEvents: "none" }}
        >
          <div className="rounded-xl bg-card/95 px-4 py-2.5 text-xs shadow-xl border border-border/50 backdrop-blur-md whitespace-nowrap">
            <div className="font-bold text-card-foreground">{zone.name}</div>
            <div className="text-muted-foreground mt-0.5">{zone.area} sqm | {zone.type}</div>
          </div>
        </Html>
      )}

      {/* Edge lines for zone boundary */}
      <lineSegments position={[0, 0.05, 0]}>
        <edgesGeometry
          args={[new THREE.BoxGeometry(zone.size[0], zone.size[1] * 1.5, zone.size[2])]}
        />
        <lineBasicMaterial
          color={isSelected ? "#fbbf24" : hovered ? "#f59e0b" : "#6b5b4a"}
          transparent
          opacity={isSelected ? 0.9 : hovered ? 0.7 : 0.4}
        />
      </lineSegments>
    </group>
  );
}

function BuildingExterior({ selectedFloor }: { selectedFloor: number | null }) {
  const glassOpacity = selectedFloor ? 0.15 : 0.6;
  const wallOpacity = selectedFloor ? 0.2 : 0.85;

  return (
    <group>
      {/* Building base/foundation - stone look */}
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[5.2, 0.5, 4.2]} />
        <meshStandardMaterial 
          color="#a89880" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Glass exterior walls - left side */}
      <mesh position={[-2.4, 1.5, 0]}>
        <boxGeometry args={[0.1, 3.2, 3.9]} />
        <meshPhysicalMaterial
          color="#e8e4dc"
          transparent
          opacity={glassOpacity}
          roughness={0.05}
          metalness={0.1}
          transmission={0.85}
          thickness={0.5}
        />
      </mesh>

      {/* Glass exterior walls - right side */}
      <mesh position={[2.4, 1.5, 0]}>
        <boxGeometry args={[0.1, 3.2, 3.9]} />
        <meshPhysicalMaterial
          color="#e8e4dc"
          transparent
          opacity={glassOpacity}
          roughness={0.05}
          metalness={0.1}
          transmission={0.85}
          thickness={0.5}
        />
      </mesh>

      {/* Glass exterior walls - back */}
      <mesh position={[0, 1.5, -1.95]}>
        <boxGeometry args={[4.9, 3.2, 0.1]} />
        <meshPhysicalMaterial
          color="#e8e4dc"
          transparent
          opacity={glassOpacity}
          roughness={0.05}
          metalness={0.1}
          transmission={0.85}
          thickness={0.5}
        />
      </mesh>

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

      {/* Front facade - glass with warm glow */}
      <mesh position={[0, 1.9, 1.95]}>
        <boxGeometry args={[4.9, 2.5, 0.08]} />
        <meshPhysicalMaterial
          color="#fff8e8"
          transparent
          opacity={glassOpacity}
          roughness={0.05}
          metalness={0.05}
          transmission={0.9}
          thickness={0.3}
        />
      </mesh>

      {/* Ground floor arched windows - warm interior light */}
      {[-1.4, -0.35, 0.7, 1.4].map((x, i) => (
        <mesh key={`arch-${i}`} position={[x, 0.35, 1.97]}>
          <boxGeometry args={[0.55, 0.55, 0.02]} />
          <meshStandardMaterial
            color="#fff5e0"
            emissive="#fef3c7"
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* Upper floor windows grid - glowing */}
      {[1, 2, 3, 4, 5].map((floor) =>
        [-1.8, -0.9, 0, 0.9, 1.8].map((x, i) => (
          <mesh
            key={`window-${floor}-${i}`}
            position={[x, 0.5 + floor * 0.5, 1.97]}
          >
            <boxGeometry args={[0.35, 0.3, 0.02]} />
            <meshStandardMaterial
              color="#fff8e8"
              emissive="#fef3c7"
              emissiveIntensity={0.5}
              transparent
              opacity={0.85}
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
      {/* Night scene lighting */}
      <ambientLight intensity={0.25} color="#1a1a2e" />
      <directionalLight position={[10, 15, 5]} intensity={0.4} color="#ffeedd" />
      
      {/* Warm interior point lights */}
      <pointLight position={[0, 1, 0]} intensity={1.5} color="#fff5e0" distance={8} />
      <pointLight position={[-1, 2, 0]} intensity={0.8} color="#fef3c7" distance={6} />
      <pointLight position={[1, 2, 0]} intensity={0.8} color="#fef3c7" distance={6} />
      <pointLight position={[0, 0.5, 1.5]} intensity={1.2} color="#fff8e8" distance={5} />

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

      <Environment preset="night" />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          intensity={0.6}
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
    <div className="h-full w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Canvas
        camera={{ position: [6, 4, 6], fov: 45 }}
        shadows
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
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

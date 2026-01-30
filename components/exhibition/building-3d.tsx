"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Environment, Html, Float } from "@react-three/drei";
import * as THREE from "three";
import { floorsData, type Floor, type Zone, getStatusColor } from "@/lib/floor-data";

interface BuildingProps {
  selectedFloor: number | null;
  selectedZone: Zone | null;
  onFloorSelect: (floorId: number | null) => void;
  onZoneSelect: (zone: Zone | null, floor: Floor) => void;
}

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

  const opacity = isAboveSelected ? 0.15 : isSelected ? 1 : 0.85;
  const floorHeight = 0.08;

  return (
    <group position={[0, yPosition, 0]}>
      {/* Main floor plate */}
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
      >
        <boxGeometry args={[4.5, floorHeight, 3.5]} />
        <meshStandardMaterial
          color={hovered ? "#c9a86c" : "#e8dcc8"}
          transparent
          opacity={opacity}
          roughness={0.3}
        />
      </mesh>

      {/* Floor label */}
      {!isAboveSelected && (
        <Html
          position={[-2.5, 0.1, 0]}
          center
          distanceFactor={8}
          style={{ pointerEvents: "none" }}
        >
          <div className="rounded bg-foreground/90 px-2 py-1 text-xs font-medium text-background whitespace-nowrap">
            {floor.id}F
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

      {/* Floor edges/walls simulation */}
      <lineSegments>
        <edgesGeometry
          args={[new THREE.BoxGeometry(4.5, floorHeight, 3.5)]}
        />
        <lineBasicMaterial color="#8b7355" transparent opacity={opacity * 0.8} />
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
        zone.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02 + 0.15;
    }
  });

  const statusColor = getStatusColor(zone.status);
  const displayColor = isSelected ? "#fbbf24" : hovered ? "#f59e0b" : zone.color;

  return (
    <group position={[zone.position[0], zone.position[1] + 0.1, zone.position[2]]}>
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
        <boxGeometry args={[zone.size[0], zone.size[1], zone.size[2]]} />
        <meshStandardMaterial
          color={displayColor}
          transparent
          opacity={0.85}
          roughness={0.4}
        />
      </mesh>

      {/* Status indicator */}
      <mesh position={[zone.size[0] / 2 - 0.08, 0.15, zone.size[2] / 2 - 0.08]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Zone label on hover or select */}
      {(hovered || isSelected) && (
        <Html
          position={[0, 0.3, 0]}
          center
          distanceFactor={6}
          style={{ pointerEvents: "none" }}
        >
          <div className="rounded-lg bg-card/95 px-3 py-2 text-xs shadow-lg border border-border backdrop-blur-sm whitespace-nowrap">
            <div className="font-semibold text-card-foreground">{zone.name}</div>
            <div className="text-muted-foreground">{zone.area} sqm</div>
          </div>
        </Html>
      )}

      {/* Edge lines */}
      <lineSegments position={[0, 0.05, 0]}>
        <edgesGeometry
          args={[new THREE.BoxGeometry(zone.size[0], zone.size[1], zone.size[2])]}
        />
        <lineBasicMaterial
          color={isSelected ? "#fbbf24" : "#6b5b4a"}
          transparent
          opacity={0.6}
        />
      </lineSegments>
    </group>
  );
}

function BuildingExterior({ selectedFloor }: { selectedFloor: number | null }) {
  const floorHeight = 0.5;
  const baseHeight = 0.3;

  return (
    <group>
      {/* Building base/foundation */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[5, 0.4, 4]} />
        <meshStandardMaterial color="#9a8b7a" roughness={0.7} />
      </mesh>

      {/* Exterior walls - left side */}
      <mesh position={[-2.35, 1.5, 0]}>
        <boxGeometry args={[0.15, 3.2, 3.7]} />
        <meshStandardMaterial
          color="#d4c4b0"
          transparent
          opacity={selectedFloor ? 0.3 : 0.9}
          roughness={0.4}
        />
      </mesh>

      {/* Exterior walls - right side */}
      <mesh position={[2.35, 1.5, 0]}>
        <boxGeometry args={[0.15, 3.2, 3.7]} />
        <meshStandardMaterial
          color="#d4c4b0"
          transparent
          opacity={selectedFloor ? 0.3 : 0.9}
          roughness={0.4}
        />
      </mesh>

      {/* Exterior walls - back */}
      <mesh position={[0, 1.5, -1.85]}>
        <boxGeometry args={[4.7, 3.2, 0.15]} />
        <meshStandardMaterial
          color="#d4c4b0"
          transparent
          opacity={selectedFloor ? 0.3 : 0.9}
          roughness={0.4}
        />
      </mesh>

      {/* Front facade with arched windows (ground floor) */}
      <mesh position={[0, 0.3, 1.85]}>
        <boxGeometry args={[4.7, 0.6, 0.15]} />
        <meshStandardMaterial
          color="#d4c4b0"
          transparent
          opacity={selectedFloor ? 0.3 : 0.9}
          roughness={0.4}
        />
      </mesh>

      {/* Upper floors front */}
      <mesh position={[0, 1.9, 1.85]}>
        <boxGeometry args={[4.7, 2.6, 0.1]} />
        <meshStandardMaterial
          color="#d4c4b0"
          transparent
          opacity={selectedFloor ? 0.2 : 0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[4.8, 0.15, 3.9]} />
        <meshStandardMaterial color="#8b7355" roughness={0.6} />
      </mesh>

      {/* Window frames - ground floor arches (decorative) */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <mesh key={`arch-${i}`} position={[x, 0.25, 1.92]}>
          <boxGeometry args={[0.6, 0.5, 0.05]} />
          <meshStandardMaterial
            color="#fef3c7"
            emissive="#fef3c7"
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Upper floor windows */}
      {[1, 2, 3, 4, 5].map((floor) =>
        [-1.8, -1.0, -0.2, 0.6, 1.4].map((x, i) => (
          <mesh
            key={`window-${floor}-${i}`}
            position={[x, 0.5 + floor * 0.5, 1.92]}
          >
            <boxGeometry args={[0.4, 0.35, 0.02]} />
            <meshStandardMaterial
              color="#fef3c7"
              emissive="#fef3c7"
              emissiveIntensity={0.2}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))
      )}
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
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#fef3c7" />

      <BuildingExterior selectedFloor={selectedFloor} />

      {/* Floor plates */}
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

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 1.2, 0]}
      />

      <Environment preset="city" />
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
        gl={{ antialias: true }}
      >
        <Scene
          selectedFloor={selectedFloor}
          selectedZone={selectedZone}
          onFloorSelect={onFloorSelect}
          onZoneSelect={onZoneSelect}
        />
      </Canvas>
    </div>
  );
}

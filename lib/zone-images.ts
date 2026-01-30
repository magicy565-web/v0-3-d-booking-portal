// Zone interior render images - using local paths
export const ZONE_IMAGES: Record<string, string> = {
  // 1F zones
  "1f-retail": "/images/zone-1f-retail.jpg",
  "1f-industry": "/images/zone-1f-industry.jpg",
  "1f-multifunction": "/images/zone-1f-multifunction.jpg",
  "1f-digital": "/images/zone-1f-digital.jpg",
  
  // 2F zones
  "2f-joint": "/images/zone-2f-joint.jpg",
  
  // 3F zones
  "3f-pet": "/images/zone-3f-pet.jpg",
  "3f-department": "/images/zone-3f-department.jpg",
  "3f-appliance": "/images/zone-3f-appliance.jpg",
};

// Floor plan images
export const FLOOR_PLAN_IMAGES: Record<number, string> = {
  1: "/images/floor-plan-1f.png",
  2: "/images/floor-plan-2f.png",
  3: "/images/floor-plan-3f.png",
  4: "/images/floor-plan-4f.png",
  5: "/images/floor-plan-5f.png",
  6: "/images/floor-plan-6f.png",
};

// Building exterior image
export const BUILDING_EXTERIOR_IMAGE = "/images/building-night.jpg";

// Gallery structure cross-section
export const GALLERY_STRUCTURE_IMAGE = "/images/gallery-structure.jpg";

export function getZoneImage(zoneId: string): string | undefined {
  return ZONE_IMAGES[zoneId];
}

export function getFloorPlanImage(floorId: number): string | undefined {
  return FLOOR_PLAN_IMAGES[floorId];
}

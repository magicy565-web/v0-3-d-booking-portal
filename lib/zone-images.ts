// Zone interior render images - using local paths
export const ZONE_IMAGES: Record<string, string> = {
  // 1F zones
  "1f-retail": "/images/zone-1f-retail.jpg",
  "1f-industry": "/images/zone-1f-industry.jpg",
  "1f-multifunction": "/images/zone-1f-multifunction.jpg",
  "1f-digital": "/images/zone-1f-digital.jpg",
  
  // 2F zones
  "2f-showroom-a": "/images/zone-2f-showroom.jpg",
  "2f-showroom-b": "/images/zone-2f-showroom.jpg",
  "2f-showroom-c": "/images/zone-2f-showroom.jpg",
  "2f-joint": "/images/zone-2f-joint.jpg",
  
  // 3F zones
  "3f-pet": "/images/zone-3f-pet.jpg",
  "3f-department": "/images/zone-3f-department.jpg",
  "3f-appliance": "/images/zone-3f-appliance.jpg",
  "3f-textile": "/images/zone-3f-lifestyle.jpg",
  "3f-stationery": "/images/zone-3f-lifestyle.jpg",
  "3f-jewelry": "/images/zone-3f-jewelry.jpg",
  "3f-socks": "/images/zone-3f-lifestyle.jpg",
  "3f-clothing": "/images/zone-3f-lifestyle.jpg",
  
  // 4F zones - Livestreaming center
  "4f-livestream-large": "/images/zone-4f-livestream.jpg",
  "4f-livestream-small-a": "/images/zone-4f-livestream.jpg",
  "4f-livestream-small-b": "/images/zone-4f-livestream.jpg",
  "4f-tiktok": "/images/zone-4f-livestream.jpg",
  
  // 5F zones - Office & Operations
  "5f-open-office": "/images/zone-5f-office.jpg",
  "5f-private-office": "/images/zone-5f-office.jpg",
  "5f-conference": "/images/zone-5f-office.jpg",
  
  // 6F zones - VIP Executive
  "6f-vip-lounge": "/images/zone-6f-vip.jpg",
  "6f-meeting-suite": "/images/zone-6f-vip.jpg",
  "6f-presidential": "/images/zone-6f-vip.jpg",
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

// Floor preview images - representative image for each floor
export const FLOOR_PREVIEW_IMAGES: Record<number, string> = {
  1: "/images/zone-1f-retail.jpg",
  2: "/images/zone-2f-showroom.jpg",
  3: "/images/zone-3f-lifestyle.jpg",
  4: "/images/zone-4f-livestream.jpg",
  5: "/images/zone-5f-office.jpg",
  6: "/images/zone-6f-vip.jpg",
};

export function getZoneImage(zoneId: string): string | undefined {
  return ZONE_IMAGES[zoneId];
}

export function getFloorPlanImage(floorId: number): string | undefined {
  return FLOOR_PLAN_IMAGES[floorId];
}

export type ZoneStatus = "available" | "booked" | "pending";

export interface Zone {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  area: number; // in sqm
  status: ZoneStatus;
  price: number; // per day
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  description: string;
  image?: string;
}

export interface Floor {
  id: number;
  name: string;
  nameEn: string;
  coreFunction: string;
  zones: Zone[];
  color: string;
  floorPlanImage: string;
}

export const floorsData: Floor[] = [
  {
    id: 1,
    name: "1F: 全球选品与特色产业带展厅",
    nameEn: "1F: Global Selection & Industry Belt Exhibition",
    coreFunction: "沉浸式展示、零售体验、产业带推介",
    color: "#F5E6A3",
    floorPlanImage: "/images/1f.png",
    zones: [
      {
        id: "1f-retail",
        name: "零售产品区与销售柜台",
        nameEn: "Retail Product Area",
        type: "Retail",
        area: 280,
        status: "available",
        price: 2500,
        position: [-1.2, 0, -0.5],
        size: [1.8, 0.15, 1.6],
        color: "#F5E6A3",
        description: "沉浸式零售体验区，适合产品展示与现场销售",
        image: "/images/1-e6-a5-bc-e7-bb-bc-e5-90-88-e8-b4-a7-e6-9e-b6.jpg"
      },
      {
        id: "1f-industry",
        name: "固定展架与橱窗展台",
        nameEn: "Fixed Display & Window Showcase",
        type: "Display",
        area: 180,
        status: "booked",
        price: 1800,
        position: [-1.2, 0, 0.8],
        size: [1.5, 0.15, 1.0],
        color: "#F5E6A3",
        description: "中国特色产业海外展厅，展示各地优势出海产品",
        image: "/images/1-e6-a5-bc-e4-b8-ad-e5-9e-8b-e5-b1-95-e5-8f-b0.jpg"
      },
      {
        id: "1f-multifunction",
        name: "多功能空间",
        nameEn: "Multi-function Space",
        type: "Event",
        area: 320,
        status: "available",
        price: 3500,
        position: [1.0, 0, 0],
        size: [1.6, 0.15, 2.0],
        color: "#E8D4F0",
        description: "灵活开放空间，适合活动、发布会及大型展示",
        image: "/images/1-e6-a5-bc-e5-b1-95-e5-8f-b0-e5-b8-a6-e6-b4-bd-e8-b0-88-e5-8c-ba.jpg"
      },
      {
        id: "1f-digital",
        name: "互动数字屏墙与观看区",
        nameEn: "Interactive Digital Wall",
        type: "Digital",
        area: 120,
        status: "pending",
        price: 2000,
        position: [1.0, 0, 1.2],
        size: [1.2, 0.15, 0.8],
        color: "#E8D4F0",
        description: "融合线下体验与数字化选品功能",
        image: "/images/1-e6-a5-bc-e4-ba-92-e5-8a-a8-e5-8c-ba-e5-b1-95-e5-8f-b0.jpg"
      }
    ]
  },
  {
    id: 2,
    name: "2F: 品牌生态与独立展区",
    nameEn: "2F: Brand Ecosystem & Independent Exhibition",
    coreFunction: "品牌孵化、独立形象展示",
    color: "#C4D4C0",
    floorPlanImage: "/images/2f.png",
    zones: [
      {
        id: "2f-independent-1",
        name: "品牌独立展厅 A",
        nameEn: "Brand Independent Showroom A",
        type: "Showroom",
        area: 150,
        status: "booked",
        price: 3200,
        position: [-1.5, 0, -0.8],
        size: [1.2, 0.15, 1.4],
        color: "#C4D4C0",
        description: "为成熟的出海品牌提供独立的展示空间"
      },
      {
        id: "2f-independent-2",
        name: "品牌独立展厅 B",
        nameEn: "Brand Independent Showroom B",
        type: "Showroom",
        area: 120,
        status: "available",
        price: 2800,
        position: [-1.5, 0, 0.6],
        size: [1.0, 0.15, 1.2],
        color: "#C4D4C0",
        description: "强化品牌调性与故事感的专属空间"
      },
      {
        id: "2f-joint",
        name: "联合品牌展区",
        nameEn: "Joint Brand Exhibition Area",
        type: "Joint Exhibition",
        area: 400,
        status: "available",
        price: 2200,
        position: [0.8, 0, 0],
        size: [2.0, 0.15, 2.2],
        color: "#E8C4C4",
        description: "灵活的开放式布局，适合新兴品牌或同类目品牌进行联合策展",
        image: "/images/2-e6-a5-bc-e8-81-94-e5-90-88-e5-93-81-e7-89-8c-e5-b1-95-e5-8c-ba.jpg"
      }
    ]
  },
  {
    id: 3,
    name: "3F: 生活方式与垂直类目选品",
    nameEn: "3F: Lifestyle & Vertical Category Selection",
    coreFunction: "精细化选品、垂直品类展示",
    color: "#D4C4B0",
    floorPlanImage: "/images/3f.png",
    zones: [
      {
        id: "3f-pet",
        name: "宠物展区",
        nameEn: "Pet Zone",
        type: "Category",
        area: 100,
        status: "available",
        price: 1600,
        position: [-1.6, 0, -1.0],
        size: [0.9, 0.15, 0.9],
        color: "#C4D4C0",
        description: "针对高增长的出海宠物经济，专门设立的场景化展示区",
        image: "/images/3-e6-a5-bc-e7-89-b9-e8-89-b2-e4-ba-a7-e4-b8-9a-e5-b1-95-e5-8c-baa.jpg"
      },
      {
        id: "3f-department",
        name: "百货展区",
        nameEn: "Department Store Zone",
        type: "Category",
        area: 120,
        status: "booked",
        price: 1400,
        position: [-1.6, 0, 0.2],
        size: [0.9, 0.15, 1.0],
        color: "#C4D4C0",
        description: "涵盖家居、日用等全品类百货，提供一站式选品体验",
        image: "/images/3-e6-a5-bc-e7-89-b9-e8-89-b2-e4-ba-a7-e4-b8-9a-e5-8c-bac.jpg"
      },
      {
        id: "3f-textile",
        name: "家纺展区",
        nameEn: "Home Textile Zone",
        type: "Category",
        area: 90,
        status: "available",
        price: 1500,
        position: [0.5, 0, -1.0],
        size: [0.8, 0.15, 0.8],
        color: "#E8C4C4",
        description: "家纺产品专区"
      },
      {
        id: "3f-stationery",
        name: "文具展区",
        nameEn: "Stationery Zone",
        type: "Category",
        area: 80,
        status: "available",
        price: 1200,
        position: [1.4, 0, -1.0],
        size: [0.7, 0.15, 0.8],
        color: "#E8C4C4",
        description: "文具创意产品展区"
      },
      {
        id: "3f-appliance",
        name: "家电展区",
        nameEn: "Home Appliance Zone",
        type: "Category",
        area: 130,
        status: "pending",
        price: 1800,
        position: [0.5, 0, 0],
        size: [1.0, 0.15, 1.0],
        color: "#E8C4C4",
        description: "智能家电与小家电展示区",
        image: "/images/3-e6-a5-bc-e7-89-b9-e8-89-b2-e4-ba-a7-e4-b8-9a-e5-8c-bab.jpg"
      },
      {
        id: "3f-jewelry",
        name: "珠宝展区",
        nameEn: "Jewelry Zone",
        type: "Category",
        area: 70,
        status: "available",
        price: 2000,
        position: [-0.5, 0, 1.0],
        size: [0.7, 0.15, 0.7],
        color: "#E8C4C4",
        description: "珠宝首饰精品展区"
      },
      {
        id: "3f-socks",
        name: "袜子展区",
        nameEn: "Socks Zone",
        type: "Category",
        area: 60,
        status: "available",
        price: 1000,
        position: [0.4, 0, 1.0],
        size: [0.6, 0.15, 0.7],
        color: "#E8C4C4",
        description: "袜类产品专区"
      },
      {
        id: "3f-clothing",
        name: "服装展区",
        nameEn: "Clothing Zone",
        type: "Category",
        area: 110,
        status: "booked",
        price: 1700,
        position: [1.3, 0, 1.0],
        size: [0.9, 0.15, 0.8],
        color: "#E8C4C4",
        description: "服装服饰展示区"
      }
    ]
  },
  {
    id: 4,
    name: "4F: 数字媒体与全球直播中心",
    nameEn: "4F: Digital Media & Global Livestreaming Center",
    coreFunction: "跨境直播、内容生产、TikTok运营",
    color: "#B0C4D4",
    floorPlanImage: "/images/4f.png",
    zones: [
      {
        id: "4f-livestream-large",
        name: "大型直播区域",
        nameEn: "Large Livestreaming Area",
        type: "Livestream",
        area: 200,
        status: "available",
        price: 3500,
        position: [-1.5, 0, -0.5],
        size: [1.2, 0.15, 1.5],
        color: "#A0A0A0",
        description: "配置专业的大型直播区域，配备专业绿幕背景"
      },
      {
        id: "4f-tiktok",
        name: "TikTok专属直播间",
        nameEn: "TikTok Dedicated Studio",
        type: "Livestream",
        area: 80,
        status: "booked",
        price: 2800,
        position: [-1.5, 0, 0.8],
        size: [0.8, 0.15, 0.8],
        color: "#A0A0A0",
        description: "专为TikTok等海外社交媒体平台设计，模拟真实海外居家或消费场景"
      },
      {
        id: "4f-studio-1",
        name: "直播间 A",
        nameEn: "Studio A",
        type: "Studio",
        area: 50,
        status: "available",
        price: 1500,
        position: [0.8, 0, -0.8],
        size: [0.6, 0.15, 0.6],
        color: "#E8C4C4",
        description: "小型直播间，适合单人或双人直播"
      },
      {
        id: "4f-studio-2",
        name: "直播间 B",
        nameEn: "Studio B",
        type: "Studio",
        area: 50,
        status: "available",
        price: 1500,
        position: [1.4, 0, -0.8],
        size: [0.6, 0.15, 0.6],
        color: "#C4D4E8",
        description: "小型直播间，适合单人或双人直播"
      },
      {
        id: "4f-studio-3",
        name: "直播间 C",
        nameEn: "Studio C",
        type: "Studio",
        area: 50,
        status: "pending",
        price: 1500,
        position: [0.8, 0, 0],
        size: [0.6, 0.15, 0.6],
        color: "#C4E8C4",
        description: "小型直播间，适合单人或双人直播"
      },
      {
        id: "4f-studio-4",
        name: "直播间 D",
        nameEn: "Studio D",
        type: "Studio",
        area: 50,
        status: "available",
        price: 1500,
        position: [1.4, 0, 0],
        size: [0.6, 0.15, 0.6],
        color: "#E8D4C4",
        description: "小型直播间，适合单人或双人直播"
      }
    ]
  },
  {
    id: 5,
    name: "5F: 全球运营与行政中心",
    nameEn: "5F: Global Operations & Administrative Center",
    coreFunction: "办公运营、团队协作",
    color: "#C4C4D4",
    floorPlanImage: "/images/5f.png",
    zones: [
      {
        id: "5f-open-office",
        name: "现代化办公区",
        nameEn: "Modern Office Area",
        type: "Office",
        area: 450,
        status: "booked",
        price: 0,
        position: [-1.0, 0, 0],
        size: [1.8, 0.15, 2.0],
        color: "#C4C4D4",
        description: "开放式办公环境，服务于跨境电商运营团队"
      },
      {
        id: "5f-conference",
        name: "会议室区域",
        nameEn: "Conference Room",
        type: "Meeting",
        area: 80,
        status: "booked",
        price: 0,
        position: [1.2, 0, -0.5],
        size: [0.8, 0.15, 1.0],
        color: "#4A5568",
        description: "大型会议室，适合团队会议与培训"
      }
    ]
  },
  {
    id: 6,
    name: "6F: 总裁行政与高端接待",
    nameEn: "6F: Executive & Premium Reception",
    coreFunction: "高层会晤、商务宴请、私密社交",
    color: "#D4B896",
    floorPlanImage: "/images/6f.png",
    zones: [
      {
        id: "6f-vip-lounge",
        name: "专属VIP休息室",
        nameEn: "Exclusive VIP Lounge",
        type: "VIP",
        area: 120,
        status: "available",
        price: 5000,
        position: [-1.5, 0, -0.5],
        size: [1.0, 0.15, 1.2],
        color: "#D4B896",
        description: "提供静谧的商务洽谈环境"
      },
      {
        id: "6f-meeting",
        name: "总裁会议套间",
        nameEn: "Executive Meeting Suite",
        type: "Executive",
        area: 100,
        status: "booked",
        price: 4500,
        position: [-1.5, 0, 0.7],
        size: [0.9, 0.15, 1.0],
        color: "#D4B896",
        description: "高规格私密套房，集休息、会客于一体"
      },
      {
        id: "6f-presidential",
        name: "总裁招待间",
        nameEn: "Presidential Reception Suite",
        type: "Presidential",
        area: 150,
        status: "available",
        price: 6000,
        position: [0.5, 0, 0.5],
        size: [1.2, 0.15, 1.0],
        color: "#C4B8A8",
        description: "位于本层核心位置，非传统会议室，而是集休息、会客于一体的高规格私密套房"
      },
      {
        id: "6f-terrace",
        name: "景观露台",
        nameEn: "Scenic Terrace",
        type: "Outdoor",
        area: 80,
        status: "available",
        price: 3000,
        position: [1.5, 0, -0.5],
        size: [0.8, 0.15, 1.0],
        color: "#A8C4B8",
        description: "连接室内的户外休闲区域，可俯瞰城市景观"
      }
    ]
  }
];

export const getStatusColor = (status: ZoneStatus): string => {
  switch (status) {
    case "available":
      return "#22c55e";
    case "booked":
      return "#ef4444";
    case "pending":
      return "#f59e0b";
    default:
      return "#6b7280";
  }
};

export const getStatusLabel = (status: ZoneStatus): string => {
  switch (status) {
    case "available":
      return "Available";
    case "booked":
      return "Booked";
    case "pending":
      return "Pending";
    default:
      return "Unknown";
  }
};

export const getStatusLabelCn = (status: ZoneStatus): string => {
  switch (status) {
    case "available":
      return "可预订";
    case "booked":
      return "已预订";
    case "pending":
      return "审核中";
    default:
      return "未知";
  }
};

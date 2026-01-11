export const MODULES = [
  {
    id: 'profile',
    name: 'The Profile',
    subtitle: 'Identity & Contact',
    description: 'Lead Capture & CRM Entry',
    icon: 'User',
    color: 'accent',
  },
  {
    id: 'canvas',
    name: 'The Canvas',
    subtitle: 'Land & Topography',
    description: 'Physical Constraints & Irrigation Design',
    icon: 'Map',
    color: 'accent',
  },
  {
    id: 'heart',
    name: 'The Heart',
    subtitle: 'Borewell Hydraulics',
    description: 'Pump Selection & Head Calculation',
    icon: 'Droplets',
    color: 'accent',
  },
  {
    id: 'arteries',
    name: 'The Arteries',
    subtitle: 'Piping & Storage',
    description: 'Friction Calculation & Delivery Head',
    icon: 'GitBranch',
    color: 'accent',
  },
  {
    id: 'pulse',
    name: 'The Pulse',
    subtitle: 'Power Infrastructure',
    description: 'Controller Selection & Protection',
    icon: 'Zap',
    color: 'accent',
  },
  {
    id: 'shelter',
    name: 'The Shelter',
    subtitle: 'Logistics & Safety',
    description: 'Installation Planning',
    icon: 'Home',
    color: 'accent',
  },
  {
    id: 'biology',
    name: 'The Biology',
    subtitle: 'Crops & Demand',
    description: 'Water Volume Calculation',
    icon: 'Leaf',
    color: 'accent',
  },
  {
    id: 'baseline',
    name: 'The Baseline',
    subtitle: 'Retrofit Check',
    description: 'Efficiency Benchmarking',
    icon: 'RefreshCw',
    color: 'accent',
  },
  {
    id: 'shed',
    name: 'The Shed',
    subtitle: 'Equipment Inventory',
    description: 'Cross-Selling Opportunities',
    icon: 'Warehouse',
    color: 'accent',
  },
  {
    id: 'vision',
    name: 'The Vision',
    subtitle: 'Economics & ROI',
    description: 'Closing the Sale',
    icon: 'TrendingUp',
    color: 'accent',
  },
];

export const SOIL_TYPES = [
  { value: 'clay', label: 'Clay', color: '#8B4513' },
  { value: 'red', label: 'Red Soil', color: '#CD5C5C' },
  { value: 'sandy', label: 'Sandy', color: '#F4A460' },
  { value: 'black', label: 'Black Cotton', color: '#2F2F2F' },
  { value: 'loamy', label: 'Loamy', color: '#654321' },
];

export const TOPOGRAPHY_TYPES = [
  { value: 'flat', label: 'Flat' },
  { value: 'sloped', label: 'Sloped' },
  { value: 'hilly', label: 'Hilly' },
];

export const FIELD_GEOMETRIES = [
  { value: 'rectangular', label: 'Rectangular' },
  { value: 'square', label: 'Square' },
  { value: 'circular', label: 'Circular' },
  { value: 'irregular', label: 'Irregular' },
];

export const WATER_SOURCES = [
  { value: 'borewell', label: 'Borewell' },
  { value: 'open-well', label: 'Open Well' },
  { value: 'pond', label: 'Pond' },
  { value: 'canal', label: 'Canal' },
];

export const CASING_DIAMETERS = [
  { value: '4', label: '4 inches' },
  { value: '6', label: '6 inches' },
  { value: '6.5', label: '6.5 inches' },
];

export const WATER_QUALITIES = [
  { value: 'clear', label: 'Clear', color: '#87CEEB' },
  { value: 'white', label: 'White/Milky', color: '#F5F5F5' },
  { value: 'red', label: 'Red/Iron', color: '#CD5C5C' },
  { value: 'muddy', label: 'Muddy/Brown', color: '#8B4513' },
];

export const PIPE_MATERIALS = [
  { value: 'hdpe', label: 'HDPE', roughness: 150 },
  { value: 'pvc', label: 'PVC', roughness: 140 },
  { value: 'gi', label: 'GI', roughness: 120 },
];

export const DELIVERY_TARGETS = [
  { value: 'direct', label: 'Direct Irrigation' },
  { value: 'tank', label: 'Overhead Tank' },
  { value: 'sump', label: 'Ground Sump' },
];

export const POWER_SOURCES = [
  { value: 'grid', label: 'Grid Power' },
  { value: 'solar', label: 'Solar' },
  { value: 'generator', label: 'Generator' },
];

export const SHELTER_TYPES = [
  { value: 'concrete', label: 'Concrete Room' },
  { value: 'tin', label: 'Tin Shed' },
  { value: 'open', label: 'Open Air' },
];

export const IRRIGATION_METHODS = [
  { value: 'drip', label: 'Drip Irrigation', efficiency: 90 },
  { value: 'sprinkler', label: 'Sprinkler', efficiency: 75 },
  { value: 'flood', label: 'Flood Irrigation', efficiency: 60 },
];

export const CROP_TYPES = [
  { value: 'mango', label: 'Mango' },
  { value: 'coconut', label: 'Coconut' },
  { value: 'banana', label: 'Banana' },
  { value: 'sugarcane', label: 'Sugarcane' },
  { value: 'rice', label: 'Rice/Paddy' },
  { value: 'wheat', label: 'Wheat' },
  { value: 'cotton', label: 'Cotton' },
  { value: 'tomato', label: 'Tomato' },
  { value: 'onion', label: 'Onion' },
  { value: 'chili', label: 'Chili' },
  { value: 'vegetables', label: 'Mixed Vegetables' },
  { value: 'flowers', label: 'Flowers' },
  { value: 'grapes', label: 'Grapes' },
  { value: 'pomegranate', label: 'Pomegranate' },
  { value: 'citrus', label: 'Citrus Fruits' },
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

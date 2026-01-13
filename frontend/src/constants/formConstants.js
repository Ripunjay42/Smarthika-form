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
    subtitle: 'Power Connection',
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
  { value: 'black-clay', label: 'Black Cotton/Clay', color: '#2F2F2F' },
  { value: 'red-loam', label: 'Red Loam/Loam', color: '#CD5C5C' },
  { value: 'sandy', label: 'Sandy Soil/Sand', color: '#F4A460' },
  { value: 'rocky-mixed', label: 'Rocky/Mixed/Gravel', color: '#A9A9A9' },
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
  { value: 'other', label: 'Other' },
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

export const SYSTEM_VOLTAGES = [
  { value: '240', label: '240V' },
  { value: '415', label: '415V' },
];

export const GENSET_CAPACITIES = [
  { value: '5', label: '5 KVA' },
  { value: '7.5', label: '7.5 KVA' },
  { value: '10', label: '10 KVA' },
  { value: '15', label: '15 KVA' },
  { value: '20', label: '20 KVA' },
  { value: '25', label: '25 KVA' },
  { value: '30', label: '30 KVA' },
  { value: '50', label: '50 KVA' },
  { value: '75', label: '75 KVA' },
  { value: '100', label: '100 KVA' },
  { value: 'other', label: 'Other' },
];

export const SHELTER_TYPES = [
  { value: 'concrete', label: 'Concrete Room' },
  { value: 'tin', label: 'Tin Shed' },
  { value: 'open', label: 'Open Air' },
];

export const OLD_PUMP_TYPES = [
  { value: 'monoblock', label: 'Monoblock' },
  { value: 'submersible', label: 'Submersible' },
  { value: 'centrifugal', label: 'Centrifugal' },
  { value: 'other', label: 'Other' },
];

export const PIPE_CONDITIONS = [
  { value: 'new', label: 'New Pipes' },
  { value: 'reuse', label: 'Reuse Old Pipes' },
];

export const IRRIGATION_METHODS = [
  { value: 'drip', label: 'Drip Irrigation', efficiency: 90 },
  { value: 'sprinkler', label: 'Sprinkler', efficiency: 75 },
  { value: 'flood', label: 'Flood Irrigation', efficiency: 60 },
];

export const EQUIPMENT_LIST = [
  // Category A: Heavy Machinery
  { value: 'tractor-heavy', label: 'Tractor (Heavy)', category: 'Heavy Machinery', icon: 'Tractor', description: '45HP+' },
  { value: 'mini-tractor', label: 'Mini Tractor', category: 'Heavy Machinery', icon: 'Tractor', description: 'Orchard/Garden use' },
  { value: 'power-tiller', label: 'Power Tiller', category: 'Heavy Machinery', icon: 'RotateCw', description: 'Handlebar tiller' },
  { value: 'combine-harvester', label: 'Combine Harvester', category: 'Heavy Machinery', icon: 'Combine', description: 'Harvesting' },
  { value: 'jcb-excavator', label: 'JCB / Excavator', category: 'Heavy Machinery', icon: 'Excavator', description: 'Earthmoving' },
  
  // Category B: Implements & Attachments
  { value: 'rotavator', label: 'Rotavator', category: 'Implements & Attachments', icon: 'RotateCw', description: 'Rotating blades' },
  { value: 'cultivator-plough', label: 'Cultivator / Plough', category: 'Implements & Attachments', icon: 'Shovel', description: 'Soil preparation' },
  { value: 'seed-drill', label: 'Seed Drill', category: 'Implements & Attachments', icon: 'Zap', description: 'Seeding' },
  { value: 'laser-leveler', label: 'Laser Leveler', category: 'Implements & Attachments', icon: 'Zap', description: 'Field leveling' },
  { value: 'trolley-trailer', label: 'Trolley / Trailer', category: 'Implements & Attachments', icon: 'Truck', description: 'Transport' },
  
  // Category C: Crop Care & Irrigation
  { value: 'knapsack-sprayer', label: 'Knapsack Sprayer', category: 'Crop Care & Irrigation', icon: 'Droplet', description: 'Manual spray' },
  { value: 'power-sprayer', label: 'Power Sprayer', category: 'Crop Care & Irrigation', icon: 'Zap', description: 'Portable engine' },
  { value: 'boom-sprayer', label: 'Boom Sprayer', category: 'Crop Care & Irrigation', icon: 'Wind', description: 'Tractor mounted' },
  { value: 'rain-gun', label: 'Rain Gun', category: 'Crop Care & Irrigation', icon: 'CloudRain', description: 'Water cannon' },
  { value: 'drip-filter-unit', label: 'Drip/Filter Unit', category: 'Crop Care & Irrigation', icon: 'Filter', description: 'Existing system' },
  
  // Category D: Power & Tech
  { value: 'diesel-generator', label: 'Diesel Generator', category: 'Power & Tech', icon: 'Zap', description: 'Power backup' },
  { value: 'solar-panels', label: 'Solar Panels', category: 'Power & Tech', icon: 'Sun', description: 'Solar array' },
  { value: 'chaff-cutter', label: 'Chaff Cutter', category: 'Power & Tech', icon: 'Scissors', description: 'Feed cutter' },
  { value: 'milking-machine', label: 'Milking Machine', category: 'Power & Tech', icon: 'Zap', description: 'Dairy equipment' },
  { value: 'agri-drone', label: 'Agri Drone', category: 'Power & Tech', icon: 'Drone', description: 'Aerial monitoring' },
];

export const EQUIPMENT_CATEGORIES = [
  { id: 'heavy-machinery', name: 'Heavy Machinery' },
  { id: 'implements', name: 'Implements & Attachments' },
  { id: 'crop-care', name: 'Crop Care & Irrigation' },
  { id: 'power-tech', name: 'Power & Tech' },
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

export const CASH_FLOW_TYPES = [
  { value: 'seasonal', label: 'Seasonal (Harvest-based)', description: 'Receive income during specific harvest months' },
  { value: 'year-round', label: 'Year-Round (Dairy/Vegetables)', description: 'Generate income throughout the year' },
];

export const EXPANSION_STATUS_OPTIONS = [
  { value: 'none', label: 'Don\'t Have', icon: 'X' },
  { value: 'own', label: 'Own Now', icon: 'Check' },
  { value: 'planned', label: 'Planning', icon: 'Clock' },
];

export const EXPANSION_ITEMS = [
  { value: 'polyhouse', label: 'Polyhouse/Greenhouse', description: 'Controlled environment farming' },
  { value: 'fish_pond', label: 'Fish Pond/Aquaculture', description: 'Integrated aquaculture system' },
  { value: 'dairy', label: 'Dairy Unit', description: 'Dairy/Animal farming' },
];

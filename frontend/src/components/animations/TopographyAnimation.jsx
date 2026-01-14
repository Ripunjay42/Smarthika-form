import { motion } from 'framer-motion';
import { Compass, Mountain, Move, Droplets, AlertCircle } from 'lucide-react';

const THEME = {
  primary: '#9ca3af',
  primaryLight: '#d1d5db',
  secondary: '#d1d5db',
  water: '#b3b3b3',
  waterLight: '#e5e7eb',
  background: '#f9fafb',
  pipe: '#9ca3af',
  text: '#374151',
  textMuted: '#9ca3af',
};

const soilColors = {
  'black-clay': '#4A4A4A',
  'red-loam': '#CD5C5C',
  sandy: '#F4A460',
  'rocky-mixed': '#A9A9A9',
};

export default function TopographyAnimation({ 
  topographyType = 'flat', 
  soilType = 'black-clay',
  totalArea = 0,
  fieldGeometry = 'rectangular',
  sideLength = 0,
  sideWidth = 0,
  exclusionZones = 0,
  drainageClass = 'good'
}) {
  const terrainRotation = topographyType === 'flat' ? 50 : topographyType === 'sloped' ? 55 : 60;
  
  // Handle soilType as array or string for multiple selection
  const soilArray = Array.isArray(soilType) ? soilType : (soilType ? [soilType] : ['black-clay']);
  
  // Ensure we always have at least one soil type to display and filter out any empty/null values
  const validSoilArray = (soilArray && soilArray.length > 0 && soilArray.filter(Boolean).length > 0) 
    ? soilArray.filter(Boolean) 
    : ['black-clay'];
  
  // Get primary soil color for display
  const soilColor = soilColors[validSoilArray[0]] || soilColors['black-clay'];
  
  // Get array of soil colors for multiple selections (for grid fill) - ensure it's always an array with at least one color
  const soilColorArray = (validSoilArray && validSoilArray.length > 0)
    ? validSoilArray.map((soil) => soilColors[soil] || soilColors['black-clay'])
    : [soilColors['black-clay']];
  
  // Format soil label with safe handling
  const formatSoilName = (soil) => {
    if (!soil) return 'Black Cotton/Clay';
    // Map soil type to friendly label
    const labels = {
      'black-clay': 'Black Cotton/Clay',
      'red-loam': 'Red Loam/Loam',
      'sandy': 'Sandy Soil/Sand',
      'rocky-mixed': 'Rocky/Mixed/Gravel'
    };
    return labels[soil] || soil.charAt(0).toUpperCase() + soil.slice(1);
  };
  
  const soilLabel = validSoilArray.length > 1 
    ? validSoilArray.map(formatSoilName).join(' + ')
    : formatSoilName(validSoilArray[0]);
  
  // Calculate field shape based on geometry
  const isCircular = fieldGeometry === 'circular';
  const isIrregular = fieldGeometry === 'irregular';
  const isSquare = fieldGeometry === 'square';
  const isRectangular = fieldGeometry === 'rectangular';
  const aspectRatio = sideLength && sideWidth ? sideWidth / sideLength : 1;
  
  // IMPROVED: Larger default sizes for large screens, responsive sizing
  const baseWidth = typeof window !== 'undefined' && window.innerWidth > 1400 ? 360 : 300;
  const baseHeight = typeof window !== 'undefined' && window.innerWidth > 1400 ? 280 : 240;
  
  // Scale based on total area for visualization (more noticeable increase)
  // Reference: 10 acres = 6.7% larger, 30 acres = 20% larger, 45+ acres = 30% larger
  const areaScaleFactor = Math.min(1.3, 1 + totalArea / 150);
  
  const fieldWidth = isSquare 
    ? baseWidth * areaScaleFactor
    : Math.max(baseWidth * 0.8 * areaScaleFactor, Math.min(baseWidth * 1.2 * areaScaleFactor, (baseWidth + sideLength * 0.3) * areaScaleFactor));
  const fieldHeight = isSquare 
    ? baseHeight * areaScaleFactor
    : Math.max(baseHeight * 0.8 * areaScaleFactor, Math.min(baseHeight * 1.2 * areaScaleFactor, baseHeight * aspectRatio * areaScaleFactor));
  const rotateZ = isSquare ? 45 : isRectangular ? 30 : 45;
  
  // Calculate usable area after exclusions
  const usableArea = totalArea * (1 - exclusionZones / 100);
  const usedPercentage = 100 - exclusionZones;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* 3D Terrain */}
      <motion.div
        className="relative"
        animate={{ rotateX: terrainRotation, rotateZ: rotateZ }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      >
        {/* Ground Plane */}
        <motion.div
          className="shadow-2xl relative overflow-hidden"
          animate={{ 
            borderRadius: isCircular ? '50%' : isIrregular ? '20% 80% 60% 40%' : isSquare ? '0.75rem' : '1rem',
            width: `${fieldWidth}px`,
            height: `${fieldHeight}px`,
          }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: '#2d5016',
            background: 'linear-gradient(135deg, #2d5016, #1a300b)',
            transform: topographyType === 'hilly' ? `rotateX(-15deg) rotateZ(${isSquare ? 0 : 5}deg)` : 'none',
          }}
        >
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-25">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern id="field-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#fff" strokeWidth="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#field-grid)" />
            </svg>
          </div>

          {/* Field Boundary */}
          <motion.div 
            className="absolute inset-3 border-2 border-dashed" 
            animate={{
              borderRadius: isCircular ? '50%' : isIrregular ? '15% 85% 65% 35%' : isSquare ? '0.5rem' : '0.25rem',
            }}
            style={{ borderColor: 'rgba(255,255,255,0.4)' }} 
          />

          {/* Crop Plots - Fixed 16 blocks matching percentages with soil colors */}
          <div className="absolute inset-6 grid grid-cols-4 gap-1.5">
            {Array.from({ length: 16 }).map((_, i) => {
              // 16 blocks total - each block = 6.25%
              // Calculate how many blocks should be used vs unused
              const usedBlocksCount = Math.round((usedPercentage / 100) * 16);
              const isUsed = i < usedBlocksCount;
              
              // Cycle through soil colors for multiple selections
              let blockSoilColor = '#1a300b'; // Default background (unused)
              if (isUsed && soilColorArray && soilColorArray.length > 0) {
                blockSoilColor = soilColorArray[i % soilColorArray.length];
              }
              
              return (
                <motion.div
                  key={i}
                  className="w-full h-full rounded-sm"
                  style={{ 
                    backgroundColor: blockSoilColor,
                    border: isUsed ? '1px solid rgba(255, 255, 255, 0.2)' : '1px dashed rgba(255, 255, 255, 0.1)',
                    opacity: 0.85
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.85 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Elevation Indicator for Hilly */}
        {topographyType === 'hilly' && (
          <motion.div
            className="absolute -left-12 top-0 h-full flex flex-col justify-between items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-1.5 h-full rounded-full" style={{ background: `linear-gradient(to bottom, ${THEME.accent}, ${THEME.accentLight})` }} />
            <span className="text-xs font-medium whitespace-nowrap" style={{ color: THEME.accent }}>
              Hilly Terrain
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Compass */}
      <motion.div
        className="absolute top-8 right-8 w-16 h-16"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="w-full h-full rounded-full flex items-center justify-center" style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}>
          <Compass size={28} color={THEME.accent} />
        </div>
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold" style={{ color: THEME.accent }}>N</span>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        className="absolute bottom-8 left-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <Mountain size={24} color={THEME.accent} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>TERRAIN</p>
            <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{topographyType}</p>
          </div>
        </div>
      </motion.div>

      {/* Drainage Card */}
      {drainageClass && (
        <motion.div
          className="absolute bottom-8 left-64 p-4 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <Droplets size={24} color={drainageClass === 'good' ? '#689F38' : '#EF4444'} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>DRAINAGE</p>
              <p className="text-sm font-bold capitalize" style={{ color: drainageClass === 'good' ? '#689F38' : '#DC2626' }}>
                {drainageClass === 'good' ? 'Well Drained' : 'Waterlogging Risk'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Area Card with Used/Unused breakdown */}
      {totalArea > 0 && (
        <motion.div
          className="absolute bottom-8 right-8 p-4 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <Move size={24} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>TOTAL AREA</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>{totalArea} acres</p>
              {sideLength > 0 && sideWidth > 0 && (
                <p className="text-xs mt-0.5" style={{ color: THEME.textLight }}>{sideLength} × {sideWidth}</p>
              )}
              {exclusionZones > 0 && (
                <div className="text-xs mt-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#689F38' }} />
                    <span style={{ color: '#689F38' }}>Used: {usedPercentage}% ({usableArea.toFixed(2)} acres)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                    <span style={{ color: '#DC2626' }}>Unused: {exclusionZones}% ({(totalArea - usableArea).toFixed(2)} acres)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Soil Type & Geometry Badges */}
      <motion.div
        className="absolute top-8 left-8 flex flex-col gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="px-4 py-2 rounded-full flex items-center gap-2" style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}>
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: soilColor }} />
          <span className="text-sm font-medium capitalize" style={{ color: THEME.text }}>{soilLabel} Soil</span>
        </div>
        <div className="px-4 py-2 rounded-full flex items-center gap-2" style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}>
          <div 
            className="w-4 h-4" 
            style={{ 
              backgroundColor: THEME.accent,
              borderRadius: isCircular ? '50%' : isIrregular ? '30% 70% 60% 40%' : '2px'
            }} 
          />
          <span className="text-sm font-medium capitalize" style={{ color: THEME.text }}>{fieldGeometry}</span>
        </div>
      </motion.div>
    </div>
  );
}

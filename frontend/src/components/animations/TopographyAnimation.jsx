import { motion } from 'framer-motion';
import { Compass, Mountain, Move } from 'lucide-react';

const THEME = {
  accent: '#689F38',
  accentLight: 'rgba(104, 159, 56, 0.3)',
  accentVeryLight: 'rgba(104, 159, 56, 0.1)',
  text: '#33691E',
  textLight: '#558B2F',
  background: '#EDEDE7',
  cardBg: 'rgba(104, 159, 56, 0.1)',
  cardBorder: 'rgba(104, 159, 56, 0.3)',
};

const soilColors = {
  clay: '#8B4513',
  red: '#CD5C5C',
  sandy: '#F4A460',
  black: '#2F2F2F',
  loamy: '#654321',
};

export default function TopographyAnimation({ 
  topographyType = 'flat', 
  soilType = 'clay',
  totalArea = 0,
  fieldGeometry = 'rectangular',
  sideLength = 0,
  sideWidth = 0,
  exclusionZones = 0
}) {
  const terrainRotation = topographyType === 'flat' ? 50 : topographyType === 'sloped' ? 55 : 60;
  const soilColor = soilColors[soilType] || soilColors.clay;
  
  // Calculate field shape based on geometry
  const isCircular = fieldGeometry === 'circular';
  const isIrregular = fieldGeometry === 'irregular';
  const isSquare = fieldGeometry === 'square';
  const isRectangular = fieldGeometry === 'rectangular';
  const aspectRatio = sideLength && sideWidth ? sideWidth / sideLength : 1;
  
  // Different dimensions and rotations for square vs rectangular
  const fieldWidth = isSquare 
    ? 280 
    : Math.max(240, Math.min(320, 240 + sideLength * 0.5));
  const fieldHeight = isSquare 
    ? 280 
    : Math.max(240, Math.min(320, 240 * aspectRatio));
  const rotateZ = isSquare ? 45 : isRectangular ? 30 : 45;
  
  // Calculate usable area after exclusions
  const usableArea = totalArea * (1 - exclusionZones / 100);

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
            backgroundColor: soilColor,
            borderRadius: isCircular ? '50%' : isIrregular ? '20% 80% 60% 40%' : isSquare ? '0.75rem' : '1rem',
            width: `${fieldWidth}px`,
            height: `${fieldHeight}px`,
          }}
          transition={{ duration: 0.5 }}
          style={{
            background: `linear-gradient(135deg, ${soilColor}, ${soilColor}cc)`,
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

          {/* Crop Plots - Dynamic based on area */}
          <div className="absolute inset-6 grid grid-cols-4 gap-1.5">
            {Array.from({ length: Math.min(16, Math.max(4, Math.floor(totalArea / 2) || 8)) }).map((_, i) => {
              const isExcluded = (i / 16) * 100 < exclusionZones;
              return (
                <motion.div
                  key={i}
                  className="w-full h-full rounded-sm"
                  style={{ 
                    backgroundColor: isExcluded ? 'rgba(239, 68, 68, 0.3)' : THEME.accentLight,
                    border: isExcluded ? '1px dashed rgba(239, 68, 68, 0.5)' : 'none'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: isExcluded ? 0.4 : 0.8 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                />
              );
            })}
          </div>

          {/* Hills for hilly terrain - Visual distinction */}
          {topographyType === 'hilly' && (
            <>
              <motion.div
                className="absolute w-20 h-12 rounded-t-full"
                style={{ backgroundColor: `${soilColor}dd`, bottom: '20%', left: '10%' }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3 }}
              />
              <motion.div
                className="absolute w-16 h-10 rounded-t-full"
                style={{ backgroundColor: `${soilColor}cc`, bottom: '15%', right: '20%' }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.4 }}
              />
              <motion.div
                className="absolute w-14 h-8 rounded-t-full"
                style={{ backgroundColor: `${soilColor}bb`, bottom: '10%', left: '35%' }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.5 }}
              />
            </>
          )}
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

      {/* Area Card */}
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
                <p className="text-xs mt-0.5 text-red-600">{exclusionZones}% unused</p>
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
          <span className="text-sm font-medium capitalize" style={{ color: THEME.text }}>{soilType} Soil</span>
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

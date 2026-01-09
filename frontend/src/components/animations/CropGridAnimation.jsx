import { motion } from 'framer-motion';
import { Droplet, FlaskConical, Funnel, Gauge, GitBranch, Grid2x2, Ruler, Sprout, Tractor, TreeDeciduous } from 'lucide-react';

const THEME = {
  accent: '#689F38',
  accentLight: 'rgba(104, 159, 56, 0.3)',
  text: '#33691E',
  textLight: '#558B2F',
  background: '#EDEDE7',
  cardBg: 'rgba(104, 159, 56, 0.1)',
  cardBorder: 'rgba(104, 159, 56, 0.3)',
};

const cropColors = {
  mango: '#FFB800',
  coconut: '#228B22',
  banana: '#90EE90',
  sugarcane: '#32CD32',
  paddy: '#9ACD32',
  vegetables: '#00AA00',
  cotton: '#F5F5DC',
  pulses: '#DEB887',
};

export default function CropGridAnimation({ 
  primaryCropType = 'mango', 
  secondaryCropType = '',
  croppingPattern = 'monoculture',
  rowCount = 0,
  plantSpacing = 10, 
  tractorAccessRequirement = false,
  totalPlantCount = 0,
  cropAge = 'sapling',
  peakWaterDemand = 0,
  irrigationMethod = 'drip',
  requiredDischarge = 0,
  numberOfZones = 1,
  filtrationRequirement = 'screen',
  slurryFertigationUsage = false
}) {
  // Tree size based on age
  const treeScale = cropAge === 'mature' ? 1 : cropAge === 'young' ? 0.65 : 0.35;
  const primaryCropColor = cropColors[primaryCropType] || cropColors.mango;
  const secondaryCropColor = secondaryCropType ? (cropColors[secondaryCropType] || cropColors.vegetables) : null;
  const isPolyculture = croppingPattern === 'polyculture' && secondaryCropColor;
  
  // Grid size based on spacing (inverse relationship)
  const gridSize = Math.max(3, Math.min(6, Math.floor(30 / plantSpacing)));
  const hasMultipleZones = numberOfZones > 1;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Top-down Field View */}
      <motion.div
        className="relative w-80 h-80"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          className="w-full h-full rounded-2xl shadow-2xl p-4 overflow-hidden"
          style={{ 
            background: 'linear-gradient(to bottom right, #8B4513, #6D3610)',
            transformStyle: 'preserve-3d'
          }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: 50 }}
          transition={{ duration: 0.5 }}
        >
          {/* Crop Grid */}
          <div 
            className="h-full gap-2 p-2"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`
            }}
          >
            {Array.from({ length: gridSize * gridSize }).map((_, i) => {
              // Alternate crops for polyculture
              const useSecondaryCrop = isPolyculture && i % 2 === 1;
              const currentColor = useSecondaryCrop ? secondaryCropColor : primaryCropColor;
              
              return (
                <motion.div
                  key={i}
                  className="relative flex items-center justify-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                >
                  {/* Tree/Plant */}
                  <motion.div
                    className="rounded-full shadow-lg relative"
                    style={{ 
                      width: '85%', 
                      height: '85%',
                      background: `radial-gradient(circle at 30% 30%, ${currentColor}, ${THEME.accent})`
                    }}
                    animate={{ scale: treeScale }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Tree Crown Inner */}
                    <div 
                      className="absolute inset-2 rounded-full" 
                      style={{ backgroundColor: `${currentColor}80` }} 
                    />
                    
                    {/* Small water drop for drip irrigation */}
                    {irrigationMethod === 'drip' && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#60A5FA' }}
                        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                      />
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Drip Lines */}
          {irrigationMethod === 'drip' && (
            <div className="absolute inset-4 pointer-events-none" style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${gridSize}, 1fr)` 
            }}>
              {Array.from({ length: gridSize }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-full w-0.5 mx-auto"
                  style={{ backgroundColor: 'rgba(96, 165, 250, 0.4)' }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                />
              ))}
            </div>
          )}

          {/* Sprinkler overlay for sprinkler irrigation */}
          {irrigationMethod === 'sprinkler' && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ 
                background: 'radial-gradient(circle, rgba(96, 165, 250, 0.2) 0%, transparent 70%)'
              }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        className="absolute bottom-8 left-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <TreeDeciduous size={24} color={primaryCropColor} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>PRIMARY CROP</p>
            <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{primaryCropType}</p>
          </div>
        </div>
      </motion.div>

      {/* Secondary Crop Badge */}
      {secondaryCropType && (
        <motion.div
          className="absolute bottom-32 left-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <GitBranch size={18} color={secondaryCropColor} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>SECONDARY</p>
              <p className="text-xs font-bold capitalize" style={{ color: THEME.text }}>{secondaryCropType}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Crop Age Card */}
      <motion.div
        className="absolute top-8 right-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <Sprout size={24} color={THEME.accent} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>CROP AGE</p>
            <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{cropAge}</p>
          </div>
        </div>
      </motion.div>

      {/* Plant Count */}
      {totalPlantCount > 0 && (
        <motion.div
          className="absolute top-32 right-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <Grid2x2 size={18} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>PLANT COUNT</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>{totalPlantCount}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Spacing Card */}
      <motion.div
        className="absolute bottom-8 right-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <Ruler size={24} color={THEME.accent} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>SPACING</p>
            <p className="text-sm font-bold" style={{ color: THEME.text }}>{plantSpacing} ft</p>
          </div>
        </div>
      </motion.div>

      {/* Irrigation Method Card */}
      <motion.div
        className="absolute top-8 left-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center gap-3">
          <Droplet size={24} color="#60A5FA" />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>IRRIGATION</p>
            <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{irrigationMethod}</p>
          </div>
        </div>
      </motion.div>

      {/* Peak Water Demand */}
      {peakWaterDemand > 0 && (
        <motion.div
          className="absolute top-1/2 left-8 -translate-y-1/2 px-4 py-3 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <Droplet size={20} color="#60A5FA" />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>PEAK DEMAND</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>{peakWaterDemand} LPD</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Discharge Requirement */}
      {requiredDischarge > 0 && (
        <motion.div
          className="absolute top-1/2 right-8 -translate-y-1/2 px-4 py-3 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <Gauge size={20} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>DISCHARGE</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>{requiredDischarge} LPM</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Multiple Zones Indicator */}
      {hasMultipleZones && (
        <motion.div
          className="absolute bottom-56 right-8 px-3 py-2 backdrop-blur-sm rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <Grid2x2 size={16} color={THEME.accent} />
            <span className="text-xs font-bold" style={{ color: THEME.text }}>{numberOfZones} Zones</span>
          </div>
        </motion.div>
      )}

      {/* Filtration */}
      <motion.div
        className="absolute bottom-32 right-8 px-3 py-2 backdrop-blur-sm rounded-lg"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center gap-2">
          <Funnel size={16} color={THEME.accent} />
          <span className="text-xs font-bold capitalize" style={{ color: THEME.text }}>{filtrationRequirement}</span>
        </div>
      </motion.div>

      {/* Fertigation Indicator */}
      {slurryFertigationUsage && (
        <motion.div
          className="absolute top-56 left-8 px-3 py-2 backdrop-blur-sm rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <FlaskConical size={16} color={THEME.accent} />
            <span className="text-xs font-bold" style={{ color: THEME.text }}>FERTIGATION</span>
          </div>
        </motion.div>
      )}

      {/* Tractor Access */}
      {tractorAccessRequirement && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-32 px-3 py-2 backdrop-blur-sm rounded-full"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center gap-2" style={{ color: THEME.text }}>
            <Tractor size={16} className="shrink-0" />
            <span className="text-xs font-bold">TRACTOR ACCESS</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

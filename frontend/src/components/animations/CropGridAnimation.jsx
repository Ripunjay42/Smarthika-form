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
  croppingPattern = 'monoculture',
  plantSpacing = 10,
  plantSpacingUnit = 'feet',
  tractorAccessRequirement = false,
  crops = [],
  cropAge = 'sapling',
  peakWaterDemand = 0,
  irrigationMethod = 'drip',
  irrigationEfficiency = 90,
  numberOfZones = 1,
  filtrationRequired = false,
  liquidFertilizerUsage = false
}) {
  // Tree size based on age
  const treeScale = cropAge === 'mature' ? 1 : cropAge === 'young' ? 0.65 : 0.35;
  
  // Get primary crop color from first crop only if crops exist
  const firstCrop = crops?.[0]?.cropType || '';
  const primaryCropColor = firstCrop ? cropColors[firstCrop] : '#999999';
  
  // Calculate total estimated count from all crops
  const totalEstimatedCount = crops?.reduce((sum, crop) => sum + (parseInt(crop.estimatedCount) || 0), 0) || 0;
  
  // Determine grid size - fixed at 6x6
  const gridSize = 6;
  const totalCells = gridSize * gridSize;
  
  const hasMultipleZones = numberOfZones > 1;
  
  // Calculate zone grid dimensions
  const zoneGridCols = Math.ceil(Math.sqrt(numberOfZones));
  const zoneGridRows = Math.ceil(numberOfZones / zoneGridCols);
  const cellsPerZone = (gridSize * gridSize) / numberOfZones;
  
  // Calculate dynamic plane size based on crops count
  let planeSize = 380; // base size
  if (totalEstimatedCount > 0) {
    if (totalEstimatedCount <= 30) planeSize = 380;
    else if (totalEstimatedCount <= 50) planeSize = 400;
    else if (totalEstimatedCount <= 100) planeSize = 420;
    else planeSize = 450;
  }

  // Create crop distribution map for single zone with multiple crops
  const getCropForCell = (cellIndex) => {
    if (hasMultipleZones) return null;
    if (!crops || crops.length === 0) return null;
    
    let cellCount = 0;
    for (let i = 0; i < crops.length; i++) {
      const cropEstimate = parseInt(crops[i].estimatedCount) || 0;
      const cellsForThisCrop = Math.round((cropEstimate / totalEstimatedCount) * totalCells);
      
      if (cellIndex < cellCount + cellsForThisCrop) {
        return crops[i];
      }
      cellCount += cellsForThisCrop;
    }
    
    // Fallback to last crop if rounding issues
    return crops[crops.length - 1];
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Top-down Field View */}
      <motion.div
        className="relative"
        style={{ perspective: '1200px', width: `${planeSize}px`, height: `${planeSize}px` }}
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
          {/* Multi-Zone Field */}
          {hasMultipleZones ? (
            <div 
              className="h-full gap-1 p-2"
              style={{ 
                display: 'grid',
                gridTemplateColumns: `repeat(${zoneGridCols}, 1fr)`,
                gridTemplateRows: `repeat(${zoneGridRows}, 1fr)`
              }}
            >
              {Array.from({ length: numberOfZones }).map((_, zoneIdx) => {
                const zoneColor = crops?.[zoneIdx]?.cropType 
                  ? cropColors[crops[zoneIdx].cropType] 
                  : Object.values(cropColors)[zoneIdx % Object.values(cropColors).length];
                
                return (
                  <motion.div
                    key={zoneIdx}
                    className="relative rounded-lg overflow-hidden border-2"
                    style={{ borderColor: `${zoneColor}60`, background: `${zoneColor}15` }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: zoneIdx * 0.15 }}
                  >
                    {/* Zone Label */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ zIndex: 10 }}
                    >
                      <div className="text-center">
                        <p className="text-xs font-bold" style={{ color: zoneColor }}>
                          Zone {zoneIdx + 1}
                        </p>
                        {crops?.[zoneIdx]?.cropType && (
                          <p className="text-xs capitalize" style={{ color: `${zoneColor}80` }}>
                            {crops[zoneIdx].cropType}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Mini Crop Grid within Zone */}
                    <div 
                      className="h-full gap-0.5 p-1"
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: `repeat(3, 1fr)`,
                        gridTemplateRows: `repeat(3, 1fr)`
                      }}
                    >
                      {Array.from({ length: 9 }).map((_, i) => (
                        <motion.div
                          key={`${zoneIdx}-${i}`}
                          className="relative flex items-center justify-center"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: zoneIdx * 0.15 + i * 0.02 }}
                        >
                          <motion.div
                            className="rounded-full shadow-md"
                            style={{ 
                              width: '80%', 
                              height: '80%',
                              background: `radial-gradient(circle at 30% 30%, ${zoneColor}, ${zoneColor}80)`
                            }}
                            animate={{ scale: treeScale }}
                            transition={{ duration: 0.4 }}
                          >
                            <div 
                              className="absolute inset-1 rounded-full" 
                              style={{ backgroundColor: `${zoneColor}60` }} 
                            />
                            
                            {irrigationMethod === 'drip' && (
                              <motion.div
                                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: '#60A5FA' }}
                                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity, delay: (zoneIdx * 9 + i) * 0.05 }}
                              />
                            )}
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Single Zone - Original Grid */
            <div 
              className="h-full gap-2 p-2"
              style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`
              }}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                const crop = getCropForCell(i);
                const currentColor = crop?.cropType ? (cropColors[crop.cropType] || '#999999') : '#999999';
                
                return (
                  <motion.div
                    key={i}
                    className="relative flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    title={crop?.cropType || 'Empty'}
                  >
                    {/* Tree/Plant */}
                    <motion.div
                      className="rounded-full shadow-lg relative"
                      style={{ 
                        width: '85%', 
                        height: '85%',
                        background: `radial-gradient(circle at 30% 30%, ${currentColor}, ${currentColor}cc)`
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
          )}

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

      {/* Crops List Card */}
      {crops && crops.length > 0 && (
        <motion.div
          className="absolute bottom-8 left-8 p-4 backdrop-blur-sm rounded-xl max-w-xs"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <TreeDeciduous size={24} color={THEME.accent} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>CROPS</p>
              <div className="space-y-1 mt-1">
                {crops.map((crop, idx) => (
                  <p key={idx} className="text-xs font-medium capitalize" style={{ color: THEME.text }}>
                    {crop.cropType}: <span style={{ color: THEME.textLight }}>{crop.estimatedCount}</span>
                  </p>
                ))}
              </div>
              {totalEstimatedCount > 0 && (
                <p className="text-xs font-bold mt-2" style={{ color: THEME.accent }}>
                  Total: {totalEstimatedCount}
                </p>
              )}
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
            <p className="text-sm font-bold" style={{ color: THEME.text }}>{plantSpacing} {plantSpacingUnit}</p>
          </div>
        </div>
      </motion.div>

      {/* Irrigation Efficiency Card */}
      <motion.div
        className="absolute top-8 right-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Droplet size={20} color="#60A5FA" />
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>EFFICIENCY</p>
          </div>
          <div className="w-32 h-2 bg-gray-300 rounded-full overflow-hidden">
            <motion.div
              className="h-full"
              style={{ width: `${irrigationEfficiency}%`, background: '#60A5FA' }}
              initial={{ width: 0 }}
              animate={{ width: `${irrigationEfficiency}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-sm font-bold" style={{ color: THEME.text }}>{irrigationEfficiency}%</p>
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
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>IRRIGATION METHOD</p>
              <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{irrigationMethod}</p>
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
      {filtrationRequired && (
        <motion.div
          className="absolute bottom-32 right-8 px-3 py-2 backdrop-blur-sm rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-2">
            <Funnel size={16} color={THEME.accent} />
            <span className="text-xs font-bold" style={{ color: THEME.text }}>FILTER NEEDED</span>
          </div>
        </motion.div>
      )}

      {/* Liquid Fertilizer Indicator */}
      {liquidFertilizerUsage && (
        <motion.div
          className="absolute top-56 left-8 px-3 py-2 backdrop-blur-sm rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <FlaskConical size={16} color={THEME.accent} />
            <span className="text-xs font-bold" style={{ color: THEME.text }}>LIQUID FERTILIZER</span>
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

import { motion } from 'framer-motion';
import { ArrowDown, CircleCheck, Database, Droplet, Gauge, Shield, TriangleAlert, Zap, Droplets } from 'lucide-react';

const THEME = {
  accent: '#689F38',
  accentLight: 'rgba(104, 159, 56, 0.3)',
  text: '#33691E',
  textLight: '#558B2F',
  background: '#EDEDE7',
  cardBg: 'rgba(104, 159, 56, 0.1)',
  cardBorder: 'rgba(104, 159, 56, 0.3)',
};

const waterColors = {
  clear: '#60A5FA',
  white: '#E5E7EB',
  red: '#F87171',
  muddy: '#92400E',
};

export default function BorewellAnimation({ 
  staticWaterLevel = 50, 
  dynamicWaterLevel = 80, 
  waterQuality = 'clear',
  totalDepth = 150,
  casingDiameter = 6,
  sourceType = [],
  seasonalVariance = 'low',
  dryRunRisk = 'low',
  numberOfBorewells = 1,
  suctionHead = 0,
  footValveCondition = 'good',
  municipalWaterAvailable = 'no',
  municipalWaterVolume = 0,
  pumpSize = ''
}) {
  const drawdown = dynamicWaterLevel && staticWaterLevel 
    ? Math.abs(parseFloat(dynamicWaterLevel) - parseFloat(staticWaterLevel))
    : 0;
  const waterColor = waterColors[waterQuality] || waterColors.clear;
  const staticPercent = totalDepth ? Math.min(staticWaterLevel / totalDepth * 100, 90) : 0;
  const dynamicPercent = totalDepth ? Math.min(dynamicWaterLevel / totalDepth * 100, 95) : 0;
  
  // High dry run risk is now RED
  const hasHighDryRunRisk = dryRunRisk === 'high';
  
  // Drawdown assessment
  const getDrawdownStatus = () => {
    if (drawdown < 20) return { label: 'Excellent', color: '#22C55E', desc: 'Strong aquifer' };
    if (drawdown < 40) return { label: 'Good', color: '#F59E0B', desc: 'Moderate recharge' };
    return { label: 'Poor', color: '#EF4444', desc: 'Low recharge' };
  };
  const drawdownStatus = getDrawdownStatus();
  
  // Check if open well selected
  const isOpenWell = sourceType && sourceType.includes('open-well');
  const hasMunicipalWater = municipalWaterAvailable === 'yes';
  const hasFootValveIssue = footValveCondition === 'leaking';

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Ground Surface */}
      <div className="absolute top-[22%] left-0 right-0 h-5 sm:h-6" style={{ background: `linear-gradient(to bottom, ${THEME.accent}, ${THEME.accentLight})` }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium" style={{ color: '#FAF0BF' }}>Ground Level</span>
        </div>
      </div>

      {/* Borewell Cross-section */}
      <div className="relative h-[300px] sm:h-[380px] w-28 sm:w-36 mt-6 sm:mt-10">
        {/* Casing Pipe */}
        <div className="absolute inset-0 rounded-lg overflow-hidden" style={{ backgroundColor: '#4B5563', border: '3px solid #374151' }}>
          {/* Earth Layers */}
          <div className="absolute inset-0">
            <div className="h-[25%]" style={{ background: 'linear-gradient(to bottom, #B8860B, #8B6914)' }} />
            <div className="h-[25%]" style={{ background: 'linear-gradient(to bottom, #78716C, #57534E)' }} />
            <div className="h-[25%]" style={{ background: 'linear-gradient(to bottom, #6B7280, #4B5563)' }} />
            <div className="h-[25%]" style={{ background: 'linear-gradient(to bottom, #64748B, #334155)' }} />
          </div>

          {/* Inner Pipe */}
          <motion.div 
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0"
            animate={{ width: casingDiameter * 2 + 'px' }}
            style={{ backgroundColor: '#1F2937', borderLeft: '3px solid #4B5563', borderRight: '3px solid #4B5563' }}
          >
            {/* Static Water Level Marker */}
            {staticWaterLevel > 0 && (
              <motion.div
                className="absolute left-0 right-0 h-1 bg-blue-400 z-10"
                animate={{ top: `${staticPercent}%` }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="absolute -left-14 sm:-left-20 flex items-center gap-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ArrowDown size={12} color="#3B82F6" />
                  <span className="text-xs font-medium whitespace-nowrap" style={{ color: '#3B82F6' }}>
                    SWL: {staticWaterLevel}ft
                  </span>
                </motion.div>
              </motion.div>
            )}

            {/* Dynamic Water Level Marker */}
            {dynamicWaterLevel > 0 && (
              <motion.div
                className="absolute left-0 right-0 h-1 z-10"
                style={{ backgroundColor: THEME.accent }}
                animate={{ top: `${dynamicPercent}%` }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="absolute -right-14 sm:-right-20 flex items-center gap-1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <span className="text-xs font-medium whitespace-nowrap" style={{ color: THEME.accent }}>
                    DWL: {dynamicWaterLevel}ft
                  </span>
                </motion.div>
              </motion.div>
            )}

            {/* Water Fill */}
            {dynamicWaterLevel > 0 && (
              <motion.div
                className="absolute left-0 right-0 bottom-0"
                animate={{ 
                  height: `${100 - dynamicPercent}%`,
                  backgroundColor: waterColor,
                }}
                transition={{ duration: 0.6 }}
                style={{ opacity: 0.7 }}
              >
                {/* Water Ripple Animation */}
                <motion.div
                  className="absolute inset-x-0 top-0 h-2"
                  style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Pump Motor at Top */}
        <motion.div
          className="absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-12 sm:h-14 rounded-lg flex items-center justify-center shadow-lg"
          style={{ backgroundColor: THEME.accent }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Zap size={26} color="#FAF0BF" />
        </motion.div>

        {/* Depth Scale */}
        {totalDepth > 0 && (
          <div className="absolute -right-12 sm:-right-16 top-0 bottom-0 flex flex-col justify-between text-[10px] sm:text-xs font-medium" style={{ color: THEME.textLight }}>
            <span>0</span>
            <span>{Math.round(totalDepth / 3)}ft</span>
            <span>{Math.round(totalDepth * 2 / 3)}ft</span>
            <span>{totalDepth}ft</span>
          </div>
        )}
      </div>

      {/* Drawdown Card with Status */}
      {drawdown > 0 && (
        <motion.div
          className="absolute top-4 sm:top-8 left-4 sm:left-8 p-3 sm:p-4 backdrop-blur-sm rounded-xl"
          style={{ 
            backgroundColor: `${drawdownStatus.color}15`,
            border: `2px solid ${drawdownStatus.color}40` 
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <Gauge size={20} color={drawdownStatus.color} />
            <div>
              <p className="text-xs font-semibold" style={{ color: drawdownStatus.color }}>RECHARGE RATE</p>
              <p className="text-xl font-bold" style={{ color: drawdownStatus.color }}>{drawdown} ft</p>
              <p className="text-xs" style={{ color: drawdownStatus.color }}>{drawdownStatus.desc}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Water Quality Card */}
      <motion.div
        className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 p-3 sm:p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-3">
          <Droplet size={20} color={waterColor} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>WATER COLOR</p>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-4 h-4 rounded-full"
                animate={{ backgroundColor: waterColor }}
              />
              <span className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{waterQuality}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pump Size Card */}
      {pumpSize && (
        <motion.div
          className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 p-3 sm:p-4 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-semibold" style={{ color: THEME.accent }}>PUMP SIZE</p>
          <p className="text-lg font-bold uppercase" style={{ color: THEME.text }}>{pumpSize}</p>
        </motion.div>
      )}

      {/* Casing Diameter Card */}
      {casingDiameter > 0 && (
        <motion.div
          className="absolute top-4 sm:top-8 right-4 sm:right-8 p-3 sm:p-4 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-semibold" style={{ color: THEME.accent }}>CASING DIAMETER</p>
          <p className="text-lg font-bold" style={{ color: THEME.text }}>{casingDiameter}"</p>
        </motion.div>
      )}

      {/* Total Depth Card */}
      {totalDepth > 0 && (
        <motion.div
          className="absolute top-24 sm:top-32 right-4 sm:right-8 p-3 sm:p-4 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-semibold" style={{ color: THEME.accent }}>TOTAL DEPTH</p>
          <p className="text-lg font-bold" style={{ color: THEME.text }}>{totalDepth} ft</p>
        </motion.div>
      )}

      {/* Source Type Badge */}
      {sourceType && sourceType.length > 0 && (
        <motion.div
          className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-2 backdrop-blur-sm rounded-full"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <Database size={16} color={THEME.accent} />
            <span className="text-xs font-bold uppercase" style={{ color: THEME.text }}>
              {sourceType.map(s => s.replace('-', ' ')).join(' + ')}
            </span>
          </div>
        </motion.div>
      )}

      {/* Number of Borewells */}
      {numberOfBorewells > 1 && (
        <motion.div
          className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 backdrop-blur-sm rounded-full"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-sm font-bold" style={{ color: THEME.text }}>
            {numberOfBorewells} Water Sources
          </span>
        </motion.div>
      )}

      {/* High Dry Run Risk - RED COLOR */}
      {hasHighDryRunRisk && (
        <motion.div
          className="absolute top-24 sm:top-32 left-4 sm:left-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '2px solid rgba(239, 68, 68, 0.4)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <TriangleAlert size={20} color="#EF4444" />
            <div>
              <p className="text-xs font-bold text-red-600">HIGH DRY RUN RISK</p>
              <p className="text-xs text-red-500 mt-0.5">Water may run dry seasonally</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Seasonal Variance Indicator */}
      {seasonalVariance && seasonalVariance !== 'low' && (
        <motion.div
          className="absolute top-40 sm:top-48 left-4 sm:left-8 px-3 py-2 backdrop-blur-sm rounded-lg"
          style={{ 
            backgroundColor: seasonalVariance === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `2px solid ${seasonalVariance === 'high' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-xs font-semibold" style={{ color: seasonalVariance === 'high' ? '#EF4444' : '#F59E0B' }}>
            {seasonalVariance === 'high' ? 'HIGH' : 'MEDIUM'} SEASONAL VAR.
          </p>
        </motion.div>
      )}

      {/* Municipal Water Supply Indicator */}
      {hasMunicipalWater && (
        <motion.div
          className="absolute top-56 sm:top-64 left-4 sm:left-8 px-3 py-2 backdrop-blur-sm rounded-lg"
          style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '2px solid rgba(59, 130, 246, 0.3)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <Droplets size={16} color="#3B82F6" />
            <div>
              <p className="text-xs font-semibold text-blue-600">MUNICIPAL WATER</p>
              {municipalWaterVolume > 0 && (
                <p className="text-xs text-blue-500">{municipalWaterVolume} L/day</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Open Well Indicators */}
      {isOpenWell && (
        <motion.div
          className="absolute bottom-24 sm:bottom-32 right-4 sm:right-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ 
            backgroundColor: hasFootValveIssue ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            border: `2px solid ${hasFootValveIssue ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}` 
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div>
            <p className="text-xs font-semibold" style={{ color: hasFootValveIssue ? '#EF4444' : '#3B82F6' }}>
              SUCTION: {suctionHead}ft
            </p>
            <div className="text-xs mt-1 flex items-center gap-1" style={{ color: hasFootValveIssue ? '#EF4444' : '#3B82F6' }}>
              <span>Valve:</span>
              {footValveCondition === 'good' ? (
                <>
                  <CircleCheck size={14} className="shrink-0" />
                  <span>Good</span>
                </>
              ) : (
                <>
                  <TriangleAlert size={14} className="shrink-0" />
                  <span>Leaking</span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

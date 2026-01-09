import { motion } from 'framer-motion';
import { ArrowDown, CircleCheck, Database, Droplet, Gauge, Shield, TriangleAlert, Zap } from 'lucide-react';

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
  sourceType = 'borewell',
  seasonalVariance = 'low',
  dryRunRisk = 'low',
  scalingRisk = 'low',
  ironContentRisk = 'low',
  abrasionRisk = 'low',
  numberOfBorewells = 1,
  suctionHead = 0,
  footValveCondition = 'good'
}) {
  const drawdown = dynamicWaterLevel - staticWaterLevel;
  const waterColor = waterColors[waterQuality] || waterColors.clear;
  const staticPercent = Math.min(staticWaterLevel / totalDepth * 100, 90);
  const dynamicPercent = Math.min(dynamicWaterLevel / totalDepth * 100, 95);
  
  // Risk indicators
  const hasHighRisk = dryRunRisk === 'high' || seasonalVariance === 'high';
  const hasQualityIssues = scalingRisk === 'high' || ironContentRisk === 'high' || abrasionRisk === 'high';
  
  // Drawdown assessment
  const getDrawdownStatus = () => {
    if (drawdown < 20) return { label: 'Excellent', color: '#22C55E', desc: 'Strong aquifer' };
    if (drawdown < 40) return { label: 'Good', color: '#F59E0B', desc: 'Moderate recharge' };
    return { label: 'Poor', color: '#EF4444', desc: 'Low recharge' };
  };
  const drawdownStatus = getDrawdownStatus();
  
  // Open well specific
  const isOpenWell = sourceType === 'open-well';
  const hasFootValveIssue = footValveCondition === 'leaking';

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Ground Surface */}
      <div className="absolute top-[22%] left-0 right-0 h-6" style={{ background: `linear-gradient(to bottom, ${THEME.accent}, ${THEME.accentLight})` }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium" style={{ color: '#FAF0BF' }}>Ground Level</span>
        </div>
      </div>

      {/* Borewell Cross-section */}
      <div className="relative h-[380px] w-36 mt-10">
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
            <motion.div
              className="absolute left-0 right-0 h-1 bg-blue-400 z-10"
              animate={{ top: `${staticPercent}%` }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="absolute -left-20 flex items-center gap-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <ArrowDown size={12} color="#3B82F6" />
                <span className="text-xs font-medium whitespace-nowrap" style={{ color: '#3B82F6' }}>
                  SWL: {staticWaterLevel}ft
                </span>
              </motion.div>
            </motion.div>

            {/* Dynamic Water Level Marker */}
            <motion.div
              className="absolute left-0 right-0 h-1 z-10"
              style={{ backgroundColor: THEME.accent }}
              animate={{ top: `${dynamicPercent}%` }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="absolute -right-20 flex items-center gap-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="text-xs font-medium whitespace-nowrap" style={{ color: THEME.accent }}>
                  DWL: {dynamicWaterLevel}ft
                </span>
              </motion.div>
            </motion.div>

            {/* Water Fill */}
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
          </motion.div>
        </div>

        {/* Pump Motor at Top */}
        <motion.div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-14 rounded-lg flex items-center justify-center shadow-lg"
          style={{ backgroundColor: THEME.accent }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Zap size={32} color="#FAF0BF" />
        </motion.div>

        {/* Depth Scale */}
        <div className="absolute -right-16 top-0 bottom-0 flex flex-col justify-between text-xs font-medium" style={{ color: THEME.textLight }}>
          <span>0</span>
          <span>50ft</span>
          <span>100ft</span>
          <span>150ft</span>
        </div>
      </div>

      {/* Drawdown Card with Status */}
      {drawdown > 0 && (
        <motion.div
          className="absolute top-8 left-8 p-4 backdrop-blur-sm rounded-xl"
          style={{ 
            backgroundColor: `${drawdownStatus.color}15`,
            border: `2px solid ${drawdownStatus.color}40` 
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <Gauge size={24} color={drawdownStatus.color} />
            <div>
              <p className="text-xs font-semibold" style={{ color: drawdownStatus.color }}>DRAWDOWN</p>
              <p className="text-xl font-bold" style={{ color: drawdownStatus.color }}>{drawdown} ft</p>
              <p className="text-xs" style={{ color: drawdownStatus.color }}>{drawdownStatus.desc}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Open Well Indicator */}
      {isOpenWell && (
        <motion.div
          className="absolute top-56 left-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ 
            backgroundColor: hasFootValveIssue ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            border: `2px solid ${hasFootValveIssue ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}` 
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
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

      {/* Water Quality Card */}
      <motion.div
        className="absolute bottom-8 left-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-3">
          <Droplet size={24} color={waterColor} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>WATER QUALITY</p>
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

      {/* Diameter Card */}
      <motion.div
        className="absolute bottom-8 right-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs font-semibold" style={{ color: THEME.accent }}>CASING DIA</p>
        <p className="text-lg font-bold" style={{ color: THEME.text }}>{casingDiameter}"</p>
      </motion.div>

      {/* Total Depth Card */}
      {totalDepth > 0 && (
        <motion.div
          className="absolute top-8 right-8 p-4 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-semibold" style={{ color: THEME.accent }}>TOTAL DEPTH</p>
          <p className="text-lg font-bold" style={{ color: THEME.text }}>{totalDepth} ft</p>
        </motion.div>
      )}

      {/* Source Type Badge */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-2 backdrop-blur-sm rounded-full"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
            <Database size={16} color={THEME.accent} />
          <span className="text-xs font-bold uppercase" style={{ color: THEME.text }}>
            {sourceType.replace('-', ' ')}
          </span>
        </div>
      </motion.div>

      {/* Risk Indicators */}
      {hasHighRisk && (
        <motion.div
          className="absolute top-32 left-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '2px solid rgba(239, 68, 68, 0.3)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <TriangleAlert size={20} color="#EF4444" />
            <div>
              <p className="text-xs font-semibold text-red-600">HIGH RISK</p>
              <p className="text-xs text-red-500">
                {dryRunRisk === 'high' ? 'Dry Run' : 'Seasonal Variance'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quality Issues Indicator */}
      {hasQualityIssues && (
        <motion.div
          className="absolute bottom-32 left-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '2px solid rgba(245, 158, 11, 0.3)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <Shield size={20} color="#F59E0B" />
            <div>
              <p className="text-xs font-semibold text-amber-600">QUALITY ALERT</p>
              <div className="flex gap-1 mt-1">
                {scalingRisk === 'high' && <span className="text-xs px-1 bg-amber-100 rounded">Scale</span>}
                {ironContentRisk === 'high' && <span className="text-xs px-1 bg-amber-100 rounded">Iron</span>}
                {abrasionRisk === 'high' && <span className="text-xs px-1 bg-amber-100 rounded">Abrasion</span>}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Number of Borewells Badge */}
      {numberOfBorewells > 1 && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 backdrop-blur-sm rounded-full"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-sm font-bold" style={{ color: THEME.text }}>
            {numberOfBorewells} Sources
          </span>
        </motion.div>
      )}

      {/* Seasonal Variance Indicator */}
      {seasonalVariance && seasonalVariance !== 'low' && (
        <motion.div
          className="absolute top-32 right-8 px-3 py-2 backdrop-blur-sm rounded-lg"
          style={{ 
            backgroundColor: seasonalVariance === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `2px solid ${seasonalVariance === 'high' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-xs font-semibold" style={{ color: seasonalVariance === 'high' ? '#EF4444' : '#F59E0B' }}>
            {seasonalVariance === 'high' ? 'HIGH' : 'MEDIUM'} VARIANCE
          </p>
        </motion.div>
      )}
    </div>
  );
}

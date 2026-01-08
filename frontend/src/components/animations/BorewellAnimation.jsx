import { motion } from 'framer-motion';
import { Drop, Lightning, ArrowDown, Gauge } from '@phosphor-icons/react';

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
  staticLevel = 50, 
  dynamicLevel = 80, 
  waterQuality = 'clear',
  pumpDepth = 100,
  borewellDiameter = 6
}) {
  const drawdown = dynamicLevel - staticLevel;
  const waterColor = waterColors[waterQuality] || waterColors.clear;
  const staticPercent = Math.min(staticLevel / 150 * 100, 90);
  const dynamicPercent = Math.min(dynamicLevel / 150 * 100, 95);

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
            animate={{ width: borewellDiameter * 2 + 'px' }}
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
                  SWL: {staticLevel}ft
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
                  DWL: {dynamicLevel}ft
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
          <Lightning size={32} weight="fill" color="#FAF0BF" />
        </motion.div>

        {/* Depth Scale */}
        <div className="absolute -right-16 top-0 bottom-0 flex flex-col justify-between text-xs font-medium" style={{ color: THEME.textLight }}>
          <span>0</span>
          <span>50ft</span>
          <span>100ft</span>
          <span>150ft</span>
        </div>
      </div>

      {/* Drawdown Card */}
      {drawdown > 0 && (
        <motion.div
          className="absolute top-8 left-8 p-4 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3">
            <Gauge size={24} weight="duotone" color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>DRAWDOWN</p>
              <p className="text-lg font-bold" style={{ color: THEME.text }}>{drawdown} ft</p>
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
          <Drop size={24} weight="duotone" color={waterColor} />
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
        <p className="text-xs font-semibold" style={{ color: THEME.accent }}>CASING</p>
        <p className="text-sm font-bold" style={{ color: THEME.text }}>{borewellDiameter}" diameter</p>
      </motion.div>
    </div>
  );
}

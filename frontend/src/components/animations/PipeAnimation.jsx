import { motion } from 'framer-motion';
import { ArrowRight, Cylinder, Droplet, Funnel, Gauge, GitBranch, Route, TriangleAlert, Wrench } from 'lucide-react';

const THEME = {
  accent: '#689F38',
  accentLight: 'rgba(104, 159, 56, 0.3)',
  text: '#33691E',
  textLight: '#558B2F',
  background: '#EDEDE7',
  cardBg: 'rgba(104, 159, 56, 0.1)',
  cardBorder: 'rgba(104, 159, 56, 0.3)',
};

export default function PipeAnimation({ 
  deliveryTarget = 'direct', 
  overheadTankHeight = 20,
  tankCapacity = 0,
  groundSumpDepth = 0,
  sumpDistance = 0,
  mainlineDiameter = 3,
  totalPipeLength = 100,
  mainlinePipeMaterial = 'PVC',
  pipeCondition = 'new',
  frictionHeadPenalty = 0,
  numberOfElbows = 0,
  flowmeterRequirement = false,
  auxiliaryOutletNeed = false
}) {
  const isTankDelivery = deliveryTarget === 'tank';
  const isSumpDelivery = deliveryTarget === 'sump';
  const tankHeightPixels = Math.min(overheadTankHeight * 5, 180);
  
  // Determine pipe color based on material
  const pipeColors = {
    'PVC': '#374151',
    'HDPE': '#1F2937',
    'GI': '#6B7280',
    'MS': '#9CA3AF'
  };
  const pipeColor = pipeColors[mainlinePipeMaterial] || pipeColors['PVC'];
  
  // Determine if pipe has issues
  const hasHighFriction = frictionHeadPenalty > 15;
  const hasManyElbows = numberOfElbows > 10;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Pipe System Visualization */}
      <div className="relative w-[380px] h-[380px]">
        
        {/* Source - Pump House */}
        <motion.div
          className="absolute left-4 bottom-16 w-24 h-32 rounded-t-lg shadow-xl overflow-hidden"
          style={{ background: 'linear-gradient(to bottom, #374151, #1F2937)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Pump Label */}
          <div className="absolute top-2 inset-x-0 text-center">
            <span className="text-xs font-bold" style={{ color: THEME.accent }}>PUMP</span>
          </div>
          
          {/* Water indicator */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-12 rounded-b-lg"
            style={{ backgroundColor: 'rgba(96, 165, 250, 0.4)' }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Pump icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Droplet size={32} color="#60A5FA" />
          </div>
        </motion.div>

        {/* Main Horizontal Pipe */}
        <motion.div
          className="absolute bottom-20 left-24 h-8 rounded-full shadow-lg overflow-hidden"
          style={{ 
            background: 'linear-gradient(to bottom, #9CA3AF, #6B7280)',
            width: isTankDelivery ? '180px' : '260px'
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Flow Animation */}
          <motion.div
            className="absolute top-1 bottom-1 rounded-full"
            style={{ 
              background: 'linear-gradient(to right, #60A5FA, #3B82F6)', 
              width: '25%',
              left: '-25%'
            }}
            animate={{ left: ['−25%', '125%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Pipe diameter indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white/70">{mainlineDiameter}"</span>
          </div>
        </motion.div>

        {/* Vertical Pipe (for tank delivery) */}
        {isTankDelivery && (
          <motion.div
            className="absolute right-24 bottom-20 w-8 rounded-t-lg shadow-lg overflow-hidden"
            style={{ 
              background: 'linear-gradient(to right, #9CA3AF, #6B7280)',
              height: `${tankHeightPixels}px`
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Upward flow */}
            <motion.div
              className="absolute left-1 right-1 rounded-full"
              style={{ 
                background: 'linear-gradient(to top, #60A5FA, #3B82F6)', 
                height: '20%',
                bottom: '-20%'
              }}
              animate={{ bottom: ['-20%', '120%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.8 }}
            />
          </motion.div>
        )}

        {/* Tank (for tank delivery) */}
        {isTankDelivery && (
          <motion.div
            className="absolute right-12 w-32 h-24 rounded-lg shadow-xl overflow-hidden"
            style={{ 
              backgroundColor: THEME.accent,
              bottom: `${tankHeightPixels + 80}px`
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {/* Tank label */}
            <div className="absolute top-2 inset-x-0 text-center">
              <span className="text-xs font-bold" style={{ color: '#FAF0BF' }}>TANK</span>
            </div>
            
            {/* Water Level Animation */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 rounded-b-lg"
              style={{ backgroundColor: 'rgba(96, 165, 250, 0.5)' }}
              initial={{ height: '0%' }}
              animate={{ height: '65%' }}
              transition={{ duration: 1.5, delay: 1.2 }}
            />
            
            {/* Tank icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Cylinder size={28} color="#FAF0BF" style={{ opacity: 0.6 }} />
            </div>
          </motion.div>
        )}

        {/* Direct Delivery Sprinkler (for direct) */}
        {!isTankDelivery && (
          <motion.div
            className="absolute right-8 bottom-16"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            {/* Sprinkler Head */}
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: THEME.accent }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Droplet size={28} color="#FAF0BF" />
            </motion.div>
            
            {/* Water spray effect */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-8 rounded-full"
                style={{
                  backgroundColor: '#60A5FA',
                  left: '50%',
                  top: '50%',
                  transformOrigin: 'center top',
                  transform: `rotate(${angle}deg) translateY(-100%)`,
                  opacity: 0.5
                }}
                animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </motion.div>
        )}

        {/* Elbow Joint */}
        {isTankDelivery && (
          <motion.div
            className="absolute right-[88px] bottom-16 w-12 h-12 rounded-tr-2xl"
            style={{ border: '4px solid #6B7280', borderLeft: 'none', borderBottom: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          />
        )}

        {/* Flow Direction Arrow */}
        <motion.div
          className="absolute left-1/2 bottom-6 -translate-x-1/2"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight size={24} color={THEME.accent} />
        </motion.div>
      </div>

      {/* Info Cards */}
      <motion.div
        className="absolute bottom-8 left-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <Route size={24} color={THEME.accent} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>DELIVERY</p>
            <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{deliveryTarget}</p>
          </div>
        </div>
      </motion.div>

      {isTankDelivery && (
        <motion.div
          className="absolute top-8 right-8 p-4 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <Cylinder size={24} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>TANK HEIGHT</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>{overheadTankHeight} ft</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pipe Length Card */}
      <motion.div
        className="absolute bottom-8 right-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-xs font-semibold" style={{ color: THEME.accent }}>PIPE LENGTH</p>
        <p className="text-sm font-bold" style={{ color: THEME.text }}>{totalPipeLength} ft</p>
      </motion.div>

      {/* Pipe Material Card */}
      <motion.div
        className="absolute top-8 left-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs font-semibold" style={{ color: THEME.accent }}>MATERIAL</p>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: pipeColor }} />
          <p className="text-sm font-bold" style={{ color: THEME.text }}>{mainlinePipeMaterial}</p>
        </div>
      </motion.div>

      {/* Pipe Condition Warning */}
      {pipeCondition === 'reusing' && (
        <motion.div
          className="absolute top-32 left-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ 
            backgroundColor: hasHighFriction ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `2px solid ${hasHighFriction ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}` 
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <TriangleAlert size={20} color={hasHighFriction ? '#EF4444' : '#F59E0B'} />
            <div>
              <p className="text-xs font-semibold" style={{ color: hasHighFriction ? '#EF4444' : '#F59E0B' }}>OLD PIPES</p>
              <p className="text-xs" style={{ color: hasHighFriction ? '#EF4444' : '#F59E0B' }}>+{frictionHeadPenalty}% friction</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Elbows Indicator */}
      {numberOfElbows > 0 && (
        <motion.div
          className="absolute top-56 left-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ 
            backgroundColor: hasManyElbows ? 'rgba(245, 158, 11, 0.1)' : THEME.cardBg,
            border: `2px solid ${hasManyElbows ? 'rgba(245, 158, 11, 0.3)' : THEME.cardBorder}` 
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <GitBranch size={18} color={hasManyElbows ? '#F59E0B' : THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: hasManyElbows ? '#F59E0B' : THEME.accent }}>ELBOWS</p>
              <p className="text-sm font-bold" style={{ color: hasManyElbows ? '#F59E0B' : THEME.text }}>{numberOfElbows} bends</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Flowmeter Indicator */}
      {flowmeterRequirement && (
        <motion.div
          className="absolute bottom-32 left-8 px-3 py-2 backdrop-blur-sm rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <Gauge size={16} color={THEME.accent} />
            <span className="text-xs font-bold" style={{ color: THEME.text }}>FLOWMETER</span>
          </div>
        </motion.div>
      )}

      {/* Auxiliary Outlet Indicator */}
      {auxiliaryOutletNeed && (
        <motion.div
          className="absolute top-56 right-8 px-3 py-2 backdrop-blur-sm rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-2">
            <Wrench size={16} color={THEME.accent} />
            <span className="text-xs font-bold" style={{ color: THEME.text }}>AUX OUTLET</span>
          </div>
        </motion.div>
      )}

      {/* Tank Capacity (when tank delivery) */}
      {isTankDelivery && tankCapacity > 0 && (
        <motion.div
          className="absolute top-32 right-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <Funnel size={18} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>CAPACITY</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>{tankCapacity}L</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sump Details (when sump delivery) */}
      {isSumpDelivery && (
        <>
          <motion.div
            className="absolute bottom-32 right-8 p-3 backdrop-blur-sm rounded-xl"
            style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>SUMP DEPTH</p>
            <p className="text-sm font-bold" style={{ color: THEME.text }}>{groundSumpDepth} ft</p>
          </motion.div>
          {sumpDistance > 0 && (
            <motion.div
              className="absolute top-32 right-8 p-3 backdrop-blur-sm rounded-xl"
              style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>SUMP DISTANCE</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>{sumpDistance} ft</p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

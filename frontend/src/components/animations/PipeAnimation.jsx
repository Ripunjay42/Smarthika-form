import { motion } from 'framer-motion';
import { ArrowRight, Cylinder, Droplet, Funnel, Gauge, Route, AlertTriangle, Wrench } from 'lucide-react';

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
  deliveryTarget = ['direct'],
  overheadTankHeight = 20,
  tankCapacity = 0,
  groundSumpDepth = 0,
  sumpDistance = 0,
  mainlineDiameter = 3,
  totalPipeLength = 100,
  mainlinePipeMaterial = 'HDPE',
  pipeCondition = 'new',
  flowmeterSize = 2,
}) {
  // Handle deliveryTarget as array
  const targets = Array.isArray(deliveryTarget) ? deliveryTarget : (deliveryTarget ? [deliveryTarget] : ['direct']);
  const isTankDelivery = targets.includes('tank');
  const isSumpDelivery = targets.includes('sump');
  const isDirectDelivery = targets.includes('direct');
  
  // Responsive sizing - significantly increased for large screens
  const containerWidth = typeof window !== 'undefined' && window.innerWidth > 1400 ? 900 : 700;
  const containerHeight = typeof window !== 'undefined' && window.innerWidth > 1400 ? 700 : 500;
  const pumpWidth = containerWidth * 0.12;
  const pumpHeight = containerWidth * 0.15;
  const tankWidth = containerWidth * 0.15;
  const tankHeight = containerWidth * 0.12;
  const tankHeightPixels = Math.min(overheadTankHeight * 8, 280);
  
  // Determine pipe color based on material
  const pipeColors = {
    'HDPE': '#264653',
    'PVC': '#457B9D',
    'GI': '#A8DADC',
  };
  const pipeColor = pipeColors[mainlinePipeMaterial] || pipeColors['HDPE'];
  
  // Pipe width based on diameter
  const pipeWidth = Math.min(20 + mainlineDiameter * 8, 60);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Main Container - Scaled SVG approach for precision */}
      <svg 
        width={containerWidth} 
        height={containerHeight} 
        viewBox={`0 0 ${containerWidth} ${containerHeight}`}
        className="relative"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      >
        <defs>
          <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={pipeColor} stopOpacity="1" />
            <stop offset="100%" stopColor={pipeColor} stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Horizontal Mainline Pipe */}
        <motion.rect
          x={containerWidth * 0.15}
          y={containerHeight * 0.5 - pipeWidth/2}
          width={isTankDelivery ? containerWidth * 0.4 : containerWidth * 0.65}
          height={pipeWidth}
          rx={pipeWidth/2}
          fill="url(#pipeGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Flow Animation Line */}
        <motion.line
          x1={containerWidth * 0.15}
          y1={containerHeight * 0.5}
          x2={isTankDelivery ? containerWidth * 0.55 : containerWidth * 0.8}
          y2={containerHeight * 0.5}
          stroke="#60A5FA"
          strokeWidth={pipeWidth * 0.5}
          strokeDasharray="20,10"
          initial={{ strokeDashoffset: 30 }}
          animate={{ strokeDashoffset: -300 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          opacity="0.7"
        />

        {/* Vertical Pipe for Tank */}
        {isTankDelivery && (
          <motion.rect
            x={containerWidth * 0.55 - pipeWidth/2}
            y={containerHeight * 0.5 - tankHeightPixels}
            width={pipeWidth}
            height={tankHeightPixels}
            rx={pipeWidth/2}
            fill="url(#pipeGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        )}

        {/* Pump House */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Pump body */}
          <rect
            x={containerWidth * 0.02}
            y={containerHeight * 0.4}
            width={pumpWidth}
            height={pumpHeight}
            rx="8"
            fill="#2C3E50"
            stroke="#1A1A1A"
            strokeWidth="2"
          />
          {/* Pump top */}
          <circle
            cx={containerWidth * 0.08}
            cy={containerHeight * 0.38}
            r={pumpWidth * 0.25}
            fill="#34495E"
            stroke="#1A1A1A"
            strokeWidth="2"
          />
          {/* Water indicator */}
          <motion.rect
            x={containerWidth * 0.02}
            y={containerHeight * 0.52}
            width={pumpWidth}
            height={pumpHeight * 0.3}
            rx="4"
            fill="#60A5FA"
            opacity="0.5"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {/* Label */}
          <text
            x={containerWidth * 0.08}
            y={containerHeight * 0.28}
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#689F38"
          >
            PUMP
          </text>
        </motion.g>

        {/* Tank */}
        {isTankDelivery && (
          <motion.g
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Tank body */}
            <rect
              x={containerWidth * 0.5}
              y={containerHeight * 0.15}
              width={tankWidth}
              height={tankHeight}
              rx="6"
              fill="#689F38"
              stroke="#558B2F"
              strokeWidth="3"
            />
            {/* Water level inside tank */}
            <motion.rect
              x={containerWidth * 0.51}
              y={containerHeight * 0.2}
              width={tankWidth * 0.9}
              height={tankHeight * 0.6}
              rx="4"
              fill="#60A5FA"
              initial={{ height: 0 }}
              animate={{ height: tankHeight * 0.6 }}
              transition={{ duration: 1.5, delay: 0.7 }}
              opacity="0.6"
            />
            {/* Tank label */}
            <text
              x={containerWidth * 0.575}
              y={containerHeight * 0.1}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#33691E"
            >
              TANK
            </text>
            {/* Capacity label */}
            {tankCapacity > 0 && (
              <text
                x={containerWidth * 0.575}
                y={containerHeight * 0.25}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#FFFFFF"
              >
                {tankCapacity}L
              </text>
            )}
          </motion.g>
        )}

        {/* Direct Sprinkler */}
        {isDirectDelivery && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Sprinkler head */}
            <motion.circle
              cx={containerWidth * 0.8}
              cy={containerHeight * 0.5}
              r={containerWidth * 0.06}
              fill="#689F38"
              stroke="#558B2F"
              strokeWidth="2"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            {/* Water spray lines */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.line
                key={i}
                x1={containerWidth * 0.8}
                y1={containerHeight * 0.5}
                x2={containerWidth * 0.8 + Math.cos(angle * Math.PI / 180) * containerWidth * 0.12}
                y2={containerHeight * 0.5 + Math.sin(angle * Math.PI / 180) * containerWidth * 0.12}
                stroke="#60A5FA"
                strokeWidth="2"
                opacity="0.6"
                animate={{ opacity: [0.3, 0.8, 0.3], strokeWidth: [2, 4, 2] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
            {/* Label */}
            <text
              x={containerWidth * 0.8}
              y={containerHeight * 0.65}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#689F38"
            >
              SPRINKLER
            </text>
          </motion.g>
        )}

        {/* Sump */}
        {isSumpDelivery && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Sump pit */}
            <rect
              x={containerWidth * 0.7}
              y={containerHeight * 0.5}
              width={containerWidth * 0.15}
              height={containerHeight * 0.3}
              rx="6"
              fill="none"
              stroke="#689F38"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            {/* Water inside sump */}
            <rect
              x={containerWidth * 0.71}
              y={containerHeight * 0.6}
              width={containerWidth * 0.13}
              height={containerHeight * 0.18}
              rx="4"
              fill="#60A5FA"
              opacity="0.4"
            />
            {/* Label */}
            <text
              x={containerWidth * 0.775}
              y={containerHeight * 0.48}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#689F38"
            >
              SUMP
            </text>
          </motion.g>
        )}

        {/* Elbow Joint for Tank */}
        {isTankDelivery && (
          <motion.path
            d={`M ${containerWidth * 0.55} ${containerHeight * 0.5} Q ${containerWidth * 0.57} ${containerHeight * 0.48} ${containerWidth * 0.57} ${containerHeight * 0.46}`}
            stroke={pipeColor}
            strokeWidth={pipeWidth}
            fill="none"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />
        )}
      </svg>

      {/* Info Card Grid - Positioned around the visualization */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Top Left - Material */}
          <motion.div
            className="absolute top-32 left-32 p-4 backdrop-blur-sm rounded-xl pointer-events-auto"
            style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: pipeColor }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: THEME.accent }}>MATERIAL</p>
                <p className="text-sm font-bold" style={{ color: THEME.text }}>{mainlinePipeMaterial.toUpperCase()}</p>
              </div>
            </div>
          </motion.div>

          {/* Top Right - Tank Height */}
          {isTankDelivery && (
            <motion.div
              className="absolute top-32 right-32 p-4 backdrop-blur-sm rounded-xl pointer-events-auto"
              style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <Cylinder size={24} color={THEME.accent} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: THEME.accent }}>HEIGHT</p>
                  <p className="text-sm font-bold" style={{ color: THEME.text }}>{overheadTankHeight} ft</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Middle Left - Delivery Targets */}
          <motion.div
            className="absolute left-32 bottom-32 p-4 backdrop-blur-sm rounded-xl pointer-events-auto"
            style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-3">
              <Route size={24} color={THEME.accent} />
              <div>
                <p className="text-xs font-semibold" style={{ color: THEME.accent }}>TARGETS</p>
                <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>
                  {targets.map(t => t === 'direct' ? 'Direct' : t === 'tank' ? 'Tank' : 'Sump').join(', ')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Middle Right - Pipe Details */}
          <motion.div
            className="absolute right-32 bottom-32 p-4 backdrop-blur-sm rounded-xl pointer-events-auto"
            style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Gauge size={20} color={THEME.accent} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: THEME.accent }}>DIAMETER</p>
                  <p className="text-sm font-bold" style={{ color: THEME.text }}>{mainlineDiameter}"</p>
                </div>
              </div>
              <div className="text-xs" style={{ color: THEME.textLight }}>Length: {totalPipeLength} ft</div>
            </div>
          </motion.div>

          {/* Bottom Left - Pipe Condition */}
          {pipeCondition === 'old' && (
            <motion.div
              className="hidden"
              style={{ 
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: `2px solid rgba(245, 158, 11, 0.3)`
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} color="#F59E0B" />
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#F59E0B' }}>OLD PIPES</p>
                  <p className="text-xs" style={{ color: '#F59E0B' }}>May have friction loss</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bottom Right - Flow Meter Size */}
          {flowmeterSize && (
            <motion.div
              className="hidden"
              style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <div className="flex items-center gap-3">
                <Gauge size={24} color={THEME.accent} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: THEME.accent }}>FLOWMETER</p>
                  <p className="text-sm font-bold" style={{ color: THEME.text }}>{flowmeterSize}"</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

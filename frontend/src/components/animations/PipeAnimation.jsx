import { motion } from 'framer-motion';

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

export default function PipeAnimation({ 
  unitSystem = 'feet',
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
  const targets = Array.isArray(deliveryTarget) ? deliveryTarget : (deliveryTarget ? [deliveryTarget] : ['direct']);
  const isTankDelivery = targets.includes('tank');
  const isSumpDelivery = targets.includes('sump');
  const isDirectDelivery = targets.includes('direct');
  
  const unitLabel = unitSystem === 'meters' ? 'm' : 'ft';
  
  const containerWidth = 800;
  const containerHeight = 550;
  const pipeStroke = 8;

  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ backgroundColor: THEME.background }}>
      <svg 
        width={containerWidth} 
        height={containerHeight} 
        viewBox={`0 0 ${containerWidth} ${containerHeight}`}
        className="relative"
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        <defs>
          <linearGradient id="waterFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={THEME.waterLight} stopOpacity="0.2" />
            <stop offset="50%" stopColor={THEME.water} stopOpacity="0.7" />
            <stop offset="100%" stopColor={THEME.waterLight} stopOpacity="0.2" />
          </linearGradient>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill={THEME.waterLight} />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main Horizontal Pipe */}
        <motion.line
          x1={150}
          y1={280}
          x2={isTankDelivery ? 450 : 580}
          y2={280}
          stroke={THEME.pipe}
          strokeWidth={pipeStroke}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Animated Water Flow - Main Pipe */}
        <motion.line
          x1={150}
          y1={280}
          x2={isTankDelivery ? 450 : 580}
          y2={280}
          stroke="url(#waterFlow)"
          strokeWidth={pipeStroke - 2}
          strokeLinecap="round"
          strokeDasharray="40 20"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -300 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Flow Direction Indicator */}
        <motion.g
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <text
            x={300}
            y={260}
            fontSize="12"
            fontWeight="600"
            fill={THEME.water}
            textAnchor="middle"
          >
            ↓ WATER FLOW
          </text>
        </motion.g>

        {/* Pump Unit */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Pump Body */}
          <rect
            x={20}
            y={200}
            width={120}
            height={120}
            rx={8}
            fill={THEME.primaryLight}
            stroke={THEME.primary}
            strokeWidth={2}
          />
          
          {/* Pump Motor Indicator */}
          <motion.circle
            cx={80}
            cy={260}
            r={20}
            fill="none"
            stroke={THEME.water}
            strokeWidth={2}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Center motor dot */}
          <circle
            cx={80}
            cy={260}
            r={6}
            fill={THEME.water}
          />
          
          <text
            x={80}
            y={350}
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill={THEME.text}
          >
            PUMP
          </text>
          
          {/* Status indicator */}
          <motion.circle
            cx={110}
            cy={210}
            r={5}
            fill="#10b981"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </motion.g>

        {/* Pressure gauge indicator on main pipe */}
        <motion.g>
          <circle cx={250} cy={250} r={12} fill="none" stroke={THEME.primary} strokeWidth="1.5" />
          <text x={250} y={255} fontSize="10" textAnchor="middle" fill={THEME.text} fontWeight="600">P</text>
        </motion.g>

        {/* Vertical Pipe to Tank */}
        {isTankDelivery && (
          <>
            <motion.line
              x1={450}
              y1={280}
              x2={450}
              y2={160}
              stroke={THEME.pipe}
              strokeWidth={pipeStroke}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            />
            
            {/* Water flow in vertical pipe */}
            <motion.line
              x1={450}
              y1={280}
              x2={450}
              y2={160}
              stroke="url(#waterFlow)"
              strokeWidth={pipeStroke - 2}
              strokeLinecap="round"
              strokeDasharray="40 20"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -300 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Upward flow indicator */}
            <motion.text
              x={470}
              y={215}
              fontSize="11"
              fill={THEME.water}
              fontWeight="600"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ↑
            </motion.text>
          </>
        )}

        {/* Overhead Tank */}
        {isTankDelivery && (
          <motion.g
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Tank body */}
            <rect
              x={370}
              y={60}
              width={160}
              height={100}
              rx={6}
              fill={THEME.primaryLight}
              stroke={THEME.primary}
              strokeWidth={2}
            />
            
            {/* Water level in tank */}
            <motion.rect
              x={385}
              y={105}
              width={130}
              height={45}
              rx={3}
              fill={THEME.water}
              initial={{ scaleY: 0, originY: 1 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              opacity={0.6}
            />
            
            {/* Tank overflow indicator */}
            <motion.circle
              cx={512}
              cy={68}
              r={4}
              fill="none"
              stroke={THEME.primary}
              strokeWidth={1.5}
            />
            
            <text
              x={450}
              y={50}
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill={THEME.text}
            >
              TANK
            </text>
            
            {tankCapacity > 0 && (
              <text
                x={450}
                y={135}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill={THEME.text}
              >
                {tankCapacity}L
              </text>
            )}
          </motion.g>
        )}

        {/* Direct Delivery Output */}
        {isDirectDelivery && (
          <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Output nozzle - improved design */}
            <circle
              cx={550}
              cy={260}
              r={50}
              fill={THEME.primaryLight}
              stroke={THEME.primary}
              strokeWidth={2}
            />
            
            {/* Nozzle tip - conical shape */}
            <path
              d="M 540 300 L 560 300 L 555 320 L 545 320 Z"
              fill={THEME.water}
              stroke={THEME.primary}
              strokeWidth={1}
            />
            
            {/* Water spray cone indicator */}
            <motion.path
              d="M 550 320 L 520 380 M 550 320 L 580 380"
              stroke={THEME.waterLight}
              strokeWidth={2}
              opacity={0.4}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            
            {/* Water droplets - improved pattern */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.g key={i}>
                <motion.circle
                  cx={550 + (i - 2.5) * 22}
                  cy={320}
                  r={7}
                  fill={THEME.water}
                  initial={{ opacity: 0.1, scale: 0.2, y: 0 }}
                  animate={{ 
                    opacity: [0.1, 0.9, 0.1],
                    scale: [0.2, 1.2, 0.2],
                    y: [0, 80, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              </motion.g>
            ))}

            {/* Splash effect circles */}
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={`splash-${i}`}
                cx={550}
                cy={400}
                r={15 + i * 10}
                fill="none"
                stroke={THEME.waterLight}
                strokeWidth={1.5}
                opacity={0.5}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.5],
                  opacity: [0.6, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.4
                }}
              />
            ))}
            
            <text
              x={550}
              y={200}
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill={THEME.text}
            >
              OUTPUT
            </text>
            
            {/* Flow rate indicator - improved */}
            <motion.text
              x={550}
              y={468}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill={THEME.water}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ◆ Flow: Active
            </motion.text>
          </motion.g>
        )}

        {/* Ground Sump */}
        {isSumpDelivery && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Ground Surface Line */}
            <line
              x1={620}
              y1={220}
              x2={760}
              y2={220}
              stroke={THEME.primary}
              strokeWidth={2}
              strokeDasharray="6 3"
            />

            {/* Sump Pit Container - Underground */}
            <motion.g>
              {/* Left wall */}
              <line
                x1={620}
                y1={220}
                x2={610}
                y2={320}
                stroke={THEME.primary}
                strokeWidth={2}
              />
              
              {/* Right wall */}
              <line
                x1={760}
                y1={220}
                x2={770}
                y2={320}
                stroke={THEME.primary}
                strokeWidth={2}
              />
              
              {/* Bottom */}
              {/* <path
                d="M 610 360 Q 690 375 770 360"
                stroke={THEME.primary}
                strokeWidth={2}
                fill="none"
              /> */}

              {/* Water level - animated fill */}
              <motion.path
                d="M 610 320 Q 690 330 770 320 L 770 360 Q 690 375 610 360 Z"
                fill="url(#sumpWaterGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.8 }}
              />

              {/* Water surface ripple */}
              <motion.path
                d="M 610 320 Q 690 325 770 320"
                stroke={THEME.water}
                strokeWidth={1.5}
                fill="none"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Water level indicator */}
              <motion.line
                x1={600}
                y1={290}
                x2={780}
                y2={290}
                stroke={THEME.water}
                strokeWidth={1}
                strokeDasharray="4 2"
                opacity={0.6}
              />
            </motion.g>

            {/* Intake Pipe from above */}
            <line
              x1={690}
              y1={210}
              x2={690}
              y2={220}
              stroke={THEME.primary}
              strokeWidth={2}
              strokeLinecap="round"
            />
            
            {/* Pump intake from bottom */}
            <motion.circle
              cx={690}
              cy={310}
              r={4}
              fill={THEME.water}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Labels */}
            <text
              x={690}
              y={205}
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill={THEME.text}
            >
              SUMP
            </text>

            {/* Water level percentage */}
            <motion.text
              x={690}
              y={300}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill={THEME.text}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ≈ 60%
            </motion.text>
            
            {/* Ground Label - Below Sump */}
            <text
              x={690}
              y={330}
              textAnchor="middle"
              fontSize="10"
              fill={THEME.textMuted}
              fontWeight="500"
            >
              Ground
            </text>
            
            {/* Depth indicator */}
            {groundSumpDepth > 0 && (
              <text
                x={690}
                y={380}
                textAnchor="middle"
                fontSize="10"
                fill={THEME.textMuted}
                fontWeight="500"
              >
                {groundSumpDepth}{unitLabel} deep
              </text>
            )}
          </motion.g>
        )}

        {/* System Status Bar - REMOVED */}
      </svg>

      {/* Clean Info Panel */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg px-8 py-4 flex gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="text-center">
          <p className="text-xs font-medium" style={{ color: THEME.textMuted }}>Material</p>
          <p className="text-sm font-bold" style={{ color: THEME.text }}>{mainlinePipeMaterial}</p>
        </div>
        <div className="text-center border-l border-r px-8" style={{ borderColor: THEME.secondary + '30' }}>
          <p className="text-xs font-medium" style={{ color: THEME.textMuted }}>Diameter</p>
          <p className="text-sm font-bold" style={{ color: THEME.text }}>{mainlineDiameter}{unitSystem === 'meters' ? 'mm' : '"'}</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-medium" style={{ color: THEME.textMuted }}>Length</p>
          <p className="text-sm font-bold" style={{ color: THEME.text }}>{totalPipeLength} {unitLabel}</p>
        </div>
        {isTankDelivery && (
          <div className="text-center border-l px-8" style={{ borderColor: THEME.secondary + '30' }}>
            <p className="text-xs font-medium" style={{ color: THEME.textMuted }}>Tank Height</p>
            <p className="text-sm font-bold" style={{ color: THEME.text }}>{overheadTankHeight} {unitLabel}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

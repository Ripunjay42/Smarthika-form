import { motion } from 'framer-motion';
import { BatteryCharging, Clock, Fuel, Gauge, Plug, Shield, Sun, TriangleAlert, WifiHigh, Zap, CircleCheck } from 'lucide-react';

const THEME = {
  accent: '#689F38',
  accentLight: 'rgba(104, 159, 56, 0.3)',
  text: '#33691E',
  textLight: '#558B2F',
  background: '#EDEDE7',
  cardBg: 'rgba(104, 159, 56, 0.1)',
  cardBorder: 'rgba(104, 159, 56, 0.3)',
};

export default function VoltmeterAnimation({ 
  averageGridVoltage = 400, 
  voltageStability = 'stable',
  primaryEnergySource = ['grid'],
  gridPhase = 'three-phase',
  solarSystemVoltage = 0,
  dailyAvailability = 24,
  powerSchedule = 'day',
  wiringHealth = 'good',
  currentWiringCondition = 'good', // New field - renamed from wiringHealth
  cableUpgradeRequired = false,
  distanceMeterToBorewell = 0,
  hasExistingPower = true, // New field - determines visibility
  frequentPhaseCuts = false, // New field - for phase protection
  generatorOwnership = false,
  evChargingNeed = false
}) {
  // Map voltage (300-500V) to angle (-90 to 90 degrees)
  const clampedVoltage = Math.max(300, Math.min(500, averageGridVoltage));
  const angle = ((clampedVoltage - 300) / 200) * 180 - 90;
  
  const isLow = averageGridVoltage < 360;
  const isHigh = averageGridVoltage > 440;
  const isOptimal = !isLow && !isHigh;
  const isFluctuating = voltageStability === 'fluctuating' || voltageStability === 'unstable';
  
  // Additional conditions - support array-based primaryEnergySource
  const energySources = Array.isArray(primaryEnergySource) ? primaryEnergySource : [primaryEnergySource];
  const hasGrid = energySources.includes('grid');
  const hasSolar = energySources.includes('solar');
  const hasGenerator = energySources.includes('generator');
  const hasWiringIssues = currentWiringCondition !== 'good'; // Use new field name
  const lowAvailability = dailyAvailability < 12;

  // If it's a new site (no existing power), show a different message
  if (!hasExistingPower) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md space-y-4"
        >
          <div className="flex justify-center mb-4">
            <Zap size={64} color={THEME.accent} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold" style={{ color: THEME.text }}>New Connection / Greenfield</h2>
          <p style={{ color: THEME.textLight }} className="text-sm leading-relaxed">
            No existing power connection detected. Our team will design a complete power solution tailored to your irrigation requirements and location.
          </p>
          <div className="pt-4 space-y-2 text-left">
            <p className="text-xs font-semibold" style={{ color: THEME.text }}>We'll consider:</p>
            <ul className="text-xs space-y-1" style={{ color: THEME.textLight }}>
              <li>✓ Grid connection availability & feasibility</li>
              <li>✓ Solar potential for your region</li>
              <li>✓ Backup power requirements</li>
              <li>✓ Long-term power stability</li>
            </ul>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Voltmeter Gauge - Pure White Round Meter */}
      <div className="relative w-96 h-96 flex items-center justify-center">
        {/* Outer Ring Shadow */}
        <div className="absolute inset-0 rounded-full" style={{ 
          background: 'radial-gradient(circle, rgba(104, 159, 56, 0.1) 0%, transparent 70%)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }} />
        
        {/* Gauge Background - Perfect Circle with white */}
        <div 
          className="absolute inset-8 rounded-full flex items-center justify-center"
          style={{ 
            background: '#FFFFFF',
            border: '8px solid #9CA3AF',
            boxShadow: 'inset 0 10px 30px rgba(0, 0, 0, 0.05), 0 0 50px rgba(156, 163, 175, 0.3)'
          }}
        >
          {/* SVG Gauge with Circular Scale Zones */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }}>
            {/* Circular Background Track */}
            <circle cx="150" cy="150" r="100" fill="none" stroke="#F0F0F0" strokeWidth="14" />
            
            {/* Scale Tick Marks - 5 main marks with rounded caps */}
            <g stroke="#33691E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
              {/* 300V - Left */}
              <line x1="30" y1="150" x2="50" y2="150" />
              {/* 350V - Lower Left */}
              <line x1="60" y1="230" x2="72" y2="248" />
              {/* 450V - Lower Right */}
              <line x1="240" y1="230" x2="228" y2="248" />
              {/* 500V - Right */}
              <line x1="250" y1="150" x2="270" y2="150" />
            </g>
            
            {/* Scale Labels - Enhanced typography */}
            <text x="20" y="163" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#EF4444" opacity="0.9">300</text>
            <text x="150" y="25" textAnchor="middle" fontSize="22" fontWeight="900" fill={THEME.accent}>400V</text>
            <text x="280" y="163" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#EF4444" opacity="0.9">500</text>
            
            
          </svg>

          {/* Needle Base - Rotating element */}
          <motion.div
            className="absolute top-1/2 left-1/2 origin-bottom"
            style={{ 
              width: '6px',
              height: '85px',
              marginLeft: '-3px',
              marginTop: '-85px',
              backgroundColor: THEME.accent,
              borderRadius: '3px'
            }}
            animate={{
              rotate: isFluctuating 
                ? [angle - 15, angle + 15, angle - 10, angle + 10, angle - 5, angle]
                : angle,
            }}
            transition={{
              duration: isFluctuating ? 0.4 : 0.6,
              repeat: isFluctuating ? Infinity : 0,
              ease: 'easeInOut'
            }}
          />

          {/* Voltage Display - Large and bold */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center z-5">
            <motion.span
              className="text-7xl font-black font-mono block leading-none"
              style={{ 
                color: isOptimal ? THEME.accent : isLow || isHigh ? '#EF4444' : '#F59E0B',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
              key={averageGridVoltage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {averageGridVoltage}
            </motion.span>
            <span className="text-base font-bold tracking-widest" style={{ color: THEME.accent }}>VOLTS</span>
          </div>

          {/* Status Indicator - Further down */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center">
            <motion.div
              className="px-8 py-2 rounded-full font-black text-sm inline-block"
              style={{
                backgroundColor: isOptimal ? 'rgba(104, 159, 56, 0.2)' : isLow || isHigh ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: isOptimal ? THEME.accent : isLow || isHigh ? '#EF4444' : '#F59E0B',
                border: `3px solid ${isOptimal ? THEME.accent : isLow || isHigh ? '#EF4444' : '#F59E0B'}`,
                letterSpacing: '0.05em'
              }}
              animate={isFluctuating ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              {isOptimal ? '✓ OPTIMAL' : isLow ? '⚠ LOW' : isHigh ? '⚠ HIGH' : '⚠ UNSTABLE'}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stability Indicator */}
      <motion.div
        className="absolute top-8 right-8 px-4 py-3 rounded-xl flex items-center gap-3"
        style={{ 
          backgroundColor: isFluctuating ? 'rgba(239, 68, 68, 0.1)' : THEME.cardBg,
          border: `2px solid ${isFluctuating ? 'rgba(239, 68, 68, 0.3)' : THEME.cardBorder}`
        }}
        animate={isFluctuating ? { scale: [1, 1.03, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        {isFluctuating ? (
          <TriangleAlert size={24} color="#EF4444" />
        ) : (
          <CircleCheck size={24} color={THEME.accent} />
        )}
        <div>
          <p className="text-xs font-semibold" style={{ color: isFluctuating ? '#EF4444' : THEME.accent }}>
            STABILITY
          </p>
          <p className="text-sm font-bold" style={{ color: isFluctuating ? '#EF4444' : THEME.text }}>
            {isFluctuating ? 'FLUCTUATING' : 'STABLE'}
          </p>
        </div>
      </motion.div>

      {/* Power Source Card */}
      <motion.div
        className="absolute bottom-8 left-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <Zap size={24} color={THEME.accent} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>POWER SOURCE</p>
            <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{Array.isArray(primaryEnergySource) ? primaryEnergySource.join(', ') : primaryEnergySource}</p>
          </div>
        </div>
      </motion.div>

      {/* Grid Phase Card - Only show when grid is selected */}
      {hasGrid && (
        <motion.div
          className="absolute bottom-8 right-8 p-4 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <Gauge size={24} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>GRID PHASE</p>
              <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{gridPhase.replace('-', ' ')}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Status Message - Only show when grid is selected */}
      {hasGrid && (isLow || isHigh) && (
        <motion.div
          className="absolute top-8 left-8 px-4 py-3 rounded-xl"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '2px solid rgba(239, 68, 68, 0.3)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 text-red-500">
            <TriangleAlert size={16} className="shrink-0" />
            <p className="text-xs font-semibold">
              {isLow ? 'Low Voltage - Motor at risk' : 'High Voltage - Use stabilizer'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Solar Indicator */}
      {hasSolar && (
        <motion.div
          className="absolute top-32 left-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', border: '2px solid rgba(251, 191, 36, 0.3)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <Sun size={20} color="#F59E0B" />
            <div>
              <p className="text-xs font-semibold text-yellow-600">SOLAR</p>
              {solarSystemVoltage > 0 && (
                <p className="text-xs font-bold text-yellow-700">{solarSystemVoltage}V</p>
              )}
            </div>
          </div>
        </motion.div>
      )}



      {/* Daily Availability */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 p-3 backdrop-blur-sm rounded-xl"
        style={{ 
          backgroundColor: lowAvailability ? 'rgba(239, 68, 68, 0.1)' : THEME.cardBg,
          border: `2px solid ${lowAvailability ? 'rgba(239, 68, 68, 0.3)' : THEME.cardBorder}` 
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2">
          <Clock size={18} color={lowAvailability ? '#EF4444' : THEME.accent} />
          <div>
            <p className="text-xs font-semibold" style={{ color: lowAvailability ? '#EF4444' : THEME.accent }}>AVAILABILITY</p>
            <p className="text-sm font-bold" style={{ color: lowAvailability ? '#EF4444' : THEME.text }}>{dailyAvailability}h/day</p>
          </div>
        </div>
      </motion.div>

      {/* Power Schedule */}
      {powerSchedule && (
        <motion.div
          className="absolute top-32 right-8 px-3 py-2 backdrop-blur-sm rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <WifiHigh size={16} color={THEME.accent} />
            <span className="text-xs font-bold capitalize" style={{ color: THEME.text }}>{powerSchedule}</span>
          </div>
        </motion.div>
      )}

      {/* Current Wiring Condition */}
      <motion.div
        className="absolute top-56 right-8 p-3 backdrop-blur-sm rounded-xl"
        style={{ 
          backgroundColor: wiringHealth === 'bad' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(104, 159, 56, 0.1)',
          border: `2px solid ${wiringHealth === 'bad' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(104, 159, 56, 0.3)'}` 
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2">
          <TriangleAlert size={20} color={wiringHealth === 'bad' ? '#EF4444' : THEME.accent} />
          <div>
            <p className="text-xs font-semibold" style={{ color: wiringHealth === 'bad' ? '#EF4444' : THEME.accent }}>WIRING</p>
            <p className="text-xs capitalize" style={{ color: wiringHealth === 'bad' ? '#EF4444' : THEME.accent }}>{wiringHealth}</p>
            {cableUpgradeRequired && (
              <span className="text-xs px-1 bg-red-100 text-red-600 rounded block mt-1">Upgrade Needed</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Cable Distance */}
      {distanceMeterToBorewell > 0 && (
        <motion.div
          className="absolute bottom-32 left-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-2">
            <Plug size={18} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>CABLE DIST</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>{distanceMeterToBorewell}m</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Generator Indicator */}
      {generatorOwnership && (
        <motion.div
          className="absolute bottom-32 right-8 px-3 py-2 backdrop-blur-sm rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <Fuel size={16} color={THEME.accent} />
            <span className="text-xs font-bold" style={{ color: THEME.text }}>GENERATOR</span>
          </div>
        </motion.div>
      )}

      {/* EV Charging */}
      {evChargingNeed && (
        <motion.div
          className="absolute bottom-56 right-8 px-3 py-2 backdrop-blur-sm rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center gap-2">
            <BatteryCharging size={16} color={THEME.accent} />
            <span className="text-xs font-bold" style={{ color: THEME.text }}>EV READY</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

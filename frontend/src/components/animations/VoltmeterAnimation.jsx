import { motion } from 'framer-motion';
import { Lightning, Warning, CheckCircle, Gauge, Sun, Shield, Plug, Clock, Engine, BatteryCharging, WifiHigh } from '@phosphor-icons/react';

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
  primaryEnergySource = 'grid',
  gridPhase = 'three-phase',
  solarSystemVoltage = 0,
  lowVoltageCutoff = false,
  highVoltageSurge = false,
  dailyAvailability = 24,
  powerSchedule = 'day',
  wiringHealth = 'good',
  cableUpgradeRequired = false,
  distanceMeterToBorewell = 0,
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
  
  // Additional conditions
  const hasSolar = primaryEnergySource === 'solar' || primaryEnergySource === 'hybrid';
  const hasProtection = lowVoltageCutoff || highVoltageSurge;
  const hasWiringIssues = wiringHealth !== 'good';
  const lowAvailability = dailyAvailability < 12;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Voltmeter Gauge */}
      <div className="relative w-72 h-72">
        {/* Gauge Background */}
        <div 
          className="absolute inset-0 rounded-full shadow-2xl"
          style={{ 
            background: 'linear-gradient(to bottom, #FAF0BF, #EDEDE7)', 
            border: `4px solid ${THEME.cardBorder}` 
          }}
        >
          {/* Scale Arc */}
          <svg className="absolute inset-3" viewBox="0 0 200 200">
            {/* Danger Zone (Low) - Red */}
            <path
              d="M 35 145 A 75 75 0 0 1 55 75"
              fill="none"
              stroke="#EF4444"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Warning Zone (Low) - Yellow */}
            <path
              d="M 55 75 A 75 75 0 0 1 80 50"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Safe Zone - Green */}
            <path
              d="M 80 50 A 75 75 0 0 1 120 50"
              fill="none"
              stroke={THEME.accent}
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Warning Zone (High) - Yellow */}
            <path
              d="M 120 50 A 75 75 0 0 1 145 75"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Danger Zone (High) - Red */}
            <path
              d="M 145 75 A 75 75 0 0 1 165 145"
              fill="none"
              stroke="#EF4444"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>

          {/* Needle */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-1.5 h-24 origin-bottom rounded-t-full"
            style={{ 
              backgroundColor: THEME.accent,
              marginLeft: '-3px',
              marginTop: '-96px'
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

          {/* Center Cap */}
          <div 
            className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg flex items-center justify-center"
            style={{ backgroundColor: THEME.accent }}
          >
            <Lightning size={20} weight="fill" color="#FAF0BF" />
          </div>

          {/* Voltage Display */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 text-center">
            <motion.span
              className="text-4xl font-bold font-mono"
              style={{ color: isOptimal ? THEME.text : isLow || isHigh ? '#EF4444' : '#F59E0B' }}
              key={averageGridVoltage}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {averageGridVoltage}
            </motion.span>
            <span className="text-sm block font-semibold" style={{ color: THEME.accent }}>VOLTS</span>
          </div>

          {/* Scale Labels */}
          <span className="absolute bottom-3 left-6 text-xs font-medium" style={{ color: THEME.textLight }}>300V</span>
          <span className="absolute bottom-3 right-6 text-xs font-medium" style={{ color: THEME.textLight }}>500V</span>
          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-medium" style={{ color: THEME.accent }}>400V</span>
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
          <Warning size={24} weight="duotone" color="#EF4444" />
        ) : (
          <CheckCircle size={24} weight="duotone" color={THEME.accent} />
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
          <Lightning size={24} weight="duotone" color={THEME.accent} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>POWER SOURCE</p>
            <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{primaryEnergySource}</p>
          </div>
        </div>
      </motion.div>

      {/* Grid Phase Card */}
      <motion.div
        className="absolute bottom-8 right-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <Gauge size={24} weight="duotone" color={THEME.accent} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>GRID PHASE</p>
            <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{gridPhase.replace('-', ' ')}</p>
          </div>
        </div>
      </motion.div>

      {/* Status Message */}
      {(isLow || isHigh) && (
        <motion.div
          className="absolute top-8 left-8 px-4 py-3 rounded-xl"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '2px solid rgba(239, 68, 68, 0.3)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p className="text-xs font-semibold text-red-500">
            {isLow ? '⚠ Low Voltage - Motor at risk' : '⚠ High Voltage - Use stabilizer'}
          </p>
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
            <Sun size={20} weight="duotone" color="#F59E0B" />
            <div>
              <p className="text-xs font-semibold text-yellow-600">SOLAR</p>
              {solarSystemVoltage > 0 && (
                <p className="text-xs font-bold text-yellow-700">{solarSystemVoltage}V</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Protection Indicators */}
      {hasProtection && (
        <motion.div
          className="absolute top-56 left-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <Shield size={20} weight="duotone" color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>PROTECTION</p>
              <div className="flex gap-1 mt-1">
                {lowVoltageCutoff && <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">Low V</span>}
                {highVoltageSurge && <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">Surge</span>}
              </div>
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
          <Clock size={18} weight="duotone" color={lowAvailability ? '#EF4444' : THEME.accent} />
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
            <WifiHigh size={16} weight="duotone" color={THEME.accent} />
            <span className="text-xs font-bold capitalize" style={{ color: THEME.text }}>{powerSchedule}</span>
          </div>
        </motion.div>
      )}

      {/* Wiring Health */}
      {hasWiringIssues && (
        <motion.div
          className="absolute top-56 right-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ 
            backgroundColor: wiringHealth === 'burnt' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `2px solid ${wiringHealth === 'burnt' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}` 
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <Warning size={20} weight="fill" color={wiringHealth === 'burnt' ? '#EF4444' : '#F59E0B'} />
            <div>
              <p className="text-xs font-semibold" style={{ color: wiringHealth === 'burnt' ? '#EF4444' : '#F59E0B' }}>WIRING</p>
              <p className="text-xs capitalize" style={{ color: wiringHealth === 'burnt' ? '#EF4444' : '#F59E0B' }}>{wiringHealth}</p>
              {cableUpgradeRequired && (
                <span className="text-xs px-1 bg-red-100 text-red-600 rounded block mt-1">Upgrade Needed</span>
              )}
            </div>
          </div>
        </motion.div>
      )}

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
            <Plug size={18} weight="duotone" color={THEME.accent} />
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
            <Engine size={16} weight="duotone" color={THEME.accent} />
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
            <BatteryCharging size={16} weight="duotone" color={THEME.accent} />
            <span className="text-xs font-bold" style={{ color: THEME.text }}>EV READY</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

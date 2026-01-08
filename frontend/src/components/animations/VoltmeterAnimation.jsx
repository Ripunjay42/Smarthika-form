import { motion } from 'framer-motion';
import { Lightning, Warning, CheckCircle, Gauge } from '@phosphor-icons/react';

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
  voltage = 400, 
  stability = 'stable',
  powerSource = 'grid',
  pumpHP = 5
}) {
  // Map voltage (300-500V) to angle (-90 to 90 degrees)
  const clampedVoltage = Math.max(300, Math.min(500, voltage));
  const angle = ((clampedVoltage - 300) / 200) * 180 - 90;
  
  const isLow = voltage < 360;
  const isHigh = voltage > 440;
  const isOptimal = !isLow && !isHigh;
  const isFluctuating = stability === 'fluctuating';

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
              key={voltage}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {voltage}
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
            <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{powerSource}</p>
          </div>
        </div>
      </motion.div>

      {/* Pump HP Card */}
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
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>PUMP RATING</p>
            <p className="text-sm font-bold" style={{ color: THEME.text }}>{pumpHP} HP</p>
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
    </div>
  );
}

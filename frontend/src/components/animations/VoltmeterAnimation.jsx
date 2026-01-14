import { motion } from 'framer-motion';
import { Zap, CircleCheck, TriangleAlert, Clock, Gauge } from 'lucide-react';

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

export default function VoltmeterAnimation({ 
  averageGridVoltage = 400, 
  voltageStability = 'stable',
  primaryEnergySource = ['grid'],
  gridPhase = 'three-phase',
  dailyAvailability = 24,
  hasExistingPower = true,
}) {
  // Map voltage (300-500V) to angle (-90 to 90 degrees for half circle)
  const clampedVoltage = Math.max(300, Math.min(500, averageGridVoltage));
  const angle = ((clampedVoltage - 300) / 200) * 180 - 90;
  
  const isLow = averageGridVoltage < 360;
  const isHigh = averageGridVoltage > 440;
  const isOptimal = !isLow && !isHigh;
  const isFluctuating = voltageStability === 'fluctuating' || voltageStability === 'unstable';
  
  const energySources = Array.isArray(primaryEnergySource) ? primaryEnergySource : [primaryEnergySource];
  const hasGrid = energySources.includes('grid');
  const lowAvailability = dailyAvailability < 12;

  if (!hasExistingPower) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md space-y-4"
        >
          <div className="flex justify-center mb-4">
            <Zap size={64} color={THEME.primary} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold" style={{ color: THEME.text }}>New Connection / Greenfield</h2>
          <p style={{ color: THEME.textMuted }} className="text-sm leading-relaxed">
            No existing power connection detected. Our team will design a complete power solution tailored to your irrigation requirements.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Half Circle Gauge */}
      <div className="relative w-80 h-40 flex items-center justify-center">
        <svg width="320" height="160" viewBox="0 0 320 160" className="absolute">
          {/* Half Circle Background */}
          <circle cx="160" cy="160" r="120" fill="none" stroke={THEME.primaryLight} strokeWidth="16" />
          
          {/* Zone Markers - Low, Optimal, High */}
          <circle cx="160" cy="160" r="120" fill="none" stroke={THEME.waterLight} strokeWidth="16" 
            strokeDasharray="62.8 62.8" strokeDashoffset="0" opacity="0.3" />
          <circle cx="160" cy="160" r="120" fill="none" stroke={THEME.waterLight} strokeWidth="16" 
            strokeDasharray="62.8 62.8" strokeDashoffset="-62.8" opacity="0.3" />
          
          {/* Tick Marks */}
          <g stroke={THEME.text} strokeWidth="3" strokeLinecap="round">
            {/* 300V */}
            <line x1="40" y1="160" x2="60" y2="160" />
            {/* 400V */}
            <line x1="160" y1="40" x2="160" y2="20" />
            {/* 500V */}
            <line x1="280" y1="160" x2="300" y2="160" />
          </g>
          
          {/* Labels */}
          <text x="30" y="180" fontSize="14" fontWeight="bold" fill={THEME.text}>300V</text>
          <text x="150" y="15" fontSize="16" fontWeight="bold" fill={THEME.text} textAnchor="middle">400V</text>
          <text x="290" y="180" fontSize="14" fontWeight="bold" fill={THEME.text} textAnchor="end">500V</text>
          
          {/* Animated Needle */}
          <motion.g
            animate={{ rotate: angle }}
            transition={{ duration: isFluctuating ? 0.4 : 0.8, type: 'spring', stiffness: 80 }}
            style={{ transformOrigin: '160px 160px' }}
          >
            <line x1="160" y1="160" x2="160" y2="50" stroke={THEME.primary} strokeWidth="5" strokeLinecap="round" />
            <circle cx="160" cy="160" r="8" fill={THEME.primary} />
          </motion.g>
        </svg>
      </div>

      {/* Voltage Value Display */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-5xl font-bold" style={{ color: THEME.primary }}>
          {averageGridVoltage}V
        </div>
        <div className="text-sm font-semibold" style={{ color: THEME.textMuted }}>
          {isOptimal ? '✓ Optimal' : isLow ? '⚠ Low Voltage' : '⚠ High Voltage'}
        </div>
      </motion.div>

      {/* Info Cards - Bottom Section */}
      <div className="absolute bottom-8 flex gap-4">
        {/* Stability Card */}
        <motion.div
          className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {isFluctuating ? (
            <TriangleAlert size={20} color="#ef4444" />
          ) : (
            <CircleCheck size={20} color={THEME.primary} />
          )}
          <div>
            <p className="text-xs font-medium" style={{ color: THEME.textMuted }}>Stability</p>
            <p className="text-sm font-bold" style={{ color: THEME.text }}>
              {isFluctuating ? 'Fluctuating' : 'Stable'}
            </p>
          </div>
        </motion.div>

        {/* Phase Card */}
        {hasGrid && (
          <motion.div
            className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Gauge size={20} color={THEME.primary} />
            <div>
              <p className="text-xs font-medium" style={{ color: THEME.textMuted }}>Grid Phase</p>
              <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>
                {gridPhase.replace('-', ' ')}
              </p>
            </div>
          </motion.div>
        )}

        {/* Availability Card */}
        <motion.div
          className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Clock size={20} color={THEME.primary} />
          <div>
            <p className="text-xs font-medium" style={{ color: THEME.textMuted }}>Daily Availability</p>
            <p className="text-sm font-bold" style={{ color: THEME.text }}>{dailyAvailability}h/day</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

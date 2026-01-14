import { motion } from 'framer-motion';
import { House, Wifi, Zap } from 'lucide-react';

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

const shelterStyles = {
  concrete: { color: '#9ca3af', label: 'Concrete' },
  tin: { color: '#b5a89d', label: 'Tin Shed' },
  open: { color: '#cbd5e1', label: 'Open Air' },
};

export default function ShelterAnimation({ 
  shelterType = 'concrete', 
  cellularSignalStrength = '4g',
  heatBuildupRisk = 'low',
  wallSpaceAvailable = 'standard',
  theftRiskLevel = 'safe',
  lightningArrestor = 'present',
  earthingPit = 'present',
  distanceToMainSwitch = 0,
  electricalSupport = 'expert',
  mechanicalSupport = 'expert',
  installationPreference = 'expert',
  liftingGearAvailability = 'manual',
}) {
  const shelter = shelterStyles[shelterType] || shelterStyles.concrete;
  
  const signalBars = {
    '4g': 4,
    '3g': 3,
    '2g': 2,
    'none': 0
  };
  
  const bars = signalBars[cellularSignalStrength] || 4;
  const hasSafetyIssues = lightningArrestor === 'absent' || earthingPit === 'absent';
  const hasHighHeat = heatBuildupRisk === 'high';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Shelter Structure - Simplified SVG */}
      <motion.svg
        width="280"
        height="260"
        viewBox="0 0 280 260"
        className="mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Foundation */}
        <rect x="40" y="200" width="200" height="20" fill="#8b7355" rx="2" />
        
        {/* Walls */}
        <rect x="50" y="120" width="180" height="80" fill={shelter.color} stroke={THEME.primary} strokeWidth="2" />
        
        {/* Roof */}
        <polygon points="50,120 140,40 230,120" fill={shelter.color} stroke={THEME.primary} strokeWidth="2" />
        
        {/* Door */}
        <motion.rect
          x="115" y="160" width="50" height="60"
          fill={THEME.primaryLight}
          stroke={THEME.primary}
          strokeWidth="2"
          rx="3"
        />
        
        {/* Door Handle */}
        <motion.circle
          cx="155" cy="190"
          r="3"
          fill={THEME.primary}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Window */}
        <rect x="70" y="140" width="30" height="30" fill={THEME.waterLight} stroke={THEME.primary} strokeWidth="1.5" rx="2" />
        <line x1="85" y1="140" x2="85" y2="170" stroke={THEME.primary} strokeWidth="1" />
        <line x1="70" y1="155" x2="100" y2="155" stroke={THEME.primary} strokeWidth="1" />
        
        {/* Control Panel indicator */}
        <motion.circle
          cx="210" cy="160"
          r="6"
          fill={THEME.water}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.svg>

      {/* Signal Card - Top Right */}
      <motion.div
        className="absolute top-8 right-8 bg-white rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs font-medium mb-2" style={{ color: THEME.textMuted }}>Signal Strength</p>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((bar) => (
            <motion.div
              key={bar}
              className="w-1.5 rounded-sm"
              style={{
                height: `${bar * 4}px`,
                backgroundColor: bar <= bars ? '#3b82f6' : '#e0e7ff',
              }}
              animate={bar <= bars ? { opacity: [0.6, 1, 0.6] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: bar * 0.1 }}
            />
          ))}
        </div>
        <p className="text-xs font-bold mt-2" style={{ color: '#3b82f6' }}>
          {cellularSignalStrength === '4g' ? '4G LTE' : cellularSignalStrength === '3g' ? '3G' : cellularSignalStrength === '2g' ? '2G' : 'No Signal'}
        </p>
      </motion.div>

      {/* Info Panel - Bottom */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg px-6 py-4 flex gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Shelter Type */}
        <div className="text-center">
          <p className="text-xs font-medium" style={{ color: THEME.textMuted }}>Shelter Type</p>
          <p className="text-sm font-bold" style={{ color: THEME.text }}>{shelter.label}</p>
        </div>

        {/* Safety Status */}
        <div className="text-center border-l border-r px-6" style={{ borderColor: THEME.secondary + '30' }}>
          <p className="text-xs font-medium" style={{ color: THEME.textMuted }}>Safety</p>
          <p className="text-sm font-bold" style={{ color: hasSafetyIssues ? '#ef4444' : THEME.text }}>
            {hasSafetyIssues ? '⚠ Alert' : '✓ OK'}
          </p>
        </div>

        {/* Heat Risk */}
        {hasHighHeat && (
          <div className="text-center border-l px-6" style={{ borderColor: THEME.secondary + '30' }}>
            <p className="text-xs font-medium" style={{ color: THEME.textMuted }}>Heat</p>
            <p className="text-sm font-bold" style={{ color: '#ef4444' }}>High Risk</p>
          </div>
        )}

        {/* Installation */}
        <div className="text-center border-l px-6" style={{ borderColor: THEME.secondary + '30' }}>
          <p className="text-xs font-medium" style={{ color: THEME.textMuted }}>Installation</p>
          <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{installationPreference}</p>
        </div>
      </motion.div>
    </div>
  );
}

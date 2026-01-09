import { motion } from 'framer-motion';
import { CircleCheck, Cpu, Flame, House, Lock, Shield, TriangleAlert, Truck, Wifi, WifiHigh, WifiLow, WifiOff, Wrench } from 'lucide-react';

const THEME = {
  accent: '#689F38',
  accentLight: 'rgba(104, 159, 56, 0.3)',
  text: '#33691E',
  textLight: '#558B2F',
  background: '#EDEDE7',
  cardBg: 'rgba(104, 159, 56, 0.1)',
  cardBorder: 'rgba(104, 159, 56, 0.3)',
};

const shelterStyles = {
  concrete: { roof: '#6B7280', walls: '#9CA3AF', label: 'Concrete' },
  tin: { roof: '#78716C', walls: '#A8A29E', label: 'Tin Shed' },
  open: { roof: 'transparent', walls: 'transparent', label: 'Open Air' },
};

const signalConfig = {
  '4g': { bars: 4, icon: WifiHigh, label: '4G LTE' },
  '3g': { bars: 3, icon: Wifi, label: '3G' },
  '2g': { bars: 2, icon: WifiLow, label: '2G' },
  'none': { bars: 0, icon: WifiOff, label: 'No Signal' },
};

export default function ShelterAnimation({ 
  shelterType = 'concrete', 
  cellularSignalStrength = '4g',
  ipRatingRequirement = 'IP54',
  heatBuildupRisk = 'low',
  wallSpaceAvailable = 'standard',
  theftRiskLevel = 'safe',
  antiTheftHardwareNeed = false,
  lightningArrestor = 'present',
  earthingPit = 'present',
  installationPreference = 'expert',
  liftingGearAvailability = 'chain-pulley',
  siteAccessibility = 'truck'
}) {
  const shelter = shelterStyles[shelterType] || shelterStyles.concrete;
  const signal = signalConfig[cellularSignalStrength] || signalConfig['4g'];
  const SignalIcon = signal.icon;
  
  // Safety and risk indicators
  const hasSafetyIssues = lightningArrestor === 'absent' || earthingPit === 'absent';
  const hasHighHeat = heatBuildupRisk === 'high';
  const needsTheftProtection = theftRiskLevel === 'high';

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* 3D Shelter */}
      <div className="relative" style={{ perspective: '800px' }}>
        <motion.div
          className="relative w-64 h-52"
          initial={{ rotateY: -15 }}
          animate={{ rotateY: [-15, -10, -15] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {shelterType !== 'open' && (
            <>
              {/* Back Wall */}
              <motion.div
                className="absolute inset-x-0 top-10 bottom-0 rounded-t-lg"
                animate={{ backgroundColor: shelter.walls }}
                style={{ transform: 'translateZ(-35px)' }}
              />

              {/* Left Wall */}
              <motion.div
                className="absolute left-0 top-10 bottom-0 w-10 rounded-l-lg"
                animate={{ backgroundColor: shelter.walls }}
                style={{ 
                  transform: 'rotateY(-90deg) translateZ(0px)', 
                  transformOrigin: 'left',
                  opacity: 0.8
                }}
              />

              {/* Roof */}
              <motion.div
                className="absolute inset-x-0 top-0 h-14 rounded-t-xl shadow-lg"
                animate={{ backgroundColor: shelter.roof }}
                style={{ transform: 'rotateX(8deg)', transformOrigin: 'bottom' }}
              >
                {/* Roof texture lines */}
                {shelterType === 'tin' && (
                  <div className="absolute inset-0 flex justify-evenly opacity-30">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="w-px h-full bg-gray-600" />
                    ))}
                  </div>
                )}
              </motion.div>
            </>
          )}

          {/* Control Panel Inside */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-40 rounded-lg shadow-xl"
            style={{ backgroundColor: THEME.accent, border: `2px solid ${THEME.accentLight}` }}
            animate={{ opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* LEDs */}
            <div className="absolute top-3 right-3 flex gap-1.5">
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            </div>
            
            {/* Display Screen */}
            <div className="absolute top-8 inset-x-3 h-12 rounded flex flex-col items-center justify-center" style={{ backgroundColor: THEME.background }}>
              <Cpu size={18} color={THEME.accent} />
              <span className="text-xs font-bold font-mono mt-1" style={{ color: THEME.accent }}>READY</span>
            </div>

            {/* Buttons */}
            <div className="absolute bottom-4 inset-x-3 flex gap-2 justify-center">
              <div className="w-4 h-4 rounded-full bg-gray-600" />
              <div className="w-4 h-4 rounded-full bg-gray-600" />
              <div className="w-4 h-4 rounded-full bg-red-500" />
            </div>
          </motion.div>

          {/* Ground/Floor */}
          <div 
            className="absolute bottom-0 inset-x-0 h-3 rounded-b-lg"
            style={{ backgroundColor: '#8B7355' }}
          />
        </motion.div>
      </div>

      {/* Signal Strength Card */}
      <motion.div
        className="absolute top-8 right-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <SignalIcon size={24} color={signal.bars > 0 ? THEME.accent : '#EF4444'} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>SIGNAL</p>
            <p className="text-sm font-bold" style={{ color: THEME.text }}>{signal.label}</p>
          </div>
        </div>
        
        {/* Signal Bars */}
        <div className="flex items-end gap-1 mt-3 h-6">
          {[1, 2, 3, 4].map((bar) => (
            <motion.div
              key={bar}
              className="w-3 rounded-sm"
              style={{ 
                height: `${bar * 5 + 4}px`,
                backgroundColor: bar <= signal.bars ? THEME.accent : 'rgba(104, 159, 56, 0.2)'
              }}
              animate={bar <= signal.bars ? { opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: bar * 0.15 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Shelter Type Card */}
      <motion.div
        className="absolute bottom-8 left-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <House size={24} color={THEME.accent} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>SHELTER TYPE</p>
            <p className="text-sm font-bold" style={{ color: THEME.text }}>{shelter.label}</p>
          </div>
        </div>
      </motion.div>

      {/* IP Rating */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-2 backdrop-blur-sm rounded-full"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <Shield size={16} color={THEME.accent} />
          <span className="text-xs font-bold" style={{ color: THEME.text }}>{ipRatingRequirement}</span>
        </div>
      </motion.div>

      {/* Heat Risk Indicator */}
      {hasHighHeat && (
        <motion.div
          className="absolute top-32 left-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '2px solid rgba(239, 68, 68, 0.3)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <Flame size={20} color="#EF4444" />
            <div>
              <p className="text-xs font-semibold text-red-600">HIGH HEAT</p>
              <p className="text-xs text-red-500">Fan Required</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Wall Space */}
      {wallSpaceAvailable === 'slimline' && (
        <motion.div
          className="absolute top-56 left-8 px-3 py-2 backdrop-blur-sm rounded-lg"
          style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '2px solid rgba(245, 158, 11, 0.3)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <TriangleAlert size={16} color="#F59E0B" />
            <span className="text-xs font-bold text-yellow-700">SLIMLINE ONLY</span>
          </div>
        </motion.div>
      )}

      {/* Theft Protection */}
      {needsTheftProtection && (
        <motion.div
          className="absolute bottom-32 left-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ 
            backgroundColor: antiTheftHardwareNeed ? THEME.cardBg : 'rgba(239, 68, 68, 0.1)',
            border: `2px solid ${antiTheftHardwareNeed ? THEME.cardBorder : 'rgba(239, 68, 68, 0.3)'}` 
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <Lock size={18} color={antiTheftHardwareNeed ? THEME.accent : '#EF4444'} />
            <div>
              <p className="text-xs font-semibold" style={{ color: antiTheftHardwareNeed ? THEME.accent : '#EF4444' }}>THEFT RISK</p>
              {antiTheftHardwareNeed && (
                <p className="text-xs" style={{ color: THEME.text }}>Protected</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Safety Issues Warning */}
      {hasSafetyIssues && (
        <motion.div
          className="absolute top-32 right-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '2px solid rgba(239, 68, 68, 0.3)' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <TriangleAlert size={20} color="#EF4444" />
            <div>
              <p className="text-xs font-semibold text-red-600">SAFETY ALERT</p>
              <div className="flex gap-1 mt-1">
                {lightningArrestor === 'absent' && <span className="text-xs px-1 bg-red-100 rounded">No LA</span>}
                {earthingPit === 'absent' && <span className="text-xs px-1 bg-red-100 rounded">No Earth</span>}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Safety Features (when present) */}
      {!hasSafetyIssues && (
        <motion.div
          className="absolute top-32 right-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <CircleCheck size={20} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>SAFETY OK</p>
              <div className="flex gap-1 mt-1">
                <span className="text-xs px-1 bg-green-100 text-green-700 rounded">LA</span>
                <span className="text-xs px-1 bg-green-100 text-green-700 rounded">Earth</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Installation Type */}
      <motion.div
        className="absolute bottom-32 right-8 p-3 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center gap-2">
          <Wrench size={18} color={THEME.accent} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>INSTALLATION</p>
            <p className="text-xs capitalize" style={{ color: THEME.text }}>{installationPreference}</p>
          </div>
        </div>
      </motion.div>

      {/* Lifting & Accessibility */}
      <motion.div
        className="absolute bottom-56 right-8 p-3 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-2">
          <Truck size={18} color={THEME.accent} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>ACCESS</p>
            <div className="flex gap-1 mt-1">
              <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded capitalize">
                {siteAccessibility === 'truck' ? 'Truck' : 'Manual'}
              </span>
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded capitalize">
                {liftingGearAvailability === 'chain-pulley' ? 'Pulley' : 'Manual'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

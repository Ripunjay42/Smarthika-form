import { motion } from 'framer-motion';
import { Tractor, Drone, Fan, Check, Lightbulb, Target, CalendarBlank, TrendUp } from '@phosphor-icons/react';

const THEME = {
  accent: '#689F38',
  accentLight: 'rgba(104, 159, 56, 0.3)',
  text: '#33691E',
  textLight: '#558B2F',
  background: '#EDEDE7',
  cardBg: 'rgba(104, 159, 56, 0.1)',
  cardBorder: 'rgba(104, 159, 56, 0.3)',
};

const EQUIPMENT_DATA = [
  { id: 'tractor', name: 'Tractor', key: 'tractorOwnership', icon: Tractor, opportunity: 'PTO Pump' },
  { id: 'drone', name: 'Drone', key: 'droneOwnership', icon: Drone, opportunity: 'Tech Savvy' },
  { id: 'sprayer', name: 'Sprayer', key: 'sprayerOwnership', icon: Fan, opportunity: 'Automation' },
  { id: 'ev', name: 'EV Status', key: 'evStatus', icon: Lightbulb, opportunity: 'Solar+EV' },
];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function EquipmentAnimation({ 
  tractorOwnership = false,
  droneOwnership = false,
  sprayerOwnership = false,
  evStatus = false,
  harvestMonths = []
}) {
  const equipmentMap = {
    tractorOwnership,
    droneOwnership,
    sprayerOwnership,
    evStatus
  };
  
  const selectedCount = Object.values(equipmentMap).filter(Boolean).length;
  const maxEquipment = EQUIPMENT_DATA.length;
  const fillPercentage = (selectedCount / maxEquipment) * 100;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Equipment Grid */}
      <div className="grid grid-cols-2 gap-6">
        {EQUIPMENT_DATA.map((equipment, index) => {
          const Icon = equipment.icon;
          const isSelected = equipmentMap[equipment.key];
          
          return (
            <motion.div
              key={equipment.id}
              className="relative w-32 h-32 rounded-2xl flex flex-col items-center justify-center overflow-hidden"
              style={{ 
                backgroundColor: isSelected ? THEME.cardBg : 'rgba(0,0,0,0.03)',
                border: `3px solid ${isSelected ? THEME.accent : 'rgba(0,0,0,0.1)'}`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: isSelected ? [0, -5, 0] : 0
              }}
              transition={{ 
                delay: index * 0.1,
                y: { duration: 2, repeat: Infinity, repeatDelay: 1 }
              }}
            >
              {/* Glow Effect for Selected */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0"
                  style={{ 
                    background: `radial-gradient(circle at center, ${THEME.accentLight} 0%, transparent 70%)` 
                  }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              
              {/* Icon */}
              <motion.div
                animate={isSelected ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Icon 
                  size={36} 
                  weight={isSelected ? 'fill' : 'regular'} 
                  color={isSelected ? THEME.accent : '#9CA3AF'} 
                />
              </motion.div>
              
              {/* Equipment Name */}
              <span 
                className="text-xs font-medium mt-2"
                style={{ color: isSelected ? THEME.text : '#6B7280' }}
              >
                {equipment.name}
              </span>

              {/* Check Mark for Selected */}
              {isSelected && (
                <motion.div
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: THEME.accent }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  <Check size={12} weight="bold" color="white" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress Header */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 px-6 py-3 backdrop-blur-sm rounded-full flex items-center gap-4"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Target size={20} weight="duotone" color={THEME.accent} />
        <p className="text-sm font-semibold" style={{ color: THEME.text }}>
          Equipment: {selectedCount}/{maxEquipment}
        </p>
        
        {/* Mini Progress Bar */}
        <div className="w-20 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
          <motion.div 
            className="h-full rounded-full"
            style={{ backgroundColor: THEME.accent }}
            initial={{ width: 0 }}
            animate={{ width: `${fillPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Harvest Calendar */}
      {harvestMonths.length > 0 && (
        <motion.div
          className="absolute bottom-8 left-8 right-8 p-4 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <CalendarBlank size={18} weight="duotone" color={THEME.accent} />
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>HARVEST MONTHS</p>
          </div>
          <div className="flex gap-1">
            {MONTH_NAMES.map((month, index) => {
              const isHarvest = harvestMonths.includes(index);
              return (
                <motion.div
                  key={month}
                  className="flex-1 rounded"
                  style={{ 
                    backgroundColor: isHarvest ? THEME.accent : 'rgba(0,0,0,0.1)',
                    height: isHarvest ? '24px' : '12px'
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: isHarvest ? 24 : 12 }}
                  transition={{ delay: index * 0.03 }}
                  title={month}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs" style={{ color: THEME.textLight }}>
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </motion.div>
      )}

      {/* Cross-Sell Opportunities */}
      {selectedCount > 0 && (
        <motion.div
          className="absolute top-32 left-8 p-3 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: 'rgba(147, 51, 234, 0.1)', border: '2px solid rgba(147, 51, 234, 0.3)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendUp size={16} weight="duotone" color="#9333EA" />
            <p className="text-xs font-semibold text-purple-700">OPPORTUNITIES</p>
          </div>
          <div className="space-y-1">
            {EQUIPMENT_DATA.filter(e => equipmentMap[e.key]).map((item) => (
              <div key={item.key} className="text-xs text-purple-600">
                • {item.opportunity}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State Message */}
      {selectedCount === 0 && (
        <motion.div
          className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Lightbulb size={24} weight="duotone" color={THEME.accent} className="mx-auto mb-2" />
          <p className="text-sm" style={{ color: THEME.textLight }}>
            Select equipment from the form
          </p>
        </motion.div>
      )}
    </div>
  );
}

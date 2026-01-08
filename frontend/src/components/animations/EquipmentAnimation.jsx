import { motion } from 'framer-motion';
import { Tractor, Drone, Fan, Check, Lightbulb, Target, Wrench, Barricade } from '@phosphor-icons/react';

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
  { id: 'tractor', name: 'Tractor', icon: Tractor },
  { id: 'drone', name: 'Drone', icon: Drone },
  { id: 'sprayer', name: 'Sprayer', icon: Fan },
  { id: 'harvester', name: 'Harvester', icon: Barricade },
  { id: 'tools', name: 'Tools', icon: Wrench },
  { id: 'lights', name: 'Lights', icon: Lightbulb },
];

export default function EquipmentAnimation({ 
  selectedEquipment = [],
  equipmentCondition = {},
  equipmentNotes = {}
}) {
  const selectedCount = selectedEquipment.length;
  const maxEquipment = EQUIPMENT_DATA.length;
  const fillPercentage = (selectedCount / maxEquipment) * 100;

  const getConditionColor = (condition) => {
    switch(condition) {
      case 'good': return '#22C55E';
      case 'fair': return '#F59E0B';
      case 'poor': return '#EF4444';
      default: return THEME.accent;
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Equipment Grid */}
      <div className="grid grid-cols-3 gap-5">
        {EQUIPMENT_DATA.map((equipment, index) => {
          const Icon = equipment.icon;
          const isSelected = selectedEquipment.includes(equipment.id);
          const condition = equipmentCondition[equipment.id] || 'good';
          
          return (
            <motion.div
              key={equipment.id}
              className="relative w-24 h-24 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden"
              style={{ 
                backgroundColor: isSelected ? THEME.cardBg : 'rgba(0,0,0,0.03)',
                border: `2px solid ${isSelected ? getConditionColor(condition) : 'rgba(0,0,0,0.1)'}`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: isSelected ? [0, -4, 0] : 0
              }}
              transition={{ 
                delay: index * 0.08,
                y: { duration: 2, repeat: Infinity, repeatDelay: 1 }
              }}
              whileHover={{ scale: 1.05 }}
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
                  style={{ backgroundColor: getConditionColor(condition) }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  <Check size={12} weight="bold" color="white" />
                </motion.div>
              )}

              {/* Condition Indicator */}
              {isSelected && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: getConditionColor(condition) }}
                />
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

      {/* Legend */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 backdrop-blur-sm rounded-xl flex gap-5"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: 'Good', color: '#22C55E' },
          { label: 'Fair', color: '#F59E0B' },
          { label: 'Poor', color: '#EF4444' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs font-medium" style={{ color: THEME.textLight }}>{item.label}</span>
          </div>
        ))}
      </motion.div>

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

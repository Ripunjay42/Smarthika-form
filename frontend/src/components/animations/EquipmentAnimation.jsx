import { motion } from 'framer-motion';
import { Calendar, Check, Lightbulb } from 'lucide-react';
import { EQUIPMENT_LIST } from '../../constants/formConstants';
import { ICON_STROKE_WIDTH } from '../../constants/iconTheme';

// Icon mapping for equipment
const ICON_MAP = {
  'Tractor': () => import('lucide-react').then(m => m.Tractor),
  'RotateCw': () => import('lucide-react').then(m => m.RotateCw),
  'Truck': () => import('lucide-react').then(m => m.Truck),
  'Wind': () => import('lucide-react').then(m => m.Wind),
  'CloudRain': () => import('lucide-react').then(m => m.CloudRain),
  'Zap': () => import('lucide-react').then(m => m.Zap),
  'Sun': () => import('lucide-react').then(m => m.Sun),
  'Scissors': () => import('lucide-react').then(m => m.Scissors),
  'Droplet': () => import('lucide-react').then(m => m.Droplet),
  'Shovel': () => import('lucide-react').then(m => m.Shovel),
  'Combine': () => import('lucide-react').then(m => m.Combine),
};

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

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function EquipmentAnimation({ 
  equipment = [],
  harvestMonths = []
}) {
  // Group equipment by category
  const equipmentByCategory = EQUIPMENT_LIST.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const selectedCount = equipment?.length || 0;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden p-4 sm:p-8" style={{ backgroundColor: THEME.background }}>
      {/* Header Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: THEME.text }}>
          Your Equipment
        </h3>
        {selectedCount > 0 && (
          <p className="text-sm" style={{ color: THEME.textLight }}>
            {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
          </p>
        )}
      </motion.div>

      {/* Equipment Display - Organized by Category */}
      <div className="w-full max-w-4xl flex-1 overflow-y-auto">
        {selectedCount > 0 ? (
          <div className="space-y-6">
            {Object.entries(equipmentByCategory).map(([category, items], categoryIndex) => {
              const selectedInCategory = items.filter(item => equipment.includes(item.value));
              if (selectedInCategory.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  {/* Category Header */}
                  <div className="mb-3">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: THEME.accent }}>
                      {category}
                    </p>
                    <div className="w-6 h-0.5 rounded-full mt-1" style={{ backgroundColor: THEME.accent }} />
                  </div>

                  {/* Selected Items in this Category */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {selectedInCategory.map((item, itemIndex) => (
                      <motion.div
                        key={item.value}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: itemIndex * 0.05 }}
                        className="p-3 rounded-lg border-2"
                        style={{
                          backgroundColor: THEME.cardBg,
                          borderColor: THEME.accent,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: 'rgba(104, 159, 56, 0.2)' }}
                          >
                            <Check size={16} color={THEME.accent} strokeWidth={3} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold" style={{ color: THEME.text }}>
                              {item.label}
                            </p>
                            <p className="text-[10px]" style={{ color: THEME.textLight }}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            className="flex flex-col items-center justify-center h-32 sm:h-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Lightbulb size={32} color={THEME.accent} className="mb-3 opacity-50" />
          </motion.div>
        )}
      </div>

      {/* Harvest Calendar - Fixed at Bottom */}
      {harvestMonths.length > 0 && (
        <motion.div
          className="w-full max-w-3xl mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl backdrop-blur-sm"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} color={THEME.accent} strokeWidth={ICON_STROKE_WIDTH} />
            <p className="text-xs font-bold" style={{ color: THEME.accent }}>
              HARVEST MONTHS
            </p>
          </div>
          <div className="flex gap-1 h-8 items-end">
            {MONTH_NAMES.map((month, index) => {
              const isHarvest = harvestMonths.includes(index);
              return (
                <motion.div
                  key={month}
                  className="flex-1 rounded-t"
                  style={{ backgroundColor: isHarvest ? THEME.accent : 'rgba(0,0,0,0.1)' }}
                  initial={{ height: 0 }}
                  animate={{ height: isHarvest ? '100%' : '30%' }}
                  transition={{ delay: index * 0.03 }}
                  title={month}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs" style={{ color: THEME.textLight }}>
            <span>Jan</span>
            <span>Jul</span>
            <span>Dec</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

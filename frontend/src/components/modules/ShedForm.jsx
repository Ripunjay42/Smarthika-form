import { motion } from 'framer-motion';
import { 
  Warehouse, Check, Calendar, AlertCircle,
  Tractor, RotateCw, Truck, Wind, CloudRain, 
  Zap, Sun, Scissors, Droplet, Shovel, Combine
} from 'lucide-react';
import { useFormContext } from '../../context/FormContext';
import { EQUIPMENT_LIST, MONTHS } from '../../constants/formConstants';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

// Icon mapping for equipment
const ICON_MAP = {
  'Tractor': Tractor,
  'RotateCw': RotateCw,
  'Truck': Truck,
  'Wind': Wind,
  'CloudRain': CloudRain,
  'Zap': Zap,
  'Sun': Sun,
  'Scissors': Scissors,
  'Droplet': Droplet,
  'Shovel': Shovel,
  'Combine': Combine,
};

export default function ShedForm() {
  const { formData, updateModuleData } = useFormContext();
  const data = formData.shed;

  const handleEquipmentToggle = (equipmentValue) => {
    const currentEquipment = data.equipment || [];
    const newEquipment = currentEquipment.includes(equipmentValue)
      ? currentEquipment.filter(e => e !== equipmentValue)
      : [...currentEquipment, equipmentValue];
    updateModuleData('shed', { equipment: newEquipment });
  };

  // Group equipment by category
  const equipmentByCategory = EQUIPMENT_LIST.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const selectedCount = (data.equipment || []).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: 'var(--color-accent)' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-dark)' }}>THE SHED</h2>
        <p className="text-gray-500">Farm equipment inventory - Select all machinery you own or have access to.</p>
      </div>

      {/* Equipment Grid by Category */}
      <div className="space-y-8">
        {Object.entries(equipmentByCategory).map(([ category, items ], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            {/* Category Header */}
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-dark)' }}>
                {category}
              </h3>
              <div className="w-8 h-1 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
            </div>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((item, itemIndex) => {
                const isSelected = (data.equipment || []).includes(item.value);
                const IconComponent = ICON_MAP[item.icon] || Warehouse;
                
                return (
                  <motion.button
                    key={item.value}
                    type="button"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: itemIndex * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEquipmentToggle(item.value)}
                    className="p-4 rounded-xl border-2 transition-all duration-200 text-left"
                    style={isSelected
                      ? { 
                          backgroundColor: 'rgba(104, 159, 56, 0.1)', 
                          borderColor: 'var(--color-accent)',
                          boxShadow: '0 4px 12px rgba(104, 159, 56, 0.15)'
                        }
                      : { 
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E5E5E5'
                        }
                    }
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon Container */}
                      <motion.div
                        className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                        style={isSelected 
                          ? { backgroundColor: 'rgba(104, 159, 56, 0.2)' } 
                          : { backgroundColor: '#F3F4F6' }
                        }
                        animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        <IconComponent 
                          size={24} 
                          strokeWidth={ICON_STROKE_WIDTH}
                          color={isSelected ? 'var(--color-accent)' : '#9CA3AF'} 
                        />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-gray-800" style={{ color: isSelected ? 'var(--color-text-dark)' : '#1F2937' }}>
                              {item.label}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                          
                          {/* Checkmark */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: 'var(--color-accent)' }}
                            >
                              <Check size={14} strokeWidth={3} color="white" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Equipment Count Summary */}
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border-2"
          style={{ 
            backgroundColor: 'rgba(104, 159, 56, 0.05)',
            borderColor: 'var(--color-accent)'
          }}
        >
          <div className="flex items-center gap-3">
            <Warehouse size={20} color="var(--color-accent)" strokeWidth={ICON_STROKE_WIDTH} />
            <div>
              <p className="font-semibold text-gray-800">
                {selectedCount} equipment item{selectedCount !== 1 ? 's' : ''} selected
              </p>
              <p className="text-xs text-gray-600">
                This helps us recommend appropriate pump and power solutions
              </p>
            </div>
          </div>
        </motion.div>
      )}


    </motion.div>
  );
}

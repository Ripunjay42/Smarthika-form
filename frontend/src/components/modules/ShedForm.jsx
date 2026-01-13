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

  const toggleHarvestMonth = (monthIndex) => {
    const currentMonths = data.harvestMonths || [];
    const newMonths = currentMonths.includes(monthIndex)
      ? currentMonths.filter(m => m !== monthIndex)
      : [...currentMonths, monthIndex];
    updateModuleData('shed', { harvestMonths: newMonths });
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
        <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: '#689F38' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#33691E' }}>THE SHED</h2>
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
              <h3 className="text-lg font-bold mb-1" style={{ color: '#33691E' }}>
                {category}
              </h3>
              <div className="w-8 h-1 rounded-full" style={{ backgroundColor: '#689F38' }} />
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
                          borderColor: '#689F38',
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
                          color={isSelected ? '#689F38' : '#9CA3AF'} 
                        />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-gray-800" style={{ color: isSelected ? '#33691E' : '#1F2937' }}>
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
                              style={{ backgroundColor: '#689F38' }}
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
            borderColor: '#689F38'
          }}
        >
          <div className="flex items-center gap-3">
            <Warehouse size={20} color="#689F38" strokeWidth={ICON_STROKE_WIDTH} />
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

      {/* Harvest Months Calendar */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#689F38' }}>
          Harvest Months (Cash Flow Cycle)
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {MONTHS.map((month, index) => {
            const isSelected = (data.harvestMonths || []).includes(index);
            return (
              <motion.button
                key={month}
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => toggleHarvestMonth(index)}
                className="p-2 sm:p-3 rounded-lg text-center transition-all duration-200 border-2"
                style={isSelected
                  ? {
                      backgroundColor: '#689F38',
                      color: 'white',
                      borderColor: '#689F38',
                      boxShadow: '0 4px 12px rgba(104, 159, 56, 0.3)'
                    }
                  : {
                      backgroundColor: '#FFFFFF',
                      color: '#6B7280',
                      borderColor: '#E5E5E5'
                    }
                }
              >
                <span className="text-xs sm:text-sm font-semibold">{month.slice(0, 3)}</span>
              </motion.button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
          <Calendar size={14} />
          Select months when you typically receive harvest income
        </p>
      </div>

      {/* Cash Flow Visual */}
      {(data.harvestMonths || []).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border-2"
          style={{ 
            backgroundColor: 'rgba(104, 159, 56, 0.08)',
            borderColor: 'rgba(104, 159, 56, 0.3)'
          }}
        >
          <h4 className="text-sm font-bold mb-3" style={{ color: '#33691E' }}>
            Cash Flow Timeline
          </h4>
          <div className="flex gap-1 h-16 items-end">
            {MONTHS.map((month, index) => {
              const isHarvest = (data.harvestMonths || []).includes(index);
              return (
                <motion.div
                  key={month}
                  className="flex-1 rounded-t-lg transition-all"
                  style={{ backgroundColor: isHarvest ? '#689F38' : '#E5E7EB' }}
                  initial={{ height: 0 }}
                  animate={{ height: isHarvest ? '100%' : '30%' }}
                  transition={{ delay: index * 0.03 }}
                  title={`${month}: ${isHarvest ? 'Income month' : 'No harvest'}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 px-1">
            <span>January</span>
            <span>July</span>
            <span>December</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { Warehouse, Info, Tractor, Drone, Fan, Check, Lightbulb, Target } from 'lucide-react';
import { FormToggle } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { MONTHS } from '../../constants/formConstants';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

export default function ShedForm() {
  const { formData, updateModuleData } = useFormContext();
  const data = formData.shed;

  const handleChange = (e) => {
    const { name, checked } = e.target;
    updateModuleData('shed', { [name]: checked });
  };

  const toggleHarvestMonth = (monthIndex) => {
    const currentMonths = data.harvestMonths || [];
    const newMonths = currentMonths.includes(monthIndex)
      ? currentMonths.filter(m => m !== monthIndex)
      : [...currentMonths, monthIndex];
    updateModuleData('shed', { harvestMonths: newMonths });
  };

  const equipment = [
    { 
      key: 'tractorOwnership', 
      icon: Tractor, 
      label: 'Tractor',
      opportunity: 'PTO Pump Lead',
      description: 'Can use tractor-powered pumps as backup'
    },
    { 
      key: 'droneOwnership', 
      icon: Drone, 
      label: 'Drone',
      opportunity: 'Tech Savvy Lead',
      description: 'Open to smart farming solutions'
    },
    { 
      key: 'sprayerOwnership', 
      icon: Fan, 
      label: 'Sprayer',
      opportunity: 'Automation Lead',
      description: 'Interested in automation upgrades'
    },
  ];

  const ownedCount = equipment.filter(e => data[e.key]).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: '#689F38' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#33691E' }}>THE SHED</h2>
        <p className="text-gray-500">Equipment inventory for cross-selling opportunities.</p>
      </div>

      {/* Equipment Grid */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#689F38' }}>
          Equipment Inventory
        </label>
        <div className="grid grid-cols-1 gap-4">
          {equipment.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${data[item.key]
                  ? 'shadow-lg'
                  : 'bg-white hover:border-[#689F38]/30'
                }
              `}
              style={data[item.key]
                ? { backgroundColor: 'rgba(104, 159, 56, 0.1)', borderColor: '#689F38' }
                : { borderColor: '#E5E5E5' }
              }
              onClick={() => handleChange({ target: { name: item.key, checked: !data[item.key] } })}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={data[item.key] 
                    ? { backgroundColor: 'rgba(104, 159, 56, 0.2)' } 
                    : { backgroundColor: '#F3F4F6' }
                  }
                  animate={data[item.key] ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <item.icon 
                    size={28} 
                    strokeWidth={ICON_STROKE_WIDTH}
                    color={data[item.key] ? ICON_COLOR : '#9CA3AF'} 
                  />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-800">{item.label}</span>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={data[item.key] ? { backgroundColor: '#689F38', color: 'white' } : { backgroundColor: '#E5E5E5' }}
                    >
                      {data[item.key] && <Check size={14} strokeWidth={ICON_STROKE_WIDTH} color="white" />}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  {data[item.key] && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="inline-block mt-2 px-2 py-1 text-xs rounded-full"
                      style={{ backgroundColor: 'rgba(104, 159, 56, 0.15)', color: '#558B2F' }}
                    >
                      {item.opportunity}
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

            <Warehouse className="w-5 h-5" strokeWidth={ICON_STROKE_WIDTH} style={{ color: ICON_COLOR }} />
      <motion.div
        className="p-4 rounded-xl border"
        style={{ backgroundColor: 'rgba(104, 159, 56, 0.08)', borderColor: 'rgba(104, 159, 56, 0.2)' }}
        animate={{ scale: ownedCount > 0 ? [1, 1.01, 1] : 1 }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(104, 159, 56, 0.2)' }}>
              <Warehouse className="w-5 h-5" style={{ color: '#689F38' }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Equipment Score</p>
              <p className="text-xs text-gray-500">Based on inventory</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold" style={{ color: '#689F38' }}>{ownedCount}</span>
            <span className="text-gray-400">/{equipment.length}</span>
          </div>
        </div>
      </motion.div>

      {/* EV Status */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <FormToggle
          label="Electric Vehicle/Equipment Ownership"
          name="evStatus"
          checked={data.evStatus}
          onChange={handleChange}
        />
        {data.evStatus && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-blue-600 mt-2 flex items-center gap-2"
          >
            <Lightbulb size={14} strokeWidth={ICON_STROKE_WIDTH} color="#2563EB" />
            Consider EV charging point integration with solar pump
          </motion.p>
        )}
      </div>

      {/* Harvest Months Calendar */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#689F38' }}>
          Harvest Months (Cash Flow Cycle)
        </label>
        <div className="grid grid-cols-4 gap-2">
          {MONTHS.map((month, index) => {
            const isSelected = (data.harvestMonths || []).includes(index);
            return (
              <motion.button
                key={month}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleHarvestMonth(index)}
                className={`
                  p-3 rounded-xl text-center transition-all duration-200
                  ${isSelected
                    ? 'text-white shadow-lg'
                    : 'bg-white text-gray-600 border-2 border-gray-200'
                  }
                `}
                style={isSelected ? { backgroundColor: '#689F38' } : {}}
              >
                <span className="text-sm font-medium">{month.slice(0, 3)}</span>
              </motion.button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Select months when you typically receive harvest income
        </p>
      </div>

      {/* Cash Flow Visual */}
      {(data.harvestMonths || []).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-yellow-50 to-green-50 rounded-xl border border-yellow-200"
        >
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Cash Flow Preview</h4>
          <div className="flex gap-1">
            {MONTHS.map((month, index) => {
              const isHarvest = (data.harvestMonths || []).includes(index);
              return (
                <motion.div
                  key={month}
                  className={`flex-1 h-8 rounded ${isHarvest ? '' : 'bg-gray-200'}`}
                  style={isHarvest ? { backgroundColor: '#689F38' } : {}}
                  initial={{ height: 0 }}
                  animate={{ height: isHarvest ? 32 : 16 }}
                  transition={{ delay: index * 0.05 }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </motion.div>
      )}

      {/* Cross-Sell Opportunities */}
      {ownedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-purple-50 rounded-xl border border-purple-200"
        >
          <h4 className="text-sm font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Target size={16} strokeWidth={ICON_STROKE_WIDTH} className="text-purple-700" />
            Opportunity Signals
          </h4>
          <div className="space-y-2">
            {equipment.filter(e => data[e.key]).map((item) => {
              const ItemIcon = item.icon;
              return (
                <div key={item.key} className="flex items-center gap-2 text-sm text-purple-700">
                  <ItemIcon size={18} strokeWidth={ICON_STROKE_WIDTH} color="#7C3AED" />
                  <span>{item.opportunity}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 rounded-xl border"
        style={{ backgroundColor: 'rgba(104, 159, 56, 0.1)', borderColor: 'rgba(104, 159, 56, 0.2)' }}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(104, 159, 56, 0.2)' }}>
            <Info className="w-5 h-5" strokeWidth={ICON_STROKE_WIDTH} style={{ color: ICON_COLOR }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: '#33691E' }}>Business Intelligence</h4>
            <p className="text-xs mt-1" style={{ color: '#558B2F' }}>
              Equipment ownership indicates tech-readiness and potential for 
              additional product recommendations. Harvest months help plan 
              payment schedules.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

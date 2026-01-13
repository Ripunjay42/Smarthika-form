import { motion } from 'framer-motion';
import { Info, TriangleAlert, Sprout, RefreshCcw, Sparkles } from 'lucide-react';
import { FormCheckboxGroup, FormSlider, FormToggle, FormButtonGroup } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';
import { OLD_PUMP_TYPES, PIPE_CONDITIONS } from '../../constants/formConstants';

export default function BaselineForm() {
  const { formData, updateModuleData } = useFormContext();
  const data = formData.baseline;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'oldPumpTypes') {
      // FormCheckboxGroup passes array of values
      const selectedTypes = Array.isArray(value) ? value : [];
      const currentTypes = data.oldPumpTypes || [];
      
      // Build pumpDetails for selected types
      const pumpDetails = {};
      
      // Keep existing pump details for types that are still selected
      selectedTypes.forEach(pumpType => {
        if (currentTypes.includes(pumpType) && data.pumpDetails?.[pumpType]) {
          // Preserve existing data
          pumpDetails[pumpType] = data.pumpDetails[pumpType];
        } else {
          // Initialize new pump type
          pumpDetails[pumpType] = { age: 0, repairs: 0, burnouts: 0 };
        }
      });
      
      updateModuleData('baseline', { 
        oldPumpTypes: selectedTypes,
        pumpDetails: pumpDetails
      });
    } else if (type === 'checkbox') {
      updateModuleData('baseline', { 
        [name]: checked 
      });
    } else {
      updateModuleData('baseline', { 
        [name]: value 
      });
    }
    
    // Clear retrofit-specific fields when switching to greenfield
    if (name === 'projectType' && value === 'greenfield') {
      updateModuleData('baseline', { 
        oldPumpTypes: [],
        pumpDetails: {},
        pipeReuseStatus: 'new'
      });
    }
  };

  const handlePumpDetailChange = (pumpType, field, value) => {
    const pumpDetails = data.pumpDetails ? { ...data.pumpDetails } : {};
    if (!pumpDetails[pumpType]) {
      pumpDetails[pumpType] = { age: 0, repairs: 0, burnouts: 0 };
    }
    pumpDetails[pumpType][field] = parseFloat(value) || 0;
    updateModuleData('baseline', { pumpDetails });
  };

  const isRetrofit = data.projectType === 'retrofit';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: '#689F38' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#33691E' }}>THE BASELINE</h2>
        <p className="text-gray-500">Retrofit check for efficiency benchmarking.</p>
      </div>

      {/* Project Type Toggle */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#689F38' }}>
          Project Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleChange({ target: { name: 'projectType', value: 'greenfield' } })}
            className={`
              p-6 rounded-xl text-center transition-all duration-200
              ${!isRetrofit
                ? 'text-white shadow-lg'
                : 'bg-white/80 text-gray-600 border-2'
              }
            `}
            style={!isRetrofit
              ? { backgroundColor: '#689F38' }
              : { borderColor: 'rgba(104, 159, 56, 0.2)' }
            }
          >
            <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: !isRetrofit ? 'rgba(255,255,255,0.2)' : 'rgba(104, 159, 56, 0.1)' }}>
              <Sprout size={28} strokeWidth={ICON_STROKE_WIDTH} color={!isRetrofit ? 'white' : ICON_COLOR} />
            </div>
            <span className="text-lg font-bold block">New Installation</span>
            <span className={`text-sm ${!isRetrofit ? 'text-white/80' : 'text-gray-500'}`}>
              Fresh start with new equipment
            </span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleChange({ target: { name: 'projectType', value: 'retrofit' } })}
            className={`
              p-6 rounded-xl text-center transition-all duration-200
              ${isRetrofit
                ? 'text-white shadow-lg'
                : 'bg-white/80 text-gray-600 border-2'
              }
            `}
            style={isRetrofit
              ? { backgroundColor: '#689F38' }
              : { borderColor: 'rgba(104, 159, 56, 0.2)' }
            }
          >
            <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: isRetrofit ? 'rgba(255,255,255,0.2)' : 'rgba(104, 159, 56, 0.1)' }}>
              <RefreshCcw size={28} strokeWidth={ICON_STROKE_WIDTH} color={isRetrofit ? 'white' : ICON_COLOR} />
            </div>
            <span className="text-lg font-bold block">Replacement</span>
            <span className={`text-sm ${isRetrofit ? 'text-white/80' : 'text-gray-500'}`}>
              Upgrading existing system
            </span>
          </motion.button>
        </div>
      </div>

      {/* Retrofit Details */}
      {isRetrofit && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-6"
        >
          {/* Old Pump Info */}
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 space-y-4">
            <div className="flex items-center gap-2 text-orange-700">
              <RefreshCcw size={20} strokeWidth={ICON_STROKE_WIDTH} />
              <span className="font-medium">Current System Details</span>
            </div>

            {/* Multi-Select Pump Types */}
            <FormCheckboxGroup
              label="Old Pump Type (Select all that apply)"
              name="oldPumpTypes"
              value={data.oldPumpTypes}
              onChange={handleChange}
              options={OLD_PUMP_TYPES}
            />

            {/* Pump Details for each selected pump */}
            {data.oldPumpTypes && data.oldPumpTypes.length > 0 && (
              <div className="space-y-6 mt-6 pt-6 border-t border-orange-300">
                {data.oldPumpTypes.map((pumpType) => {
                  const pumpDetail = data.pumpDetails?.[pumpType] || { age: 0, repairs: 0, burnouts: 0 };
                  const pumpLabel = OLD_PUMP_TYPES.find(p => p.value === pumpType)?.label || pumpType;
                  
                  return (
                    <motion.div
                      key={pumpType}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-orange-100/50 rounded-lg border border-orange-200 space-y-4"
                    >
                      <h4 className="font-semibold text-orange-900">{pumpLabel}</h4>
                      
                      <div className="space-y-4">
                        {/* Pump Age */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#689F38' }}>
                            Pump Age
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="20"
                              step="1"
                              value={pumpDetail.age || 0}
                              onChange={(e) => handlePumpDetailChange(pumpType, 'age', e.target.value)}
                              className="flex-1 h-2 rounded-lg"
                              style={{ backgroundColor: '#E8F5E9' }}
                            />
                            <span className="font-medium text-lg w-20 text-center" style={{ color: '#33691E' }}>
                              {pumpDetail.age || 0} yrs
                            </span>
                          </div>
                        </div>

                        {/* Starter Coil/Capacitor Repairs */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#689F38' }}>
                            Starter Coil/Capacitor Repairs (Last Year)
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="20"
                              step="1"
                              value={pumpDetail.repairs || 0}
                              onChange={(e) => handlePumpDetailChange(pumpType, 'repairs', e.target.value)}
                              className="flex-1 h-2 rounded-lg"
                              style={{ backgroundColor: '#E8F5E9' }}
                            />
                            <span className="font-medium text-lg w-20 text-center" style={{ color: '#33691E' }}>
                              {pumpDetail.repairs || 0}x
                            </span>
                          </div>
                        </div>

                        {/* Motor Burnouts */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#689F38' }}>
                            Motor Burnouts (Rewinding)
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="20"
                              step="1"
                              value={pumpDetail.burnouts || 0}
                              onChange={(e) => handlePumpDetailChange(pumpType, 'burnouts', e.target.value)}
                              className="flex-1 h-2 rounded-lg"
                              style={{ backgroundColor: '#E8F5E9' }}
                            />
                            <span className="font-medium text-lg w-20 text-center" style={{ color: '#33691E' }}>
                              {pumpDetail.burnouts || 0}x
                            </span>
                          </div>
                        </div>

                        {/* Warn if issues detected for this pump */}
                        {(pumpDetail.repairs >= 3 || pumpDetail.burnouts >= 3) && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-3 bg-red-100 rounded-lg flex items-center gap-2"
                          >
                            <TriangleAlert className="text-red-600" size={20} strokeWidth={ICON_STROKE_WIDTH} />
                            <span className="text-sm text-red-700">
                              {pumpDetail.repairs >= 3 && pumpDetail.burnouts >= 3 
                                ? 'High failure frequency in both controller and motor - upgrade recommended'
                                : pumpDetail.repairs >= 3
                                ? 'High controller failure - reliability issues detected'
                                : 'High motor burnout frequency - consider upgrading'}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pipe Reuse Toggle */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#689F38' }}>
                Piping Approach
              </label>
              <div className="grid grid-cols-2 gap-3">
                {PIPE_CONDITIONS.map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChange({ target: { name: 'pipeReuseStatus', value: option.value } })}
                    className={`
                      p-4 rounded-lg text-center transition-all duration-200 font-medium text-sm
                      ${data.pipeReuseStatus === option.value
                        ? 'text-white shadow-lg'
                        : 'bg-white/80 text-gray-600 border-2'
                      }
                    `}
                    style={data.pipeReuseStatus === option.value
                      ? { backgroundColor: '#689F38' }
                      : { borderColor: 'rgba(104, 159, 56, 0.2)' }
                    }
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Greenfield Message */}
      {!isRetrofit && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-xl border text-center"
          style={{ backgroundColor: 'rgba(104, 159, 56, 0.1)', borderColor: 'rgba(104, 159, 56, 0.2)' }}
        >
          <Sparkles className="mx-auto mb-4" size={48} strokeWidth={ICON_STROKE_WIDTH} style={{ color: ICON_COLOR }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: '#33691E' }}>Fresh Start</h3>
          <p className="text-sm" style={{ color: '#558B2F' }}>
            New installation means optimal efficiency from day one. 
            No legacy constraints to work around.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

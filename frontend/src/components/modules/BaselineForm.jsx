import { motion } from 'framer-motion';
import { ArrowsClockwise, Info, WarningCircle, Plant, ArrowsCounterClockwise } from '@phosphor-icons/react';
import { FormButtonGroup, FormSlider, FormToggle } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';

export default function BaselineForm() {
  const { formData, updateModuleData } = useFormContext();
  const data = formData.baseline;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateModuleData('baseline', { 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    updateModuleData('baseline', { [name]: parseFloat(value) });
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
              <Plant size={28} weight="duotone" color={!isRetrofit ? 'white' : '#689F38'} />
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
              <ArrowsCounterClockwise size={28} weight="duotone" color={isRetrofit ? 'white' : '#689F38'} />
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
              <ArrowsCounterClockwise size={20} />
              <span className="font-medium">Current System Details</span>
            </div>

            <FormButtonGroup
              label="Old Pump Type"
              name="oldPumpType"
              value={data.oldPumpType}
              onChange={handleChange}
              options={[
                { value: 'monoblock', label: 'Monoblock' },
                { value: 'submersible', label: 'Submersible' },
                { value: 'centrifugal', label: 'Centrifugal' },
              ]}
            />

            <FormSlider
              label="Old Pump Age"
              name="oldPumpAge"
              value={data.oldPumpAge}
              onChange={handleSliderChange}
              min={0}
              max={20}
              step={1}
              unit=" years"
            />

            <FormSlider
              label="Burnout Frequency (Last 5 years)"
              name="burnoutFrequency"
              value={data.burnoutFrequency}
              onChange={handleSliderChange}
              min={0}
              max={10}
              step={1}
              unit=" times"
            />

            {/* Pain Point Indicator */}
            {data.burnoutFrequency >= 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-100 rounded-lg flex items-center gap-2"
              >
                <WarningCircle className="text-red-600" size={20} />
                <span className="text-sm text-red-700">
                  High burnout frequency indicates reliability issues
                </span>
              </motion.div>
            )}
          </div>

          {/* Efficiency Comparison */}
          <div className="p-4 rounded-xl border" style={{ backgroundColor: 'rgba(104, 159, 56, 0.08)', borderColor: 'rgba(104, 159, 56, 0.2)' }}>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Efficiency Gap Analysis</h4>
            
            <FormSlider
              label="Estimated Efficiency Gap"
              name="efficiencyGap"
              value={data.efficiencyGap}
              onChange={handleSliderChange}
              min={0}
              max={50}
              step={1}
              unit="% savings potential"
            />

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-500">Old System</p>
                <p className="text-lg font-bold text-orange-600">
                  {100 - data.efficiencyGap}% eff.
                </p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-500">New System</p>
                <p className="text-lg font-bold" style={{ color: '#689F38' }}>
                  ~95% eff.
                </p>
              </div>
            </div>
          </div>

          {/* Pipe Reuse */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
            <FormToggle
              label="Reusing Old Pipes"
              name="pipeReuseStatus"
              checked={data.pipeReuseStatus}
              onChange={handleChange}
            />

            {data.pipeReuseStatus && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-orange-600 bg-orange-50 p-2 rounded"
              >
                ⚠️ Old pipes may add friction penalty to head calculations
              </motion.p>
            )}

            <FormButtonGroup
              label="Foot Valve Condition"
              name="footValveCondition"
              value={data.footValveCondition}
              onChange={handleChange}
              options={[
                { value: 'good', label: 'Good' },
                { value: 'leaking', label: 'Leaking' },
                { value: 'replace', label: 'Needs Replacement' },
              ]}
            />
          </div>

          {/* Retrofit Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border"
            style={{ backgroundColor: 'rgba(104, 159, 56, 0.15)', borderColor: 'rgba(104, 159, 56, 0.25)' }}
          >
            <h4 className="text-sm font-semibold mb-3" style={{ color: '#33691E' }}>Retrofit Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#558B2F' }}>Current Age</span>
                <span className="font-medium" style={{ color: '#33691E' }}>{data.oldPumpAge} years</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#558B2F' }}>Burnout Issues</span>
                <span className={`font-medium ${data.burnoutFrequency >= 3 ? 'text-red-600' : ''}`} style={data.burnoutFrequency < 3 ? { color: '#33691E' } : {}}>
                  {data.burnoutFrequency >= 3 ? 'Frequent' : 'Normal'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#558B2F' }}>Potential Savings</span>
                <span className="font-medium" style={{ color: '#33691E' }}>{data.efficiencyGap}% power</span>
              </div>
            </div>
          </motion.div>
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
          <span className="text-6xl block mb-4">✨</span>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#33691E' }}>Fresh Start</h3>
          <p className="text-sm" style={{ color: '#558B2F' }}>
            New installation means optimal efficiency from day one. 
            No legacy constraints to work around.
          </p>
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
            <Info className="w-5 h-5" style={{ color: '#689F38' }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: '#33691E' }}>Why This Matters</h4>
            <p className="text-xs mt-1" style={{ color: '#558B2F' }}>
              Retrofit projects require understanding current system limitations 
              to calculate accurate ROI and energy savings projections.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

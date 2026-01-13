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
      // Handle array value for checkboxes
      updateModuleData('baseline', { 
        [name]: value
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
        oldPumpAge: 0,
        starterCoilRepairs: 0,
        motorBurnouts: 0,
        pipeReuseStatus: 'new'
      });
    }
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
              label="What pumps do you currently use?"
              name="oldPumpTypes"
              value={data.oldPumpTypes}
              onChange={handleChange}
              options={OLD_PUMP_TYPES}
            />

            {/* Old Pump Age */}
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

            {/* Starter Coil/Capacitor Repairs */}
            <FormSlider
              label="Starter Coil/Capacitor Repairs (Last Year)"
              name="starterCoilRepairs"
              value={data.starterCoilRepairs}
              onChange={handleSliderChange}
              min={0}
              max={20}
              step={1}
              unit=" times"
            />

            {/* Motor Burnouts */}
            <FormSlider
              label="Motor Burnouts (Rewinding)"
              name="motorBurnouts"
              value={data.motorBurnouts}
              onChange={handleSliderChange}
              min={0}
              max={20}
              step={1}
              unit=" times"
            />

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

            {/* Pain Point Indicators */}
            {(data.starterCoilRepairs >= 3 || data.motorBurnouts >= 3) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-100 rounded-lg flex items-center gap-2"
              >
                <TriangleAlert className="text-red-600" size={20} strokeWidth={ICON_STROKE_WIDTH} />
                <span className="text-sm text-red-700">
                  {data.starterCoilRepairs >= 3 && data.motorBurnouts >= 3 
                    ? 'High failure frequency in both controllers and motor - immediate upgrade recommended'
                    : data.starterCoilRepairs >= 3
                    ? 'High controller failure frequency indicates reliability issues'
                    : 'High motor burnout frequency - consider upgrading'}
                </span>
              </motion.div>
            )}
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
                <span style={{ color: '#558B2F' }}>Pump Types</span>
                <span className="font-medium capitalize" style={{ color: '#33691E' }}>
                  {data.oldPumpTypes.length > 0 ? data.oldPumpTypes.join(', ') : 'None selected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#558B2F' }}>Age</span>
                <span className="font-medium" style={{ color: '#33691E' }}>{data.oldPumpAge} years</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#558B2F' }}>Controller Issues</span>
                <span className={`font-medium ${data.starterCoilRepairs >= 3 ? 'text-red-600' : ''}`} 
                  style={data.starterCoilRepairs < 3 ? { color: '#33691E' } : {}}>
                  {data.starterCoilRepairs >= 3 ? 'Frequent' : 'Normal'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#558B2F' }}>Motor Issues</span>
                <span className={`font-medium ${data.motorBurnouts >= 3 ? 'text-red-600' : ''}`} 
                  style={data.motorBurnouts < 3 ? { color: '#33691E' } : {}}>
                  {data.motorBurnouts >= 3 ? 'Frequent' : 'Normal'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#558B2F' }}>Piping Plan</span>
                <span className="font-medium capitalize" style={{ color: '#33691E' }}>
                  {PIPE_CONDITIONS.find(p => p.value === data.pipeReuseStatus)?.label}
                </span>
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

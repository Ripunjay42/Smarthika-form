import { motion } from 'framer-motion';
import { Droplet, Info, Gauge, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { FormInput, FormSlider, FormButtonGroup, FormToggle } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { PIPE_MATERIALS, DELIVERY_TARGETS } from '../../constants/formConstants';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

const UNIT_SYSTEMS = [
  { value: 'feet', label: 'Feet' },
  { value: 'meters', label: 'Meters' },
];

const PIPE_DIAMETERS = [
  { value: '1.5', label: '1½″\n40 mm' },
  { value: '2', label: '2″\n50 mm' },
  { value: '2.5', label: '2½″\n63 mm' },
  { value: '3', label: '3″\n75 mm' },
  { value: '4', label: '4″\n110 mm' },
  { value: '5', label: '5″\n125 mm' },
  { value: '6', label: '6″\n160 mm' },
  { value: 'other', label: 'OTHER' },
];

export default function ArteriesForm() {
  const { formData, updateModuleData, moduleErrors } = useFormContext();
  const data = formData.arteries;
  const errors = moduleErrors?.arteries || {};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateModuleData('arteries', { 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    updateModuleData('arteries', { [name]: parseFloat(value) });
  };

  const handleMultiSelectTarget = (value) => {
    let current = data.deliveryTarget || [];
    if (typeof current === 'string') {
      current = current ? [current] : [];
    }
    
    if (current.includes(value)) {
      const updated = current.filter(v => v !== value);
      updateModuleData('arteries', { deliveryTarget: updated });
    } else {
      const updated = [...current, value];
      updateModuleData('arteries', { deliveryTarget: updated });
    }
  };

  const deliveryTargets = Array.isArray(data.deliveryTarget) ? data.deliveryTarget : [];
  const isTankSelected = deliveryTargets.includes('tank');
  const isSumpSelected = deliveryTargets.includes('sump');
  const unitLabel = data.unitSystem === 'meters' ? 'Meters' : 'Feet';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with Unit Selector in Corner */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: '#689F38' }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#33691E' }}>THE ARTERIES</h2>
            <p style={{ color: '#558B2F' }}>Piping infrastructure for water delivery.</p>
          </div>
          <div className="flex-shrink-0 pt-1">
            <div className="flex flex-col items-end gap-2">
              <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#33691E' }}>Measurement Unit</label>
              <div className="relative inline-flex items-center bg-white rounded-full p-1" style={{ border: '2px solid rgba(104, 159, 56, 0.3)' }}>
                <motion.div
                  className="absolute h-8 rounded-full"
                  style={{
                    backgroundColor: '#689F38',
                    width: '50%',
                    left: data.unitSystem === 'feet' ? '0%' : '50%',
                  }}
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                <button
                  onClick={() => handleChange({ target: { name: 'unitSystem', value: 'feet' } })}
                  className="relative z-10 px-4 py-1.5 text-sm font-semibold transition-colors rounded-full"
                  style={{ color: data.unitSystem === 'feet' ? '#EDEDE7' : '#33691E' }}
                >
                  Feet
                </button>
                <button
                  onClick={() => handleChange({ target: { name: 'unitSystem', value: 'meters' } })}
                  className="relative z-10 px-4 py-1.5 text-sm font-semibold transition-colors rounded-full"
                  style={{ color: data.unitSystem === 'meters' ? '#EDEDE7' : '#33691E' }}
                >
                  Meters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Target - Multi-Select */}
      <div className="space-y-3" id="field-arteries-deliveryTarget">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Where Does Water Go? (Select All That Apply)</label>
        <p className="text-xs" style={{ color: '#558B2F' }}>Each borewell/source can deliver to different destinations</p>
        <div className="space-y-2">
          {DELIVERY_TARGETS.map((target) => (
            <motion.button
              key={target.value}
              onClick={() => handleMultiSelectTarget(target.value)}
              className="w-full p-3 rounded-lg border-2 transition-all text-left"
              style={{
                borderColor: deliveryTargets.includes(target.value) ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                backgroundColor: deliveryTargets.includes(target.value) ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded border-2 flex items-center justify-center"
                  style={{
                    borderColor: deliveryTargets.includes(target.value) ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                    backgroundColor: deliveryTargets.includes(target.value) ? '#689F38' : 'transparent',
                  }}
                >
                  {deliveryTargets.includes(target.value) && (
                    <CheckCircle size={16} color="#E5E7EB" />
                  )}
                </div>
                <span className="font-medium" style={{ color: '#33691E' }}>{target.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
        {errors.deliveryTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-lg flex items-start gap-2 mt-2"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
          >
            <AlertCircle size={16} color="#EF4444" className="mt-0.5 shrink-0" />
            <span className="text-sm" style={{ color: '#DC2626' }}>{errors.deliveryTarget}</span>
          </motion.div>
        )}
      </div>

      {/* Tank Settings - Conditional */}
      {isTankSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 p-4 rounded-xl border-2"
          style={{ backgroundColor: 'rgba(104, 159, 56, 0.08)', borderColor: 'rgba(104, 159, 56, 0.2)' }}
        >
          <h3 className="font-semibold" style={{ color: '#33691E' }}>Overhead Tank Settings</h3>
          <FormSlider
            label={`Tank Height Above Ground (${unitLabel})`}
            name="overheadTankHeight"
            value={data.overheadTankHeight || 20}
            onChange={handleSliderChange}
            min={10}
            max={50}
            step={1}
            unit={data.unitSystem === 'meters' ? ' m' : ' ft'}
          />
          <FormSlider
            label="Tank Capacity"
            name="tankCapacity"
            value={data.tankCapacity || 0}
            onChange={handleSliderChange}
            min={100}
            max={5000}
            step={100}
            unit=" L"
          />
        </motion.div>
      )}

      {/* Sump Settings - Conditional */}
      {isSumpSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 p-4 rounded-xl border-2"
          style={{ backgroundColor: 'rgba(104, 159, 56, 0.08)', borderColor: 'rgba(104, 159, 56, 0.2)' }}
        >
          <h3 className="font-semibold" style={{ color: '#33691E' }}>Ground Sump Settings</h3>
          <FormSlider
            label={`Sump Depth Below Ground (${unitLabel})`}
            name="groundSumpDepth"
            value={data.groundSumpDepth || 0}
            onChange={handleSliderChange}
            min={0}
            max={30}
            step={1}
            unit={data.unitSystem === 'meters' ? ' m' : ' ft'}
          />
          <FormSlider
            label={`Distance from Pump to Sump (${unitLabel})`}
            name="sumpDistance"
            value={data.sumpDistance || 0}
            onChange={handleSliderChange}
            min={0}
            max={200}
            step={5}
            unit={data.unitSystem === 'meters' ? ' m' : ' ft'}
          />
        </motion.div>
      )}

      {/* Mainline Pipe Material with capitalized labels */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Mainline Pipe Material</label>
        <div className="grid grid-cols-3 gap-2">
          {PIPE_MATERIALS.map((material) => (
            <motion.button
              key={material.value}
              onClick={() => handleChange({ target: { name: 'mainlinePipeMaterial', value: material.value } })}
              className="p-3 rounded-lg border-2 transition-all text-center"
              style={{
                borderColor: data.mainlinePipeMaterial === material.value ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                backgroundColor: data.mainlinePipeMaterial === material.value ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-sm font-bold" style={{ color: '#33691E' }}>
                {material.label.toUpperCase()}
              </div>
              <div className="text-xs mt-1" style={{ color: '#558B2F' }}>
                C={material.roughness}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mainline Pipe Size Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Mainline Pipe Size Selection</label>
        <div className="grid grid-cols-4 gap-2">
          {PIPE_DIAMETERS.map((diameter) => (
            <motion.button
              key={diameter.value}
              onClick={() => handleChange({ target: { name: 'mainlineDiameter', value: diameter.value } })}
              className="p-2 rounded-lg border-2 transition-all text-center"
              style={{
                borderColor: data.mainlineDiameter === diameter.value ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                backgroundColor: data.mainlineDiameter === diameter.value ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-xs font-bold whitespace-pre-line" style={{ color: '#33691E' }}>
                {diameter.label}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Pipe Condition - How old are your pipes */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>How Old Are Your Pipes?</label>
        <div className="space-y-2">
          <motion.button
            onClick={() => handleChange({ target: { name: 'pipeCondition', value: 'new' } })}
            className="w-full p-3 rounded-lg border-2 transition-all text-left"
            style={{
              borderColor: data.pipeCondition === 'new' ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
              backgroundColor: data.pipeCondition === 'new' ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={18} color="#22C55E" />
              <div>
                <span className="font-medium" style={{ color: '#33691E' }}>New Installation</span>
                <p className="text-xs" style={{ color: '#558B2F' }}>Fresh pipes, no friction penalty</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => handleChange({ target: { name: 'pipeCondition', value: 'old' } })}
            className="w-full p-3 rounded-lg border-2 transition-all text-left"
            style={{
              borderColor: data.pipeCondition === 'old' ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
              backgroundColor: data.pipeCondition === 'old' ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-3">
              <AlertCircle size={18} color="#F59E0B" />
              <div>
                <span className="font-medium" style={{ color: '#33691E' }}>Reusing Old Pipes</span>
                <p className="text-xs" style={{ color: '#558B2F' }}>Existing pipes may have resistance</p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Flowmeter Requirement - Yes/No Toggle */}
      <FormToggle
        label="Is a Flow Meter Required?"
        name="flowmeterRequirement"
        checked={data.flowmeterRequirement}
        onChange={handleChange}
      />

      {/* Total Pipe Length - Slider instead of text input */}
      <FormSlider
        label={`Total Mainline Length (${unitLabel})`}
        name="totalPipeLength"
        id="field-arteries-totalPipeLength"
        value={data.totalPipeLength || 0}
        onChange={handleSliderChange}
        min={10}
        max={1000}
        step={10}
        unit={data.unitSystem === 'meters' ? ' m' : ' ft'}
        required
        error={errors.totalPipeLength}
      />

    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { Droplet, Info, Gauge, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { FormInput, FormSlider, FormButtonGroup, FormToggle } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { PIPE_MATERIALS, DELIVERY_TARGETS } from '../../constants/formConstants';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

const PIPE_DIAMETERS = [
  { value: '2', label: '2"' },
  { value: '2.5', label: '2.5"' },
  { value: '3', label: '3"' },
  { value: '4', label: '4"' },
  { value: '6', label: '6"' },
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: '#689F38' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#33691E' }}>THE ARTERIES</h2>
        <p style={{ color: '#558B2F' }}>Piping infrastructure for water delivery.</p>
      </div>

      {/* Delivery Target - Multi-Select */}
      <div className="space-y-3">
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
                    <CheckCircle size={16} color="#FAF0BF" />
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
            label="Tank Height Above Ground"
            name="overheadTankHeight"
            value={data.overheadTankHeight || 20}
            onChange={handleSliderChange}
            min={10}
            max={50}
            step={1}
            unit=" ft"
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
            label="Sump Depth Below Ground"
            name="groundSumpDepth"
            value={data.groundSumpDepth || 0}
            onChange={handleSliderChange}
            min={0}
            max={30}
            step={1}
            unit=" ft"
          />
          <FormSlider
            label="Distance from Pump to Sump"
            name="sumpDistance"
            value={data.sumpDistance || 0}
            onChange={handleSliderChange}
            min={0}
            max={200}
            step={5}
            unit=" ft"
          />
        </motion.div>
      )}

      {/* Pipe Material */}
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
                {material.label}
              </div>
              <div className="text-xs mt-1" style={{ color: '#558B2F' }}>
                C={material.roughness}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mainline Diameter */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Mainline Diameter</label>
        <div className="grid grid-cols-5 gap-2">
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
              <div className="text-sm font-bold" style={{ color: '#33691E' }}>
                {diameter.label}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Pipe Condition - Only Old option */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Pipe Condition</label>
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

      {/* Friction Penalty for old pipes */}
      {data.pipeCondition === 'old' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 p-4 rounded-xl border-2"
          style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.2)' }}
        >
          <FormSlider
            label="Friction Head Penalty"
            name="frictionHeadPenalty"
            value={data.frictionHeadPenalty || 0}
            onChange={handleSliderChange}
            min={0}
            max={30}
            step={1}
            unit="% extra"
            helper="Additional pressure loss due to pipe age"
          />
        </motion.div>
      )}

      {/* Total Pipe Length - Slider instead of text input */}
      <FormSlider
        label="Total Mainline Length"
        name="totalPipeLength"
        value={data.totalPipeLength || 0}
        onChange={handleSliderChange}
        min={10}
        max={1000}
        step={10}
        unit=" ft"
        required
        error={errors.totalPipeLength}
      />

      {/* Flowmeter Toggle with Icon */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(104, 159, 56, 0.15)' }}>
            <Gauge size={20} color="#689F38" />
          </div>
          <div className="flex-1">
            <label className="text-sm font-semibold" style={{ color: '#33691E' }}>Flow Meter Required</label>
            <p className="text-xs mt-1" style={{ color: '#558B2F' }}>Track and monitor water discharge</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => handleChange({ target: { name: 'flowmeterRequirement', type: 'checkbox', checked: true } })}
            className="flex-1 p-3 rounded-lg border-2 transition-all text-center"
            style={{
              borderColor: data.flowmeterRequirement ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
              backgroundColor: data.flowmeterRequirement ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
            }}
            whileHover={{ scale: 1.01 }}
          >
            <span className="font-medium" style={{ color: '#33691E' }}>Yes</span>
          </motion.button>
          <motion.button
            onClick={() => handleChange({ target: { name: 'flowmeterRequirement', type: 'checkbox', checked: false } })}
            className="flex-1 p-3 rounded-lg border-2 transition-all text-center"
            style={{
              borderColor: !data.flowmeterRequirement ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
              backgroundColor: !data.flowmeterRequirement ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
            }}
            whileHover={{ scale: 1.01 }}
          >
            <span className="font-medium" style={{ color: '#33691E' }}>No</span>
          </motion.button>
        </div>
      </div>

      {/* Auxiliary Outlet Toggle */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(104, 159, 56, 0.15)' }}>
            <Zap size={20} color="#689F38" />
          </div>
          <div className="flex-1">
            <label className="text-sm font-semibold" style={{ color: '#33691E' }}>Auxiliary Outlet for Future Expansion</label>
            <p className="text-xs mt-1" style={{ color: '#558B2F' }}>Extra tap for additional irrigation zones</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => handleChange({ target: { name: 'auxiliaryOutletNeed', type: 'checkbox', checked: true } })}
            className="flex-1 p-3 rounded-lg border-2 transition-all text-center"
            style={{
              borderColor: data.auxiliaryOutletNeed ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
              backgroundColor: data.auxiliaryOutletNeed ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
            }}
            whileHover={{ scale: 1.01 }}
          >
            <span className="font-medium" style={{ color: '#33691E' }}>Yes</span>
          </motion.button>
          <motion.button
            onClick={() => handleChange({ target: { name: 'auxiliaryOutletNeed', type: 'checkbox', checked: false } })}
            className="flex-1 p-3 rounded-lg border-2 transition-all text-center"
            style={{
              borderColor: !data.auxiliaryOutletNeed ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
              backgroundColor: !data.auxiliaryOutletNeed ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
            }}
            whileHover={{ scale: 1.01 }}
          >
            <span className="font-medium" style={{ color: '#33691E' }}>No</span>
          </motion.button>
        </div>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-xl border-2"
        style={{ backgroundColor: 'rgba(104, 159, 56, 0.1)', borderColor: 'rgba(104, 159, 56, 0.2)' }}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(104, 159, 56, 0.2)' }}>
            <Info size={20} strokeWidth={ICON_STROKE_WIDTH} style={{ color: ICON_COLOR }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: '#33691E' }}>Delivery Options</h4>
            <p className="text-xs mt-1" style={{ color: '#558B2F' }}>
              You can deliver water from multiple borehells to different destinations. 
              One source can go to direct irrigation while another fills your sump or tank.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

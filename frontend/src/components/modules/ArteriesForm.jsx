import { motion } from 'framer-motion';
import { GitBranch, Info } from '@phosphor-icons/react';
import { FormInput, FormSlider, FormButtonGroup, FormToggle } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { PIPE_MATERIALS } from '../../constants/formConstants';

export default function ArteriesForm() {
  const { formData, updateModuleData } = useFormContext();
  const data = formData.arteries;

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
        <p className="text-gray-500">Piping infrastructure for water delivery.</p>
      </div>

      {/* Delivery Target */}
      <FormButtonGroup
        label="Delivery Target"
        name="deliveryTarget"
        value={data.deliveryTarget}
        onChange={handleChange}
        options={[
          { value: 'direct', label: 'Direct to Field' },
          { value: 'tank', label: 'Overhead Tank' },
          { value: 'sump', label: 'Ground Sump' },
        ]}
      />

      {/* Tank Settings */}
      {data.deliveryTarget === 'tank' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 p-4 bg-blue-50 rounded-xl"
        >
          <FormSlider
            label="Overhead Tank Height"
            name="overheadTankHeight"
            value={data.overheadTankHeight || 20}
            onChange={handleSliderChange}
            min={10}
            max={50}
            step={1}
            unit=" ft"
          />
          <FormInput
            label="Tank Capacity"
            name="tankCapacity"
            type="number"
            value={data.tankCapacity}
            onChange={handleChange}
            placeholder="Capacity in liters"
          />
        </motion.div>
      )}

      {/* Sump Settings */}
      {data.deliveryTarget === 'sump' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 p-4 bg-blue-50 rounded-xl"
        >
          <FormInput
            label="Ground Sump Depth"
            name="groundSumpDepth"
            type="number"
            value={data.groundSumpDepth}
            onChange={handleChange}
            placeholder="Depth (ft)"
          />
          <FormInput
            label="Sump Distance from Pump"
            name="sumpDistance"
            type="number"
            value={data.sumpDistance}
            onChange={handleChange}
            placeholder="Distance (ft)"
          />
        </motion.div>
      )}

      {/* Pipe Material */}
      <FormButtonGroup
        label="Mainline Pipe Material"
        name="mainlinePipeMaterial"
        value={data.mainlinePipeMaterial}
        onChange={handleChange}
        options={PIPE_MATERIALS.map(p => ({ value: p.value, label: p.label }))}
      />

      {/* Pipe Diameter */}
      <FormButtonGroup
        label="Mainline Diameter"
        name="mainlineDiameter"
        value={data.mainlineDiameter}
        onChange={handleChange}
        options={[
          { value: '2', label: '2 inch' },
          { value: '2.5', label: '2.5 inch' },
          { value: '3', label: '3 inch' },
          { value: '4', label: '4 inch' },
          { value: '6', label: '6 inch' },
        ]}
      />

      {/* Pipe Condition */}
      <FormButtonGroup
        label="Pipe Age/Condition"
        name="pipeCondition"
        value={data.pipeCondition}
        onChange={handleChange}
        options={[
          { value: 'new', label: 'New Installation' },
          { value: 'reusing', label: 'Reusing Old Pipes' },
        ]}
      />

      {/* Friction Penalty for old pipes */}
      {data.pipeCondition === 'reusing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FormSlider
            label="Friction Head Penalty"
            name="frictionHeadPenalty"
            value={data.frictionHeadPenalty}
            onChange={handleSliderChange}
            min={0}
            max={30}
            step={1}
            unit="% extra"
          />
        </motion.div>
      )}

      {/* Pipe Length */}
      <FormInput
        label="Total Pipe Length"
        name="totalPipeLength"
        type="number"
        value={data.totalPipeLength}
        onChange={handleChange}
        placeholder="Total length (ft)"
        icon={GitBranch}
      />

      {/* Elbows */}
      <FormSlider
        label="Number of Elbows/Bends"
        name="numberOfElbows"
        value={data.numberOfElbows}
        onChange={handleSliderChange}
        min={0}
        max={20}
        step={1}
        unit=" bends"
      />

      {/* Toggles */}
      <div className="space-y-3">
        <FormToggle
          label="Flowmeter Required"
          name="flowmeterRequirement"
          checked={data.flowmeterRequirement}
          onChange={handleChange}
        />
        <FormToggle
          label="Auxiliary Outlet for Future Expansion"
          name="auxiliaryOutletNeed"
          checked={data.auxiliaryOutletNeed}
          onChange={handleChange}
        />
      </div>

      {/* Calculated Values Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl border"
        style={{ backgroundColor: 'rgba(104, 159, 56, 0.08)', borderColor: 'rgba(104, 159, 56, 0.2)' }}
      >
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Calculated Parameters</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-white rounded-lg">
            <p className="text-xs text-gray-500">Roughness (C)</p>
            <p className="text-lg font-bold" style={{ color: '#689F38' }}>
              {PIPE_MATERIALS.find(p => p.value === data.mainlinePipeMaterial)?.roughness || 150}
            </p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <p className="text-xs text-gray-500">Static Head</p>
            <p className="text-lg font-bold" style={{ color: '#689F38' }}>
              {data.deliveryTarget === 'tank' ? `${data.overheadTankHeight || 20} ft` : 'N/A'}
            </p>
          </div>
        </div>
      </motion.div>

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
            <h4 className="text-sm font-semibold" style={{ color: '#33691E' }}>Friction Calculation</h4>
            <p className="text-xs mt-1" style={{ color: '#558B2F' }}>
              Pipe material and length determine friction losses. Each elbow adds 
              equivalent pipe length to the friction calculation.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

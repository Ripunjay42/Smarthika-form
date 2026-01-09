import { motion } from 'framer-motion';
import { Droplet, Info } from 'lucide-react';
import { FormInput, FormSelect, FormSlider, FormButtonGroup, FormColorPicker } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { WATER_SOURCES, CASING_DIAMETERS, WATER_QUALITIES } from '../../constants/formConstants';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

export default function HeartForm() {
  const { formData, updateModuleData, moduleErrors } = useFormContext();
  const data = formData.heart;
  const errors = moduleErrors?.heart || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateModuleData('heart', { [name]: value });
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    updateModuleData('heart', { [name]: parseFloat(value) });
  };

  // Calculate drawdown
  const drawdown = data.dynamicWaterLevel && data.staticWaterLevel 
    ? parseFloat(data.dynamicWaterLevel) - parseFloat(data.staticWaterLevel) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: '#689F38' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#33691E' }}>THE HYDRAULIC HEART</h2>
        <p className="text-gray-500">Borewell specifications for pump selection.</p>
      </div>

      {/* Source Type */}
      <FormButtonGroup
        label="Water Source Type"
        name="sourceType"
        value={data.sourceType}
        onChange={handleChange}
        options={WATER_SOURCES}
      />

      {/* Depth */}
      <FormInput
        label="Total Depth"
        name="totalDepth"
        type="number"
        value={data.totalDepth}
        onChange={handleChange}
        placeholder="Total borewell depth (ft)"
        icon={Droplet}
        required
        error={errors.totalDepth}
      />

      {/* Water Levels */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Static Water Level"
          name="staticWaterLevel"
          type="number"
          value={data.staticWaterLevel}
          onChange={handleChange}
          placeholder="Resting depth (ft)"
          helper="Water level when pump is off"
          required
          error={errors.staticWaterLevel}
        />
        <FormInput
          label="Dynamic Water Level"
          name="dynamicWaterLevel"
          type="number"
          value={data.dynamicWaterLevel}
          onChange={handleChange}
          placeholder="Pumping depth (ft)"
          helper="Water level during pumping"
          required
          error={errors.dynamicWaterLevel}
        />
      </div>

      {/* Calculated Drawdown */}
      {drawdown > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-blue-50 rounded-xl border border-blue-100"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">Calculated Drawdown</span>
            <span className="text-lg font-bold text-blue-800">{drawdown} ft</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            {drawdown < 20 ? 'Good aquifer recharge rate' : 
             drawdown < 40 ? 'Moderate recharge rate' : 
             'Low recharge rate - consider water conservation'}
          </p>
        </motion.div>
      )}

      {/* Casing Diameter */}
      <FormButtonGroup
        label="Casing Pipe Diameter"
        name="casingDiameter"
        value={data.casingDiameter}
        onChange={handleChange}
        options={CASING_DIAMETERS}
      />

      {/* Seasonal Variance */}
      <FormButtonGroup
        label="Seasonal Variance Risk"
        name="seasonalVariance"
        value={data.seasonalVariance}
        onChange={handleChange}
        options={[
          { value: 'low', label: 'Low (< 10ft drop)' },
          { value: 'medium', label: 'Medium (10-30ft drop)' },
          { value: 'high', label: 'High (> 30ft drop)' },
        ]}
      />

      {/* Dry Run Risk */}
      <FormButtonGroup
        label="Dry Run Risk"
        name="dryRunRisk"
        value={data.dryRunRisk}
        onChange={handleChange}
        options={[
          { value: 'low', label: 'Low' },
          { value: 'high', label: 'High' },
        ]}
      />

      {/* Water Quality */}
      <FormColorPicker
        label="Water Visual Quality"
        name="waterQuality"
        value={data.waterQuality}
        onChange={handleChange}
        options={WATER_QUALITIES}
      />

      {/* Quality Risks */}
      <div className="grid grid-cols-3 gap-3">
        <FormButtonGroup
          label="Scaling Risk"
          name="scalingRisk"
          value={data.scalingRisk}
          onChange={handleChange}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'high', label: 'High' },
          ]}
        />
        <FormButtonGroup
          label="Iron Content"
          name="ironContentRisk"
          value={data.ironContentRisk}
          onChange={handleChange}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'high', label: 'High' },
          ]}
        />
        <FormButtonGroup
          label="Abrasion Risk"
          name="abrasionRisk"
          value={data.abrasionRisk}
          onChange={handleChange}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'high', label: 'High' },
          ]}
        />
      </div>

      {/* Open Well Specific */}
      {data.sourceType === 'open-well' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          <FormInput
            label="Suction Head"
            name="suctionHead"
            type="number"
            value={data.suctionHead}
            onChange={handleChange}
            placeholder="Suction head (ft)"
          />
          <FormButtonGroup
            label="Foot Valve Condition"
            name="footValveCondition"
            value={data.footValveCondition}
            onChange={handleChange}
            options={[
              { value: 'good', label: 'Good' },
              { value: 'leaking', label: 'Leaking' },
            ]}
          />
        </motion.div>
      )}

      {/* Number of Borewells */}
      <FormSlider
        label="Number of Borewells"
        name="numberOfBorewells"
        value={data.numberOfBorewells}
        onChange={handleSliderChange}
        min={1}
        max={5}
        step={1}
        unit=" sources"
      />

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
            <h4 className="text-sm font-semibold" style={{ color: '#33691E' }}>Pump Selection Guide</h4>
            <p className="text-xs mt-1" style={{ color: '#558B2F' }}>
              Water levels determine pump duty point. Quality indicators help select 
              appropriate impeller material and filtration requirements.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

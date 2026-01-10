import { motion } from 'framer-motion';
import { Droplet, Info, AlertCircle, CheckCircle, TrendingDown } from 'lucide-react';
import { FormInput, FormSelect, FormSlider, FormButtonGroup, FormColorPicker } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { WATER_SOURCES, CASING_DIAMETERS, WATER_QUALITIES } from '../../constants/formConstants';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

const WATER_STORAGE_OPTIONS = [
  { value: 'sump', label: 'Underground Sump' },
  { value: 'tank', label: 'Overhead Tank' },
  { value: 'both', label: 'Both Sump & Tank' },
];

const PUMP_SIZES = [
  { value: '1hp', label: '1 HP' },
  { value: '2hp', label: '2 HP' },
  { value: '3hp', label: '3 HP' },
  { value: '5hp', label: '5 HP' },
  { value: '7.5hp', label: '7.5 HP' },
  { value: '10hp', label: '10 HP' },
];

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

  const handleMultiSelect = (name, value) => {
    // Ensure current is always an array
    let current = data[name] || [];
    if (typeof current === 'string') {
      current = current ? [current] : [];
    }
    
    if (current.includes(value)) {
      const updated = current.filter(v => v !== value);
      updateModuleData('heart', { [name]: updated });
    } else {
      const updated = [...current, value];
      updateModuleData('heart', { [name]: updated });
    }
  };

  // Calculate drawdown
  const drawdown = data.dynamicWaterLevel && data.staticWaterLevel 
    ? parseFloat(data.dynamicWaterLevel) - parseFloat(data.staticWaterLevel) 
    : 0;

  // Get recharge assessment
  const getRechargeAssessment = () => {
    if (drawdown < 20) return { label: 'Excellent', color: '#22C55E', desc: 'Strong recharge rate' };
    if (drawdown < 40) return { label: 'Good', color: '#F59E0B', desc: 'Moderate recharge rate' };
    return { label: 'Poor', color: '#EF4444', desc: 'Low recharge rate' };
  };
  
  const rechargeStatus = getRechargeAssessment();
  const hasHighDryRunRisk = data.dryRunRisk === 'high';
  const isOpenWell = data.sourceType && data.sourceType.includes('open-well');
  const hasMunicipalWater = data.municipalWaterAvailable === 'yes';

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
        <p style={{ color: '#558B2F' }}>Water source assessment and pump sizing.</p>
      </div>

      {/* Number of Borewells - Ask First */}
      <FormInput
        label="Number of Water Sources"
        name="numberOfBorewells"
        type="number"
        value={data.numberOfBorewells}
        onChange={handleChange}
        placeholder="How many water sources?"
        icon={Droplet}
        min="1"
        max="10"
        required
        error={errors.numberOfBorewells}
      />

      {/* Multi-Select Water Sources */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Available Water Sources</label>
        <div className="space-y-2">
          {WATER_SOURCES.map((source) => (
            <motion.button
              key={source.value}
              onClick={() => handleMultiSelect('sourceType', source.value)}
              className="w-full p-3 rounded-lg border-2 transition-all text-left"
              style={{
                borderColor: (data.sourceType || []).includes(source.value) ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                backgroundColor: (data.sourceType || []).includes(source.value) ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded border-2 flex items-center justify-center"
                  style={{
                    borderColor: (data.sourceType || []).includes(source.value) ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                    backgroundColor: (data.sourceType || []).includes(source.value) ? '#689F38' : 'transparent',
                  }}
                >
                  {(data.sourceType || []).includes(source.value) && (
                    <CheckCircle size={16} color="#FAF0BF" />
                  )}
                </div>
                <span className="font-medium" style={{ color: '#33691E' }}>{source.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
        {errors.sourceType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-lg flex items-start gap-2 mt-2"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
          >
            <AlertCircle size={16} color="#EF4444" className="mt-0.5 shrink-0" />
            <span className="text-sm" style={{ color: '#DC2626' }}>{errors.sourceType}</span>
          </motion.div>
        )}
      </div>

      {/* Water Quality - Keep but with description */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Water Color/Quality</label>
        <p className="text-xs" style={{ color: '#558B2F' }}>Visual indication of water quality</p>
        <FormColorPicker
          label=""
          name="waterQuality"
          value={data.waterQuality}
          onChange={handleChange}
          options={WATER_QUALITIES}
        />
      </div>

      {/* Seasonal Variance */}
      <FormButtonGroup
        label="Seasonal Variance in Water Level"
        name="seasonalVariance"
        value={data.seasonalVariance}
        onChange={handleChange}
        options={[
          { value: 'low', label: 'Low (< 10ft drop)' },
          { value: 'medium', label: 'Medium (10-30ft drop)' },
          { value: 'high', label: 'High (> 30ft drop)' },
        ]}
      />

      {/* Dry Run Risk with Color Coding */}
      <FormButtonGroup
        label="Dry Run Risk Assessment"
        name="dryRunRisk"
        value={data.dryRunRisk}
        onChange={handleChange}
        options={[
          { value: 'low', label: '✓ Low Risk' },
          { value: 'high', label: '⚠ High Risk' },
        ]}
      />

      {hasHighDryRunRisk && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-xl flex items-start gap-3"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '2px solid rgba(239, 68, 68, 0.3)' }}
        >
          <AlertCircle size={20} color="#EF4444" className="shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-600">High Dry Run Risk Detected</p>
            <p className="text-xs text-red-500 mt-1">
              Your water source may dry up during peak season. Consider water conservation strategies or multiple sources.
            </p>
          </div>
        </motion.div>
      )}

      {/* Depth Section - Optional */}
      <div className="border-t pt-5">
        <h3 className="font-semibold mb-4" style={{ color: '#33691E' }}>Water Level Details (Optional)</h3>
        <p className="text-xs mb-4" style={{ color: '#558B2F' }}>Provide these if available for precise pump sizing</p>

        <FormInput
          label="Total Depth of Borewell/Source"
          name="totalDepth"
          type="number"
          value={data.totalDepth}
          onChange={handleChange}
          placeholder="Total depth in feet"
          icon={Droplet}
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <FormInput
            label="Static Water Level"
            name="staticWaterLevel"
            type="number"
            value={data.staticWaterLevel}
            onChange={handleChange}
            placeholder="Resting level (ft)"
            helper="When pump is OFF"
          />
          <FormInput
            label="Dynamic Water Level"
            name="dynamicWaterLevel"
            type="number"
            value={data.dynamicWaterLevel}
            onChange={handleChange}
            placeholder="Pumping level (ft)"
            helper="When pump is ON"
          />
        </div>

        {/* Drawdown & Recharge Assessment */}
        {drawdown > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 rounded-xl"
            style={{
              backgroundColor: `${rechargeStatus.color}15`,
              border: `2px solid ${rechargeStatus.color}40`,
            }}
          >
            <div className="flex items-start gap-3">
              <TrendingDown size={20} color={rechargeStatus.color} className="mt-0.5" />
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold" style={{ color: rechargeStatus.color }}>
                    {rechargeStatus.label} Recharge
                  </span>
                  <span className="text-lg font-bold" style={{ color: rechargeStatus.color }}>{drawdown} ft</span>
                </div>
                <p className="text-xs mt-1" style={{ color: rechargeStatus.color }}>
                  {rechargeStatus.desc}
                </p>
                {drawdown > 40 && (
                  <p className="text-xs mt-2 text-red-600 font-medium">
                    💧 Water conservation recommended. Consider supplementary sources.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Casing Diameter */}
      <FormButtonGroup
        label="Casing Pipe Diameter"
        name="casingDiameter"
        value={data.casingDiameter}
        onChange={handleChange}
        options={CASING_DIAMETERS}
      />

      {/* Open Well Specific - Sump & Tank Storage */}
      {isOpenWell && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 border-t pt-4"
        >
          <h3 className="font-semibold" style={{ color: '#33691E' }}>Water Storage Options</h3>
          <div className="space-y-2">
            {WATER_STORAGE_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => handleChange({ target: { name: 'waterStorageType', value: option.value } })}
                className="w-full p-3 rounded-lg border-2 transition-all text-left"
                style={{
                  borderColor: data.waterStorageType === option.value ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                  backgroundColor: data.waterStorageType === option.value ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
                }}
                whileHover={{ scale: 1.01 }}
              >
                <span className="font-medium" style={{ color: '#33691E' }}>{option.label}</span>
              </motion.button>
            ))}
          </div>

          <FormInput
            label="Suction Head"
            name="suctionHead"
            type="number"
            value={data.suctionHead}
            onChange={handleChange}
            placeholder="Suction head (ft)"
            helper="Distance from suction point to pump"
          />

          <FormButtonGroup
            label="Foot Valve Condition"
            name="footValveCondition"
            value={data.footValveCondition}
            onChange={handleChange}
            options={[
              { value: 'good', label: 'Good - No Leaks' },
              { value: 'leaking', label: 'Leaking - Needs Replacement' },
            ]}
          />
        </motion.div>
      )}

      {/* Municipal Water Supply */}
      <div className="border-t pt-5">
        <FormButtonGroup
          label="Water from Municipality Available?"
          name="municipalWaterAvailable"
          value={data.municipalWaterAvailable}
          onChange={handleChange}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />

        {hasMunicipalWater && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4"
          >
            <FormInput
              label="Estimated Municipal Water Volume"
              name="municipalWaterVolume"
              type="number"
              value={data.municipalWaterVolume}
              onChange={handleChange}
              placeholder="Volume in liters per day"
              helper="Estimated daily supply"
            />
          </motion.div>
        )}
      </div>

      {/* Pump Size Selection */}
      <div className="border-t pt-5">
        <h3 className="font-semibold mb-3" style={{ color: '#33691E' }}>Pump Motor Size</h3>
        <FormButtonGroup
          label="Select Appropriate Pump Horsepower"
          name="pumpSize"
          value={data.pumpSize}
          onChange={handleChange}
          options={PUMP_SIZES}
        />
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-xl"
        style={{ backgroundColor: 'rgba(104, 159, 56, 0.1)', border: '2px solid rgba(104, 159, 56, 0.2)' }}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(104, 159, 56, 0.15)' }}>
            <Info size={20} strokeWidth={ICON_STROKE_WIDTH} style={{ color: ICON_COLOR }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: '#33691E' }}>Borewell Assessment</h4>
            <p className="text-xs mt-1" style={{ color: '#558B2F' }}>
              Water source type determines pump configuration. Seasonal variance and recharge rates 
              affect reliability. Municipal water can provide supplementary supply during dry seasons.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

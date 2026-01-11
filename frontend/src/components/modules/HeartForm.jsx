import { motion } from 'framer-motion';
import { Droplet, Info, AlertCircle, CheckCircle, TrendingDown, Plus, Minus } from 'lucide-react';
import { FormInput, FormSelect, FormSlider, FormButtonGroup, FormColorPicker } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { WATER_SOURCES, CASING_DIAMETERS, WATER_QUALITIES } from '../../constants/formConstants';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

const WATER_STORAGE_OPTIONS = [
  { value: 'sump', label: 'Underground Sump' },
  { value: 'tank', label: 'Overhead Tank' },
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
      // Also remove count when deselecting
      const sourceCountKey = `${value}Count`;
      updateModuleData('heart', { [name]: updated, [sourceCountKey]: 0 });
    } else {
      const updated = [...current, value];
      // Initialize count to 1 when selecting
      const sourceCountKey = `${value}Count`;
      updateModuleData('heart', { [name]: updated, [sourceCountKey]: data[sourceCountKey] || 1 });
    }
  };

  const handleWaterStorageSelect = (value) => {
    let current = data.waterStorageType || [];
    if (typeof current === 'string') {
      current = current ? [current] : [];
    }
    
    if (current.includes(value)) {
      const updated = current.filter(v => v !== value);
      updateModuleData('heart', { waterStorageType: updated });
    } else {
      const updated = [...current, value];
      updateModuleData('heart', { waterStorageType: updated });
    }
  };

  const handleSourceCountChange = (sourceValue, increment) => {
    const countKey = `${sourceValue}Count`;
    const currentCount = data[countKey] || 0;
    const newCount = Math.max(1, currentCount + (increment ? 1 : -1));
    updateModuleData('heart', { [countKey]: newCount });
  };

  // Calculate adjusted static water level based on seasonal variance
  const getAdjustedStaticLevel = () => {
    let base = parseFloat(data.staticWaterLevel) || 50;
    if (data.seasonalVariance === 'high') {
      return base + 30; // Water level drops more during dry season
    } else if (data.seasonalVariance === 'medium') {
      return base + 15; // Moderate seasonal variation
    }
    return base; // Low variation
  };
  const adjustedStaticLevel = getAdjustedStaticLevel();

  // Calculate drawdown
  const drawdown = data.dynamicWaterLevel && data.staticWaterLevel 
    ? Math.abs(parseFloat(data.dynamicWaterLevel) - adjustedStaticLevel)
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

      {/* Multi-Select Water Sources */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Available Water Sources</label>
        <div className="space-y-2">
          {WATER_SOURCES.map((source) => {
            const isSelected = (data.sourceType || []).includes(source.value);
            const countKey = `${source.value}Count`;
            const count = data[countKey] || 0;
            
            return (
              <motion.div
                key={source.value}
                className="p-3 rounded-lg border-2 transition-all"
                style={{
                  borderColor: isSelected ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                  backgroundColor: isSelected ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <motion.button
                    onClick={() => handleMultiSelect('sourceType', source.value)}
                    className="flex-1 text-left flex items-center gap-3"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div
                      className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor: isSelected ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                        backgroundColor: isSelected ? '#689F38' : 'transparent',
                      }}
                    >
                      {isSelected && (
                        <CheckCircle size={16} color="#FAF0BF" />
                      )}
                    </div>
                    <span className="font-medium" style={{ color: '#33691E' }}>{source.label}</span>
                  </motion.button>
                  
                  {/* Counter - Shows only when selected */}
                  {isSelected && (
                    <div className="flex items-center gap-2 bg-white rounded-lg p-1" style={{ border: '1px solid rgba(104, 159, 56, 0.3)' }}>
                      <motion.button
                        onClick={() => handleSourceCountChange(source.value, false)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Minus size={18} color="#689F38" strokeWidth={2} />
                      </motion.button>
                      <span className="w-8 text-center font-bold" style={{ color: '#33691E' }}>
                        {count}
                      </span>
                      <motion.button
                        onClick={() => handleSourceCountChange(source.value, true)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus size={18} color="#689F38" strokeWidth={2} />
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
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
          <div className="flex gap-3 flex-wrap">
            {WATER_STORAGE_OPTIONS.map((option) => {
              const isSelected = Array.isArray(data.waterStorageType) 
                ? data.waterStorageType.includes(option.value)
                : data.waterStorageType === option.value;
              return (
                <motion.button
                  key={option.value}
                  onClick={() => handleWaterStorageSelect(option.value)}
                  className="flex-1 min-w-[140px] p-3 rounded-lg border-2 transition-all text-left flex items-center gap-2"
                  style={{
                    borderColor: isSelected ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                    backgroundColor: isSelected ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
                  }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex-1">
                    <span className="font-medium" style={{ color: '#33691E' }}>{option.label}</span>
                  </div>
                  {isSelected && (
                    <CheckCircle size={20} color="#689F38" strokeWidth={2.5} />
                  )}
                </motion.button>
              );
            })}
          </div>

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
    </motion.div>
  );
}

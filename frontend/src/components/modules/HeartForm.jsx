import { motion } from 'framer-motion';
import { Droplet, Info, AlertCircle, CheckCircle, TrendingDown, Plus, Minus, HelpCircle } from 'lucide-react';
import { FormInput, FormSelect, FormSlider, FormButtonGroup, FormColorPicker } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { WATER_SOURCES, CASING_DIAMETERS, WATER_QUALITIES } from '../../constants/formConstants';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

const WATER_STORAGE_OPTIONS = [
  { value: 'sump', label: 'Underground Sump' },
  { value: 'tank', label: 'Overhead Tank' },
];

const UNIT_SYSTEMS = [
  { value: 'feet', label: 'Feet' },
  { value: 'meters', label: 'Meters' },
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
    const currentCount = data[countKey] || 1;
    const newCount = Math.max(1, currentCount + (increment ? 1 : -1));
    updateModuleData('heart', { [countKey]: newCount });
  };

  // Calculate adjusted static water level based on seasonal variance
  const getAdjustedStaticLevel = () => {
    let base = parseFloat(data.staticWaterLevel) || 50;
    const variance = parseFloat(data.seasonalVariance) || 0;
    return base + variance;
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
  const isOpenWell = data.sourceType && data.sourceType.includes('open-well');
  const hasMunicipalWater = data.municipalWaterAvailable === 'yes';
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
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#33691E' }}>THE HYDRAULIC HEART</h2>
            <p style={{ color: '#558B2F' }}>Water source assessment and pump sizing.</p>
          </div>
          <div className="shrink-0 pt-1">
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

      {/* Multi-Select Water Sources */}
      <div className="space-y-3" id="field-heart-sourceType">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Available Water Sources</label>
        <div className="space-y-2">
          {WATER_SOURCES.map((source) => {
            const isSelected = (data.sourceType || []).includes(source.value);
            const countKey = `${source.value}Count`;
            const count = data[countKey] || 1;
            
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
                      className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0"
                      style={{
                        borderColor: isSelected ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                        backgroundColor: isSelected ? '#689F38' : 'transparent',
                      }}
                    >
                      {isSelected && (
                        <CheckCircle size={16} color="#E5E7EB" />
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

        {/* I don't know button */}
        <motion.button
          onClick={() => {
            if (!data.unknownDetails) {
              // When toggling ON: clear water level details
              updateModuleData('heart', { 
                unknownDetails: true,
                totalDepth: '',
                staticWaterLevel: '',
                dynamicWaterLevel: '',
                seasonalVariance: 0,
              });
            } else {
              // When toggling OFF: just turn off the flag
              updateModuleData('heart', { unknownDetails: false });
            }
          }}
          className="w-full mb-4 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2"
          style={{
            borderColor: data.unknownDetails ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
            backgroundColor: data.unknownDetails ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <HelpCircle size={18} color={data.unknownDetails ? '#689F38' : '#558B2F'} />
          <span className="font-medium" style={{ color: data.unknownDetails ? '#689F38' : '#33691E' }}>
            I don't know my details
          </span>
        </motion.button>

        {/* Service card shown when user clicks "I don't know" */}
        {data.unknownDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg mb-4"
            style={{
              backgroundColor: 'rgba(104, 159, 56, 0.1)',
              border: '2px solid rgba(104, 159, 56, 0.3)',
            }}
          >
            <div className="flex items-start gap-3">
              <CheckCircle size={20} color="#689F38" className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm" style={{ color: '#33691E' }}>We can test your borewell yield</p>
                <p className="text-xs mt-1" style={{ color: '#558B2F' }}>Our team can visit and test your borewell to determine exact water levels and yield.</p>
              </div>
            </div>
          </motion.div>
        )}

        <FormInput
          label={`Total Depth of Borewell/Source (${unitLabel})`}
          name="totalDepth"
          type="number"
          value={data.totalDepth}
          onChange={handleChange}
          placeholder={`Total depth in ${unitLabel.toLowerCase()}`}
          icon={Droplet}
          min="0"
          disabled={data.unknownDetails}
          inputStyle={{
            backgroundColor: data.unknownDetails ? '#e5e5e5' : '#EDEDE7',
          }}
        />

        {/* Check if total depth is entered to enable sliders */}
        {(() => {
          const totalDepthValue = parseFloat(data.totalDepth);
          const sliderDisabled = data.unknownDetails || !totalDepthValue || totalDepthValue === 0;

          return (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <FormInput
                label={`Water Level (Morning) (${unitLabel})`}
                name="staticWaterLevel"
                type="number"
                value={data.staticWaterLevel}
                onChange={handleChange}
                placeholder={`Resting level (${unitLabel.toLowerCase()})`}
                helper="When pump is OFF"
                min="0"
                disabled={sliderDisabled}
                inputStyle={{
                  backgroundColor: data.unknownDetails ? '#e5e5e5' : '#EDEDE7',
                }}
              />
              <FormInput
                label={`Water Level (Pumping) (${unitLabel})`}
                name="dynamicWaterLevel"
                type="number"
                value={data.dynamicWaterLevel}
                onChange={handleChange}
                placeholder={`Pumping level (${unitLabel.toLowerCase()})`}
                helper="When pump is ON"
                min="0"
                disabled={sliderDisabled}
                inputStyle={{
                  backgroundColor: data.unknownDetails ? '#e5e5e5' : '#EDEDE7',
                }}
              />
            </div>
          );
        })()}

        {/* Drawdown & Recharge Assessment */}
        {/* {drawdown > 0 && (
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
        )} */}
      </div>

      {/* Water Quality with Color Labels - Accessible for Color-blind Users */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Water Color/Quality</label>
        <p className="text-xs mb-3" style={{ color: '#558B2F' }}>Visual indication of water quality</p>
        <div className="grid grid-cols-2 gap-3">
          {WATER_QUALITIES.map((quality) => (
            <motion.button
              key={quality.value}
              onClick={() => handleChange({ target: { name: 'waterQuality', value: quality.value } })}
              className="p-3 rounded-lg border-2 transition-all flex items-center gap-2"
              style={{
                borderColor: data.waterQuality === quality.value ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                backgroundColor: data.waterQuality === quality.value ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="w-6 h-6 rounded shrink-0 border"
                style={{
                  backgroundColor: quality.color,
                  borderColor: data.waterQuality === quality.value ? '#689F38' : '#ccc',
                }}
              />
              <span className="text-xs font-medium" style={{ color: '#33691E' }}>{quality.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Seasonal Variance */}
      <FormInput
        label={`Seasonal Variance in Water Level (${unitLabel})`}
        name="seasonalVariance"
        type="number"
        value={data.seasonalVariance}
        onChange={handleChange}
        placeholder={`Water level drop in ${unitLabel.toLowerCase()}`}
        helper={`Expected drop in water level during dry season (${unitLabel.toLowerCase()})`}
        min="0"
      />

      {/* Casing Diameter */}
      <FormButtonGroup
        label="Bore Width"
        name="casingDiameter"
        value={data.casingDiameter}
        onChange={handleChange}
        options={CASING_DIAMETERS}
      />
    </motion.div>
  );
}

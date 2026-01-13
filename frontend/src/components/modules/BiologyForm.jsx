import { motion } from 'framer-motion';
import { Leaf, Droplet, Info, Sprout, Waves, Plus, Trash2 } from 'lucide-react';
import { FormInput, FormSelect, FormSlider, FormButtonGroup, FormToggle } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { CROP_TYPES, IRRIGATION_METHODS } from '../../constants/formConstants';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

export default function BiologyForm() {
  const { formData, updateModuleData, moduleErrors } = useFormContext();
  const data = formData.biology;
  const errors = moduleErrors?.biology || {};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateModuleData('biology', { 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    updateModuleData('biology', { [name]: parseFloat(value) });
  };

  const handleAddCrop = () => {
    const newCrops = [...(data.crops || []), { cropType: '', estimatedCount: 0 }];
    updateModuleData('biology', { crops: newCrops });
  };

  const handleRemoveCrop = (index) => {
    const newCrops = data.crops.filter((_, i) => i !== index);
    updateModuleData('biology', { crops: newCrops });
  };

  const handleCropChange = (index, field, value) => {
    const newCrops = [...data.crops];
    newCrops[index] = { ...newCrops[index], [field]: value };
    updateModuleData('biology', { crops: newCrops });
  };

  // Calculate efficiency based on method
  const currentMethod = IRRIGATION_METHODS.find(m => m.value === data.irrigationMethod);
  const efficiency = currentMethod?.efficiency || 90;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: '#689F38' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#33691E' }}>THE BIOLOGY</h2>
        <p className="text-gray-500">Crop requirements for water demand calculation.</p>
      </div>

      {/* Crops with Estimated Numbers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Crops & Estimated Count</label>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddCrop}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ backgroundColor: '#689F38', color: 'white' }}
          >
            <Plus size={14} />
            Add
          </motion.button>
        </div>

        {data.crops && data.crops.length > 0 ? (
          <div className="grid gap-3">
            {/* Column Headers */}
            <div className="grid gap-3 items-center text-xs font-semibold px-3 text-gray-600" style={{ gridTemplateColumns: '1fr 100px 40px' }}>
              <span>Crop Name</span>
              <span className="text-center">Count</span>
              <span></span>
            </div>
            {/* Crop Rows */}
            {data.crops.map((crop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-3 items-center p-3 rounded-lg border"
                style={{ gridTemplateColumns: '1fr 100px 40px', backgroundColor: '#FAFAF9', borderColor: 'rgba(104, 159, 56, 0.2)' }}
              >
                <input
                  type="text"
                  value={crop.cropType}
                  onChange={(e) => handleCropChange(index, 'cropType', e.target.value)}
                  placeholder="Crop name"
                  className="bg-transparent text-sm outline-none border-b border-gray-300 pb-1"
                  style={{ color: '#33691E' }}
                />
                <input
                  type="number"
                  value={crop.estimatedCount}
                  onChange={(e) => handleCropChange(index, 'estimatedCount', e.target.value)}
                  placeholder="0"
                  min="0"
                  className="px-2 py-1.5 text-sm text-center outline-none rounded border"
                  style={{ color: '#33691E', borderColor: 'rgba(104, 159, 56, 0.3)', backgroundColor: 'rgba(104, 159, 56, 0.05)' }}
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemoveCrop(index)}
                  className="p-1.5 rounded transition-colors justify-self-center"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}
                  title="Remove crop"
                >
                  <Trash2 size={16} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 p-3 text-center">No crops added</p>
        )}
      </div>
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Plant Spacing</label>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <input
              type="number"
              name="plantSpacing"
              value={data.plantSpacing}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: 'rgba(104, 159, 56, 0.3)', backgroundColor: '#FAFAF9', color: '#33691E' }}
            />
          </div>
          <div className="flex gap-1 bg-white rounded-lg p-1 border" style={{ borderColor: 'rgba(104, 159, 56, 0.3)' }}>
            {['feet', 'meters'].map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => handleChange({ target: { name: 'plantSpacingUnit', value: unit } })}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                  data.plantSpacingUnit === unit ? 'text-white' : 'text-gray-600'
                }`}
                style={{
                  backgroundColor: data.plantSpacingUnit === unit ? '#689F38' : 'transparent',
                }}
              >
                {unit === 'feet' ? 'ft' : 'm'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tractor Access */}
      <FormToggle
        label="Tractor Access Requirement (Wider Paths)"
        name="tractorAccessRequirement"
        checked={data.tractorAccessRequirement}
        onChange={handleChange}
      />

      <FormButtonGroup
        label="Crop Age/Maturity"
        name="cropAge"
        value={data.cropAge}
        onChange={handleChange}
        options={[
          { value: 'sapling', label: 'Sapling (0-2 yrs)' },
          { value: 'young', label: 'Young (2-5 yrs)' },
          { value: 'mature', label: 'Mature (5+ yrs)' },
        ]}
      />

      {/* Water Demand */}
      <FormInput
        label="Peak Water Demand"
        name="peakWaterDemand"
        id="field-biology-peakWaterDemand"
        type="number"
        value={data.peakWaterDemand}
        onChange={handleChange}
        placeholder="Liters Per Day (LPD)"
        icon={Droplet}
        helper="Total water requirement during peak season"
        // required
        error={errors.peakWaterDemand}
        min="0"
      />

      {/* Irrigation Method */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#689F38' }}>
          Irrigation Method
        </label>
        <div className="grid grid-cols-3 gap-3">
          {IRRIGATION_METHODS.map((method) => (
            <motion.button
              key={method.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChange({ target: { name: 'irrigationMethod', value: method.value } })}
              className={`
                p-4 rounded-xl text-center transition-all duration-200
                ${data.irrigationMethod === method.value
                  ? 'text-white shadow-lg'
                  : 'bg-white/80 text-gray-600 border-2'
                }
              `}
              style={data.irrigationMethod === method.value
                ? { backgroundColor: '#689F38' }
                : { borderColor: 'rgba(104, 159, 56, 0.2)' }
              }
            >
              <span className="block mb-2 flex justify-center">
                {method.value === 'drip' ? (
                  <Droplet size={24} strokeWidth={ICON_STROKE_WIDTH} color={data.irrigationMethod === method.value ? 'white' : ICON_COLOR} />
                ) : method.value === 'sprinkler' ? (
                  <Sprout size={24} strokeWidth={ICON_STROKE_WIDTH} color={data.irrigationMethod === method.value ? 'white' : ICON_COLOR} />
                ) : (
                  <Waves size={24} strokeWidth={ICON_STROKE_WIDTH} color={data.irrigationMethod === method.value ? 'white' : ICON_COLOR} />
                )}
              </span>
              <span className="text-sm font-medium block">{method.label}</span>
              <span className={`text-xs ${data.irrigationMethod === method.value ? 'text-white/80' : 'text-gray-500'}`}>
                {method.efficiency}% efficiency
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Efficiency Display */}
      <motion.div
        className="p-4 rounded-xl border"
        style={{ backgroundColor: 'rgba(104, 159, 56, 0.08)', borderColor: 'rgba(104, 159, 56, 0.2)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Irrigation Efficiency</span>
          <span className="text-lg font-bold" style={{ color: '#689F38' }}>{efficiency}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full"
            style={{ background: 'linear-gradient(to right, #B8D888, #689F38)' }}
            initial={{ width: 0 }}
            animate={{ width: `${efficiency}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Zones */}
      <FormSlider
        label="Number of Irrigation Zones"
        name="numberOfZones"
        value={data.numberOfZones}
        onChange={handleSliderChange}
        min={1}
        max={10}
        step={1}
        unit=" zones"
      />

      {/* Filtration Need */}
      <FormToggle
        label="Filter Needed?"
        name="filtrationRequired"
        checked={data.filtrationRequired}
        onChange={handleChange}
      />

      {/* Liquid Fertilizer / Slurry */}
      <FormToggle
        label="Do you add liquid fertilizer?"
        name="liquidFertilizerUsage"
        checked={data.liquidFertilizerUsage}
        onChange={handleChange}
      />
    </motion.div>
  );
}

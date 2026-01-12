import { motion } from 'framer-motion';
import { Leaf, Droplet, Info, CloudRain, Waves, Plus, Trash2 } from 'lucide-react';
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
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#689F38', color: 'white' }}
          >
            <Plus size={16} />
            Add Crop
          </motion.button>
        </div>

        {data.crops && data.crops.length > 0 ? (
          <div className="space-y-2">
            {data.crops.map((crop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-2 items-end p-3 rounded-lg"
                style={{ gridTemplateColumns: '1fr 100px 40px', backgroundColor: 'rgba(104, 159, 56, 0.08)', border: '1px solid rgba(104, 159, 56, 0.2)' }}
              >
                <FormInput
                  label="Crop Name"
                  type="text"
                  value={crop.cropType}
                  onChange={(e) => handleCropChange(index, 'cropType', e.target.value)}
                  placeholder="Enter crop name"
                />
                <FormInput
                  label="Est. Count"
                  type="number"
                  value={crop.estimatedCount}
                  onChange={(e) => handleCropChange(index, 'estimatedCount', e.target.value)}
                  placeholder="Number"
                  min="0"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemoveCrop(index)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}
                  title="Remove crop"
                >
                  <Trash2 size={18} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 p-3">No crops added yet. Click "Add Crop" to get started.</p>
        )}
      </div>
      <FormInput
        label="Plant Spacing"
        name="plantSpacing"
        type="number"
        value={data.plantSpacing}
        onChange={handleChange}
        placeholder="Spacing in feet"
        min="0"
      />

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
                  <CloudRain size={24} strokeWidth={ICON_STROKE_WIDTH} color={data.irrigationMethod === method.value ? 'white' : ICON_COLOR} />
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

      {/* Discharge Requirement */}
      <FormInput
        label="Required Discharge"
        name="requiredDischarge"
        type="number"
        value={data.requiredDischarge}
        onChange={handleChange}
        placeholder="LPM (Liters Per Minute)"
        helper="Calculated: Demand / Power Hours"
        min="0"
      />

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
        label="Do You Need Filtration?"
        name="filtrationRequired"
        checked={data.filtrationRequired}
        onChange={handleChange}
      />

      {/* Filtration Type - Conditional */}
      {data.filtrationRequired && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <FormButtonGroup
            label="Filtration Type"
            name="filtrationRequirement"
            value={data.filtrationRequirement}
            onChange={handleChange}
            options={[
              { value: 'screen', label: 'Screen Filter' },
              { value: 'disc', label: 'Disc Filter' },
              { value: 'hydrocyclone', label: 'Hydrocyclone' },
              { value: 'sand', label: 'Sand Filter' },
              { value: 'other', label: 'Other' },
            ]}
          />
        </motion.div>
      )}

      {/* Fertigation */}
      <FormToggle
        label="Slurry/Fertigation Usage (Vortex Impeller Need)"
        name="slurryFertigationUsage"
        checked={data.slurryFertigationUsage}
        onChange={handleChange}
      />

      {/* Zone Calculator Card */}
      {data.numberOfZones > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 rounded-xl border border-blue-200"
        >
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Zone Information</h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-white rounded-lg">
              <p className="text-xs text-gray-500">Valves Required</p>
              <p className="text-lg font-bold text-blue-600">{data.numberOfZones}</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-xs text-gray-500">Per Zone Flow</p>
              <p className="text-lg font-bold text-blue-600">
                {data.requiredDischarge ? Math.round(data.requiredDischarge / data.numberOfZones) : '--'} LPM
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

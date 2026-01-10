import { motion } from 'framer-motion';
import { MapPin, Ruler, Mountain, Info, Upload, Navigation2 } from 'lucide-react';
import { FormInput, FormSelect, FormSlider, FormButtonGroup, FormColorPicker } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { SOIL_TYPES, TOPOGRAPHY_TYPES, FIELD_GEOMETRIES } from '../../constants/formConstants';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

const UNIT_SYSTEMS = [
  { value: 'feet', label: 'Feet' },
  { value: 'meters', label: 'Meters' },
];

export default function CanvasForm() {
  const { formData, updateModuleData, moduleErrors } = useFormContext();
  const data = formData.canvas;
  const errors = moduleErrors?.canvas || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateModuleData('canvas', { [name]: value });
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    updateModuleData('canvas', { [name]: parseFloat(value) });
  };

  const convertLength = (value, from, to) => {
    if (!value) return '';
    if (from === to) return value;
    if (from === 'feet' && to === 'meters') return (value / 3.28084).toFixed(2);
    if (from === 'meters' && to === 'feet') return (value * 3.28084).toFixed(2);
    return value;
  };

  const unitLabel = data.unitSystem === 'meters' ? 'Meters' : 'Feet';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: '#689F38' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#33691E' }}>YOUR LAND</h2>
        <p style={{ color: '#558B2F' }}>Map your physical reality for precision irrigation.</p>
      </div>

      {/* Unit System Selection */}
      <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(104, 159, 56, 0.1)', border: '2px solid rgba(104, 159, 56, 0.2)' }}>
        <FormButtonGroup
          label="Measurement Unit"
          name="unitSystem"
          value={data.unitSystem || 'feet'}
          onChange={handleChange}
          options={UNIT_SYSTEMS}
        />
      </div>

      {/* Area & Dimensions */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Total Land Area"
          name="totalArea"
          type="number"
          value={data.totalArea}
          onChange={handleChange}
          placeholder="Area in acres"
          icon={Ruler}
          required
          error={errors.totalArea}
        />
        <FormInput
          label="Length"
          name="sideLength"
          type="number"
          value={data.sideDimensions?.length || ''}
          onChange={(e) => updateModuleData('canvas', { 
            sideDimensions: { ...data.sideDimensions, length: e.target.value }
          })}
          placeholder={unitLabel}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Width"
          name="sideWidth"
          type="number"
          value={data.sideDimensions?.width || ''}
          onChange={(e) => updateModuleData('canvas', { 
            sideDimensions: { ...data.sideDimensions, width: e.target.value }
          })}
          placeholder={unitLabel}
        />
      </div>

      {/* Field Geometry - Visual Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Field Geometry</label>
        <div className="grid grid-cols-3 gap-3">
          {FIELD_GEOMETRIES.map((geometry) => (
            <motion.button
              key={geometry.value}
              onClick={() => handleChange({ target: { name: 'fieldGeometry', value: geometry.value } })}
              className="p-4 rounded-lg border-2 transition-all"
              style={{
                borderColor: data.fieldGeometry === geometry.value ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                backgroundColor: data.fieldGeometry === geometry.value ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col items-center gap-2">
                {geometry.value === 'rectangular' && (
                  <div className="w-8 h-5 rounded-sm border-2" style={{ borderColor: '#689F38' }} />
                )}
                {geometry.value === 'square' && (
                  <div className="w-6 h-6 rounded-sm border-2" style={{ borderColor: '#689F38' }} />
                )}
                {geometry.value === 'circular' && (
                  <div className="w-6 h-6 rounded-full border-2" style={{ borderColor: '#689F38' }} />
                )}
                {geometry.value === 'irregular' && (
                  <div 
                    className="w-6 h-6 border-2"
                    style={{ 
                      borderColor: '#689F38',
                      borderRadius: '30% 70% 60% 40%'
                    }} 
                  />
                )}
                <span className="text-xs font-semibold" style={{ color: '#33691E' }}>{geometry.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Topography */}
      <FormButtonGroup
        label="Terrain Type"
        name="topographyType"
        value={data.topographyType}
        onChange={handleChange}
        options={TOPOGRAPHY_TYPES}
      />

      {/* Soil Type with Visual */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Soil Texture (Top Layer)</label>
        <div className="grid grid-cols-2 gap-3">
          {SOIL_TYPES.map((soil) => (
            <motion.button
              key={soil.value}
              onClick={() => handleChange({ target: { name: 'soilTextureTop', value: soil.value } })}
              className="p-3 rounded-lg border-2 transition-all flex items-center gap-3"
              style={{
                borderColor: data.soilTextureTop === soil.value ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                backgroundColor: data.soilTextureTop === soil.value ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="w-8 h-8 rounded-lg flex-shrink-0" 
                style={{ backgroundColor: soil.color }} 
              />
              <span className="text-sm font-medium text-left" style={{ color: '#33691E' }}>{soil.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Drainage - Binary */}
      <FormButtonGroup
        label="Drainage Condition"
        name="drainageClass"
        value={data.drainageClass}
        onChange={handleChange}
        options={[
          { value: 'good', label: 'Good (Well Drained)' },
          { value: 'poor', label: 'Poor (Waterlogging Risk)' },
        ]}
      />

      {/* Unused Land */}
      <FormSlider
        label="Approximately how much of your land is unused?"
        name="exclusionZones"
        value={data.exclusionZones}
        onChange={handleSliderChange}
        min={0}
        max={100}
        step={5}
        unit="%"
      />

      {/* Soil Testing Status */}
      <div className="border-t pt-5">
        <FormButtonGroup
          label="Has Your Soil Been Tested?"
          name="soilTestStatus"
          value={data.soilTestStatus}
          onChange={handleChange}
          options={[
            { value: 'done', label: 'Testing Done' },
            { value: 'required', label: 'Testing Required' },
          ]}
        />
      </div>

      {/* Conditional: If testing done - upload report */}
      {data.soilTestStatus === 'done' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-lg border-2 border-dashed" 
          style={{ borderColor: 'rgba(104, 159, 56, 0.5)', backgroundColor: 'rgba(104, 159, 56, 0.05)' }}
        >
          <label className="flex items-center justify-center gap-2 cursor-pointer">
            <Upload size={18} color="#689F38" />
            <span className="text-sm font-medium" style={{ color: '#33691E' }}>
              {data.soilTestReport ? `✓ ${data.soilTestReport.name}` : 'Upload Soil Test Report (PDF/Image)'}
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  updateModuleData('canvas', { soilTestReport: e.target.files[0] });
                }
              }}
            />
          </label>
        </motion.div>
      )}

      {/* Road Access */}
      <div className="border-t pt-5">
        <FormButtonGroup
          label="Farm Road Accessibility"
          name="roadAccessible"
          value={data.roadAccessible}
          onChange={handleChange}
          options={[
            { value: 'yes', label: 'Yes, accessible by road' },
            { value: 'no', label: 'No, far from main road' },
          ]}
        />
      </div>

      {/* Conditional: If not accessible - ask distance */}
      {data.roadAccessible === 'no' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          <FormSlider
            label="Distance from Main Road"
            name="roadAccessDistance"
            value={data.roadAccessDistance}
            onChange={handleSliderChange}
            min={0}
            max={10}
            step={0.5}
            unit=" km"
          />
          <div className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <Navigation2 size={18} color="#EF4444" />
            <span className="text-xs" style={{ color: '#DC2626' }}>Remote locations may affect equipment transportation and installation timeline.</span>
          </div>
        </motion.div>
      )}

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 rounded-xl"
        style={{ backgroundColor: 'rgba(104, 159, 56, 0.1)', border: '2px solid rgba(104, 159, 56, 0.2)' }}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(104, 159, 56, 0.15)' }}>
            <Info size={20} strokeWidth={ICON_STROKE_WIDTH} style={{ color: ICON_COLOR }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: '#33691E' }}>Land Analysis</h4>
            <p className="text-xs mt-1" style={{ color: '#558B2F' }}>
              Soil texture determines infiltration rate and pipe material selection. Terrain and 
              drainage affect water availability and system design. Road access impacts equipment delivery.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

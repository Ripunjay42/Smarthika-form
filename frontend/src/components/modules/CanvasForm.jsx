import { motion } from 'framer-motion';
import { MapPin, Ruler, Mountain, Info, Upload, Navigation2, Droplets, TrendingDown, Layers, TrendingUp, AlertCircle, CheckCircle2, Beaker } from 'lucide-react';
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

  const handleSoilTextureSelect = (value) => {
    let current = data.soilTextureTop || [];
    if (typeof current === 'string') {
      current = current ? [current] : [];
    }
    
    if (current.includes(value)) {
      // Don't allow unselecting the last soil
      if (current.length === 1) return;
      
      const updated = current.filter(v => v !== value);
      updateModuleData('canvas', { soilTextureTop: updated });
    } else {
      const updated = [...current, value];
      updateModuleData('canvas', { soilTextureTop: updated });
    }
  };

  // Handle soil test report file upload
  const handleSoilTestReportChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateModuleData('canvas', {
        soilTestReport: reader.result, // base64 string
        soilTestReportFile: file.name,
        soilTestReportType: file.type || 'application/octet-stream'
      });
    };
    reader.readAsDataURL(file);
  };

  const unitLabel = data.unitSystem === 'meters' ? 'Meters' : 'Feet';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with Unit Selection */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: '#689F38' }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#33691E' }}>YOUR LAND</h2>
            <p style={{ color: '#558B2F' }}>Map your physical reality for precision irrigation.</p>
          </div>
          <div className="flex-shrink-0 pt-1">
            <div className="flex flex-col items-end gap-2">
              <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#33691E' }}>Measurement Unit</label>
              <div className="flex gap-2">
                {UNIT_SYSTEMS.map((unit) => (
                  <motion.button
                    key={unit.value}
                    onClick={() => handleChange({ target: { name: 'unitSystem', value: unit.value } })}
                    className="px-4 py-2 rounded-lg border-2 font-semibold transition-all text-sm"
                    style={{
                      borderColor: data.unitSystem === unit.value ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                      backgroundColor: data.unitSystem === unit.value ? '#689F38' : 'transparent',
                      color: data.unitSystem === unit.value ? '#EDEDE7' : '#33691E',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {unit.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Area & Dimensions */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Total Land Area (acres)"
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
          label="Length (Optional)"
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
          label="Width (Optional)"
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

      {/* Topography with Icons */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Terrain Type</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'flat', label: 'Flat', icon: Layers },
            { value: 'sloped', label: 'Sloped', icon: TrendingUp },
            { value: 'hilly', label: 'Hilly', icon: Mountain },
          ].map((terrain) => {
            const TerrainIcon = terrain.icon;
            return (
              <motion.button
                key={terrain.value}
                onClick={() => handleChange({ target: { name: 'topographyType', value: terrain.value } })}
                className="p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2"
                style={{
                  borderColor: data.topographyType === terrain.value ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                  backgroundColor: data.topographyType === terrain.value ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TerrainIcon size={28} color={data.topographyType === terrain.value ? '#689F38' : '#558B2F'} strokeWidth={1.5} />
                <span className="text-xs font-semibold" style={{ color: '#33691E' }}>{terrain.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Soil Type with Visual - Multiple Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Soil Texture (Top Layer)</label>
        <p className="text-xs" style={{ color: '#558B2F' }}>Select one or more soil types present</p>
        <div className="grid grid-cols-2 gap-3">
          {SOIL_TYPES.map((soil) => {
            const isSelected = Array.isArray(data.soilTextureTop) 
              ? data.soilTextureTop.includes(soil.value)
              : data.soilTextureTop === soil.value;
            
            // Restrict unselecting the last soil - disable if it's the only one selected
            const soilArray = Array.isArray(data.soilTextureTop) ? data.soilTextureTop : (data.soilTextureTop ? [data.soilTextureTop] : []);
            const isLastSoil = isSelected && soilArray.length === 1;
            
            return (
              <motion.button
                key={soil.value}
                onClick={() => !isLastSoil && handleSoilTextureSelect(soil.value)}
                disabled={isLastSoil}
                className="p-3 rounded-lg border-2 transition-all flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  borderColor: isSelected ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                  backgroundColor: isSelected ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
                }}
                whileHover={!isLastSoil ? { scale: 1.02 } : {}}
                whileTap={!isLastSoil ? { scale: 0.98 } : {}}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center" 
                  style={{ 
                    backgroundColor: soil.color,
                    border: isSelected ? '2px solid #689F38' : 'none'
                  }} 
                >
                  {isSelected && (
                    <CheckCircle2 size={16} color="#FAF0BF" strokeWidth={2} />
                  )}
                </div>
                <span className="text-sm font-medium text-left" style={{ color: '#33691E' }}>{soil.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Drainage Condition with Icons */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Drainage Condition</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'good', label: 'Good (Well Drained)', icon: TrendingDown },
            { value: 'poor', label: 'Poor (Waterlogging)', icon: Droplets },
          ].map((drainage) => {
            const DrainageIcon = drainage.icon;
            return (
              <motion.button
                key={drainage.value}
                onClick={() => handleChange({ target: { name: 'drainageClass', value: drainage.value } })}
                className="p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2"
                style={{
                  borderColor: data.drainageClass === drainage.value ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                  backgroundColor: data.drainageClass === drainage.value ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <DrainageIcon size={24} color={data.drainageClass === drainage.value ? '#689F38' : '#558B2F'} />
                <span className="text-xs font-semibold text-center" style={{ color: '#33691E' }}>{drainage.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

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

      {/* Soil Testing Status with Icon */}
      <div className="border-t pt-5">
        <div className="space-y-3">
          <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Has Your Soil Been Tested?</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'done', label: 'Testing Done', icon: CheckCircle2 },
              { value: 'required', label: 'Testing Required', icon: Beaker },
            ].map((test) => {
              const TestIcon = test.icon;
              return (
                <motion.button
                  key={test.value}
                  onClick={() => handleChange({ target: { name: 'soilTestStatus', value: test.value } })}
                  className="p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2"
                  style={{
                    borderColor: data.soilTestStatus === test.value ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                    backgroundColor: data.soilTestStatus === test.value ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <TestIcon size={28} color={data.soilTestStatus === test.value ? '#689F38' : '#558B2F'} strokeWidth={1.5} />
                  <span className="text-xs font-semibold text-center" style={{ color: '#33691E' }}>{test.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
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
              {data.soilTestReportFile ? `✓ ${data.soilTestReportFile}` : 'Upload Soil Test Report (PDF/Image)'}
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png" 
              onChange={handleSoilTestReportChange}
            />
          </label>
        </motion.div>
      )}

      {/* Conditional: If testing required - ask if should proceed with testing */}
      {data.soilTestStatus === 'required' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(104, 159, 56, 0.1)', border: '2px solid rgba(104, 159, 56, 0.2)' }}>
            <label className="block text-sm font-semibold mb-3" style={{ color: '#33691E' }}>Should we proceed with soil testing?</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'yes', label: 'Yes, Proceed with Testing', icon: CheckCircle2 },
                { value: 'no', label: 'No, Skip Testing', icon: AlertCircle },
              ].map((option) => {
                const OptionIcon = option.icon;
                return (
                  <motion.button
                    key={option.value}
                    onClick={() => handleChange({ target: { name: 'soilTestRequired', value: option.value } })}
                    className="p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2"
                    style={{
                      borderColor: data.soilTestRequired === option.value ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                      backgroundColor: data.soilTestRequired === option.value ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <OptionIcon size={24} color={data.soilTestRequired === option.value ? '#689F38' : '#558B2F'} strokeWidth={1.5} />
                    <span className="text-xs font-semibold text-center" style={{ color: '#33691E' }}>{option.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
          {/* {data.soilTestRequired === 'yes' && (
            <div className="p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: 'rgba(104, 159, 56, 0.1)', border: '1px solid rgba(104, 159, 56, 0.3)' }}>
              <Beaker size={18} color="#689F38" className="flex-shrink-0 mt-0.5" />
              <span className="text-xs" style={{ color: '#558B2F' }}>Professional soil testing will help determine soil properties, nutrient levels, and recommendations for optimal irrigation system design.</span>
            </div>
          )} */}
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
    </motion.div>
  );
}

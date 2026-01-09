import { motion } from 'framer-motion';
import { MapPin, Ruler, Mountain, Info } from 'lucide-react';
import { FormInput, FormSelect, FormSlider, FormButtonGroup, FormColorPicker } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { SOIL_TYPES, TOPOGRAPHY_TYPES, FIELD_GEOMETRIES } from '../../constants/formConstants';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

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

      {/* GPS Coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="GPS Latitude"
          name="gpsLatitude"
          value={data.gpsLatitude}
          onChange={handleChange}
          placeholder="e.g. 12.9716"
          icon={MapPin}
        />
        <FormInput
          label="GPS Longitude"
          name="gpsLongitude"
          value={data.gpsLongitude}
          onChange={handleChange}
          placeholder="e.g. 77.5946"
          icon={MapPin}
        />
      </div>

      {/* Area & Perimeter */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Total Land Area"
          name="totalArea"
          type="number"
          value={data.totalArea}
          onChange={handleChange}
          placeholder="Acres"
          icon={Ruler}
          required
          error={errors.totalArea}
        />
        <FormInput
          label="Perimeter Length"
          name="perimeterLength"
          type="number"
          value={data.perimeterLength}
          onChange={handleChange}
          placeholder="Feet"
          icon={Ruler}
        />
      </div>

      {/* Field Geometry */}
      <FormButtonGroup
        label="Field Geometry"
        name="fieldGeometry"
        value={data.fieldGeometry}
        onChange={handleChange}
        options={FIELD_GEOMETRIES}
      />

      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Length"
          name="sideLength"
          type="number"
          value={data.sideDimensions?.length || ''}
          onChange={(e) => updateModuleData('canvas', { 
            sideDimensions: { ...data.sideDimensions, length: e.target.value }
          })}
          placeholder="Feet"
        />
        <FormInput
          label="Width"
          name="sideWidth"
          type="number"
          value={data.sideDimensions?.width || ''}
          onChange={(e) => updateModuleData('canvas', { 
            sideDimensions: { ...data.sideDimensions, width: e.target.value }
          })}
          placeholder="Feet"
        />
      </div>

      {/* Topography */}
      <FormButtonGroup
        label="Topography Type"
        name="topographyType"
        value={data.topographyType}
        onChange={handleChange}
        options={TOPOGRAPHY_TYPES}
      />

      {/* Slope */}
      {data.topographyType !== 'flat' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <FormSlider
            label="Slope Percentage"
            name="slopePercentage"
            value={data.slopePercentage}
            onChange={handleSliderChange}
            min={0}
            max={30}
            step={1}
            unit="%"
          />
        </motion.div>
      )}

      {/* Soil Type */}
      <FormColorPicker
        label="Soil Texture (Top Layer)"
        name="soilTextureTop"
        value={data.soilTextureTop}
        onChange={handleChange}
        options={SOIL_TYPES}
      />

      {/* Drainage */}
      <FormButtonGroup
        label="Drainage Class"
        name="drainageClass"
        value={data.drainageClass}
        onChange={handleChange}
        options={[
          { value: 'excellent', label: 'Excellent' },
          { value: 'good', label: 'Good' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'poor', label: 'Poor (Waterlogging Risk)' },
        ]}
      />

      {/* Exclusion & Cultivable */}
      <FormSlider
        label="Exclusion Zones"
        name="exclusionZones"
        value={data.exclusionZones}
        onChange={handleSliderChange}
        min={0}
        max={50}
        step={1}
        unit="% (Rocky/Waste Area)"
      />

      {/* Road Access */}
      <FormInput
        label="Road Access Distance"
        name="roadAccessDistance"
        type="number"
        value={data.roadAccessDistance}
        onChange={handleChange}
        placeholder="Distance to main road (km)"
      />

      {/* Soil Test */}
      <FormButtonGroup
        label="Soil Test Status"
        name="soilTestStatus"
        value={data.soilTestStatus}
        onChange={handleChange}
        options={[
          { value: 'has-report', label: 'Has Report' },
          { value: 'needs-kit', label: 'Needs Testing Kit' },
        ]}
      />

      {/* Soil pH & EC */}
      <div className="grid grid-cols-2 gap-4">
        <FormSlider
          label="Soil pH"
          name="soilPH"
          value={data.soilPH}
          onChange={handleSliderChange}
          min={4}
          max={10}
          step={0.1}
        />
        <FormSlider
          label="Soil EC (Salinity)"
          name="soilEC"
          value={data.soilEC}
          onChange={handleSliderChange}
          min={0}
          max={4}
          step={0.1}
          unit=" dS/m"
        />
      </div>

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
              GPS coordinates enable solar angle calculation and weather data. Soil texture 
              determines infiltration rate and pipe material selection.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

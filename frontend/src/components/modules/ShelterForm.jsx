import { motion } from 'framer-motion';
import { House, WifiHigh, Wifi, WifiLow, WifiOff, Shield, Info, Warehouse, Sun, TriangleAlert } from 'lucide-react';
import { FormButtonGroup, FormToggle } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { SHELTER_TYPES } from '../../constants/formConstants';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

export default function ShelterForm() {
  const { formData, updateModuleData } = useFormContext();
  const data = formData.shelter;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateModuleData('shelter', { 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateModuleData('shelter', {
          pumpHousePicture: event.target.result,
          pumpHousePictureFile: file.name,
          pumpHousePictureType: file.type || 'application/octet-stream'
        });
      };
      reader.readAsDataURL(file);
    }
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
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#33691E' }}>THE SHELTER</h2>
        <p className="text-gray-500">Installation logistics and safety planning.</p>
      </div>

      {/* Shelter Type */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#689F38' }}>
          Shelter Structure
        </label>
        <div className="grid grid-cols-3 gap-3">
          {SHELTER_TYPES.map((type) => (
            <motion.button
              key={type.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChange({ target: { name: 'shelterStructure', value: type.value } })}
              className={`
                p-4 rounded-xl text-center transition-all duration-200
                ${data.shelterStructure === type.value
                  ? 'text-white shadow-lg'
                  : 'bg-white/80 text-gray-600 border-2'
                }
              `}
              style={data.shelterStructure === type.value 
                ? { backgroundColor: '#689F38' }
                : { borderColor: 'rgba(104, 159, 56, 0.2)' }
              }
            >
              <span className="block mb-2 flex justify-center">
                {type.value === 'concrete' ? (
                  <House size={24} strokeWidth={ICON_STROKE_WIDTH} color={data.shelterStructure === type.value ? 'white' : ICON_COLOR} />
                ) : type.value === 'tin' ? (
                  <Warehouse size={24} strokeWidth={ICON_STROKE_WIDTH} color={data.shelterStructure === type.value ? 'white' : ICON_COLOR} />
                ) : (
                  <Sun size={24} strokeWidth={ICON_STROKE_WIDTH} color={data.shelterStructure === type.value ? 'white' : ICON_COLOR} />
                )}
              </span>
              <span className="text-sm font-medium">{type.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Heat Risk */}
      {data.shelterStructure === 'tin' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-yellow-50 rounded-xl border border-yellow-200"
        >
          <FormButtonGroup
            label="Heat Buildup Risk"
            name="heatBuildupRisk"
            value={data.heatBuildupRisk}
            onChange={handleChange}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High (Fan Needed)' },
            ]}
          />
        </motion.div>
      )}

      {/* Signal Strength */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#689F38' }}>
          Mobile Signal Strength
        </label>
        <div className="grid grid-cols-4 gap-3">
          {[
            { value: '4g', label: '4G', icon: WifiHigh },
            { value: '3g', label: '3G', icon: Wifi },
            { value: '2g', label: '2G', icon: WifiLow },
            { value: 'none', label: 'None', icon: WifiOff },
          ].map((signal) => {
            const IconComponent = signal.icon;
            return (
              <motion.button
                key={signal.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChange({ target: { name: 'mobileSignalStrength', value: signal.value } })}
                className={`
                  p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-200
                  ${data.mobileSignalStrength === signal.value
                    ? 'text-white shadow-lg'
                    : 'bg-white/80 text-gray-600 border-2'
                  }
                `}
                style={data.mobileSignalStrength === signal.value
                  ? { backgroundColor: '#689F38' }
                  : { borderColor: 'rgba(104, 159, 56, 0.2)' }
                }
              >
                <IconComponent 
                  size={24} 
                  strokeWidth={ICON_STROKE_WIDTH} 
                  color={data.mobileSignalStrength === signal.value ? 'white' : '#689F38'}
                />
                <span className="text-xs font-medium">{signal.label}</span>
              </motion.button>
            );
          })}
        </div>
        {data.mobileSignalStrength === 'none' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-500 mt-2 flex items-center gap-2"
          >
            <TriangleAlert size={14} strokeWidth={ICON_STROKE_WIDTH} className="text-red-500" />
            GSM/IoT features will not be available
          </motion.p>
        )}
      </div>

      {/* Security Section */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Shield size={20} strokeWidth={ICON_STROKE_WIDTH} />
          <span className="font-medium">Security & Safety</span>
        </div>

        <FormButtonGroup
          label="Theft Risk Level"
          name="theftRiskLevel"
          value={data.theftRiskLevel}
          onChange={handleChange}
          options={[
            { value: 'safe', label: 'Safe Area' },
            { value: 'high', label: 'High Risk' },
          ]}
        />

        <FormButtonGroup
          label="Lightning Arrestor"
          name="lightningArrestor"
          value={data.lightningArrestor}
          onChange={handleChange}
          options={[
            { value: 'present', label: 'Present' },
            { value: 'absent', label: 'Absent' },
          ]}
        />

        <FormButtonGroup
          label="Earthing Pit"
          name="earthingPit"
          value={data.earthingPit}
          onChange={handleChange}
          options={[
            { value: 'present', label: 'Present' },
            { value: 'absent', label: 'Absent' },
          ]}
        />
      </div>

      {/* Installation */}
      <FormButtonGroup
        label="Installation Preference"
        name="installationPreference"
        value={data.installationPreference}
        onChange={handleChange}
        options={[
          { value: 'self', label: 'Self Installation' },
          { value: 'expert', label: 'Expert Team' },
        ]}
      />

      {/* Lifting Gear Availability */}
      <FormButtonGroup
        label="Lifting Gear Availability"
        name="liftingGearAvailability"
        value={data.liftingGearAvailability}
        onChange={handleChange}
        options={[
          { value: 'chain-pulley', label: 'Chain Pulley' },
          { value: 'manual', label: 'Manual Lift' },
        ]}
      />

      {/* Pump House Picture Upload */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: '#33691E' }}>Pump House Picture</label>
        <input
          type="file"
          name="pumpHousePicture"
          accept="image/*"
          onChange={(e) => handleFileChange(e)}
          className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:outline-none"
        />
        <p className="text-xs text-gray-500 mt-1">Upload a photo of the pump house for reference</p>
      </div>

      {/* Safety Alerts */}
      {(data.lightningArrestor === 'absent' || data.earthingPit === 'absent') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 rounded-xl border border-red-200"
        >
          <p className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
            <TriangleAlert size={16} strokeWidth={ICON_STROKE_WIDTH} className="text-red-700" />
            Safety Recommendations
          </p>
          <ul className="text-xs text-red-600 space-y-1">
            {data.lightningArrestor === 'absent' && (
              <li>• Lightning arrestor installation recommended for equipment protection</li>
            )}
            {data.earthingPit === 'absent' && (
              <li>• Earthing pit required for safe electrical installation</li>
            )}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}

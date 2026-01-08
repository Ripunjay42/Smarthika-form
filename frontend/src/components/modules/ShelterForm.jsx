import { motion } from 'framer-motion';
import { House, WifiHigh, Shield, Info } from '@phosphor-icons/react';
import { FormButtonGroup, FormToggle } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { SHELTER_TYPES } from '../../constants/formConstants';

export default function ShelterForm() {
  const { formData, updateModuleData } = useFormContext();
  const data = formData.shelter;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateModuleData('shelter', { 
      [name]: type === 'checkbox' ? checked : value 
    });
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
              <span className="text-2xl block mb-2">
                {type.value === 'concrete' ? '🏠' : type.value === 'tin' ? '🏚️' : '☀️'}
              </span>
              <span className="text-sm font-medium">{type.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* IP Rating */}
      <FormButtonGroup
        label="IP Rating Requirement"
        name="ipRatingRequirement"
        value={data.ipRatingRequirement}
        onChange={handleChange}
        options={[
          { value: 'IP54', label: 'IP54 (Dust Protected)' },
          { value: 'IP65', label: 'IP65 (Water Resistant)' },
        ]}
      />

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

      {/* Wall Space */}
      <FormButtonGroup
        label="Wall Space Available"
        name="wallSpaceAvailable"
        value={data.wallSpaceAvailable}
        onChange={handleChange}
        options={[
          { value: 'standard', label: 'Standard Box' },
          { value: 'slimline', label: 'Slimline Only' },
        ]}
      />

      {/* Signal Strength */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#689F38' }}>
          Mobile Signal Strength
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: '4g', label: '4G', bars: 4 },
            { value: '3g', label: '3G', bars: 3 },
            { value: '2g', label: '2G', bars: 2 },
            { value: 'none', label: 'None', bars: 0 },
          ].map((signal) => (
            <motion.button
              key={signal.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChange({ target: { name: 'mobileSignalStrength', value: signal.value } })}
              className={`
                p-3 rounded-xl flex flex-col items-center gap-2 transition-all duration-200
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
              <div className="flex items-end gap-0.5 h-5">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1.5 rounded-sm ${
                      bar <= signal.bars 
                        ? data.mobileSignalStrength === signal.value ? 'bg-white' : ''
                        : 'bg-gray-300'
                    }`}
                    style={bar <= signal.bars && data.mobileSignalStrength !== signal.value ? { backgroundColor: '#689F38' } : {}}
                  />
                ))}
              </div>
              <span className="text-xs font-medium">{signal.label}</span>
            </motion.button>
          ))}
        </div>
        {data.mobileSignalStrength === 'none' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-500 mt-2"
          >
            ⚠️ GSM/IoT features will not be available
          </motion.p>
        )}
      </div>

      {/* Security Section */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Shield size={20} />
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

        {data.theftRiskLevel === 'high' && (
          <FormToggle
            label="Anti-Theft Hardware (Lockable Box/Nuts)"
            name="antiTheftHardwareNeed"
            checked={data.antiTheftHardwareNeed}
            onChange={handleChange}
          />
        )}

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

      <FormButtonGroup
        label="Lifting Gear Availability"
        name="liftingGearAvailability"
        value={data.liftingGearAvailability}
        onChange={handleChange}
        options={[
          { value: 'chain-pulley', label: 'Chain Pulley' },
          { value: 'manual', label: 'Manual Only' },
        ]}
      />

      <FormButtonGroup
        label="Site Accessibility"
        name="siteAccessibility"
        value={data.siteAccessibility}
        onChange={handleChange}
        options={[
          { value: 'truck', label: 'Truck Accessible' },
          { value: 'manual', label: 'Manual Carry Only' },
        ]}
      />

      {/* Safety Alerts */}
      {(data.lightningArrestor === 'absent' || data.earthingPit === 'absent') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 rounded-xl border border-red-200"
        >
          <p className="text-sm font-medium text-red-700 mb-2">⚠️ Safety Recommendations</p>
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
            <Info className="w-5 h-5" style={{ color: '#689F38' }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: '#33691E' }}>Installation Planning</h4>
            <p className="text-xs mt-1" style={{ color: '#558B2F' }}>
              Shelter type determines enclosure rating. Signal strength enables IoT 
              monitoring. Site accessibility affects installation logistics and cost.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

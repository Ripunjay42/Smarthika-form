import { motion } from 'framer-motion';
import { Lightning, Info, Sun, Plugs, CheckCircle, Warning } from '@phosphor-icons/react';
import { FormInput, FormSlider, FormButtonGroup, FormToggle } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { POWER_SOURCES } from '../../constants/formConstants';

export default function PulseForm() {
  const { formData, updateModuleData } = useFormContext();
  const data = formData.pulse;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateModuleData('pulse', { 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    updateModuleData('pulse', { [name]: parseFloat(value) });
  };

  const getVoltageStatus = (voltage) => {
    if (voltage < 360) return { status: 'LOW', color: 'text-red-500', bg: 'bg-red-100' };
    if (voltage > 460) return { status: 'HIGH', color: 'text-red-500', bg: 'bg-red-100' };
    if (voltage < 380 || voltage > 440) return { status: 'WARNING', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'OPTIMAL', color: 'text-[#689F38]', bg: 'bg-[#689F38]/10' };
  };

  const voltageStatus = getVoltageStatus(data.averageGridVoltage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: '#689F38' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#33691E' }}>THE PULSE</h2>
        <p className="text-gray-500">Power infrastructure for controller selection.</p>
      </div>

      {/* Primary Energy Source */}
      <FormButtonGroup
        label="Primary Energy Source"
        name="primaryEnergySource"
        value={data.primaryEnergySource}
        onChange={handleChange}
        options={POWER_SOURCES}
      />

      {/* Grid Specific Settings */}
      {(data.primaryEnergySource === 'grid' || data.primaryEnergySource === 'hybrid') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          <FormButtonGroup
            label="Grid Phase"
            name="gridPhase"
            value={data.gridPhase}
            onChange={handleChange}
            options={[
              { value: '1-phase', label: '1-Phase' },
              { value: '3-phase', label: '3-Phase' },
            ]}
          />

          {/* Voltage Slider */}
          <div className="space-y-2">
            <FormSlider
              label="Average Grid Voltage"
              name="averageGridVoltage"
              value={data.averageGridVoltage}
              onChange={handleSliderChange}
              min={300}
              max={500}
              step={5}
              unit=" V"
            />
            <motion.div
              className={`p-2 rounded-lg ${voltageStatus.bg} text-center flex items-center justify-center gap-2`}
              animate={{ scale: voltageStatus.status === 'LOW' || voltageStatus.status === 'HIGH' ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {voltageStatus.status === 'OPTIMAL' 
                ? <CheckCircle size={16} weight="fill" className="text-[#689F38]" />
                : <Warning size={16} weight="fill" className={voltageStatus.status === 'WARNING' ? 'text-yellow-600' : 'text-red-500'} />
              }
              <span className={`text-sm font-bold ${voltageStatus.color}`}>
                {voltageStatus.status}
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Solar Specific Settings */}
      {(data.primaryEnergySource === 'solar' || data.primaryEnergySource === 'hybrid') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200"
        >
          <div className="flex items-center gap-2 text-yellow-700">
            <Sun size={20} />
            <span className="font-medium">Solar Configuration</span>
          </div>
          <FormButtonGroup
            label="Solar System Voltage"
            name="solarSystemVoltage"
            value={data.solarSystemVoltage}
            onChange={handleChange}
            options={[
              { value: '240', label: '240V' },
              { value: '415', label: '415V' },
            ]}
          />
        </motion.div>
      )}

      {/* Voltage Stability */}
      <FormButtonGroup
        label="Voltage Stability"
        name="voltageStability"
        value={data.voltageStability}
        onChange={handleChange}
        options={[
          { value: 'stable', label: 'Stable' },
          { value: 'fluctuating', label: 'Fluctuating' },
        ]}
      />

      {/* Protection Requirements */}
      {data.voltageStability === 'fluctuating' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3 p-4 bg-red-50 rounded-xl border border-red-200"
        >
          <p className="text-sm font-medium text-red-700">Protection Requirements</p>
          <FormToggle
            label="Low Voltage Cutoff (< 360V)"
            name="lowVoltageCutoff"
            checked={data.lowVoltageCutoff}
            onChange={handleChange}
          />
          <FormToggle
            label="High Voltage Surge Protection (> 460V)"
            name="highVoltageSurge"
            checked={data.highVoltageSurge}
            onChange={handleChange}
          />
        </motion.div>
      )}

      {/* Availability */}
      <FormSlider
        label="Daily Availability"
        name="dailyAvailability"
        value={data.dailyAvailability}
        onChange={handleSliderChange}
        min={0}
        max={24}
        step={1}
        unit=" hours/day"
      />

      {/* Power Schedule */}
      <FormButtonGroup
        label="Power Schedule"
        name="powerSchedule"
        value={data.powerSchedule}
        onChange={handleChange}
        options={[
          { value: 'day', label: 'Day Hours' },
          { value: 'night', label: 'Night Hours' },
          { value: 'mixed', label: 'Mixed Schedule' },
        ]}
      />

      {/* Wiring Condition */}
      <FormButtonGroup
        label="Wiring Health"
        name="wiringHealth"
        value={data.wiringHealth}
        onChange={handleChange}
        options={[
          { value: 'good', label: 'Good' },
          { value: 'jointed', label: 'Jointed' },
          { value: 'burnt', label: 'Burnt/Damaged' },
        ]}
      />

      {/* Cable Upgrade */}
      {data.wiringHealth !== 'good' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-yellow-50 rounded-xl border border-yellow-200"
        >
          <FormToggle
            label="Cable Upgrade Required"
            name="cableUpgradeRequired"
            checked={data.cableUpgradeRequired}
            onChange={handleChange}
          />
        </motion.div>
      )}

      {/* Distance to Borewell */}
      <FormInput
        label="Distance: Meter to Borewell"
        name="distanceMeterToBorewell"
        type="number"
        value={data.distanceMeterToBorewell}
        onChange={handleChange}
        placeholder="Cable length in meters"
        icon={Plugs}
      />

      {/* Additional Options */}
      <div className="space-y-3">
        <FormToggle
          label="Generator Ownership"
          name="generatorOwnership"
          checked={data.generatorOwnership}
          onChange={handleChange}
        />
        <FormToggle
          label="EV Charging Need"
          name="evChargingNeed"
          checked={data.evChargingNeed}
          onChange={handleChange}
        />
      </div>

      {/* Solar Opportunity Score */}
      {data.dailyAvailability < 12 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
        >
          <div className="flex items-center gap-3">
            <Sun className="text-yellow-600" size={24} />
            <div>
              <p className="text-sm font-semibold text-yellow-800">Solar Opportunity</p>
              <p className="text-xs text-yellow-600">
                With {24 - data.dailyAvailability} hours of power unavailability, 
                solar backup could significantly improve irrigation reliability.
              </p>
            </div>
          </div>
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
            <h4 className="text-sm font-semibold" style={{ color: '#33691E' }}>Controller Selection</h4>
            <p className="text-xs mt-1" style={{ color: '#558B2F' }}>
              Voltage levels and stability determine VFD requirements and protection circuits. 
              Cable distance affects conductor sizing.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

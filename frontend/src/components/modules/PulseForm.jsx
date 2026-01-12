import { motion } from 'framer-motion';
import { Info, Sun, Plug2, CircleCheck, CircleAlert, CheckCircle } from 'lucide-react';
import { FormInput, FormSlider, FormButtonGroup, FormToggle } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { POWER_SOURCES } from '../../constants/formConstants';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

export default function PulseForm() {
  const { formData, updateModuleData, moduleErrors } = useFormContext();
  const data = formData.pulse;
  const errors = moduleErrors?.pulse || {};

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

  const handlePrimaryEnergySelect = (value) => {
    let current = data.primaryEnergySource || [];
    if (typeof current === 'string') {
      current = current ? [current] : [];
    }
    
    if (current.includes(value)) {
      const updated = current.filter(v => v !== value);
      updateModuleData('pulse', { primaryEnergySource: updated });
    } else {
      const updated = [...current, value];
      updateModuleData('pulse', { primaryEnergySource: updated });
    }
  };

  const primaryEnergySources = Array.isArray(data.primaryEnergySource) ? data.primaryEnergySource : (data.primaryEnergySource ? [data.primaryEnergySource] : []);
  const hasGrid = primaryEnergySources.includes('grid');
  const hasSolar = primaryEnergySources.includes('solar');

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

      {/* Primary Energy Source - Multi Select */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: '#33691E' }}>Primary Energy Source (Select All That Apply)</label>
        <div className="space-y-2">
          {POWER_SOURCES.map((source) => (
            <motion.button
              key={source.value}
              onClick={() => handlePrimaryEnergySelect(source.value)}
              className="w-full p-3 rounded-lg border-2 transition-all text-left"
              style={{
                borderColor: primaryEnergySources.includes(source.value) ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                backgroundColor: primaryEnergySources.includes(source.value) ? 'rgba(104, 159, 56, 0.15)' : 'transparent',
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded border-2 flex items-center justify-center"
                  style={{
                    borderColor: primaryEnergySources.includes(source.value) ? '#689F38' : 'rgba(104, 159, 56, 0.3)',
                    backgroundColor: primaryEnergySources.includes(source.value) ? '#689F38' : 'transparent',
                  }}
                >
                  {primaryEnergySources.includes(source.value) && (
                    <CheckCircle size={16} color="#E5E7EB" />
                  )}
                </div>
                <span className="font-medium" style={{ color: '#33691E' }}>{source.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Grid Specific Settings */}
      {hasGrid && (
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
                ? <CircleCheck size={16} strokeWidth={ICON_STROKE_WIDTH} style={{ color: ICON_COLOR }} />
                : <CircleAlert size={16} strokeWidth={ICON_STROKE_WIDTH} className={voltageStatus.status === 'WARNING' ? 'text-yellow-600' : 'text-red-500'} />
              }
              <span className={`text-sm font-bold ${voltageStatus.color}`}>
                {voltageStatus.status}
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Solar Specific Settings */}
      {hasSolar && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200"
        >
          <div className="flex items-center gap-2 text-yellow-700">
            <Sun size={20} strokeWidth={ICON_STROKE_WIDTH} />
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
          { value: 'bad', label: 'Bad' },
        ]}
      />

      {/* Cable Upgrade */}
      {data.wiringHealth === 'bad' && (
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

      {/* Distance: Meter to Borewell */}
      <FormInput
        label="How Far is Your Power Supply from Your Pump House?"
        name="distanceMeterToBorewell"
        id="field-pulse-distanceMeterToBorewell"
        type="number"
        value={data.distanceMeterToBorewell}
        onChange={handleChange}
        placeholder="Distance in meters"
        icon={Plug2}
        required
        error={errors.distanceMeterToBorewell}
        min="0"
      />

      {/* Solar Opportunity Score */}
      {data.dailyAvailability < 12 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
        >
          <div className="flex items-center gap-3">
            <Sun className="text-yellow-600" size={24} strokeWidth={ICON_STROKE_WIDTH} />
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
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { User, Phone, Mail, Users } from 'lucide-react';
import { FormInput, FormSlider } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

export default function ProfileForm() {
  const { formData, updateModuleData, moduleErrors } = useFormContext();
  const data = formData.profile;
  const errors = moduleErrors?.profile || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateModuleData('profile', { [name]: value });
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    updateModuleData('profile', { [name]: parseInt(value) });
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
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#33691E' }}>WHO ARE YOU?</h2>
        <p style={{ color: '#558B2F' }}>Establish your digital identity on the network.</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        <FormInput
          label="Farmer Full Name"
          name="customerName"
          value={data.customerName}
          onChange={handleChange}
          placeholder="e.g. Samuel Harvest"
          icon={User}
          required
          error={errors.customerName}
        />

        <FormInput
          label="WhatsApp Number"
          name="whatsappNumber"
          type="tel"
          value={data.whatsappNumber}
          onChange={handleChange}
          placeholder="e.g. 9876543210"
          icon={Phone}
          required
          error={errors.whatsappNumber}
          helper="10-digit mobile number for communication"
        />

        <FormInput
          label="Email Address"
          name="emailAddress"
          type="email"
          value={data.emailAddress}
          onChange={handleChange}
          placeholder="e.g. farmer@example.com"
          icon={Mail}
          helper="For proposal and document delivery"
        />

        <FormSlider
          label="Farm Labor Count"
          name="laborCount"
          value={data.laborCount}
          onChange={handleSliderChange}
          min={0}
          max={50}
          step={1}
          unit=" workers"
        />

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
              <Users size={20} color={ICON_COLOR} strokeWidth={ICON_STROKE_WIDTH} />
            </div>
            <div>
              <h4 className="text-sm font-semibold" style={{ color: '#33691E' }}>Why we ask this</h4>
              <p className="text-xs mt-1" style={{ color: '#558B2F' }}>
                Your contact details help us communicate efficiently. Labor count helps estimate 
                ROI and automation opportunities for your farm.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

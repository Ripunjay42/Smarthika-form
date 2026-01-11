import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { User, Phone, Mail, Users, MapPin, Calendar } from 'lucide-react';
import { FormInput, FormSlider, FormSelect, FormButtonGroup } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';
import { fetchStates, fetchDistricts } from '../../services/locationService';

const COUNTRIES = [
  { value: 'india', label: 'India' },
];

export default function ProfileForm() {
  const { formData, updateModuleData, moduleErrors } = useFormContext();
  const data = formData.profile;
  const errors = moduleErrors?.profile || {};

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Load states on component mount
  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const statesList = await fetchStates();
        setStates(statesList);
      } catch (error) {
        console.error('Error loading states:', error);
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  // Load districts when state changes
  useEffect(() => {
    if (data.state) {
      const loadDistricts = async () => {
        setLoadingDistricts(true);
        try {
          const districtsList = await fetchDistricts(data.state);
          setDistricts(districtsList);
        } catch (error) {
          console.error('Error loading districts:', error);
          setDistricts([]);
        } finally {
          setLoadingDistricts(false);
        }
      };
      loadDistricts();
    } else {
      setDistricts([]);
    }
  }, [data.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateModuleData('profile', { [name]: value });
    
    // Reset dependent fields
    if (name === 'state') {
      updateModuleData('profile', { district: '', village: '' });
    }
    if (name === 'district') {
      updateModuleData('profile', { village: '' });
    }
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
      {/* Smarthika Header */}
      <div className="mb-8 p-4 rounded-xl" style={{ backgroundColor: 'rgba(104, 159, 56, 0.1)', border: '2px solid rgba(104, 159, 56, 0.2)' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#689F38' }}>
            S
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#33691E' }}>SMARTHIKA</h1>
            <p className="text-xs" style={{ color: '#558B2F' }}>Smart Irrigation Solutions</p>
          </div>
        </div>
      </div>

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
          label="Age"
          name="age"
          type="number"
          value={data.age}
          onChange={handleChange}
          placeholder="e.g. 45"
          icon={Calendar}
          min="18"
          max="100"
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

        {/* Location Section */}
        <div className="border-t pt-5 mt-5 space-y-5">
          <h3 className="font-semibold mb-4" style={{ color: '#33691E' }}>Location Information</h3>
          
          {/* Country - Fixed to India */}
          <FormSelect
            label="Country"
            name="country"
            value={data.country || 'india'}
            onChange={handleChange}
            options={COUNTRIES}
            icon={MapPin}
          />

          {/* State - From API */}
          <FormSelect
            label="State / Province"
            name="state"
            value={data.state}
            onChange={handleChange}
            options={states}
            icon={MapPin}
            disabled={loadingStates || states.length === 0}
          />

          {/* District - From API or text input fallback */}
          {data.state && (
            <>
              {loadingDistricts ? (
                <div style={{ color: '#558B2F' }} className="text-sm py-2">Loading districts...</div>
              ) : districts.length > 0 ? (
                <FormSelect
                  label="District"
                  name="district"
                  value={data.district}
                  onChange={handleChange}
                  options={districts}
                  icon={MapPin}
                />
              ) : (
                <FormInput
                  label="District"
                  name="district"
                  value={data.district}
                  onChange={handleChange}
                  placeholder="Enter district name"
                  icon={MapPin}
                  helper="Type your district name"
                />
              )}
            </>
          )}

          {/* Village - Always text input (free text) */}
          {data.district && (
            <FormInput
              label="Village / City / Town"
              name="village"
              value={data.village}
              onChange={handleChange}
              placeholder="Enter village or city name"
              icon={MapPin}
              helper="Type your village, city, or town name"
            />
          )}
        </div>

        {/* Farm Location Question */}
        <FormButtonGroup
          label="Is your farm plot in the same location as where you stay?"
          name="farmSameLocation"
          value={data.farmSameLocation}
          onChange={handleChange}
          options={[
            { value: 'yes', label: 'Yes, same location' },
            { value: 'no', label: 'No, different location' },
          ]}
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
        {/* <motion.div
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
                Your contact details help us communicate efficiently. Location and farm information 
                helps us understand local conditions and provide targeted recommendations. Age and 
                labor count help estimate ROI and automation opportunities.
              </p>
            </div>
          </div>
        </motion.div> */}
      </div>
    </motion.div>
  );
}

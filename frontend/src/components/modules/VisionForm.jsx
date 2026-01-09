import { motion } from 'framer-motion';
import { TrendingUp, Info, Target, Leaf, House, Fish } from 'lucide-react';
import { FormSlider, FormButtonGroup, FormToggle } from '../ui/FormElements';
import { useFormContext } from '../../context/FormContext';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

export default function VisionForm() {
  const { formData, updateModuleData, completeModule } = useFormContext();
  const data = formData.vision;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateModuleData('vision', { 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    updateModuleData('vision', { [name]: parseFloat(value) });
  };

  const getLaborPainDescription = (score) => {
    if (score <= 2) return { level: 'Low', color: 'text-[#689F38]', desc: 'Manageable labor situation' };
    if (score <= 5) return { level: 'Medium', color: 'text-yellow-600', desc: 'Some automation could help' };
    if (score <= 7) return { level: 'High', color: 'text-orange-600', desc: 'Automation recommended' };
    return { level: 'Critical', color: 'text-red-600', desc: 'Strong automation ROI' };
  };

  const laborPain = getLaborPainDescription(data.laborPainScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: '#689F38' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#33691E' }}>THE VISION</h2>
        <p className="text-gray-500">Economic goals and future aspirations.</p>
      </div>

      {/* Labor Pain Score */}
      <div className="space-y-2">
        <FormSlider
          label="Labor Pain Score"
          name="laborPainScore"
          value={data.laborPainScore}
          onChange={handleSliderChange}
          min={0}
          max={10}
          step={1}
          unit="/10"
        />
        <motion.div
          className={`p-3 rounded-lg bg-gray-50 border border-gray-200`}
          key={data.laborPainScore}
        >
          <div className="flex items-center justify-between">
            <span className={`font-semibold ${laborPain.color}`}>{laborPain.level} Pain</span>
            <span className="text-sm text-gray-500">{laborPain.desc}</span>
          </div>
        </motion.div>
      </div>

      {/* Target LER */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Target style={{ color: ICON_COLOR }} size={20} strokeWidth={ICON_STROKE_WIDTH} />
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#689F38' }}>
            Target Land Equivalent Ratio (LER)
          </label>
        </div>
        <FormSlider
          name="targetLER"
          value={data.targetLER}
          onChange={handleSliderChange}
          min={0.5}
          max={2.5}
          step={0.1}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 p-4 rounded-xl"
          style={{ backgroundColor: 'rgba(104, 159, 56, 0.1)' }}
        >
          <div className="text-center">
            <span className="text-4xl font-bold" style={{ color: '#689F38' }}>{data.targetLER.toFixed(1)}</span>
            <p className="text-sm text-gray-500 mt-1">
              {data.targetLER <= 1 ? 'Standard yield target' : 
               data.targetLER <= 1.5 ? 'Good intercropping efficiency' :
               data.targetLER <= 2 ? 'Excellent land utilization' :
               'Intensive polyculture target'}
            </p>
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            <span>Monoculture</span>
            <span>Mixed</span>
            <span>Intensive</span>
          </div>
        </motion.div>
      </div>

      {/* Future Plans */}
      <div className="space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#689F38' }}>
          Future Expansion Plans
        </label>

        {/* Polyhouse */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-4 bg-white rounded-xl border-2 border-gray-200"
        >
          <div className="flex items-center gap-4">
            <House size={24} strokeWidth={ICON_STROKE_WIDTH} style={{ color: ICON_COLOR }} />
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Polyhouse/Greenhouse</p>
              <p className="text-sm text-gray-500">Protected cultivation infrastructure</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {[
              { value: 'none', label: 'None' },
              { value: 'own', label: 'Already Own' },
              { value: 'planned', label: 'Planning' },
            ].map((option) => (
              <motion.button
                key={option.value}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChange({ target: { name: 'polyhouseStatus', value: option.value } })}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
                  ${data.polyhouseStatus === option.value
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                style={data.polyhouseStatus === option.value ? { backgroundColor: '#689F38' } : {}}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Aquaculture */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-4 bg-white rounded-xl border-2 border-gray-200"
        >
          <div className="flex items-center gap-4">
            <Fish size={24} strokeWidth={ICON_STROKE_WIDTH} style={{ color: ICON_COLOR }} />
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Aquaculture/Fish Pond</p>
              <p className="text-sm text-gray-500">Integrated water-based farming</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {[
              { value: 'none', label: 'None' },
              { value: 'own', label: 'Already Own' },
              { value: 'planned', label: 'Planning' },
            ].map((option) => (
              <motion.button
                key={option.value}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChange({ target: { name: 'aquacultureStatus', value: option.value } })}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
                  ${data.aquacultureStatus === option.value
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                style={data.aquacultureStatus === option.value ? { backgroundColor: '#689F38' } : {}}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Organic Interest */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-lime-50 rounded-xl border border-green-200">
        <div className="flex items-center gap-3 mb-3">
          <Leaf className="text-green-600" size={24} strokeWidth={ICON_STROKE_WIDTH} />
          <span className="font-semibold text-green-800">Sustainability</span>
        </div>
        <FormToggle
          label="Interested in Organic Farming"
          name="organicFarmingInterest"
          checked={data.organicFarmingInterest}
          onChange={handleChange}
        />
        {data.organicFarmingInterest && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-green-600 mt-2 flex items-center gap-2"
          >
            <Leaf size={14} strokeWidth={ICON_STROKE_WIDTH} className="text-green-600" />
            Organic certification may unlock premium pricing opportunities
          </motion.p>
        )}
      </div>

      {/* Vision Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl text-white shadow-xl"
        style={{ background: 'linear-gradient(135deg, #689F38 0%, #7FAF45 100%)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={24} strokeWidth={ICON_STROKE_WIDTH} />
          <h3 className="text-lg font-bold">Your Farm Vision</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/70">Automation Priority</span>
            <span className="font-semibold">
              {data.laborPainScore >= 5 ? 'High' : data.laborPainScore >= 3 ? 'Medium' : 'Low'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Yield Target</span>
            <span className="font-semibold">{data.targetLER >= 1.5 ? 'Intensive' : 'Standard'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Expansion Plans</span>
            <span className="font-semibold">
              {(data.polyhouseStatus !== 'none' || data.aquacultureStatus !== 'none') ? 'Active' : 'None'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Sustainability Focus</span>
            <span className="font-semibold">{data.organicFarmingInterest ? 'Yes' : 'No'}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/20">
          <p className="text-sm text-white/70 text-center flex items-center justify-center gap-2">
            <Target size={16} strokeWidth={ICON_STROKE_WIDTH} className="text-white/80" />
            Your personalized irrigation solution will be tailored to these goals
          </p>
        </div>
      </motion.div>

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
            <Info className="w-5 h-5" strokeWidth={ICON_STROKE_WIDTH} style={{ color: ICON_COLOR }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: '#33691E' }}>ROI Calculation</h4>
            <p className="text-xs mt-1" style={{ color: '#558B2F' }}>
              Your economic goals help us calculate accurate return on investment 
              and recommend the right tier of automation for your needs.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

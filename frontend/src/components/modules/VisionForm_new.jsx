import { motion } from 'framer-motion';
import { TrendingUp, Calendar, BarChart3, Zap, House, Fish, Gauge, AlertCircle, CheckCircle2, Clock, X } from 'lucide-react';
import { useFormContext } from '../../context/FormContext';
import { CASH_FLOW_TYPES, EXPANSION_STATUS_OPTIONS, MONTHS } from '../../constants/formConstants';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

export default function VisionForm() {
  const { formData, updateModuleData, completeModule } = useFormContext();
  const data = formData.vision;
  const shedData = formData.shed || {};

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

  const handleExpansionStatusChange = (itemValue, status) => {
    if (itemValue === 'polyhouse') {
      updateModuleData('vision', { polyhouseStatus: status });
    } else if (itemValue === 'fish_pond') {
      updateModuleData('vision', { aquacultureStatus: status });
    }
  };

  const getLaborDescription = (score) => {
    if (score <= 2) return { level: 'Easy', color: '#689F38', desc: 'Easy to find labor' };
    if (score <= 4) return { level: 'Moderate', color: '#FBC02D', desc: 'Moderate availability' };
    if (score <= 7) return { level: 'Difficult', color: '#FF6F00', desc: 'Hard to find labor' };
    return { level: 'Critical', color: '#D32F2F', desc: 'Very expensive/hard to find' };
  };

  const laborInfo = getLaborDescription(data.laborPainScore);

  const getExpansionStatus = (item) => {
    if (item === 'polyhouse') return data.polyhouseStatus || 'none';
    if (item === 'fish_pond') return data.aquacultureStatus || 'none';
    return 'none';
  };

  const getExpansionIcon = (status) => {
    switch(status) {
      case 'own': return <CheckCircle2 size={20} color="#689F38" />;
      case 'planned': return <Clock size={20} color="#FBC02D" />;
      default: return <X size={20} color="#999" />;
    }
  };

  const harvestMonths = shedData.harvestMonths || [];
  const selectedMonthsLabel = harvestMonths.length > 0 
    ? harvestMonths.map(m => MONTHS[m].slice(0, 3)).join(', ')
    : 'Select months in Equipment';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: '#689F38' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#33691E' }}>THE VISION</h2>
        <p className="text-gray-500">Economic goals, cash flow strategy, and 3-year expansion plan.</p>
      </div>

      {/* ===== SECTION 1: INCOME CYCLE (HARVEST & CASH FLOW) ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(104, 159, 56, 0.1)' }}>
            <Calendar size={20} color="#689F38" strokeWidth={ICON_STROKE_WIDTH} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#33691E' }}>Income Cycle (Harvest & Cash Flow)</h3>
            <p className="text-xs text-gray-500">Match payment plan to your wallet</p>
          </div>
        </div>

        {/* Cash Flow Type Toggle */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold" style={{ color: '#689F38' }}>
            How do you earn income?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CASH_FLOW_TYPES.map((type) => (
              <motion.button
                key={type.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateModuleData('vision', { cash_flow_type: type.value })}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  data.cash_flow_type === type.value
                    ? 'border-[#689F38] bg-opacity-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{
                  backgroundColor: data.cash_flow_type === type.value 
                    ? 'rgba(104, 159, 56, 0.1)' 
                    : 'transparent'
                }}
              >
                <p className="font-semibold text-sm" style={{ color: '#33691E' }}>{type.label}</p>
                <p className="text-xs text-gray-500 mt-1">{type.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Harvest Months Display */}
        <div className="p-4 rounded-lg border-2" style={{ borderColor: 'rgba(104, 159, 56, 0.3)', backgroundColor: 'rgba(104, 159, 56, 0.05)' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#689F38' }}>Harvest Months:</p>
          <p className="text-sm" style={{ color: '#33691E' }}>
            {selectedMonthsLabel}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {harvestMonths.length === 0 ? '👉 Go to Equipment form to select harvest months' : '✓ Set in Equipment form'}
          </p>
        </div>
      </motion.div>

      {/* ===== SECTION 2: YIELD STRATEGY (LER & DENSITY) ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(104, 159, 56, 0.1)' }}>
            <BarChart3 size={20} color="#689F38" strokeWidth={ICON_STROKE_WIDTH} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#33691E' }}>Yield Strategy (LER & Density)</h3>
            <p className="text-xs text-gray-500">Plan for high-density farming</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold" style={{ color: '#689F38' }}>
              Target Yield Multiplier (LER)
            </label>
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ color: '#689F38', backgroundColor: 'rgba(104, 159, 56, 0.1)' }}>
              {data.targetLER.toFixed(1)}x
            </span>
          </div>
          
          <input
            type="range"
            name="targetLER"
            min="1"
            max="2"
            step="0.1"
            value={data.targetLER}
            onChange={handleSliderChange}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #689F38 0%, #689F38 ${(data.targetLER - 1) * 100}%, #ddd ${(data.targetLER - 1) * 100}%, #ddd 100%)`
            }}
          />

          <div className="flex justify-between text-xs" style={{ color: '#689F38' }}>
            <span>Standard (1.0x)</span>
            <span>High Density (2.0x)</span>
          </div>

          <p className="text-xs text-gray-600 mt-2">
            {data.targetLER < 1.3 
              ? '📍 Standard spacing - monoculture farming'
              : data.targetLER < 1.6
              ? '🌱 Mixed crops - adds pepper/cocoa between primary crops'
              : '🌿 High density - maximizes yield per acre with polyculture'}
          </p>

          {data.targetLER > 1.5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-lg border-l-4 text-sm"
              style={{ borderColor: '#689F38', backgroundColor: 'rgba(104, 159, 56, 0.08)' }}
            >
              <p style={{ color: '#33691E' }} className="font-semibold flex items-center gap-2">
                <Zap size={16} />
                💡 Multi-Zone Automation will be recommended for different crop watering
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ===== SECTION 3: FUTURE EXPANSION (3-YEAR PLAN) ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(104, 159, 56, 0.1)' }}>
            <TrendingUp size={20} color="#689F38" strokeWidth={ICON_STROKE_WIDTH} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#33691E' }}>Future Expansion (3-Year Plan)</h3>
            <p className="text-xs text-gray-500">Plan for tomorrow's farm today</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          Are you planning these upgrades soon? (This helps us add necessary features to your pump system)
        </p>

        {/* Expansion Items */}
        <div className="space-y-3">
          {/* Polyhouse */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-4 rounded-lg border-2 transition-all cursor-pointer"
            style={{ borderColor: 'rgba(104, 159, 56, 0.3)', backgroundColor: 'rgba(104, 159, 56, 0.05)' }}
            onClick={() => {}}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <House size={20} color="#689F38" />
                <div>
                  <h4 className="font-bold text-sm" style={{ color: '#33691E' }}>Polyhouse/Greenhouse</h4>
                  <p className="text-xs text-gray-500">Controlled environment farming</p>
                </div>
              </div>
              {getExpansionIcon(getExpansionStatus('polyhouse'))}
            </div>

            {/* Status Toggle */}
            <div className="flex gap-2">
              {EXPANSION_STATUS_OPTIONS.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExpansionStatusChange('polyhouse', option.value)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all border-2 ${
                    getExpansionStatus('polyhouse') === option.value
                      ? 'border-[#689F38] bg-[#689F38] text-white'
                      : 'border-gray-300 text-gray-600 hover:border-[#689F38]'
                  }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Fish Pond */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-4 rounded-lg border-2 transition-all cursor-pointer"
            style={{ borderColor: 'rgba(104, 159, 56, 0.3)', backgroundColor: 'rgba(104, 159, 56, 0.05)' }}
            onClick={() => {}}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <Fish size={20} color="#689F38" />
                <div>
                  <h4 className="font-bold text-sm" style={{ color: '#33691E' }}>Fish Pond/Aquaculture</h4>
                  <p className="text-xs text-gray-500">Integrated aquaculture system</p>
                </div>
              </div>
              {getExpansionIcon(getExpansionStatus('fish_pond'))}
            </div>

            {/* Status Toggle */}
            <div className="flex gap-2">
              {EXPANSION_STATUS_OPTIONS.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExpansionStatusChange('fish_pond', option.value)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all border-2 ${
                    getExpansionStatus('fish_pond') === option.value
                      ? 'border-[#689F38] bg-[#689F38] text-white'
                      : 'border-gray-300 text-gray-600 hover:border-[#689F38]'
                  }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Expansion Summary */}
        {(getExpansionStatus('polyhouse') !== 'none' || getExpansionStatus('fish_pond') !== 'none') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-lg border-l-4 text-sm"
            style={{ borderColor: '#689F38', backgroundColor: 'rgba(104, 159, 56, 0.08)' }}
          >
            <p style={{ color: '#33691E' }} className="font-semibold flex items-center gap-2">
              <AlertCircle size={16} />
              We'll add foggers & auxiliary outlets to handle your future plans
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* ===== SECTION 4: BOTTOM LINE (LABOR & ROI) ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(104, 159, 56, 0.1)' }}>
            <Gauge size={20} color="#689F38" strokeWidth={ICON_STROKE_WIDTH} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#33691E' }}>Bottom Line (Labor & ROI)</h3>
            <p className="text-xs text-gray-500">The final push for automation</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold" style={{ color: '#689F38' }}>
              How big is your labor headache?
            </label>
            <span 
              className="px-3 py-1 rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: laborInfo.color }}
            >
              {laborInfo.level}
            </span>
          </div>

          <input
            type="range"
            name="laborPainScore"
            min="0"
            max="10"
            step="1"
            value={data.laborPainScore}
            onChange={handleSliderChange}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #689F38 0%, #FBC02D 40%, #FF6F00 70%, #D32F2F 100%)`
            }}
          />

          <div className="flex justify-between text-xs font-semibold">
            <span style={{ color: '#689F38' }}>Easy</span>
            <span style={{ color: '#D32F2F' }}>Expensive</span>
          </div>

          <p className="text-sm" style={{ color: laborInfo.color }}>
            👉 {laborInfo.desc}
          </p>

          {data.laborPainScore >= 7 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-lg border-l-4 text-sm"
              style={{ borderColor: '#D32F2F', backgroundColor: 'rgba(211, 47, 47, 0.08)' }}
            >
              <p style={{ color: '#C62828' }} className="font-semibold flex items-center gap-2">
                <Zap size={16} />
                🎯 Automation priority: HIGH - Pump controller & drip automation recommended
              </p>
            </motion.div>
          )}

          {data.laborPainScore >= 4 && data.laborPainScore < 7 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-lg border-l-4 text-sm"
              style={{ borderColor: '#FF6F00', backgroundColor: 'rgba(255, 111, 0, 0.08)' }}
            >
              <p style={{ color: '#E65100' }} className="font-semibold flex items-center gap-2">
                <Zap size={16} />
                💡 Automation priority: MEDIUM - Drip automation can help manage labor
              </p>
            </motion.div>
          )}

          {data.laborPainScore < 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-lg border-l-4 text-sm"
              style={{ borderColor: '#689F38', backgroundColor: 'rgba(104, 159, 56, 0.08)' }}
            >
              <p style={{ color: '#558B2F' }} className="font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                ✓ Labor is manageable - basic automation can still increase efficiency
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Completion Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm text-gray-500 mt-8 pt-6 border-t border-gray-200"
      >
        <p>You've completed The Vision. This helps us understand your farm's economics and future plans.</p>
      </motion.div>
    </motion.div>
  );
}

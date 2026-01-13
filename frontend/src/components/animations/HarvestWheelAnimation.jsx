import { motion } from 'framer-motion';
import { Calendar, BarChart3, TrendingUp, Gauge, CheckCircle2, Clock, X, AlertCircle, Zap } from 'lucide-react';
import { CASH_FLOW_TYPES, MONTHS, EXPANSION_STATUS_OPTIONS } from '../../constants/formConstants';
import { ICON_STROKE_WIDTH } from '../../constants/iconTheme';

const THEME = {
  accent: '#689F38',
  accentLight: 'rgba(104, 159, 56, 0.3)',
  text: '#33691E',
  textLight: '#558B2F',
  background: '#EDEDE7',
  cardBg: 'rgba(104, 159, 56, 0.1)',
  cardBorder: 'rgba(104, 159, 56, 0.3)',
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function HarvestWheelAnimation({ 
  laborPainScore = 5,
  targetLER = 1.2,
  polyhouseStatus = 'none',
  aquacultureStatus = 'none',
  cash_flow_type = 'seasonal'
}) {
  // Labor pain description
  const getLaborDescription = (score) => {
    if (score <= 2) return { level: 'Easy', color: '#689F38', desc: 'Easy to find labor' };
    if (score <= 4) return { level: 'Moderate', color: '#FBC02D', desc: 'Moderate availability' };
    if (score <= 7) return { level: 'Difficult', color: '#FF6F00', desc: 'Hard to find labor' };
    return { level: 'Critical', color: '#D32F2F', desc: 'Very expensive/hard to find' };
  };

  const laborInfo = getLaborDescription(laborPainScore);

  const getExpansionIcon = (status) => {
    switch(status) {
      case 'own': return <CheckCircle2 size={16} color="#689F38" />;
      case 'planned': return <Clock size={16} color="#FBC02D" />;
      default: return <X size={16} color="#999" />;
    }
  };

  const hasExpansionPlans = polyhouseStatus !== 'none' || aquacultureStatus !== 'none';

  const cashFlowType = CASH_FLOW_TYPES.find(t => t.value === cash_flow_type);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-start overflow-y-auto p-4 sm:p-6" style={{ backgroundColor: THEME.background }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 w-full"
      >
        <h3 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: THEME.text }}>
          Your Farm Vision
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">
          Economic goals & 3-year expansion plan
        </p>
      </motion.div>

      {/* Main Content Container */}
      <div className="w-full max-w-3xl space-y-4">
        {/* ===== SECTION 1: INCOME CYCLE ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg border-2"
          style={{ borderColor: THEME.cardBorder, backgroundColor: 'rgba(104, 159, 56, 0.05)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} color={THEME.accent} strokeWidth={ICON_STROKE_WIDTH} />
            <h4 className="text-sm font-bold" style={{ color: THEME.text }}>Income Cycle</h4>
          </div>
          <p className="text-xs text-gray-600 mb-2">{cashFlowType?.label}</p>
          <p className="text-xs text-gray-500">{cashFlowType?.description}</p>
        </motion.div>

        {/* ===== SECTION 2: YIELD STRATEGY ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg border-2"
          style={{ borderColor: THEME.cardBorder, backgroundColor: 'rgba(104, 159, 56, 0.05)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} color={THEME.accent} strokeWidth={ICON_STROKE_WIDTH} />
              <h4 className="text-sm font-bold" style={{ color: THEME.text }}>Yield Strategy (LER)</h4>
            </div>
            <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ color: THEME.accent, backgroundColor: THEME.cardBg }}>
              {targetLER.toFixed(1)}x
            </span>
          </div>

          {/* LER Visual Bar */}
          <div className="mb-3">
            <div className="h-6 rounded-full overflow-hidden" style={{ backgroundColor: '#ddd' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(targetLER - 1) * 100}%` }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-full"
                style={{ backgroundColor: THEME.accent }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1" style={{ color: THEME.textLight }}>
              <span>Standard (1.0x)</span>
              <span>High Density (2.0x)</span>
            </div>
          </div>

          <p className="text-xs text-gray-600">
            {targetLER < 1.3 
              ? '📍 Standard spacing - monoculture farming'
              : targetLER < 1.6
              ? '🌱 Mixed crops - intercropping approach'
              : '🌿 High density - polyculture system'}
          </p>

          {targetLER > 1.5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-xs text-blue-600 flex items-center gap-1"
            >
              <Zap size={12} />
              Multi-Zone Automation recommended
            </motion.div>
          )}
        </motion.div>

        {/* ===== SECTION 3: FUTURE EXPANSION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-lg border-2"
          style={{ borderColor: THEME.cardBorder, backgroundColor: 'rgba(104, 159, 56, 0.05)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} color={THEME.accent} strokeWidth={ICON_STROKE_WIDTH} />
            <h4 className="text-sm font-bold" style={{ color: THEME.text }}>3-Year Expansion</h4>
          </div>

          <div className="space-y-2">
            {/* Polyhouse */}
            <div className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'rgba(104, 159, 56, 0.08)' }}>
              <span className="text-xs" style={{ color: THEME.text }}>Polyhouse/Greenhouse</span>
              <div className="flex items-center gap-1">
                {getExpansionIcon(polyhouseStatus)}
                <span className="text-xs text-gray-500">
                  {polyhouseStatus === 'own' ? 'Own' : polyhouseStatus === 'planned' ? 'Planning' : 'None'}
                </span>
              </div>
            </div>

            {/* Fish Pond */}
            <div className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'rgba(104, 159, 56, 0.08)' }}>
              <span className="text-xs" style={{ color: THEME.text }}>Fish Pond/Aquaculture</span>
              <div className="flex items-center gap-1">
                {getExpansionIcon(aquacultureStatus)}
                <span className="text-xs text-gray-500">
                  {aquacultureStatus === 'own' ? 'Own' : aquacultureStatus === 'planned' ? 'Planning' : 'None'}
                </span>
              </div>
            </div>
          </div>

          {hasExpansionPlans && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-xs flex items-center gap-1"
              style={{ color: THEME.accent }}
            >
              <AlertCircle size={12} />
              Foggers & auxiliary outlets included
            </motion.div>
          )}
        </motion.div>

        {/* ===== SECTION 4: LABOR & ROI ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-lg border-2"
          style={{ borderColor: THEME.cardBorder, backgroundColor: 'rgba(104, 159, 56, 0.05)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gauge size={16} color={THEME.accent} strokeWidth={ICON_STROKE_WIDTH} />
              <h4 className="text-sm font-bold" style={{ color: THEME.text }}>Labor Availability</h4>
            </div>
            <span 
              className="px-2 py-1 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: laborInfo.color }}
            >
              {laborInfo.level}
            </span>
          </div>

          {/* Labor Pain Scale Visual */}
          <div className="mb-3">
            <div className="h-6 rounded-full overflow-hidden" style={{ background: `linear-gradient(to right, #689F38 0%, #FBC02D 40%, #FF6F00 70%, #D32F2F 100%)` }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(laborPainScore / 10) * 100}%` }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="h-full"
                style={{ backgroundColor: laborInfo.color }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1 text-gray-500">
              <span>Easy (0)</span>
              <span>Expensive (10)</span>
            </div>
          </div>

          <p className="text-xs mb-2" style={{ color: laborInfo.color }}>
            👉 {laborInfo.desc}
          </p>

          {laborPainScore >= 7 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-red-600 flex items-center gap-1"
            >
              <Zap size={12} />
              Priority: HIGH - Automation recommended
            </motion.div>
          )}

          {laborPainScore >= 4 && laborPainScore < 7 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-orange-600 flex items-center gap-1"
            >
              <Zap size={12} />
              Priority: MEDIUM - Drip automation helpful
            </motion.div>
          )}

          {laborPainScore < 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs flex items-center gap-1"
              style={{ color: THEME.accent }}
            >
              <CheckCircle2 size={12} />
              Labor manageable - efficiency focus
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center text-xs text-gray-500 pb-6"
      >
        <p>Your irrigation solution tailored to your farm's vision</p>
      </motion.div>
    </div>
  );
}

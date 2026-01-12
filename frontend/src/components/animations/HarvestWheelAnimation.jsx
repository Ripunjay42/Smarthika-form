import { motion } from 'framer-motion';
import { ChartLine, Coins, Fish, Heart, Leaf, Rocket, Sparkles, Sun, Target, TrendingUp } from 'lucide-react';

const THEME = {
  accent: '#689F38',
  accentLight: 'rgba(104, 159, 56, 0.3)',
  text: '#33691E',
  textLight: '#558B2F',
  background: '#EDEDE7',
  cardBg: 'rgba(104, 159, 56, 0.1)',
  cardBorder: 'rgba(104, 159, 56, 0.3)',
};

export default function HarvestWheelAnimation({ 
  laborPainScore = 5,
  targetLER = 1.2,
  organicFarmingInterest = false,
  polyhouseStatus = 'none',
  aquacultureStatus = 'none'
}) {
  // Map labor pain score (0-10) to angle for gauge
  const painAngle = (laborPainScore / 10) * 180 - 90;
  const isPainHigh = laborPainScore >= 7;
  const isPainMedium = laborPainScore >= 4 && laborPainScore < 7;
  const isPainLow = laborPainScore < 4;

  // Calculate expansion activity
  const hasPolyhouse = polyhouseStatus === 'own' || polyhouseStatus === 'planned';
  const hasAquaculture = aquacultureStatus === 'own' || aquacultureStatus === 'planned';
  const expansionCount = (hasPolyhouse ? 1 : 0) + (hasAquaculture ? 1 : 0);
  const isExpanding = expansionCount > 0;

  // Calculate automation ROI signal
  const automationPriority = laborPainScore >= 7 ? 'high' : laborPainScore >= 4 ? 'medium' : 'low';
  const yieldAmbition = targetLER >= 1.8 ? 'intensive' : targetLER >= 1.3 ? 'high' : 'standard';
  
  // Get status labels
  const getStatusLabel = (status) => {
    if (status === 'own') return 'Owned';
    if (status === 'planned') return 'Planned';
    return 'None';
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Vision Metrics Dashboard */}
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-6 sm:gap-8 p-4 sm:p-8">
        
        {/* Labor Pain Gauge */}
        <div className="relative w-52 h-52 sm:w-64 sm:h-64">
          <div 
            className="absolute inset-0 rounded-full shadow-2xl"
            style={{ 
              background: 'linear-gradient(to bottom, #E5E7EB, #EDEDE7)', 
              border: `4px solid ${THEME.cardBorder}` 
            }}
          >
            {/* Gauge Arc */}
            <svg className="absolute inset-4" viewBox="0 0 200 200">
              {/* Low Pain - Green */}
              <path
                d="M 35 145 A 75 75 0 0 1 75 55"
                fill="none"
                stroke="#22C55E"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Medium Pain - Yellow */}
              <path
                d="M 75 55 A 75 75 0 0 1 125 55"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* High Pain - Red */}
              <path
                d="M 125 55 A 75 75 0 0 1 165 145"
                fill="none"
                stroke="#EF4444"
                strokeWidth="12"
                strokeLinecap="round"
              />
              
              {/* Needle */}
              <motion.line
                x1="100"
                y1="100"
                x2="100"
                y2="35"
                stroke={isPainHigh ? '#EF4444' : isPainMedium ? '#F59E0B' : '#22C55E'}
                strokeWidth="4"
                strokeLinecap="round"
                style={{ transformOrigin: 'center' }}
                animate={{ rotate: painAngle }}
                transition={{ duration: 1, type: 'spring' }}
              />
              <circle cx="100" cy="100" r="8" fill={THEME.accent} />
            </svg>

            {/* Pain Score Display */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
              <motion.span
                className="text-3xl sm:text-4xl font-bold"
                style={{ color: isPainHigh ? '#EF4444' : isPainMedium ? '#F59E0B' : '#22C55E' }}
                key={laborPainScore}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {laborPainScore}
              </motion.span>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>PAIN SCORE</p>
            </div>

            {/* Scale Labels */}
            <span className="absolute bottom-2 left-4 text-xs font-medium text-green-600">Easy</span>
            <span className="absolute bottom-2 right-4 text-xs font-medium text-red-600">Hard</span>
          </div>

          {/* Labor Status Icon */}
          <motion.div
            className="absolute -top-6 left-1/2 -translate-x-1/2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart size={34} color={isPainHigh ? '#EF4444' : THEME.accent} />
          </motion.div>
        </div>

        {/* Bottom Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Target LER Card */}
          <motion.div
            className="px-4 sm:px-5 py-3 sm:py-4 backdrop-blur-sm rounded-xl"
            style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col items-center gap-2">
              <TrendingUp size={24} color={THEME.accent} />
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>TARGET LER</p>
              <p className="text-xl sm:text-2xl font-bold" style={{ color: THEME.text }}>{targetLER.toFixed(1)}</p>
              <span className="text-xs font-medium" style={{ color: THEME.textLight }}>
                {yieldAmbition === 'intensive' ? 'Intensive' : yieldAmbition === 'high' ? 'High' : 'Standard'}
              </span>
            </div>
          </motion.div>

          {/* Organic Farming Card */}
          <motion.div
            className="px-4 sm:px-5 py-3 sm:py-4 backdrop-blur-sm rounded-xl"
            style={{ 
              backgroundColor: organicFarmingInterest ? 'rgba(34, 197, 94, 0.1)' : THEME.cardBg,
              border: `2px solid ${organicFarmingInterest ? 'rgba(34, 197, 94, 0.3)' : THEME.cardBorder}` 
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col items-center gap-2">
              <Leaf size={24} color={organicFarmingInterest ? '#22C55E' : THEME.accent} />
              <p className="text-xs font-semibold" style={{ color: organicFarmingInterest ? '#22C55E' : THEME.accent }}>
                ORGANIC
              </p>
              <p className="text-lg font-bold" style={{ color: organicFarmingInterest ? '#22C55E' : THEME.text }}>
                {organicFarmingInterest ? 'Yes' : 'No'}
              </p>
              {organicFarmingInterest && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <Coins size={12} className="shrink-0" />
                  Premium
                </span>
              )}
            </div>
          </motion.div>

          {/* Polyhouse Card */}
          <motion.div
            className="px-4 sm:px-5 py-3 sm:py-4 backdrop-blur-sm rounded-xl"
            style={{ 
              backgroundColor: hasPolyhouse ? 'rgba(59, 130, 246, 0.1)' : THEME.cardBg,
              border: `2px solid ${hasPolyhouse ? 'rgba(59, 130, 246, 0.3)' : THEME.cardBorder}` 
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col items-center gap-2">
              <Sun size={24} color={hasPolyhouse ? '#3B82F6' : THEME.accent} />
              <p className="text-xs font-semibold" style={{ color: hasPolyhouse ? '#3B82F6' : THEME.accent }}>
                POLYHOUSE
              </p>
              <p className="text-lg font-bold" style={{ color: hasPolyhouse ? '#3B82F6' : THEME.text }}>
                {getStatusLabel(polyhouseStatus)}
              </p>
              {polyhouseStatus === 'planned' && (
                <span className="text-xs text-blue-600 flex items-center gap-1">
                  <Rocket size={12} className="shrink-0" />
                  Coming
                </span>
              )}
            </div>
          </motion.div>

          {/* Aquaculture Card */}
          <motion.div
            className="px-4 sm:px-5 py-3 sm:py-4 backdrop-blur-sm rounded-xl"
            style={{ 
              backgroundColor: hasAquaculture ? 'rgba(6, 182, 212, 0.1)' : THEME.cardBg,
              border: `2px solid ${hasAquaculture ? 'rgba(6, 182, 212, 0.3)' : THEME.cardBorder}` 
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-col items-center gap-2">
              <Fish size={24} color={hasAquaculture ? '#06B6D4' : THEME.accent} />
              <p className="text-xs font-semibold" style={{ color: hasAquaculture ? '#06B6D4' : THEME.accent }}>
                AQUACULTURE
              </p>
              <p className="text-lg font-bold" style={{ color: hasAquaculture ? '#06B6D4' : THEME.text }}>
                {getStatusLabel(aquacultureStatus)}
              </p>
              {aquacultureStatus === 'planned' && (
                <span className="text-xs text-cyan-600 flex items-center gap-1">
                  <Rocket size={12} className="shrink-0" />
                  Coming
                </span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Automation ROI Signal */}
        <motion.div
          className="absolute top-4 sm:top-8 right-4 sm:right-8 px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-sm rounded-xl"
          style={{ 
            backgroundColor: automationPriority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 
                           automationPriority === 'medium' ? 'rgba(245, 158, 11, 0.1)' : 
                           'rgba(34, 197, 94, 0.1)',
            border: `2px solid ${automationPriority === 'high' ? 'rgba(239, 68, 68, 0.3)' : 
                                 automationPriority === 'medium' ? 'rgba(245, 158, 11, 0.3)' : 
                                 'rgba(34, 197, 94, 0.3)'}` 
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2">
            <ChartLine
              size={18}
              color={automationPriority === 'high' ? '#EF4444' :
                     automationPriority === 'medium' ? '#F59E0B' : '#22C55E'}
            />
            <div>
              <p className="text-xs font-semibold" 
                 style={{ color: automationPriority === 'high' ? '#EF4444' : 
                                automationPriority === 'medium' ? '#F59E0B' : '#22C55E' }}>
                {automationPriority.toUpperCase()} ROI
              </p>
              <p className="text-xs" style={{ color: THEME.textLight }}>
                {automationPriority === 'high' ? 'Strong automation case' : 
                 automationPriority === 'medium' ? 'Moderate automation value' : 
                 'Manual farming viable'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Expansion Summary */}
        {isExpanding && (
          <motion.div
            className="absolute top-4 sm:top-8 left-4 sm:left-8 px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-sm rounded-xl"
            style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '2px solid rgba(139, 92, 246, 0.3)' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={18} color="#8B5CF6" />
              <div>
                <p className="text-xs font-semibold text-purple-700">EXPANSION PLANS</p>
                <p className="text-xs text-purple-600">
                  {expansionCount} project{expansionCount > 1 ? 's' : ''} planned
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Vision Status Message */}
        <motion.div
          className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2">
            <Target size={18} color={THEME.accent} />
            <p className="text-xs sm:text-sm font-semibold" style={{ color: THEME.text }}>
              {organicFarmingInterest && isExpanding ? 'Premium Growth Strategy' :
               organicFarmingInterest ? 'Sustainable Focus' :
               isExpanding ? 'Expansion Mode' :
               'Standard Operations'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

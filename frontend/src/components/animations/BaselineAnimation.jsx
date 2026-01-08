import { motion } from 'framer-motion';
import { ArrowRight, Lightning, Wrench, Sparkle } from '@phosphor-icons/react';

const THEME = {
  accent: '#689F38',
  accentLight: 'rgba(104, 159, 56, 0.3)',
  text: '#33691E',
  textLight: '#558B2F',
  background: '#EDEDE7',
  cardBg: 'rgba(104, 159, 56, 0.1)',
  cardBorder: 'rgba(104, 159, 56, 0.3)',
};

export default function BaselineAnimation({ 
  projectType = 'greenfield', 
  pumpAge = 0,
  burnoutFrequency = 0,
  efficiencyGap = 0
}) {
  const isRetrofit = projectType === 'retrofit';
  const agePercentage = Math.min((pumpAge / 15) * 100, 100);
  const rustIntensity = Math.min(pumpAge * 0.05, 0.5);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Old vs New Comparison */}
      <div className="flex gap-8 items-center">
        {/* Old System - Only for Retrofit */}
        {isRetrofit && (
          <motion.div
            className="relative"
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Old Pump Housing */}
            <div 
              className="w-36 h-52 rounded-xl shadow-xl relative overflow-hidden"
              style={{ background: 'linear-gradient(to bottom, #6B7280, #4B5563)' }}
            >
              {/* Rust Effect Overlay */}
              <div 
                className="absolute inset-0"
                style={{ 
                  background: `linear-gradient(to bottom, rgba(180, 83, 9, ${rustIntensity}), rgba(154, 52, 18, ${rustIntensity + 0.1}))` 
                }}
              />
              
              {/* Old Pump Body */}
              <motion.div
                className="absolute inset-3 rounded-lg flex flex-col items-center justify-center"
                style={{ backgroundColor: '#374151' }}
                animate={{ opacity: [0.7, 0.5, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                {/* OLD Label */}
                <span className="text-xs font-bold text-red-400 mb-2">OLD PUMP</span>
                
                {/* Wrench Icon */}
                <Wrench size={32} weight="duotone" color="#9CA3AF" />
                
                {/* Age Indicator */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: THEME.textLight }}>Age</span>
                    <span className="text-red-400">{pumpAge} yrs</span>
                  </div>
                  <div className="h-1.5 bg-gray-600 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-red-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${agePercentage}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Damage Indicators */}
              {burnoutFrequency > 0 && (
                <motion.div
                  className="absolute top-2 right-2 w-4 h-4 rounded-full bg-red-500"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
            
            <p className="text-center mt-3 text-sm font-medium" style={{ color: THEME.textLight }}>
              Current System
            </p>
          </motion.div>
        )}

        {/* Animated Arrow */}
        {isRetrofit && (
          <motion.div
            className="flex flex-col items-center gap-2"
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <ArrowRight size={36} weight="bold" color={THEME.accent} />
            <span className="text-xs font-medium" style={{ color: THEME.accent }}>UPGRADE</span>
          </motion.div>
        )}

        {/* New System */}
        <motion.div
          initial={{ x: isRetrofit ? 60 : 0, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: isRetrofit ? 0.3 : 0, duration: 0.5 }}
        >
          {/* New Pump Housing */}
          <div 
            className="w-36 h-52 rounded-xl shadow-xl relative overflow-hidden"
            style={{ backgroundColor: THEME.accent }}
          >
            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0"
              style={{ 
                background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.3) 50%, transparent 60%)' 
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            />
            
            {/* New Pump Body */}
            <div className="absolute inset-3 rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}>
              {/* NEW Label */}
              <span className="text-xs font-bold mb-2" style={{ color: '#FAF0BF' }}>
                {isRetrofit ? 'NEW PUMP' : 'GREENFIELD'}
              </span>
              
              {/* Lightning Icon */}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Lightning size={40} weight="fill" color="#FAF0BF" />
              </motion.div>

              {/* Sparkles */}
              <motion.div
                className="absolute top-4 right-4"
                animate={{ rotate: 360, opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkle size={16} weight="fill" color="#FAF0BF" />
              </motion.div>
            </div>
            
            {/* Efficiency Bar */}
            <div className="absolute bottom-2 inset-x-2 text-center">
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <motion.div 
                  className="h-full rounded-full"
                  style={{ backgroundColor: '#FAF0BF' }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <span className="text-xs font-medium mt-1 block" style={{ color: '#FAF0BF' }}>100% Efficient</span>
            </div>
          </div>
          
          <p className="text-center mt-3 text-sm font-semibold" style={{ color: THEME.accent }}>
            {isRetrofit ? 'Upgraded System' : 'New Installation'}
          </p>
        </motion.div>
      </div>

      {/* Project Type Badge */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 px-6 py-3 backdrop-blur-sm rounded-full"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>
          {projectType} Project
        </p>
      </motion.div>

      {/* Retrofit Stats */}
      {isRetrofit && (
        <>
          {/* Efficiency Gap Card */}
          {efficiencyGap > 0 && (
            <motion.div
              className="absolute bottom-8 left-8 p-4 backdrop-blur-sm rounded-xl"
              style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>POTENTIAL SAVINGS</p>
              <p className="text-lg font-bold" style={{ color: THEME.text }}>{efficiencyGap}% power</p>
            </motion.div>
          )}

          {/* Burnout Frequency Card */}
          {burnoutFrequency > 0 && (
            <motion.div
              className="absolute bottom-8 right-8 p-4 backdrop-blur-sm rounded-xl"
              style={{ 
                backgroundColor: burnoutFrequency >= 3 ? 'rgba(239, 68, 68, 0.1)' : THEME.cardBg, 
                border: `2px solid ${burnoutFrequency >= 3 ? 'rgba(239, 68, 68, 0.3)' : THEME.cardBorder}` 
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-xs font-semibold" style={{ color: burnoutFrequency >= 3 ? '#EF4444' : THEME.accent }}>
                BURNOUT ISSUES
              </p>
              <p className="text-lg font-bold" style={{ color: burnoutFrequency >= 3 ? '#EF4444' : THEME.text }}>
                {burnoutFrequency}x / year
              </p>
            </motion.div>
          )}
        </>
      )}

      {/* Greenfield Message */}
      {!isRetrofit && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 p-4 backdrop-blur-sm rounded-xl text-center"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkle size={20} weight="fill" color={THEME.accent} className="mx-auto mb-2" />
          <p className="text-sm font-medium" style={{ color: THEME.text }}>Fresh Start - Optimal Design</p>
        </motion.div>
      )}
    </div>
  );
}

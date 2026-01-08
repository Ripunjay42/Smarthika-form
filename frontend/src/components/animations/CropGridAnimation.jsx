import { motion } from 'framer-motion';
import { Plant, Tree, Drop, Ruler } from '@phosphor-icons/react';

const THEME = {
  accent: '#689F38',
  accentLight: 'rgba(104, 159, 56, 0.3)',
  text: '#33691E',
  textLight: '#558B2F',
  background: '#EDEDE7',
  cardBg: 'rgba(104, 159, 56, 0.1)',
  cardBorder: 'rgba(104, 159, 56, 0.3)',
};

const cropColors = {
  mango: '#FFB800',
  coconut: '#228B22',
  banana: '#90EE90',
  sugarcane: '#32CD32',
  paddy: '#9ACD32',
  vegetables: '#00AA00',
  cotton: '#F5F5DC',
  pulses: '#DEB887',
};

export default function CropGridAnimation({ 
  cropType = 'mango', 
  plantSpacing = 10, 
  cropAge = 'sapling',
  irrigationMethod = 'drip',
  plantCount = 0
}) {
  // Tree size based on age
  const treeScale = cropAge === 'mature' ? 1 : cropAge === 'young' ? 0.65 : 0.35;
  const cropColor = cropColors[cropType] || cropColors.mango;
  
  // Grid size based on spacing (inverse relationship)
  const gridSize = Math.max(3, Math.min(6, Math.floor(30 / plantSpacing)));

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Top-down Field View */}
      <motion.div
        className="relative w-80 h-80"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          className="w-full h-full rounded-2xl shadow-2xl p-4 overflow-hidden"
          style={{ 
            background: 'linear-gradient(to bottom right, #8B4513, #6D3610)',
            transformStyle: 'preserve-3d'
          }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: 50 }}
          transition={{ duration: 0.5 }}
        >
          {/* Crop Grid */}
          <div 
            className="h-full gap-2 p-2"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`
            }}
          >
            {Array.from({ length: gridSize * gridSize }).map((_, i) => (
              <motion.div
                key={i}
                className="relative flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
              >
                {/* Tree/Plant */}
                <motion.div
                  className="rounded-full shadow-lg relative"
                  style={{ 
                    width: '85%', 
                    height: '85%',
                    background: `radial-gradient(circle at 30% 30%, ${cropColor}, ${THEME.accent})`
                  }}
                  animate={{ scale: treeScale }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Tree Crown Inner */}
                  <div 
                    className="absolute inset-2 rounded-full" 
                    style={{ backgroundColor: `${cropColor}80` }} 
                  />
                  
                  {/* Small water drop for drip irrigation */}
                  {irrigationMethod === 'drip' && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                      style={{ backgroundColor: '#60A5FA' }}
                      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                    />
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Drip Lines */}
          {irrigationMethod === 'drip' && (
            <div className="absolute inset-4 pointer-events-none" style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${gridSize}, 1fr)` 
            }}>
              {Array.from({ length: gridSize }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-full w-0.5 mx-auto"
                  style={{ backgroundColor: 'rgba(96, 165, 250, 0.4)' }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                />
              ))}
            </div>
          )}

          {/* Sprinkler overlay for sprinkler irrigation */}
          {irrigationMethod === 'sprinkler' && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ 
                background: 'radial-gradient(circle, rgba(96, 165, 250, 0.2) 0%, transparent 70%)'
              }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        className="absolute bottom-8 left-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <Tree size={24} weight="duotone" color={cropColor} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>PRIMARY CROP</p>
            <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{cropType}</p>
          </div>
        </div>
      </motion.div>

      {/* Crop Age Card */}
      <motion.div
        className="absolute top-8 right-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <Plant size={24} weight="duotone" color={THEME.accent} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>CROP AGE</p>
            <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{cropAge}</p>
          </div>
        </div>
      </motion.div>

      {/* Spacing Card */}
      <motion.div
        className="absolute bottom-8 right-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <Ruler size={24} weight="duotone" color={THEME.accent} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>SPACING</p>
            <p className="text-sm font-bold" style={{ color: THEME.text }}>{plantSpacing} ft</p>
          </div>
        </div>
      </motion.div>

      {/* Irrigation Method Card */}
      <motion.div
        className="absolute top-8 left-8 p-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center gap-3">
          <Drop size={24} weight="duotone" color="#60A5FA" />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>IRRIGATION</p>
            <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{irrigationMethod}</p>
          </div>
        </div>
      </motion.div>

      {/* Plant Count Badge */}
      {plantCount > 0 && (
        <motion.div
          className="absolute top-1/2 left-8 -translate-y-1/2 px-4 py-2 rounded-full"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-lg font-bold" style={{ color: THEME.text }}>{plantCount}</span>
          <span className="text-xs ml-1" style={{ color: THEME.textLight }}>plants</span>
        </motion.div>
      )}
    </div>
  );
}

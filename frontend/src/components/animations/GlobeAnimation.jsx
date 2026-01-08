import { motion } from 'framer-motion';
import { Globe, MapPin, WifiHigh } from '@phosphor-icons/react';

const THEME = {
  accent: '#689F38',
  accentLight: 'rgba(104, 159, 56, 0.3)',
  accentVeryLight: 'rgba(104, 159, 56, 0.1)',
  text: '#33691E',
  textLight: '#558B2F',
  background: '#EDEDE7',
  cardBg: 'rgba(104, 159, 56, 0.1)',
  cardBorder: 'rgba(104, 159, 56, 0.3)',
};

export default function GlobeAnimation({ farmerName = '', district = '', state = '' }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 400 400">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={THEME.accent} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Rotating Globe */}
      <motion.div
        className="relative"
        animate={{ rotateY: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-72 h-72 relative">
          {/* Globe Base */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${THEME.accentLight}, ${THEME.accent}40)`,
              boxShadow: `0 0 60px ${THEME.accentLight}, inset 0 0 40px ${THEME.accentVeryLight}`,
              border: `2px solid ${THEME.accentLight}`,
            }}
          />
          
          {/* Latitude Lines */}
          {[25, 50, 75].map((deg, i) => (
            <motion.div
              key={`lat-${i}`}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: `${100 - deg * 0.7}%`,
                height: `${100 - deg * 0.7}%`,
                transform: 'translate(-50%, -50%)',
                border: `1px solid ${THEME.accentLight}`,
              }}
            />
          ))}
          
          {/* Longitude Lines */}
          {[0, 45, 90, 135].map((deg, i) => (
            <motion.div
              key={`lng-${i}`}
              className="absolute left-1/2 top-1/2 w-px h-full origin-center"
              style={{ 
                transform: `translate(-50%, -50%) rotate(${deg}deg)`,
                backgroundColor: THEME.accentLight 
              }}
            />
          ))}

          {/* Location Marker */}
          <motion.div
            className="absolute"
            style={{ top: '35%', left: '55%' }}
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MapPin size={28} weight="fill" color={THEME.accent} />
            <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: THEME.accent, opacity: 0.3 }} />
          </motion.div>

          {/* Center Globe Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe size={48} weight="duotone" color={THEME.accentLight} style={{ opacity: 0.3 }} />
          </div>
        </div>
      </motion.div>

      {/* Identity Card */}
      <motion.div
        className="absolute top-16 left-8 px-5 py-4 backdrop-blur-sm rounded-xl"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="flex items-center gap-3">
          <MapPin size={20} weight="duotone" color={THEME.accent} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>IDENTITY</p>
            <p className="text-sm font-bold" style={{ color: THEME.text }}>
              {farmerName || 'New Farmer'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Location Card */}
      {(district || state) && (
        <motion.div
          className="absolute bottom-16 right-8 px-5 py-4 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3">
            <WifiHigh size={20} weight="duotone" color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>LOCATION</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>
                {district && state ? `${district}, ${state}` : district || state || 'India'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Network Status */}
      <motion.div
        className="absolute bottom-16 left-8 px-4 py-2 backdrop-blur-sm rounded-lg"
        style={{ backgroundColor: THEME.cardBg, border: `1px solid ${THEME.cardBorder}` }}
      >
        <p className="text-xs font-medium" style={{ color: THEME.textLight }}>TerraTwin Network</p>
      </motion.div>
    </div>
  );
}

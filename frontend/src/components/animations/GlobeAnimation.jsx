import { motion } from 'framer-motion';
import { Globe, MapPin, WifiHigh, User, Users } from 'lucide-react';

const THEME = {
  accent: '#689F38',
  accentLight: 'rgba(104, 159, 56, 0.3)',
  accentVeryLight: 'rgba(104, 159, 56, 0.1)',
  text: '#33691E',
  textLight: '#558B2F',
  background: '#EDEDE7',
  cardBg: 'rgba(250, 240, 191, 0.7)',
  cardBorder: 'rgba(104, 159, 56, 0.3)',
};

export default function GlobeAnimation({ farmerName = '', whatsappNumber = '', laborCount = 0 }) {
  const hasData = farmerName || whatsappNumber;
  
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>

      {/* Rotating Earth Globe */}
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-80 h-80 relative">
          {/* Earth Base */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(135deg, #FAF0BF 0%, #EDEDE7 100%)`,
              boxShadow: `
                inset -20px -20px 40px rgba(104, 159, 56, 0.15),
                inset 10px 10px 30px rgba(255, 255, 255, 0.8),
                0 20px 60px rgba(104, 159, 56, 0.2)
              `,
              border: `3px solid ${THEME.cardBorder}`
            }}
          />

          {/* Latitude Lines */}
          {[20, 35, 50, 65, 80].map((deg, i) => (
            <motion.div
              key={`lat-${i}`}
              className="absolute left-1/2 top-1/2 rounded-full border"
              style={{
                width: `${100 - deg * 0.9}%`,
                height: `${100 - deg * 0.9}%`,
                transform: 'translate(-50%, -50%)',
                borderColor: THEME.accent,
                borderWidth: '2px',
                opacity: 0.3,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
          
          {/* Longitude Lines */}
          {[0, 30, 60, 90, 120, 150].map((deg, i) => (
            <motion.div
              key={`lng-${i}`}
              className="absolute left-1/2 top-1/2 origin-center"
              style={{ 
                width: '2px',
                height: '100%',
                transform: `translate(-50%, -50%) rotate(${deg}deg)`,
                background: `linear-gradient(to bottom, transparent 0%, ${THEME.accent} 50%, transparent 100%)`,
                opacity: 0.25,
              }}
            />
          ))}

          {/* Location Marker - India */}
          {hasData && (
            <motion.div
              className="absolute"
              style={{ top: '35%', left: '60%' }}
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="relative">
                <div className="w-5 h-5 rounded-full shadow-lg" style={{ backgroundColor: THEME.accent, boxShadow: `0 0 15px ${THEME.accent}` }} />
                <div className="absolute inset-0 w-5 h-5 rounded-full animate-ping" style={{ backgroundColor: THEME.accent, opacity: 0.5 }} />
                <MapPin 
                  size={14} 
                  color="#FAF0BF" 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              </div>
            </motion.div>
          )}

          {/* Globe Icon Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe size={64} color={THEME.accent} style={{ opacity: 0.15 }} />
          </div>
        </div>
      </motion.div>

      {/* Farmer Name Card */}
      {farmerName && (
        <motion.div
          className="absolute top-16 left-8 px-5 py-4 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
          transition={{ y: { duration: 3, repeat: Infinity } }}
        >
          <div className="flex items-center gap-3">
            <User size={20} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>FARMER</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>{farmerName}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* WhatsApp Card */}
      {whatsappNumber && (
        <motion.div
          className="absolute top-16 right-8 px-5 py-4 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
          transition={{ y: { duration: 3, repeat: Infinity, delay: 0.5 } }}
        >
          <div className="flex items-center gap-3">
            <WifiHigh size={20} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>CONTACT</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>+91 {whatsappNumber}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Labor Count Card */}
      {laborCount > 0 && (
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 px-5 py-4 backdrop-blur-sm rounded-xl"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [20, 12, 20] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="flex items-center gap-3">
            <Users size={24} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>WORKFORCE</p>
              <p className="text-lg font-bold" style={{ color: THEME.text }}>{laborCount} Workers</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Network Status */}
      {!hasData && (
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 px-6 py-4 backdrop-blur-sm rounded-xl text-center"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <WifiHigh size={32} color={THEME.accent} className="mx-auto mb-2" />
          <p className="text-sm font-medium" style={{ color: THEME.text }}>Awaiting Farmer Details...</p>
          <p className="text-xs mt-1" style={{ color: THEME.textLight }}>Fill the form to connect</p>
        </motion.div>
      )}
    </div>
  );
}

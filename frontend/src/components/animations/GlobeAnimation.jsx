import { motion } from 'framer-motion';
import { MapPin, WifiHigh, User, Users, Calendar, Navigation } from 'lucide-react';

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

export default function GlobeAnimation({ 
  farmerName = '', 
  whatsappNumber = '', 
  laborCount = 0,
  age = 0,
  country = '',
  state = '',
  village = '',
  farmSameLocation = ''
}) {
  const hasData = farmerName || whatsappNumber;
  
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>

      {/* Simplified Globe - Lightweight version */}
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-64 h-64 relative">
          {/* Simple Earth Circle */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(135deg, #FAF0BF 0%, #EDEDE7 100%)`,
              boxShadow: `
                inset -10px -10px 20px rgba(104, 159, 56, 0.1),
                inset 5px 5px 15px rgba(255, 255, 255, 0.6),
                0 10px 30px rgba(104, 159, 56, 0.15)
              `,
              border: `2px solid ${THEME.cardBorder}`
            }}
          />

          {/* Single decorative circle line */}
          <motion.div
            className="absolute left-1/2 top-1/2 rounded-full border"
            style={{
              width: '85%',
              height: '85%',
              transform: 'translate(-50%, -50%)',
              borderColor: THEME.accent,
              borderWidth: '1px',
              opacity: 0.25,
            }}
            animate={{ opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Location Marker - Single dot */}
          {hasData && (
            <motion.div
              className="absolute"
              style={{ top: '35%', left: '60%' }}
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.15, 1],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <div className="relative">
                <div 
                  className="w-4 h-4 rounded-full shadow-lg" 
                  style={{ 
                    backgroundColor: THEME.accent, 
                    boxShadow: `0 0 10px ${THEME.accent}` 
                  }} 
                />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Farmer Name Card */}
      {farmerName && (
        <motion.div
          className="absolute top-16 left-8 px-4 py-3 rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `1px solid ${THEME.cardBorder}`, backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
          transition={{ y: { duration: 3, repeat: Infinity } }}
        >
          <div className="flex items-center gap-2">
            <User size={18} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>FARMER</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>{farmerName}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Age Card */}
      {age > 0 && (
        <motion.div
          className="absolute top-40 right-8 px-4 py-3 rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `1px solid ${THEME.cardBorder}`, backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
          transition={{ y: { duration: 3, repeat: Infinity, delay: 0.2 } }}
        >
          <div className="flex items-center gap-2">
            <Calendar size={18} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>AGE</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>{age} yrs</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* WhatsApp Card */}
      {whatsappNumber && (
        <motion.div
          className="absolute top-16 right-8 px-4 py-3 rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `1px solid ${THEME.cardBorder}`, backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
          transition={{ y: { duration: 3, repeat: Infinity, delay: 0.4 } }}
        >
          <div className="flex items-center gap-2">
            <WifiHigh size={18} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>CONTACT</p>
              <p className="text-sm font-bold" style={{ color: THEME.text }}>+91 {whatsappNumber}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Location Card */}
      {village && (
        <motion.div
          className="absolute bottom-24 right-8 px-4 py-3 rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `1px solid ${THEME.cardBorder}`, backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <Navigation size={18} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>LOCATION</p>
              <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>{village}</p>
              {state && <p className="text-xs capitalize" style={{ color: THEME.textLight }}>{state}</p>}
            </div>
          </div>
        </motion.div>
      )}

      {/* Labor Count Card */}
      {laborCount > 0 && (
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `1px solid ${THEME.cardBorder}`, backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [20, 12, 20] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="flex items-center gap-2">
            <Users size={20} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>WORKFORCE</p>
              <p className="text-base font-bold" style={{ color: THEME.text }}>{laborCount}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Farm Location Card */}
      {farmSameLocation && (
        <motion.div
          className="absolute bottom-24 left-8 px-4 py-3 rounded-lg"
          style={{ backgroundColor: THEME.cardBg, border: `1px solid ${THEME.cardBorder}`, backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <MapPin size={18} color={THEME.accent} />
            <div>
              <p className="text-xs font-semibold" style={{ color: THEME.accent }}>FARM</p>
              <p className="text-sm font-bold capitalize" style={{ color: THEME.text }}>
                {farmSameLocation === 'yes' ? 'Same' : 'Different'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Network Status */}
      {/* {!hasData && (
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 px-5 py-3 rounded-lg text-center"
          style={{ backgroundColor: THEME.cardBg, border: `1px solid ${THEME.cardBorder}`, backdropFilter: 'blur(4px)' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <WifiHigh size={28} color={THEME.accent} className="mx-auto mb-1" />
          <p className="text-sm font-medium" style={{ color: THEME.text }}>Fill the form</p>
          <p className="text-xs mt-0.5" style={{ color: THEME.textLight }}>to see details</p>
        </motion.div>
      )} */}
    </div>
  );
}

import { motion } from 'framer-motion';
import { Calendar, ChartLine, Sun, CloudRain, Leaf, Flower, Grains, CalendarCheck, Plant } from '@phosphor-icons/react';

const THEME = {
  accent: '#689F38',
  accentLight: 'rgba(104, 159, 56, 0.3)',
  text: '#33691E',
  textLight: '#558B2F',
  background: '#EDEDE7',
  cardBg: 'rgba(104, 159, 56, 0.1)',
  cardBorder: 'rgba(104, 159, 56, 0.3)',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SEASON_ICONS = {
  spring: Flower,
  summer: Sun,
  monsoon: CloudRain,
  autumn: Leaf,
  winter: Grains,
};

const getSeasonForMonth = (monthIndex) => {
  if (monthIndex >= 2 && monthIndex <= 4) return 'spring';
  if (monthIndex >= 5 && monthIndex <= 6) return 'summer';
  if (monthIndex >= 7 && monthIndex <= 9) return 'monsoon';
  if (monthIndex >= 10 && monthIndex <= 11) return 'autumn';
  return 'winter';
};

const getSeasonColor = (season) => {
  switch(season) {
    case 'spring': return '#F472B6';
    case 'summer': return '#FBBF24';
    case 'monsoon': return '#3B82F6';
    case 'autumn': return '#F97316';
    case 'winter': return '#A78BFA';
    default: return THEME.accent;
  }
};

export default function HarvestWheelAnimation({ 
  plantingMonth = 0,
  harvestMonth = 6,
  expectedYield = 0,
  yieldUnit = 'tonnes/acre'
}) {
  const radius = 120;
  const innerRadius = 60;
  const centerX = 150;
  const centerY = 150;

  const getPointOnCircle = (index, r) => {
    const angle = (index * 30 - 90) * (Math.PI / 180);
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  };

  // Create arc path between months
  const createArcPath = (startMonth, endMonth) => {
    const startAngle = (startMonth * 30 - 90) * (Math.PI / 180);
    const endAngle = (endMonth * 30 - 90) * (Math.PI / 180);
    const largeArc = endMonth - startMonth > 6 ? 1 : 0;
    
    const startX = centerX + radius * Math.cos(startAngle);
    const startY = centerY + radius * Math.sin(startAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Calendar Wheel SVG */}
      <svg viewBox="0 0 300 300" className="w-72 h-72">
        {/* Outer Ring */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={THEME.cardBorder}
          strokeWidth="30"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
        
        {/* Growing Season Arc */}
        <motion.path
          d={createArcPath(plantingMonth, harvestMonth)}
          fill="none"
          stroke={THEME.accent}
          strokeWidth="30"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Month Markers */}
        {MONTHS.map((month, index) => {
          const point = getPointOnCircle(index, radius);
          const labelPoint = getPointOnCircle(index, radius + 24);
          const isPlanting = index === plantingMonth;
          const isHarvest = index === harvestMonth;
          const isInSeason = index >= plantingMonth && index <= harvestMonth;
          const season = getSeasonForMonth(index);
          const SeasonIcon = SEASON_ICONS[season];
          
          return (
            <g key={month}>
              {/* Month Dot */}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={isPlanting || isHarvest ? 10 : 5}
                fill={isPlanting ? '#22C55E' : isHarvest ? '#F59E0B' : isInSeason ? THEME.accent : '#9CA3AF'}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 + 0.3 }}
              />
              
              {/* Month Label */}
              <motion.text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fontWeight={isPlanting || isHarvest ? 'bold' : 'normal'}
                fill={isPlanting ? '#22C55E' : isHarvest ? '#F59E0B' : THEME.textLight}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 + 0.5 }}
              >
                {month}
              </motion.text>

              {/* Planting/Harvest Icon */}
              {isPlanting && (
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: 'spring' }}
                >
                  <circle cx={point.x} cy={point.y - 20} r="12" fill="#22C55E" />
                  {/* Seedling icon path */}
                  <g transform={`translate(${point.x - 6}, ${point.y - 26})`}>
                    <path d="M6 12V8M6 8C6 8 4 6 2 6C2 8 4 8 6 8ZM6 8C6 8 8 6 10 6C10 8 8 8 6 8Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </g>
                </motion.g>
              )}
              {isHarvest && (
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: 'spring' }}
                >
                  <circle cx={point.x} cy={point.y - 20} r="12" fill="#F59E0B" />
                  {/* Wheat/grain icon path */}
                  <g transform={`translate(${point.x - 6}, ${point.y - 26})`}>
                    <path d="M6 12V6M3 3L6 6L9 3M2 5L6 8L10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </g>
                </motion.g>
              )}
            </g>
          );
        })}

        {/* Center Circle */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={innerRadius}
          fill={THEME.background}
          stroke={THEME.cardBorder}
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />
      </svg>

      {/* Center Content */}
      <motion.div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: innerRadius * 2 - 20 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Calendar size={28} weight="duotone" color={THEME.accent} />
        <p className="text-lg font-bold mt-1" style={{ color: THEME.text }}>
          {harvestMonth - plantingMonth} mo
        </p>
        <p className="text-xs" style={{ color: THEME.textLight }}>Growth Cycle</p>
      </motion.div>

      {/* Legend */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 px-5 py-3 backdrop-blur-sm rounded-full flex gap-5"
        style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs font-medium" style={{ color: THEME.textLight }}>Planting</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs font-medium" style={{ color: THEME.textLight }}>Harvest</span>
        </div>
      </motion.div>

      {/* Yield Card */}
      {expectedYield > 0 && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 backdrop-blur-sm rounded-xl flex items-center gap-3"
          style={{ backgroundColor: THEME.cardBg, border: `2px solid ${THEME.cardBorder}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ChartLine size={24} weight="duotone" color={THEME.accent} />
          <div>
            <p className="text-xs font-semibold" style={{ color: THEME.accent }}>EXPECTED YIELD</p>
            <p className="text-lg font-bold" style={{ color: THEME.text }}>
              {expectedYield} {yieldUnit}
            </p>
          </div>
        </motion.div>
      )}

      {/* Season Icons Around */}
      {Object.entries(SEASON_ICONS).map(([season, Icon], index) => {
        const positions = [
          { top: '20%', left: '10%' },
          { top: '20%', right: '10%' },
          { bottom: '20%', right: '10%' },
          { bottom: '20%', left: '10%' },
          { top: '50%', left: '5%' },
        ];
        const pos = positions[index] || positions[0];
        
        return (
          <motion.div
            key={season}
            className="absolute opacity-20"
            style={pos}
            animate={{ 
              y: [0, -8, 0],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ 
              duration: 3 + index, 
              repeat: Infinity,
              delay: index * 0.3
            }}
          >
            <Icon size={28} weight="duotone" color={getSeasonColor(season)} />
          </motion.div>
        );
      })}
    </div>
  );
}

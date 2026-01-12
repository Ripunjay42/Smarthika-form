import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sprout,
  Map,
  Droplet,
  Route,
  Zap,
  Warehouse,
  Leaf,
  LineChart,
  Building2,
  Eye,
} from 'lucide-react';
import { MODULES } from '../../constants/formConstants';
import { useFormContext } from '../../context/FormContext';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

const MODULE_ICONS = {
  profile: Sprout,
  canvas: Map,
  heart: Droplet,
  arteries: Route,
  pulse: Zap,
  shelter: Warehouse,
  biology: Leaf,
  baseline: LineChart,
  shed: Building2,
  vision: Eye
};

export default function ModuleProgress({ isExpanded, onToggle }) {
  const { currentModule, completedModules, goToModule } = useFormContext();

  return (
    <div className="h-full flex flex-col p-3 bg-gray-100">
      {/* Header */}
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center  shrink-0 ml-2"
            style={{ backgroundColor: 'rgba(104, 159, 56, 0.15)' }}
          >
            <Sprout size={24} color={ICON_COLOR} strokeWidth={ICON_STROKE_WIDTH} />
          </div>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <h1 className="text-lg font-bold whitespace-nowrap" style={{ color: '#33691E' }}>SMARTHIKA</h1>
              <p className="text-xs font-medium whitespace-nowrap" style={{ color: '#558B2F' }}>Farm Intelligence</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Current Module Info */}
      {isExpanded && (
        <motion.div
          key={currentModule}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4 p-3 rounded-xl"
          style={{ backgroundColor: 'rgba(104, 159, 56, 0.08)' }}
        >
          <p className="text-xs uppercase tracking-wider mb-1 font-medium" style={{ color: '#558B2F' }}>
            Module {currentModule + 1} of {MODULES.length}
          </p>
          <h2 className="text-base font-bold" style={{ color: '#33691E' }}>
            {MODULES[currentModule]?.name}
          </h2>
        </motion.div>
      )}

      {/* Module List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="space-y-1">
          {MODULES.map((module, index) => {
            const isCompleted = completedModules.includes(index);
            const isCurrent = currentModule === index;
            const isAccessible = index <= currentModule || isCompleted;
            const IconComponent = MODULE_ICONS[module.id] || Sprout;

            return (
              <motion.button
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => isAccessible && goToModule(index)}
                disabled={!isAccessible}
                className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 ${isExpanded ? '' : 'justify-center'}`}
                style={{
                  backgroundColor: isCurrent ? 'transparent' : 'transparent',
                  opacity: isAccessible ? 1 : 0.4,
                  cursor: isAccessible ? 'pointer' : 'default'
                }}
                whileHover={isAccessible ? { backgroundColor: 'transparent' } : {}}
                title={!isExpanded ? module.name : undefined}
              >
                {/* Module Icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: isCurrent ? 'rgba(104, 159, 56, 0.2)' : 'transparent'
                  }}
                >
                  <IconComponent 
                    size={20} 
                    color={ICON_COLOR}
                    strokeWidth={ICON_STROKE_WIDTH}
                  />
                </div>

                {/* Module Info - Only when expanded */}
                {isExpanded && (
                  <div className="text-left flex-1 min-w-0">
                    <p 
                      className="text-sm font-medium truncate"
                      style={{ color: isCurrent ? '#33691E' : '#558B2F' }}
                    >
                      {module.name}
                    </p>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer with Progress & Toggle Button */}
      <div className="mt-4 pt-3">
        {isExpanded && (
          <div className="mb-3">
            <div className="flex justify-between text-xs font-medium mb-2" style={{ color: '#558B2F' }}>
              <span>Progress</span>
              <span style={{ color: '#33691E' }}>{completedModules.length}/{MODULES.length}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(104, 159, 56, 0.15)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: '#689F38' }}
                initial={{ width: 0 }}
                animate={{ width: `${(completedModules.length / MODULES.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
        
        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggle}
          className={`w-full flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${isExpanded ? '' : 'justify-center'}`}
          style={{ backgroundColor: 'rgba(104, 159, 56, 0.08)' }}
        >
          {isExpanded ? (
            <>
              <ChevronLeft size={18} color={ICON_COLOR} strokeWidth={ICON_STROKE_WIDTH} />
              <span className="text-sm font-medium" style={{ color: '#558B2F' }}></span>
            </>
          ) : (
            <ChevronRight size={18} color={ICON_COLOR} strokeWidth={ICON_STROKE_WIDTH} />
          )}
        </motion.button>
      </div>
    </div>
  );
}

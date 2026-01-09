import { MODULES } from '../../constants/formConstants';
import { useFormContext } from '../../context/FormContext';
import {
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
  vision: Eye,
};

export default function MobileModuleProgress() {
  const { currentModule, completedModules, goToModule } = useFormContext();

  return (
    <div
      className="w-full px-3 py-2"
      style={{
        backgroundColor: '#FAF0BF',
      }}
    >
      <div 
        className="flex items-center gap-2 overflow-x-auto overflow-y-hidden hide-scrollbar"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {MODULES.map((module, index) => {
          const Icon = MODULE_ICONS[module.id] || Sprout;
          const isCurrent = index === currentModule;
          const isCompleted = completedModules.includes(index);
          const isAccessible = index <= currentModule || isCompleted;

          return (
            <button
              key={module.id}
              type="button"
              onClick={() => isAccessible && goToModule(index)}
              disabled={!isAccessible}
              className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              title={module.name}
              aria-label={module.name}
              style={{
                backgroundColor: isCurrent
                  ? 'rgba(104, 159, 56, 0.18)'
                  : isCompleted
                  ? 'rgba(104, 159, 56, 0.10)'
                  : 'transparent',
                opacity: isAccessible ? 1 : 0.4,
                border: isCurrent ? '2px solid rgba(104, 159, 56, 0.35)' : '2px solid transparent',
              }}
            >
              <Icon size={18} color={ICON_COLOR} strokeWidth={ICON_STROKE_WIDTH} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

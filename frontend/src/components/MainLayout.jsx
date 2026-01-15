import { useState } from 'react';
import ModuleProgress from './layout/ModuleProgress';
import FormPanel from './layout/FormPanel';
import AnimationPanel from './animations/AnimationPanel';
import MobileModuleProgress from './layout/MobileModuleProgress';

export default function MainLayout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div
      className="h-screen w-screen flex flex-col md:flex-col lg:flex-row overflow-hidden bg-gray-100"
    >
      {/* Mobile & Tablet Top Bar - Module Progress (icons only) */}
      <div className="lg:hidden shrink-0">
        <MobileModuleProgress />
      </div>

      {/* Left Panel - Module Progress (visible only on large screens) */}
      <div
        className="hidden lg:block shrink-0 transition-all duration-300"
        style={{
          width: isSidebarExpanded ? '280px' : '72px',
          borderRight: '1px solid var(--color-accent)33',
        }}
      >
        <ModuleProgress
          isExpanded={isSidebarExpanded}
          onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
        />
      </div>

      {/* Top/Center Panel - Animation (visible only on large screens) */}
      <div
        className="hidden lg:block w-full lg:flex-1 min-w-0 h-[35vh] sm:h-[40vh] lg:h-auto bg-gray-100"
      >
        <AnimationPanel />
      </div>

      {/* Bottom/Right Panel - Form (below top bar for md screens, right side for lg) */}
      <div className="w-full lg:flex-1 bg-white shadow-2xl flex-1 min-h-0">
        <FormPanel />
      </div>
    </div>
  );
}

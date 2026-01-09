import { useState } from 'react';
import ModuleProgress from './layout/ModuleProgress';
import FormPanel from './layout/FormPanel';
import AnimationPanel from './animations/AnimationPanel';
import MobileModuleProgress from './layout/MobileModuleProgress';

export default function MainLayout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div
      className="h-screen w-screen flex flex-col md:flex-row overflow-hidden"
      style={{ backgroundColor: '#FAF0BF' }}
    >
      {/* Mobile Top Bar - Module Progress (icons only) */}
      <div className="md:hidden shrink-0">
        <MobileModuleProgress />
      </div>

      {/* Left Panel - Module Progress (hidden on mobile) */}
      <div
        className="hidden md:block shrink-0 transition-all duration-300"
        style={{
          width: isSidebarExpanded ? '280px' : '72px',
          borderRight: '1px solid #689F3833',
        }}
      >
        <ModuleProgress
          isExpanded={isSidebarExpanded}
          onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
        />
      </div>

      {/* Top/Center Panel - Animation (on mobile it stays on top) */}
      <div
        className="w-full md:flex-1 min-w-0 h-[35vh] sm:h-[40vh] md:h-auto"
        style={{ backgroundColor: '#EDEDE7' }}
      >
        <AnimationPanel />
      </div>

      {/* Bottom/Right Panel - Form */}
      <div className="w-full lg:w-[620px] bg-white shadow-2xl flex-1 md:flex-none min-h-0">
        <FormPanel />
      </div>
    </div>
  );
}

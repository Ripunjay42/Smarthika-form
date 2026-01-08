import { useState } from 'react';
import ModuleProgress from './layout/ModuleProgress';
import FormPanel from './layout/FormPanel';
import AnimationPanel from './animations/AnimationPanel';

export default function MainLayout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="h-screen w-screen flex overflow-hidden" style={{ backgroundColor: '#FAF0BF' }}>
      {/* Left Panel - Module Progress */}
      <div 
        className="shrink-0 transition-all duration-300" 
        style={{ 
          width: isSidebarExpanded ? '280px' : '72px',
          borderRight: '1px solid #689F3833' 
        }}
      >
        <ModuleProgress 
          isExpanded={isSidebarExpanded} 
          onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)} 
        />
      </div>

      {/* Center Panel - Animation */}
      <div className="flex-1 min-w-0" style={{ backgroundColor: '#EDEDE7' }}>
        <AnimationPanel />
      </div>

      {/* Right Panel - Form */}
      <div className="w-[720px] shrink-0 bg-white shadow-2xl">
        <FormPanel />
      </div>
    </div>
  );
}

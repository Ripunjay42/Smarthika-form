import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle } from '@phosphor-icons/react';
import { useFormContext } from '../../context/FormContext';
import { MODULES } from '../../constants/formConstants';
import {
  ProfileForm,
  CanvasForm,
  HeartForm,
  ArteriesForm,
  PulseForm,
  ShelterForm,
  BiologyForm,
  BaselineForm,
  ShedForm,
  VisionForm,
} from '../modules';

const formComponents = [
  ProfileForm,
  CanvasForm,
  HeartForm,
  ArteriesForm,
  PulseForm,
  ShelterForm,
  BiologyForm,
  BaselineForm,
  ShedForm,
  VisionForm,
];

export default function FormPanel() {
  const { 
    currentModule, 
    nextModule, 
    prevModule, 
    completeModule,
    completedModules 
  } = useFormContext();

  const CurrentForm = formComponents[currentModule];
  const isLastModule = currentModule === MODULES.length - 1;
  const isFirstModule = currentModule === 0;

  const handleContinue = () => {
    completeModule(currentModule);
    if (!isLastModule) {
      nextModule();
    }
  };

  const handleSubmit = () => {
    completeModule(currentModule);
    // Handle final submission
    alert('Form submitted successfully! Check console for data.');
    console.log('Form data ready for submission');
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#FAF0BF' }}>
      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentModule}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {CurrentForm && <CurrentForm />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div 
        className="flex-shrink-0 px-8 py-4 backdrop-blur-sm"
        style={{ 
          backgroundColor: 'rgba(250, 240, 191, 0.9)',
          borderTop: '2px solid rgba(104, 159, 56, 0.15)'
        }}
      >
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={prevModule}
            disabled={isFirstModule}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200"
            style={{
              opacity: isFirstModule ? 0 : 1,
              pointerEvents: isFirstModule ? 'none' : 'auto',
              backgroundColor: 'rgba(104, 159, 56, 0.1)',
              color: '#33691E',
              border: '2px solid rgba(104, 159, 56, 0.2)'
            }}
          >
            <ArrowLeft size={18} weight="bold" />
            Back
          </motion.button>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {MODULES.map((_, index) => (
              <motion.div
                key={index}
                className="rounded-full transition-all duration-200"
                style={{
                  width: index === currentModule ? '32px' : '8px',
                  height: '8px',
                  backgroundColor: index === currentModule 
                    ? '#689F38' 
                    : completedModules.includes(index)
                    ? 'rgba(104, 159, 56, 0.6)'
                    : 'rgba(104, 159, 56, 0.2)'
                }}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>

          {/* Continue/Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={isLastModule ? handleSubmit : handleContinue}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
            style={{
              backgroundColor: '#689F38',
              color: '#FAF0BF',
              boxShadow: '0 4px 14px rgba(104, 159, 56, 0.3)'
            }}
          >
            {isLastModule ? (
              <>
                Complete
                <CheckCircle size={20} weight="bold" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={20} weight="bold" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

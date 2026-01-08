import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, PaperPlaneTilt, Warning } from '@phosphor-icons/react';
import { useFormContext } from '../../context/FormContext';
import { MODULES } from '../../constants/formConstants';
import { submitToGoogleSheets, validateFormData } from '../../services/googleSheets';
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
    completedModules,
    formData
  } = useFormContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const CurrentForm = formComponents[currentModule];
  const isLastModule = currentModule === MODULES.length - 1;
  const isFirstModule = currentModule === 0;

  const handleContinue = () => {
    completeModule(currentModule);
    if (!isLastModule) {
      nextModule();
    }
  };

  const handleSubmit = async () => {
    // Validate form data
    const validation = validateFormData(formData);
    
    if (!validation.isValid) {
      setSubmitError(validation.errors.join(', '));
      alert('⚠️ Please fill in required fields:\n' + validation.errors.join('\n'));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitToGoogleSheets(formData);
      
      if (result.success) {
        setSubmitSuccess(true);
        completeModule(currentModule);
        
        // Show success message
        setTimeout(() => {
          alert('✅ Form submitted successfully!\n\nYour data has been saved to:\nGoogle Drive > Farm Form Data > Farm Form Submissions');
        }, 300);
        
        // Optional: Reset form or redirect after successful submission
        setTimeout(() => {
          console.log('Form submitted successfully!', formData);
        }, 1000);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error.message);
      alert('❌ Submission failed. Please check your internet connection and try again.\n\nError: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
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
            whileHover={{ scale: isSubmitting || submitSuccess ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting || submitSuccess ? 1 : 0.98 }}
            onClick={isLastModule ? handleSubmit : handleContinue}
            disabled={isSubmitting || submitSuccess}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
            style={{
              backgroundColor: submitSuccess ? '#22C55E' : isSubmitting ? '#9CA3AF' : '#689F38',
              color: '#FAF0BF',
              boxShadow: '0 4px 14px rgba(104, 159, 56, 0.3)',
              opacity: isSubmitting ? 0.8 : 1,
              cursor: isSubmitting || submitSuccess ? 'not-allowed' : 'pointer'
            }}
          >
            {isLastModule ? (
              submitSuccess ? (
                <>
                  <CheckCircle size={20} weight="fill" />
                  Submitted!
                </>
              ) : isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <PaperPlaneTilt size={20} weight="bold" />
                  </motion.div>
                  Submitting...
                </>
              ) : submitError ? (
                <>
                  <Warning size={20} weight="bold" />
                  Retry Submit
                </>
              ) : (
                <>
                  Submit
                  <PaperPlaneTilt size={20} weight="bold" />
                </>
              )
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

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Send, AlertTriangle } from 'lucide-react';
import { useFormContext } from '../../context/FormContext';
import { MODULES } from '../../constants/formConstants';
import { submitToGoogleSheets, validateFormData } from '../../services/googleSheets';
import { validateAllModules, validateModule } from '../../utils/moduleValidation';
import { useScrollToElement } from '../../hooks/useScrollToElement';
import SubmissionPreview from './SubmissionPreview';
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
    goToModule,
    completedModules,
    formData,
    setErrorsForModule,
    setAllModuleErrors,
    clearErrorsForModule,
  } = useFormContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [showSubmitSuccessModal, setShowSubmitSuccessModal] = useState(false);
  
  const { scrollToElement, scrollToTop } = useScrollToElement();

  const CurrentForm = formComponents[currentModule];
  const isLastModule = currentModule === MODULES.length - 1;
  const isFirstModule = currentModule === 0;

  useEffect(() => {
    // If user navigates between modules, exit preview and scroll to top
    setIsPreviewing(false);
    setSubmitError(null);
    scrollToTop('smooth');
  }, [currentModule, scrollToTop]);

  const handleContinue = () => {
    const moduleId = MODULES[currentModule]?.id;
    const moduleData = moduleId ? formData?.[moduleId] : undefined;

    if (moduleId) {
      const validation = validateModule(moduleId, moduleData);
      if (!validation.isValid) {
        setErrorsForModule(moduleId, validation.fieldErrors);
        // Scroll to the first error field
        if (validation.fieldErrors && Object.keys(validation.fieldErrors).length > 0) {
          const firstErrorField = Object.keys(validation.fieldErrors)[0];
          const elementId = `field-${moduleId}-${firstErrorField}`;
          scrollToElement(elementId, 'smooth', 100);
        }
        return;
      }
      clearErrorsForModule(moduleId);
    }

    completeModule(currentModule);
    if (!isLastModule) {
      nextModule();
    }
  };

  const handleOpenPreview = () => {
    const moduleId = MODULES[currentModule]?.id;
    const moduleData = moduleId ? formData?.[moduleId] : undefined;

    if (moduleId) {
      const validation = validateModule(moduleId, moduleData);
      if (!validation.isValid) {
        setErrorsForModule(moduleId, validation.fieldErrors);
        // Scroll to the first error field
        if (validation.fieldErrors && Object.keys(validation.fieldErrors).length > 0) {
          const firstErrorField = Object.keys(validation.fieldErrors)[0];
          const elementId = `field-${moduleId}-${firstErrorField}`;
          scrollToElement(elementId, 'smooth', 100);
        }
        return;
      }
      clearErrorsForModule(moduleId);
    }

    completeModule(currentModule);
    setSubmitError(null);
    setIsPreviewing(true);
  };

  const handleClosePreview = () => {
    setIsPreviewing(false);
  };

  const handleSubmit = async () => {
    // Validate required fields across modules (no blocking alerts; navigate to first invalid module).
    const moduleValidation = validateAllModules(MODULES, formData);
    if (!moduleValidation.isValid) {
      setAllModuleErrors(moduleValidation.moduleErrors);
      setIsPreviewing(false);
      if (moduleValidation.firstInvalidModuleIndex >= 0) {
        goToModule(moduleValidation.firstInvalidModuleIndex);
      }
      setSubmitError('Please fill required fields before submitting.');
      return;
    }

    // Back-compat overall validator (kept for safety) but no alerts.
    const legacyValidation = validateFormData(formData);
    if (!legacyValidation.isValid) {
      setSubmitError(legacyValidation.errors.join(', '));
      setIsPreviewing(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Submit to Google Sheets (handles all files from canvas, shelter, etc.)
      const result = await submitToGoogleSheets(formData);
      
      if (result.success) {
        setSubmitSuccess(true);
        setShowSubmitSuccessModal(true);
        completeModule(currentModule);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#E5E7EB' }}>
      <AnimatePresence>
        {showSubmitSuccessModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Submission successful"
            onClick={() => setShowSubmitSuccessModal(false)}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl border shadow-xl"
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#E5E7EB',
                borderColor: 'rgba(104, 159, 56, 0.25)',
              }}
            >
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(104, 159, 56, 0.15)' }}
                  >
                    <CheckCircle size={22} style={{ color: '#689F38' }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold" style={{ color: '#33691E' }}>
                      Submitted successfully
                    </h3>
                    <p className="text-sm mt-1" style={{ color: '#558B2F' }}>
                      Your form has been successfully submitted. Thank you!
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="px-5 py-2.5 rounded-xl font-semibold"
                    style={{
                      backgroundColor: '#689F38',
                      color: '#E5E7EB',
                      boxShadow: '0 4px 14px rgba(104, 159, 56, 0.3)',
                    }}
                    onClick={() => setShowSubmitSuccessModal(false)}
                  >
                    Done
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 form-panel-scroll">
        <AnimatePresence mode="wait">
          <motion.div
            key={isPreviewing ? 'preview' : currentModule}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {isPreviewing ? <SubmissionPreview formData={formData} /> : CurrentForm ? <CurrentForm /> : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div 
        className="shrink-0 px-4 sm:px-6 md:px-8 py-3 sm:py-4 backdrop-blur-sm"
        style={{ 
          backgroundColor: 'rgba(229, 231, 235, 0.9)',
          borderTop: '2px solid rgba(104, 159, 56, 0.15)',
          paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))'
        }}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={isPreviewing ? handleClosePreview : prevModule}
            disabled={isPreviewing ? false : isFirstModule}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 shrink-0"
            style={{
              opacity: isPreviewing ? 1 : isFirstModule ? 0 : 1,
              pointerEvents: isPreviewing ? 'auto' : isFirstModule ? 'none' : 'auto',
              backgroundColor: 'rgba(104, 159, 56, 0.1)',
              color: '#33691E',
              border: '2px solid rgba(104, 159, 56, 0.2)'
            }}
          >
            <ArrowLeft size={18} />
            {isPreviewing ? 'Edit' : 'Back'}
          </motion.button>

          {/* Progress Indicator */}
          <div className="hidden sm:flex items-center gap-2">
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
            onClick={
              isPreviewing
                ? handleSubmit
                : isLastModule
                ? handleOpenPreview
                : handleContinue
            }
            disabled={isSubmitting || submitSuccess}
            className="flex items-center justify-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg whitespace-nowrap"
            style={{
              backgroundColor: submitSuccess ? '#22C55E' : isSubmitting ? '#9CA3AF' : '#689F38',
              color: '#E5E7EB',
              boxShadow: '0 4px 14px rgba(104, 159, 56, 0.3)',
              opacity: isSubmitting ? 0.8 : 1,
              cursor: isSubmitting || submitSuccess ? 'not-allowed' : 'pointer'
            }}
          >
            {isPreviewing ? (
              submitSuccess ? (
                <>
                  <CheckCircle size={20} />
                  Submitted!
                </>
              ) : isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Send size={20} />
                  </motion.div>
                  Submitting...
                </>
              ) : submitError ? (
                <>
                  <AlertTriangle size={20} />
                  Retry Submit
                </>
              ) : (
                <>
                  Submit
                  <Send size={20} />
                </>
              )
            ) : isLastModule ? (
              submitSuccess ? (
                <>
                  <CheckCircle size={20} />
                  Submitted!
                </>
              ) : isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Send size={20} />
                  </motion.div>
                  Submitting...
                </>
              ) : submitError ? (
                <>
                  <AlertTriangle size={20} />
                  Retry Submit
                </>
              ) : (
                <>
                  Preview
                  <ArrowRight size={20} />
                </>
              )
            ) : (
              <>
                Continue
                <ArrowRight size={20} />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

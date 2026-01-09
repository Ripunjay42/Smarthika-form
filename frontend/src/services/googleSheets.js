// Google Apps Script Web App URL from environment variable
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

/**
 * Submit form data to Google Sheets via Apps Script
 * @param {Object} formData - Complete form data object
 * @returns {Promise<Object>} - Success status and message
 */
export const submitToGoogleSheets = async (formData) => {
  try {
    // Check if Google Script URL is configured
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_WEB_APP_URL_HERE') {
      throw new Error('Google Script URL not configured. Please update VITE_GOOGLE_SCRIPT_URL in .env file');
    }

    console.log('Submitting to Farm Form Submissions sheet...');
    console.log('URL:', GOOGLE_SCRIPT_URL);
    console.log('Form data:', formData);
    console.log('Data size:', JSON.stringify(formData).length, 'bytes');
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    console.log('Response type:', response.type);
    console.log('Request sent successfully');
    console.log('NOTE: With no-cors mode, we cannot verify if data was actually saved.');
    console.log('   Check your Google Sheet and Apps Script logs to confirm.');
    
    return { success: true, message: 'Form submitted successfully!' };
    
  } catch (error) {
    console.error('Submission error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Test connection to Google Apps Script
 * @returns {Promise<Object>} - Connection test result
 */
export const testConnection = async () => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'GET',
    });
    const text = await response.text();
    console.log('Connection test:', text);
    return { success: true, message: text };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Validate form data before submission
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Validation result
 */
export const validateFormData = (formData) => {
  const errors = [];
  
  // Check required fields
  if (!formData.profile?.customerName) {
    errors.push('Customer/Farmer name is required');
  }
  
  if (!formData.profile?.whatsappNumber) {
    errors.push('WhatsApp number is required');
  }
  
  if (!formData.canvas?.totalArea) {
    errors.push('Total area is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

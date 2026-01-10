// Google Apps Script Web App URL from environment variable
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

/**
 * Convert file to base64
 * @param {File} file - File to convert
 * @returns {Promise<String>} - Base64 encoded string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Extract base64 from data URL
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Submit form data to Google Sheets via Apps Script
 * @param {Object} formData - Complete form data object
 * @param {File} file - Optional file to upload
 * @returns {Promise<Object>} - Success status and message
 */
export const submitToGoogleSheets = async (formData, file = null) => {
  try {
    // Check if Google Script URL is configured
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_WEB_APP_URL_HERE') {
      throw new Error('Google Script URL not configured. Please update VITE_GOOGLE_SCRIPT_URL in .env file');
    }

    console.log('Submitting to Farm Form Submissions sheet...');
    console.log('URL:', GOOGLE_SCRIPT_URL);
    console.log('Form data:', formData);
    console.log('Data size:', JSON.stringify(formData).length, 'bytes');
    
    // Prepare submission data
    let submissionData = { ...formData };
    
    // Handle file upload if provided
    if (file) {
      console.log('File detected:', file.name, file.type, file.size);
      try {
        const base64 = await fileToBase64(file);
        submissionData.uploadedFile = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64
        };
        console.log('File converted to base64');
        console.log('Base64 length:', base64.length);
        console.log('First 100 chars of base64:', base64.substring(0, 100));
        console.log('Last 50 chars of base64:', base64.substring(base64.length - 50));
        
        // Validate base64
        const base64Test = /^[A-Za-z0-9+/]*={0,2}$/.test(base64);
        if (!base64Test && !base64.includes(',')) {
          console.warn('⚠️ Warning: Base64 may be malformed');
        } else {
          console.log('✓ Base64 format looks valid');
        }
      } catch (fileError) {
        console.warn('File conversion failed, continuing without file:', fileError);
      }
    }
    
    // Log total payload size
    const totalPayload = JSON.stringify(submissionData);
    console.log('Total payload size:', totalPayload.length, 'bytes');
    if (totalPayload.length > 50000000) {
      console.warn('⚠️ Warning: Payload is very large (>50MB). Upload may fail.');
    }
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: totalPayload,
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

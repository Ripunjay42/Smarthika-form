// ========================================
// FARM FORM - Google Apps Script
// ========================================
// This script receives form submissions and saves them to Google Sheets
// Deploy as Web App with access set to "Anyone"

function doPost(e) {
  try {
    // Log incoming request
    Logger.log('=== NEW REQUEST RECEIVED ===');
    Logger.log('Request time: ' + new Date());
    
    // Check if request has data
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('No data received in request');
    }
    
    Logger.log('Raw data received: ' + e.postData.contents.substring(0, 200) + '...');
    
    // ====================================
    // CONFIGURATION - UPDATE THESE VALUES
    // ====================================
    
    // Option 1: If this script is attached to your sheet, use this:
    // const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Option 2: OR if accessing a different sheet, use Spreadsheet ID:
    const spreadsheet = SpreadsheetApp.openById('1K915AnBXQvuXBLzjCSwMnH8Mmibbq8akG99byeCuwHQ');
    Logger.log('Spreadsheet accessed successfully');
    
    // Make sure this matches your actual sheet name
    const sheet = spreadsheet.getSheetByName('Farm Form Submissions');
    
    if (!sheet) {
      throw new Error('Sheet "Farm Form Submissions" not found. Please check the sheet name.');
    }
    
    Logger.log('Sheet "Farm Form Submissions" found. Last row: ' + sheet.getLastRow());
    
    // ====================================
    // PARSE INCOMING DATA
    // ====================================
    const data = JSON.parse(e.postData.contents);
    Logger.log('Data parsed successfully. Keys: ' + Object.keys(data).join(', '));
    
    // ====================================
    // CREATE HEADERS (First submission only)
    // ====================================
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Customer Name',
        'WhatsApp Number',
        'Email Address',
        'Labor Count',
        'GPS Latitude',
        'GPS Longitude',
        'Total Area (acres)',
        'Perimeter Length (m)',
        'Field Geometry',
        'Side Length (m)',
        'Side Width (m)',
        'Topography Type',
        'Slope Percentage',
        'Slope Direction',
        'Soil Texture Top',
        'Soil Texture Sub',
        'Drainage Class',
        'Exclusion Zones (%)',
        'Cultivable Area (acres)',
        'Road Access Distance (m)',
        'Soil Test Status',
        'Soil pH',
        'Soil EC',
        'Source Type',
        'Total Depth (ft)',
        'Static Water Level (ft)',
        'Dynamic Water Level (ft)',
        'Drawdown (ft)',
        'Casing Diameter (inch)',
        'Pump Setting Depth (ft)',
        'Seasonal Variance',
        'Dry Run Risk',
        'Water Quality',
        'Scaling Risk',
        'Iron Content Risk',
        'Abrasion Risk',
        'Suction Head (ft)',
        'Foot Valve Condition',
        'Number of Borewells',
        'Delivery Target',
        'Overhead Tank Height (ft)',
        'Tank Capacity (L)',
        'Ground Sump Depth (ft)',
        'Sump Distance (m)',
        'Mainline Diameter (inch)',
        'Total Pipe Length (m)',
        'Mainline Pipe Material',
        'Pipe Condition',
        'Friction Head Penalty (ft)',
        'Number of Elbows',
        'Flowmeter Requirement',
        'Auxiliary Outlet Need',
        'Primary Energy Source',
        'Grid Phase',
        'Average Grid Voltage (V)',
        'Voltage Stability',
        'Solar System Voltage (V)',
        'Low Voltage Cutoff',
        'High Voltage Surge',
        'Daily Availability (hrs)',
        'Power Schedule',
        'Wiring Health',
        'Cable Upgrade Required',
        'Distance Meter to Borewell (m)',
        'Generator Ownership',
        'EV Charging Need',
        'Shelter Structure',
        'Mobile Signal Strength',
        'Primary Crop Type',
        'Secondary Crop Type',
        'Cropping Pattern',
        'Row Count',
        'Plant Spacing (ft)',
        'Tractor Access Requirement',
        'Total Plant Count',
        'Crop Age',
        'Peak Water Demand (L/day)',
        'Irrigation Method',
        'Required Discharge (LPM)',
        'Number of Zones',
        'Filtration Requirement',
        'Slurry Fertigation Usage',
        'Project Type',
        'Old Pump Type',
        'Old Pump Age (years)',
        'Burnout Frequency',
        'Efficiency Gap (%)',
        'Pipe Reuse Status',
        'Tractor Ownership',
        'Drone Ownership',
        'Sprayer Ownership',
        'EV Status',
        'Harvest Months',
        'Labor Pain Score',
        'Target LER',
        'Organic Farming Interest',
        'Polyhouse Status',
        'Aquaculture Status'
      ];
      
      sheet.appendRow(headers);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#689F38');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      headerRange.setWrap(true);
      sheet.setFrozenRows(1);
    }
    
    // ====================================
    // CALCULATE DERIVED VALUES
    // ====================================
    
    // Calculate drawdown
    const drawdown = data.heart?.dynamicWaterLevel && data.heart?.staticWaterLevel 
      ? parseFloat(data.heart.dynamicWaterLevel) - parseFloat(data.heart.staticWaterLevel) 
      : 0;
    
    // Format harvest months as comma-separated list
    const harvestMonths = data.shed?.harvestMonths 
      ? data.shed.harvestMonths.map((active, index) => active ? index + 1 : null)
          .filter(m => m !== null)
          .join(', ')
      : '';
    
    // Helper function to safely get nested values
    const get = (obj, path, defaultValue = '') => {
      return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? defaultValue;
    };
    
    // ====================================
    // PREPARE ROW DATA
    // ====================================
    const row = [
      new Date(),
      get(data, 'profile.customerName'),
      get(data, 'profile.whatsappNumber'),
      get(data, 'profile.emailAddress'),
      get(data, 'profile.laborCount', 0),
      get(data, 'canvas.gpsLatitude'),
      get(data, 'canvas.gpsLongitude'),
      get(data, 'canvas.totalArea'),
      get(data, 'canvas.perimeterLength'),
      get(data, 'canvas.fieldGeometry'),
      get(data, 'canvas.sideDimensions.length'),
      get(data, 'canvas.sideDimensions.width'),
      get(data, 'canvas.topographyType'),
      get(data, 'canvas.slopePercentage', 0),
      get(data, 'canvas.slopeDirection'),
      get(data, 'canvas.soilTextureTop'),
      get(data, 'canvas.soilTextureSub'),
      get(data, 'canvas.drainageClass'),
      get(data, 'canvas.exclusionZones', 0),
      get(data, 'canvas.cultivableArea'),
      get(data, 'canvas.roadAccessDistance'),
      get(data, 'canvas.soilTestStatus'),
      get(data, 'canvas.soilPH', 7),
      get(data, 'canvas.soilEC', 0),
      get(data, 'heart.sourceType'),
      get(data, 'heart.totalDepth'),
      get(data, 'heart.staticWaterLevel'),
      get(data, 'heart.dynamicWaterLevel'),
      drawdown,
      get(data, 'heart.casingDiameter'),
      get(data, 'heart.pumpSettingDepth'),
      get(data, 'heart.seasonalVariance'),
      get(data, 'heart.dryRunRisk'),
      get(data, 'heart.waterQuality'),
      get(data, 'heart.scalingRisk'),
      get(data, 'heart.ironContentRisk'),
      get(data, 'heart.abrasionRisk'),
      get(data, 'heart.suctionHead'),
      get(data, 'heart.footValveCondition'),
      get(data, 'heart.numberOfBorewells', 1),
      get(data, 'arteries.deliveryTarget'),
      get(data, 'arteries.overheadTankHeight', 0),
      get(data, 'arteries.tankCapacity', 0),
      get(data, 'arteries.groundSumpDepth', 0),
      get(data, 'arteries.sumpDistance', 0),
      get(data, 'arteries.mainlineDiameter', 0),
      get(data, 'arteries.totalPipeLength', 0),
      get(data, 'arteries.mainlinePipeMaterial'),
      get(data, 'arteries.pipeCondition'),
      get(data, 'arteries.frictionHeadPenalty', 0),
      get(data, 'arteries.numberOfElbows', 0),
      get(data, 'arteries.flowmeterRequirement') ? 'Yes' : 'No',
      get(data, 'arteries.auxiliaryOutletNeed') ? 'Yes' : 'No',
      get(data, 'pulse.primaryEnergySource'),
      get(data, 'pulse.gridPhase'),
      get(data, 'pulse.averageGridVoltage', 0),
      get(data, 'pulse.voltageStability'),
      get(data, 'pulse.solarSystemVoltage', 0),
      get(data, 'pulse.lowVoltageCutoff') ? 'Yes' : 'No',
      get(data, 'pulse.highVoltageSurge') ? 'Yes' : 'No',
      get(data, 'pulse.dailyAvailability', 0),
      get(data, 'pulse.powerSchedule'),
      get(data, 'pulse.wiringHealth'),
      get(data, 'pulse.cableUpgradeRequired') ? 'Yes' : 'No',
      get(data, 'pulse.distanceMeterToBorewell', 0),
      get(data, 'pulse.generatorOwnership') ? 'Yes' : 'No',
      get(data, 'pulse.evChargingNeed') ? 'Yes' : 'No',
      get(data, 'shelter.shelterStructure'),
      get(data, 'shelter.mobileSignalStrength'),
      get(data, 'biology.primaryCropType'),
      get(data, 'biology.secondaryCropType'),
      get(data, 'biology.croppingPattern'),
      get(data, 'biology.rowCount', 0),
      get(data, 'biology.plantSpacing', 0),
      get(data, 'biology.tractorAccessRequirement') ? 'Yes' : 'No',
      get(data, 'biology.totalPlantCount', 0),
      get(data, 'biology.cropAge'),
      get(data, 'biology.peakWaterDemand', 0),
      get(data, 'biology.irrigationMethod'),
      get(data, 'biology.requiredDischarge', 0),
      get(data, 'biology.numberOfZones', 0),
      get(data, 'biology.filtrationRequirement'),
      get(data, 'biology.slurryFertigationUsage') ? 'Yes' : 'No',
      get(data, 'baseline.projectType'),
      get(data, 'baseline.oldPumpType'),
      get(data, 'baseline.oldPumpAge', 0),
      get(data, 'baseline.burnoutFrequency', 0),
      get(data, 'baseline.efficiencyGap', 0),
      get(data, 'baseline.pipeReuseStatus') ? 'Yes' : 'No',
      get(data, 'shed.tractorOwnership') ? 'Yes' : 'No',
      get(data, 'shed.droneOwnership') ? 'Yes' : 'No',
      get(data, 'shed.sprayerOwnership') ? 'Yes' : 'No',
      get(data, 'shed.evStatus'),
      harvestMonths,
      get(data, 'vision.laborPainScore', 0),
      get(data, 'vision.targetLER', 1.0),
      get(data, 'vision.organicFarmingInterest') ? 'Yes' : 'No',
      get(data, 'vision.polyhouseStatus'),
      get(data, 'vision.aquacultureStatus')
    ];
    
    // ====================================
    // APPEND DATA TO SHEET
    // ====================================
    sheet.appendRow(row);
    Logger.log('Row appended successfully. New last row: ' + sheet.getLastRow());
    
    // Auto-resize columns for better readability (limit to first 20 to save time)
    sheet.autoResizeColumns(1, Math.min(sheet.getLastColumn(), 20));
    Logger.log('Columns auto-resized');
    
    // ====================================
    // OPTIONAL: SEND EMAIL NOTIFICATION
    // ====================================
    // Uncomment the line below to enable email notifications
    // sendNotificationEmail(data, sheet.getLastRow());
    
    // ====================================
    // RETURN SUCCESS RESPONSE
    // ====================================
    return ContentService
      .createTextOutput(JSON.stringify({ 
        result: 'success', 
        row: sheet.getLastRow(),
        message: 'Data saved successfully to Farm Form Submissions',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // ====================================
    // ERROR HANDLING
    // ====================================
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        result: 'error', 
        error: error.toString(),
        stack: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ====================================
// HANDLE GET REQUESTS (Health Check)
// ====================================
function doGet() {
  return ContentService
    .createTextOutput('Farm Form Data API is running\n\nStatus: Active\nLast updated: ' + new Date().toISOString())
    .setMimeType(ContentService.MimeType.TEXT);
}

// ====================================
// EMAIL NOTIFICATION FUNCTION (OPTIONAL)
// ====================================
function sendNotificationEmail(data, rowNumber) {
  // UPDATE THIS EMAIL ADDRESS
  const email = 'your-email@example.com';
  
  const subject = 'New Farm Form Submission #' + rowNumber + ' - ' + (data.profile?.customerName || 'Unknown');
  
  const body = `
New Farm Form submission received!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBMISSION #${rowNumber}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CUSTOMER PROFILE
Name: ${data.profile?.customerName || 'N/A'}
WhatsApp: ${data.profile?.whatsappNumber || 'N/A'}
Email: ${data.profile?.emailAddress || 'N/A'}
Labor Count: ${data.profile?.laborCount || 0}

FIELD CANVAS
Total Area: ${data.canvas?.totalArea || 'N/A'} acres
Geometry: ${data.canvas?.fieldGeometry || 'N/A'}
Soil Type: ${data.canvas?.soilTextureTop || 'N/A'}
Topography: ${data.canvas?.topographyType || 'N/A'}

WATER SOURCE (HEART)
Source Type: ${data.heart?.sourceType || 'N/A'}
Static Water Level: ${data.heart?.staticWaterLevel || 'N/A'} ft
Dynamic Water Level: ${data.heart?.dynamicWaterLevel || 'N/A'} ft
Water Quality: ${data.heart?.waterQuality || 'N/A'}

DISTRIBUTION (ARTERIES)
Delivery Target: ${data.arteries?.deliveryTarget || 'N/A'}
Pipe Material: ${data.arteries?.mainlinePipeMaterial || 'N/A'}
Total Length: ${data.arteries?.totalPipeLength || 'N/A'} m

ENERGY (PULSE)
Source: ${data.pulse?.primaryEnergySource || 'N/A'}
Grid Phase: ${data.pulse?.gridPhase || 'N/A'}
Voltage: ${data.pulse?.averageGridVoltage || 'N/A'} V

SHELTER
Structure: ${data.shelter?.shelterStructure || 'N/A'}
Signal Strength: ${data.shelter?.mobileSignalStrength || 'N/A'}

CROPS (BIOLOGY)
Primary Crop: ${data.biology?.primaryCropType || 'N/A'}
Irrigation Method: ${data.biology?.irrigationMethod || 'N/A'}
Peak Demand: ${data.biology?.peakWaterDemand || 'N/A'} L/day

PROJECT TYPE
Type: ${data.baseline?.projectType || 'N/A'}
Old Pump Age: ${data.baseline?.oldPumpAge || 0} years

VISION
Labor Pain Score: ${data.vision?.laborPainScore || 0}/10
Target LER: ${data.vision?.targetLER || 1.0}
Organic Interest: ${data.vision?.organicFarmingInterest ? 'Yes' : 'No'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
View in Google Sheet
Row Number: ${rowNumber}
Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `;
  
  try {
    MailApp.sendEmail(email, subject, body);
    Logger.log('Email notification sent to: ' + email);
  } catch (error) {
    Logger.log('Failed to send email notification: ' + error.toString());
  }
}

// ====================================
// UTILITY: Test function to verify setup
// ====================================
function testSubmission() {
  const testData = {
    profile: {
      customerName: 'Test Farmer',
      whatsappNumber: '+91 9876543210',
      emailAddress: 'test@example.com',
      laborCount: 5
    },
    canvas: {
      totalArea: '10',
      gpsLatitude: '12.9716',
      gpsLongitude: '77.5946'
    },
    heart: {
      sourceType: 'borewell',
      staticWaterLevel: '50',
      dynamicWaterLevel: '80'
    }
    // ... add more test data as needed
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}

// ====================================
// DEBUG: Verify spreadsheet and sheet setup
// ====================================
function debugSetup() {
  try {
    Logger.log('=== DEBUGGING SETUP ===');
    
    const spreadsheet = SpreadsheetApp.openById('1K915AnBXQvuXBLzjCSwMnH8Mmibbq8akG99byeCuwHQ');
    Logger.log('[OK] Spreadsheet found: ' + spreadsheet.getName());
    Logger.log('   Spreadsheet URL: ' + spreadsheet.getUrl());
    
    const sheet = spreadsheet.getSheetByName('Farm Form Submissions');
    if (sheet) {
      Logger.log('[OK] Sheet "Farm Form Submissions" found!');
      Logger.log('   Last row: ' + sheet.getLastRow());
      Logger.log('   Last column: ' + sheet.getLastColumn());
      Logger.log('   Sheet ID: ' + sheet.getSheetId());
    } else {
      Logger.log('[ERROR] Sheet "Farm Form Submissions" NOT found');
      Logger.log('   Available sheets in this spreadsheet:');
      spreadsheet.getSheets().forEach(function(s, index) {
        Logger.log('   ' + (index + 1) + '. "' + s.getName() + '" (ID: ' + s.getSheetId() + ')');
      });
      Logger.log('');
      Logger.log('[ACTION REQUIRED]');
      Logger.log('   Either rename one of the sheets above to "Farm Form Submissions"');
      Logger.log('   OR update line 20 of the script to use one of the sheet names above');
    }
    
    Logger.log('');
    Logger.log('Current deployment info:');
    Logger.log('   Script owner: ' + Session.getActiveUser().getEmail());
    
  } catch (error) {
    Logger.log('[ERROR] ' + error.toString());
    Logger.log('   Stack: ' + error.stack);
  }
}

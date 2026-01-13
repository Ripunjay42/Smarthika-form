// ========================================
// FARM FORM - Google Apps Script
// ========================================
// This script receives form submissions and saves them to Google Sheets
// Deploy as Web App with access set to "Anyone"

// Google Drive Folder ID for storing uploaded files
// CREATE A FOLDER IN YOUR GOOGLE DRIVE AND GET ITS ID
const UPLOAD_FOLDER_ID = '1AElFRG9LomDbz0MOuvEgcyg0SGrcDa6t'; // Replace with your folder ID

// ====================================
// FILE UPLOAD FUNCTION
// ====================================
function uploadFileToGoogleDrive(fileName, base64Data, mimeType) {
  Logger.log('');
  Logger.log('╔════════════════════════════════════════╗');
  Logger.log('║   FILE UPLOAD DIAGNOSTIC STARTED       ║');
  Logger.log('╚════════════════════════════════════════╝');
  
  try {
    // Step 1: Validate inputs
    Logger.log('');
    Logger.log('STEP 1: Validating inputs');
    Logger.log('  - Folder ID: ' + UPLOAD_FOLDER_ID);
    Logger.log('  - File name: ' + fileName);
    Logger.log('  - MIME type: ' + (mimeType || 'not specified'));
    Logger.log('  - Base64 data type: ' + typeof base64Data);
    Logger.log('  - Base64 data length: ' + (base64Data ? base64Data.length : 'null'));
    
    if (!UPLOAD_FOLDER_ID || UPLOAD_FOLDER_ID === 'YOUR_GOOGLE_DRIVE_FOLDER_ID') {
      Logger.log('  ❌ UPLOAD_FOLDER_ID not configured');
      throw new Error('UPLOAD_FOLDER_ID not configured');
    }

    if (!base64Data || base64Data.length === 0) {
      Logger.log('  ❌ No base64 data provided');
      throw new Error('No base64 data provided');
    }
    
    if (!fileName) {
      Logger.log('  ❌ No file name provided');
      throw new Error('No file name provided');
    }

    Logger.log('  ✓ All inputs valid');

    // Step 2: Check if base64 has data URL prefix and remove if needed
    Logger.log('');
    Logger.log('STEP 2: Checking base64 format');
    let cleanBase64 = base64Data;
    if (base64Data.includes(',')) {
      Logger.log('  - Base64 contains data URL prefix');
      cleanBase64 = base64Data.split(',')[1];
      Logger.log('  - Extracted base64 length: ' + cleanBase64.length);
    } else {
      Logger.log('  - Base64 is clean (no data URL prefix)');
    }
    
    if (!cleanBase64 || cleanBase64.length === 0) {
      throw new Error('Base64 string is empty after processing');
    }
    Logger.log('  ✓ Base64 format valid');

    // Step 3: Determine MIME type if not provided
    Logger.log('');
    Logger.log('STEP 3: Determining MIME type');
    let finalMimeType = mimeType || 'application/octet-stream';
    Logger.log('  - Original MIME type: ' + (mimeType || 'not provided'));
    Logger.log('  - Final MIME type: ' + finalMimeType);

    // Step 4: Decode base64
    Logger.log('');
    Logger.log('STEP 4: Decoding base64 to binary');
    let binaryData;
    try {
      // Decode base64 - this returns raw bytes
      const decodedBytes = Utilities.base64Decode(cleanBase64);
      // Create a blob from the decoded bytes
      const blob = Utilities.newBlob(decodedBytes, finalMimeType);
      binaryData = blob.getBytes();
      Logger.log('  ✓ Base64 decoded successfully');
      Logger.log('  - Binary data length: ' + binaryData.length + ' bytes');
      Logger.log('  - Decoded data type: ' + typeof binaryData);
    } catch (decodeError) {
      Logger.log('  ❌ Base64 decode failed: ' + decodeError.toString());
      throw decodeError;
    }

    // Step 5: Get folder reference
    Logger.log('');
    Logger.log('STEP 5: Accessing Google Drive folder');
    let folder;
    try {
      folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
      Logger.log('  ✓ Folder accessed');
      Logger.log('  - Folder name: ' + folder.getName());
      Logger.log('  - Folder URL: ' + folder.getUrl());
    } catch (folderError) {
      Logger.log('  ❌ Cannot access folder: ' + folderError.toString());
      Logger.log('  - Folder ID may be invalid: ' + UPLOAD_FOLDER_ID);
      Logger.log('  - Script may not have permission');
      throw folderError;
    }

    // Step 6: Create file
    Logger.log('');
    Logger.log('STEP 6: Creating file in Drive');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const uniqueName = timestamp + '_' + fileName;
    Logger.log('  - Unique file name: ' + uniqueName);
    Logger.log('  - Binary data to upload: ' + binaryData.length + ' bytes');
    
    let file;
    try {
      // Create file directly from binary data with proper MIME type
      const fileBlob = Utilities.newBlob(binaryData, finalMimeType, fileName);
      file = folder.createFile(fileBlob);
      Logger.log('  ✓ File created successfully');
      Logger.log('  - File name: ' + file.getName());
      Logger.log('  - File size: ' + file.getSize() + ' bytes');
      Logger.log('  - File ID: ' + file.getId());
      Logger.log('  - File MIME type: ' + file.getMimeType());
      
      // Rename file to include timestamp
      file.setName(uniqueName);
      Logger.log('  ✓ File renamed to: ' + file.getName());
    } catch (createError) {
      Logger.log('  ❌ File creation failed: ' + createError.toString());
      throw createError;
    }

    // Step 7: Set sharing permissions
    Logger.log('');
    Logger.log('STEP 7: Setting sharing permissions');
    try {
      file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
      Logger.log('  ✓ File shared with ANYONE as VIEWER');
    } catch (shareError) {
      Logger.log('  ⚠️  Sharing failed: ' + shareError.toString());
      Logger.log('     File created but may not be publicly accessible');
    }

    // Step 8: Get shareable URL
    Logger.log('');
    Logger.log('STEP 8: Generating shareable URL');
    const fileLink = file.getUrl();
    Logger.log('  ✓ URL generated');
    Logger.log('  - File URL: ' + fileLink);
    
    // Step 9: Verify file is accessible
    Logger.log('');
    Logger.log('STEP 9: Verifying file accessibility');
    try {
      // Try to read the first few bytes to verify file isn't corrupted
      const fileBlob = file.getBlob();
      const blobSize = fileBlob.getSize();
      Logger.log('  ✓ File blob accessible');
      Logger.log('  - Blob size: ' + blobSize + ' bytes');
      Logger.log('  - Original size: ' + binaryData.length + ' bytes');
      
      if (blobSize === binaryData.length) {
        Logger.log('  ✓ File size matches original data - file is intact');
      } else {
        Logger.log('  ⚠️  File size mismatch!');
        Logger.log('     Original: ' + binaryData.length + ' bytes');
        Logger.log('     Uploaded: ' + blobSize + ' bytes');
      }
    } catch (accessError) {
      Logger.log('  ❌ Cannot access uploaded file: ' + accessError.toString());
    }

    Logger.log('');
    Logger.log('╔════════════════════════════════════════╗');
    Logger.log('║   ✅ FILE UPLOAD SUCCESSFUL            ║');
    Logger.log('╚════════════════════════════════════════╝');
    Logger.log('');
    
    return fileLink;
    
  } catch (error) {
    Logger.log('');
    Logger.log('╔════════════════════════════════════════╗');
    Logger.log('║   ❌ FILE UPLOAD FAILED                ║');
    Logger.log('╚════════════════════════════════════════╝');
    Logger.log('');
    Logger.log('ERROR: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
    Logger.log('');
    return null;
  }
}

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
    const spreadsheet = SpreadsheetApp.openById('1CzifkyZmZuux5Yn5g3Ebr9ZElUsIMIo0sWXDeC4Rpg4');
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
        // Profile Section
        'Customer Name',
        'WhatsApp Number',
        'Email Address',
        'Age',
        'Country',
        'State',
        'District',
        'Village',
        'Lives On Farm',
        'Labor Count',
        // Canvas Section
        'Unit System',
        'Total Area (acres)',
        'Side Length',
        'Side Width',
        'Field Geometry',
        'Topography Type',
        'Soil Texture Top',
        'Drainage Class',
        'Unused Land (%)',
        'Soil Test Status',
        'Topography Map Link',
        'Soil Test Report Link',
        'Has Existing Power',
        'Road Accessible',
        'Road Access Distance (km)',
        // Heart Section (Borewell/Water Source)
        'Water Sources',
        'Number of Borehells',
        'Total Depth (ft)',
        'Static Water Level (ft)',
        'Dynamic Water Level (ft)',
        'Drawdown (ft)',
        'Casing Diameter (inch)',
        'Pump Setting Depth (ft)',
        'Seasonal Variance (ft)',
        'Water Quality',
        'Water Storage Type',
        'Suction Head (ft)',
        'Foot Valve Condition',
        'Pump Size',
        // Distribution Section (Arteries)
        'Delivery Target',
        'Overhead Tank Height (ft)',
        'Tank Capacity (L)',
        'Ground Sump Depth (ft)',
        'Sump Distance (ft)',
        'Mainline Pipe Material',
        'Mainline Diameter (inch)',
        'Pipe Condition',
        'Friction Head Penalty (%)',
        'Total Pipe Length (ft)',
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
        'Current Wiring Condition',
        'Cable Upgrade Required',
        'Distance Meter to Borewell (m)',
        'Has Existing Power',
        'Frequent Phase Cuts',
        'Genset Capacity (KVA)',
        'Solar System Voltage Toggle (V)',
        // Shelter Section
        'Where will we mount the box?',
        'Wall Space Check',
        'Mobile Signal at Pump',
        'Heat Buildup Risk',
        'Theft Risk Level',
        'Lightning Rod on Roof?',
        'Is there Earthing / Grounding?',
        'Distance to Main Switch (m)',
        'Electrical Support',
        'Mechanical Support',
        'Installation Preference',
        'Lifting Gear Availability',
        'Pump House Picture Link',
        // Biology Section
        'Distance Between Plants',
        'Plant Spacing Unit',
        'Tractor Access Requirement',
        'Crop Age',
        'Crops & Plant Count',
        'Peak Water Demand (L/day)',
        'Irrigation Method',
        'Irrigation Efficiency (%)',
        'Number of Zones',
        'Filter Needed?',
        'Do you add liquid fertilizer?',
        // Baseline Section
        'Project Type',
        'Current Pump Types',
        'Pump Details (Age, Repairs, Burnouts)',
        'Piping Approach (New vs Reuse)',
        // Shed Section
        'Equipment Inventory',
        'Harvest Months',
        // Vision Section
        'Income Cycle Type',
        'Target LER (Yield Multiplier)',
        'Labor Availability Score',
        'Polyhouse Status',
        'Aquaculture Status',
        'Organic Farming Interest',
        'Submission Metadata'
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
    const harvestMonths = data.vision?.harvestMonths 
      ? data.vision.harvestMonths.map((monthIndex) => {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return monthNames[monthIndex];
        })
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
      // Profile Section
      get(data, 'profile.customerName'),
      get(data, 'profile.whatsappNumber'),
      get(data, 'profile.emailAddress'),
      get(data, 'profile.age', 0),
      get(data, 'profile.country'),
      get(data, 'profile.state'),
      get(data, 'profile.district'),
      get(data, 'profile.village'),
      (() => {
        const livesOnFarm = get(data, 'profile.livesOnFarm', 'yes');
        if (livesOnFarm === 'yes') return 'Yes — I stay here';
        if (livesOnFarm === 'no') return 'No — I manage remotely';
        return String(livesOnFarm);
      })(),
      get(data, 'profile.laborCount', 0),
      // Canvas Section
      get(data, 'canvas.unitSystem', 'feet'),
      get(data, 'canvas.totalArea'),
      get(data, 'canvas.sideDimensions.length'),
      get(data, 'canvas.sideDimensions.width'),
      get(data, 'canvas.fieldGeometry'),
      get(data, 'canvas.topographyType'),
      Array.isArray(data.canvas?.soilTextureTop) ? data.canvas.soilTextureTop.join(', ') : get(data, 'canvas.soilTextureTop'),
      get(data, 'canvas.drainageClass'),
      get(data, 'canvas.exclusionZones', 0),
      (() => {
        const status = get(data, 'canvas.soilTestStatus', 'no');
        if (status === 'yes') return 'Yes';
        if (status === 'no') return 'No';
        return String(status);
      })(),
      // Handle file upload for Canvas/Topography map (Module 2)
      (() => {
        const uploadedFiles = data.uploadedFiles || [];
        const canvasFile = uploadedFiles.find(f => f.module === 'canvas' && f.fieldType === 'topographyMap');
        if (canvasFile) {
          const fileLink = uploadFileToGoogleDrive(canvasFile.name, canvasFile.data, canvasFile.type);
          return fileLink || 'Upload failed';
        }
        // Fallback to old format for backwards compatibility
        if (data.uploadedFile) {
          const fileLink = uploadFileToGoogleDrive(data.uploadedFile.name, data.uploadedFile.data, data.uploadedFile.type);
          return fileLink || 'Upload failed';
        }
        return '';
      })(),
      // Handle file upload for Canvas/Soil Test Report (Module 2)
      (() => {
        const uploadedFiles = data.uploadedFiles || [];
        const soilTestFile = uploadedFiles.find(f => f.module === 'canvas' && f.fieldType === 'soilTestReport');
        if (soilTestFile) {
          const fileLink = uploadFileToGoogleDrive(soilTestFile.name, soilTestFile.data, soilTestFile.type);
          return fileLink || 'Upload failed';
        }
        return '';
      })(),
      get(data, 'pulse.hasExistingPower') ? 'Yes' : 'No',
      (() => {
        const access = get(data, 'canvas.roadAccessible', 'direct');
        if (access === 'direct') return 'Direct Access';
        if (access === 'remote') return 'Remote / No Road';
        return String(access);
      })(),
      (() => {
        const distance = get(data, 'canvas.roadAccessDistance', 0);
        return distance ? `${distance} km` : '';
      })(),
      // Heart Section (Borewell/Water Source)
      Array.isArray(data.heart?.sourceType) ? data.heart.sourceType.join(', ') : get(data, 'heart.sourceType'),
      (() => {
        const sourceType = Array.isArray(data.heart?.sourceType) ? data.heart.sourceType : [get(data, 'heart.sourceType')];
        if (!sourceType.includes('borewell')) return '';
        const num = get(data, 'heart.numberOfBorewells', '');
        if (num === '' || Number(num) === 1) return '';
        return num;
      })(),
      get(data, 'heart.totalDepth'),
      get(data, 'heart.staticWaterLevel'),
      get(data, 'heart.dynamicWaterLevel'),
      drawdown,
      get(data, 'heart.casingDiameter'),
      get(data, 'heart.pumpSettingDepth'),
      get(data, 'heart.seasonalVariance'),
      get(data, 'heart.waterQuality'),
      Array.isArray(data.heart?.waterStorageType) ? data.heart.waterStorageType.join(', ') : get(data, 'heart.waterStorageType'),
      get(data, 'heart.suctionHead'),
      get(data, 'heart.footValveCondition'),
      get(data, 'heart.pumpSize'),
      // Distribution Section (Arteries)
      Array.isArray(data.arteries?.deliveryTarget) ? data.arteries.deliveryTarget.join(', ') : get(data, 'arteries.deliveryTarget'),
      get(data, 'arteries.overheadTankHeight', 0),
      get(data, 'arteries.tankCapacity', 0),
      get(data, 'arteries.groundSumpDepth', 0),
      get(data, 'arteries.sumpDistance', 0),
      get(data, 'arteries.mainlinePipeMaterial'),
      get(data, 'arteries.mainlineDiameter', 0),
      get(data, 'arteries.pipeCondition'),
      get(data, 'arteries.frictionHeadPenalty', 0),
      get(data, 'arteries.totalPipeLength', 0),
      get(data, 'arteries.flowmeterRequirement') ? 'Yes' : 'No',
      get(data, 'arteries.auxiliaryOutletNeed') ? 'Yes' : 'No',
      // Pulse Section (Energy/Power)
      Array.isArray(data.pulse?.primaryEnergySource) ? data.pulse.primaryEnergySource.join(', ') : get(data, 'pulse.primaryEnergySource'),
      get(data, 'pulse.gridPhase'),
      get(data, 'pulse.averageGridVoltage', 0),
      get(data, 'pulse.voltageStability'),
      get(data, 'pulse.solarSystemVoltage', 0),
      get(data, 'pulse.lowVoltageCutoff') ? 'Yes' : 'No',
      get(data, 'pulse.highVoltageSurge') ? 'Yes' : 'No',
      get(data, 'pulse.dailyAvailability', 0),
      get(data, 'pulse.powerSchedule'),
      get(data, 'pulse.currentWiringCondition'),
      get(data, 'pulse.cableUpgradeRequired') ? 'Yes' : 'No',
      get(data, 'pulse.distanceMeterToBorewell', 0),
      get(data, 'pulse.hasExistingPower') ? 'Yes' : 'No',
      get(data, 'pulse.frequentPhaseCuts') ? 'Yes' : 'No',
      get(data, 'pulse.gensetCapacity', ''),
      get(data, 'pulse.solarSystemVoltageToggle', ''),
      // Shelter Section - Updated Labels
      (() => {
        const structure = get(data, 'shelter.shelterStructure', 'concrete');
        const structureMap = { 'concrete': 'Concrete Room', 'tin': 'Tin Shed', 'open': 'Open Air' };
        return structureMap[structure] || String(structure);
      })(),
      (() => {
        const space = get(data, 'shelter.wallSpaceAvailable', 'standard');
        const spaceMap = { 'tight': 'Tight (Slimline)', 'standard': 'Standard', 'spacious': 'Spacious' };
        return spaceMap[space] || String(space);
      })(),
      (() => {
        const signal = get(data, 'shelter.mobileSignalStrength', '4g');
        const signalMap = { '4g': '4G LTE', '3g': '3G', '2g': '2G', 'none': 'None' };
        return signalMap[signal] || String(signal);
      })(),
      get(data, 'shelter.heatBuildupRisk'),
      (() => {
        const risk = get(data, 'shelter.theftRiskLevel', 'safe');
        return risk === 'safe' ? 'Safe Area' : 'High Risk';
      })(),
      (() => {
        const arrestor = get(data, 'shelter.lightningArrestor', 'present');
        return arrestor === 'present' ? 'Yes - Present' : 'No - Absent';
      })(),
      (() => {
        const earthing = get(data, 'shelter.earthingPit', 'present');
        return earthing === 'present' ? 'Yes - Chemical Pit Present' : 'No - Need to Install';
      })(),
      get(data, 'shelter.distanceToMainSwitch', ''),
      (() => {
        const elec = get(data, 'shelter.electricalSupport', 'expert');
        return elec === 'local-electrician' ? 'Local Electrician Available' : 'Need Expert Support';
      })(),
      (() => {
        const mech = get(data, 'shelter.mechanicalSupport', 'expert');
        return mech === 'local-team' ? 'Local Team Available' : 'Need Expert Support';
      })(),
      (() => {
        const pref = get(data, 'shelter.installationPreference', 'expert');
        return pref === 'self' ? 'Self Installation' : 'Expert Team';
      })(),
      (() => {
        const gear = get(data, 'shelter.liftingGearAvailability', 'manual');
        const gearMap = { 'chain-pulley': 'Chain Pulley Available', 'manual': 'Manual Lift Only' };
        return gearMap[gear] || String(gear);
      })(),
      // Handle pump house picture upload (Module 6)
      (() => {
        const uploadedFiles = data.uploadedFiles || [];
        const shelterFile = uploadedFiles.find(f => f.module === 'shelter');
        if (shelterFile) {
          const fileLink = uploadFileToGoogleDrive(shelterFile.name, shelterFile.data, shelterFile.type);
          return fileLink || 'Upload failed';
        }
        return '';
      })(),
      get(data, 'biology.plantSpacing', 0),
      get(data, 'biology.plantSpacingUnit', 'feet'),
      get(data, 'biology.tractorAccessRequirement') ? 'Yes' : 'No',
      get(data, 'biology.cropAge'),
      (() => {
        const crops = get(data, 'biology.crops', []);
        return crops.map(c => `${c.cropType}: ${c.estimatedCount} plants`).join('; ') || '';
      })(),
      get(data, 'biology.peakWaterDemand', 0),
      get(data, 'biology.irrigationMethod'),
      get(data, 'biology.irrigationEfficiency', 90),
      get(data, 'biology.numberOfZones', 0),
      get(data, 'biology.filtrationRequired') ? 'Yes' : 'No',
      get(data, 'biology.liquidFertilizerUsage') ? 'Yes' : 'No',
      get(data, 'baseline.projectType'),
      (() => {
        const oldPumpTypes = get(data, 'baseline.oldPumpTypes', []);
        return Array.isArray(oldPumpTypes) ? oldPumpTypes.join(', ') : String(oldPumpTypes || '');
      })(),
      (() => {
        const pumpDetails = get(data, 'baseline.pumpDetails', {});
        if (!pumpDetails || Object.keys(pumpDetails).length === 0) return '';
        return Object.entries(pumpDetails)
          .map(([pumpType, details]) => {
            return `${pumpType}: Age=${details.age}yr, Repairs=${details.repairs}x, Burnouts=${details.burnouts}x`;
          })
          .join('; ');
      })(),
      (() => {
        const pipeStatus = get(data, 'baseline.pipeReuseStatus', 'new');
        return pipeStatus === 'reuse' ? 'Reuse Old Pipes' : 'New Pipes';
      })(),
      // Shed Section - New Equipment Array Format
      (() => {
        const equipment = get(data, 'shed.equipment', []);
        if (!equipment || equipment.length === 0) return '';
        // Get friendly equipment names from the equipment array
        const equipmentNames = {
          'tractor-heavy': 'Tractor (Heavy)',
          'mini-tractor': 'Mini Tractor',
          'power-tiller': 'Power Tiller',
          'combine-harvester': 'Combine Harvester',
          'jcb-excavator': 'JCB / Excavator',
          'rotavator': 'Rotavator',
          'cultivator-plough': 'Cultivator / Plough',
          'seed-drill': 'Seed Drill',
          'laser-leveler': 'Laser Leveler',
          'trolley-trailer': 'Trolley / Trailer',
          'knapsack-sprayer': 'Knapsack Sprayer',
          'power-sprayer': 'Power Sprayer',
          'boom-sprayer': 'Boom Sprayer',
          'rain-gun': 'Rain Gun',
          'drip-filter-unit': 'Drip/Filter Unit',
          'diesel-generator': 'Diesel Generator',
          'solar-panels': 'Solar Panels',
          'chaff-cutter': 'Chaff Cutter',
          'milking-machine': 'Milking Machine',
          'agri-drone': 'Agri Drone'
        };
        return equipment.map(eq => equipmentNames[eq] || eq).join(', ');
      })(),
      harvestMonths,
      (() => {
        const cashFlowType = get(data, 'vision.cash_flow_type', 'seasonal');
        const flowMap = {
          'seasonal': 'Seasonal (Harvest-based)',
          'year-round': 'Year-Round (Dairy/Vegetables)'
        };
        return flowMap[cashFlowType] || cashFlowType;
      })(),
      get(data, 'vision.targetLER', 1.0),
      get(data, 'vision.laborPainScore', 0),
      (() => {
        const status = get(data, 'vision.polyhouseStatus', 'none');
        const statusMap = {
          'none': 'No Plans',
          'own': 'Already Own',
          'planned': 'Planning Soon'
        };
        return statusMap[status] || status;
      })(),
      (() => {
        const status = get(data, 'vision.aquacultureStatus', 'none');
        const statusMap = {
          'none': 'No Plans',
          'own': 'Already Own',
          'planned': 'Planning Soon'
        };
        return statusMap[status] || status;
      })(),
      get(data, 'vision.organicFarmingInterest') ? 'Yes' : 'No',
      // File upload link
      JSON.stringify({submitTime: new Date().toISOString(), submittedBy: get(data, 'profile.customerName')})
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
Crops & Count: ${(data.biology?.crops || []).map(c => `${c.cropType}(${c.estimatedCount})`).join(', ') || 'N/A'}
Irrigation Method: ${data.biology?.irrigationMethod || 'N/A'}
Peak Demand: ${data.biology?.peakWaterDemand || 'N/A'} L/day
Filtration Required: ${data.biology?.filtrationRequired ? 'Yes' : 'No'}

PROJECT TYPE
Type: ${data.baseline?.projectType || 'N/A'}
Pump Types: ${Array.isArray(data.baseline?.oldPumpTypes) ? data.baseline.oldPumpTypes.join(', ') : 'N/A'}
Old Pump Age: ${data.baseline?.oldPumpAge || 0} years
Starter Coil/Capacitor Repairs: ${data.baseline?.starterCoilRepairs || 0} repairs/replacements
Motor Burnouts: ${data.baseline?.motorBurnouts || 0} rewinding(s)
Piping Approach: ${data.baseline?.pipeReuseStatus === 'reuse' ? 'Reuse Old Pipes' : 'New Pipes'}

VISION
Income Cycle: ${data.vision?.cash_flow_type === 'seasonal' ? 'Seasonal (Harvest-based)' : 'Year-Round (Dairy/Vegetables)'}
Target LER: ${data.vision?.targetLER || 1.0}x
Labor Availability Score: ${data.vision?.laborPainScore || 0}/10 (0=easy, 10=very hard)
Polyhouse/Greenhouse: ${data.vision?.polyhouseStatus === 'own' ? 'Already Own' : data.vision?.polyhouseStatus === 'planned' ? 'Planning Soon' : 'No Plans'}
Fish Pond/Aquaculture: ${data.vision?.aquacultureStatus === 'own' ? 'Already Own' : data.vision?.aquacultureStatus === 'planned' ? 'Planning Soon' : 'No Plans'}
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
    
    const spreadsheet = SpreadsheetApp.openById('1CzifkyZmZuux5Yn5g3Ebr9ZElUsIMIo0sWXDeC4Rpg4');
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
    
    // Check upload folder
    Logger.log('');
    Logger.log('=== CHECKING UPLOAD FOLDER ===');
    Logger.log('UPLOAD_FOLDER_ID: ' + UPLOAD_FOLDER_ID);
    try {
      const folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
      Logger.log('[OK] Folder found: ' + folder.getName());
      Logger.log('   Folder URL: ' + folder.getUrl());
      Logger.log('   Can create files: YES');
    } catch (folderError) {
      Logger.log('[ERROR] Cannot access folder: ' + folderError.toString());
      Logger.log('   The folder ID may be incorrect or the script may not have access');
      Logger.log('   Please verify:');
      Logger.log('   1. Folder ID is correct: ' + UPLOAD_FOLDER_ID);
      Logger.log('   2. Folder exists in Google Drive');
      Logger.log('   3. Script has permission to access it');
    }
    
  } catch (error) {
    Logger.log('[ERROR] ' + error.toString());
    Logger.log('   Stack: ' + error.stack);
  }
}

// ====================================
// DEBUG: Test file upload function
// ====================================
function testFileUpload() {
  Logger.log('=== TESTING FILE UPLOAD ===');
  
  // Create a simple test file
  const testContent = 'This is a test file content';
  const base64Content = Utilities.base64Encode(testContent);
  
  Logger.log('Test data:');
  Logger.log('   Original content: ' + testContent);
  Logger.log('   Base64 length: ' + base64Content.length);
  Logger.log('   MIME type: text/plain');
  
  const result = uploadFileToGoogleDrive('test-file.txt', base64Content, 'text/plain');
  Logger.log('Upload result: ' + result);
}

import { MODULES, MONTHS, CROP_TYPES, SOIL_TYPES, EQUIPMENT_LIST } from '../../constants/formConstants';

const THEME = {
  bg: '#E5E7EB',
  panel: 'rgba(229, 231, 235, 0.9)',
  border: 'rgba(104, 159, 56, 0.15)',
  cardBg: 'rgba(104, 159, 56, 0.06)',
  cardBorder: 'rgba(104, 159, 56, 0.18)',
  text: '#33691E',
  muted: '#558B2F',
};

function toTitleCase(text) {
  // Special field name mappings
  const specialMappings = {
    'burnoutfrequency': 'Controller Replacement/Repair Frequency',
    'burnout frequency': 'Controller Replacement/Repair Frequency',
    'oldpumptypes': 'What pumps do you currently use?',
    'old pump types': 'What pumps do you currently use?',
    'oldpumpage': 'Old Pump Age',
    'old pump age': 'Old Pump Age',
    'startercoilrepairs': 'Starter Coil/Capacitor Repairs (Last Year)',
    'starter coil repairs': 'Starter Coil/Capacitor Repairs (Last Year)',
    'motorburnouts': 'Motor Burnouts (Rewinding)',
    'motor burnouts': 'Motor Burnouts (Rewinding)',
    'pipereusestatus': 'Piping Approach',
    'pipe reuse status': 'Piping Approach',
  };
  
  const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim();
  if (specialMappings[normalized]) {
    return specialMappings[normalized];
  }
  
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_.-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function formatValue(value, keyPath, formData = {}) {
  // Show file names for uploaded files
  if (keyPath === 'canvas.topographyMapFile' || keyPath === 'canvas.soilTestReportFile' || keyPath === 'shelter.pumpHousePictureFile') {
    return value ? `📎 ${value}` : '';
  }
  
  // Skip base64 data - these are handled by showing the filename above
  if (keyPath === 'canvas.topographyMapImage' || keyPath === 'canvas.soilTestReport' || keyPath === 'shelter.pumpHousePicture') {
    return '';
  }
  
  // Skip MIME type fields
  if (keyPath === 'canvas.topographyMapType' || keyPath === 'canvas.soilTestReportType' || keyPath === 'shelter.pumpHousePictureType') {
    return '';
  }

  // Format unitSystem to show capitalized unit name
  if (keyPath === 'canvas.unitSystem' || keyPath === 'heart.unitSystem' || keyPath === 'arteries.unitSystem') {
    return value === 'feet' ? 'Feet' : 'Meters';
  }

  // Friendly display for whether farmer lives on the farm
  if (keyPath === 'profile.livesOnFarm') {
    if (value === 'yes') return '🏠 Yes — I stay here';
    if (value === 'no') return '📱 No — I manage remotely';
    return String(value);
  }

  // Format soil texture to show friendly label
  if (keyPath === 'canvas.soilTextureTop' || keyPath === 'canvas.soilTextureSub') {
    const soilType = SOIL_TYPES.find(s => s.value === value);
    return soilType ? soilType.label : String(value);
  }

  // Format soil test status
  if (keyPath === 'canvas.soilTestStatus') {
    if (value === 'yes') return 'Yes, I have the report';
    if (value === 'no') return 'No';
    return String(value);
  }

  // Format road accessibility
  if (keyPath === 'canvas.roadAccessible') {
    if (value === 'direct') return 'Direct Access';
    if (value === 'remote') return 'Remote / No Road';
    return String(value);
  }

  // Format unknownDetails for heart module
  if (keyPath === 'heart.unknownDetails') {
    return value ? 'Yes — Farmer requested service' : 'No — Details provided';
  }

  // Format Pulse module fields
  if (keyPath === 'pulse.hasExistingPower') {
    return value ? 'Yes — Existing Connection' : 'No — New Site';
  }

  if (keyPath === 'pulse.frequentPhaseCuts') {
    return value ? 'Yes — Frequent Phase Cuts' : 'No — Stable Phase';
  }

  if (keyPath === 'pulse.solarSystemVoltageToggle') {
    return `${value}V`;
  }

  if (keyPath === 'pulse.currentWiringCondition') {
    const conditionMap = {
      'good': 'Good Condition',
      'fair': 'Fair Condition',
      'poor': 'Poor Condition - Upgrade Needed'
    };
    return conditionMap[value] || String(value);
  }

  if (keyPath === 'pulse.gensetCapacity') {
    return value ? `${value} KVA` : '';
  }

  if (keyPath === 'pulse.gridPhase') {
    const phaseMap = {
      '1-phase': 'Domestic (1-Phase)',
      '3-phase': 'Agri Grid (3-Phase)'
    };
    return phaseMap[value] || String(value);
  }

  if (keyPath === 'pulse.primaryEnergySource' && Array.isArray(value)) {
    const sourceMap = {
      'grid': 'Grid Power',
      'solar': 'Solar',
      'generator': 'Generator'
    };
    return value.map(v => sourceMap[v] || v).join(', ');
  }

  if (keyPath === 'pulse.voltageStability') {
    const stabilityMap = {
      'stable': 'Stable',
      'fluctuating': 'Fluctuating',
      'unstable': 'Unstable'
    };
    return stabilityMap[value] || String(value);
  }

  if (keyPath === 'shed.harvestMonths' && Array.isArray(value)) {
    const selected = value
      .map((active, idx) => (active ? MONTHS[idx] : null))
      .filter(Boolean);
    return selected.length ? selected.join(', ') : '';
  }

  // Format Shelter module fields
  if (keyPath === 'shelter.shelterStructure') {
    const structureMap = {
      'concrete': 'Concrete Room',
      'tin': 'Tin Shed',
      'open': 'Open Air'
    };
    return structureMap[value] || String(value);
  }

  if (keyPath === 'shelter.wallSpaceAvailable') {
    const spaceMap = {
      'tight': 'Tight (Slimline Cabinet)',
      'standard': 'Standard',
      'spacious': 'Spacious'
    };
    return spaceMap[value] || String(value);
  }

  if (keyPath === 'shelter.mobileSignalStrength') {
    const signalMap = {
      '4g': '4G LTE',
      '3g': '3G',
      '2g': '2G',
      'none': 'No Signal'
    };
    return signalMap[value] || String(value);
  }

  if (keyPath === 'shelter.lightningArrestor' || keyPath === 'shelter.earthingPit') {
    return value === 'present' ? 'Yes - Present' : 'No - Absent';
  }

  if (keyPath === 'shelter.heatBuildupRisk') {
    const riskMap = {
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High (Fan Needed)'
    };
    return riskMap[value] || String(value);
  }

  if (keyPath === 'shelter.theftRiskLevel') {
    const riskMap = {
      'safe': 'Safe Area',
      'high': 'High Risk'
    };
    return riskMap[value] || String(value);
  }

  if (keyPath === 'shelter.electricalSupport') {
    const supportMap = {
      'local-electrician': 'Local Electrician Available',
      'expert': 'Need Expert Support'
    };
    return supportMap[value] || String(value);
  }

  if (keyPath === 'shelter.mechanicalSupport') {
    const supportMap = {
      'local-team': 'Local Team Available',
      'expert': 'Need Expert Support'
    };
    return supportMap[value] || String(value);
  }

  if (keyPath === 'shelter.installationPreference') {
    const prefMap = {
      'self': 'Self Installation',
      'expert': 'Expert Team'
    };
    return prefMap[value] || String(value);
  }

  if (keyPath === 'shelter.liftingGearAvailability') {
    const gearMap = {
      'chain-pulley': 'Chain Pulley Available',
      'manual': 'Manual Lift Only'
    };
    return gearMap[value] || String(value);
  }

  if (keyPath === 'shelter.distanceToMainSwitch') {
    return value ? `${value} meters` : '';
  }

  if (keyPath === 'biology.crops' && Array.isArray(value)) {
    return value.length ? value
      .map(crop => {
        const cropLabel = CROP_TYPES.find(c => c.value === crop.cropType)?.label || crop.cropType;
        return `${cropLabel}: ${crop.estimatedCount} plants`;
      })
      .join(', ') : '';
  }

  if (keyPath === 'biology.plantSpacing') {
    return value ? `${value} ${formData.biology?.plantSpacingUnit || 'feet'}` : '';
  }

  if (keyPath === 'biology.plantSpacingUnit') {
    return '';
  }

  if (keyPath === 'biology.irrigationMethod') {
    const methodMap = {
      'drip': 'Drip Irrigation',
      'sprinkler': 'Sprinkler',
      'flood': 'Flood Irrigation'
    };
    return methodMap[value] || String(value);
  }

  if (keyPath === 'biology.cropAge') {
    const ageMap = {
      'sapling': 'Sapling (0-2 yrs)',
      'young': 'Young (2-5 yrs)',
      'mature': 'Mature (5+ yrs)'
    };
    return ageMap[value] || String(value);
  }

  if (keyPath === 'biology.croppingPattern') {
    const patternMap = {
      'monoculture': 'Monoculture',
      'intercrop': 'Intercropping',
      'mixed': 'Mixed Farming'
    };
    return patternMap[value] || String(value);
  }

  if (keyPath === 'biology.filtrationRequired') {
    return value ? 'Yes - Filter Needed' : 'No - No Filter';
  }

  if (keyPath === 'biology.liquidFertilizerUsage') {
    return value ? 'Yes - Liquid Fertilizer Added' : 'No';
  }

  if (keyPath === 'biology.peakWaterDemand') {
    return value ? `${value} L/day` : '';
  }

  if (keyPath === 'biology.numberOfZones') {
    return `${value} zone${value !== 1 ? 's' : ''}`;
  }

  if (keyPath === 'biology.tractorAccessRequirement') {
    return value ? 'Yes - Wider paths needed' : 'No';
  }

  if (keyPath === 'biology.irrigationEfficiency') {
    return `${value}%`;
  }

  // Handle vision fields
  if (keyPath === 'vision.cash_flow_type') {
    const flowMap = {
      'seasonal': 'Seasonal (Harvest-based)',
      'year-round': 'Year-Round (Dairy/Vegetables)'
    };
    return flowMap[value] || String(value);
  }

  if (keyPath === 'vision.targetLER') {
    return `${parseFloat(value).toFixed(1)}x`;
  }

  if (keyPath === 'vision.laborPainScore') {
    const laborMap = {
      '0': 'Easy (0)', '1': 'Easy (1)', '2': 'Easy (2)',
      '3': 'Moderate (3)', '4': 'Moderate (4)', '5': 'Moderate (5)', '6': 'Moderate (6)',
      '7': 'Difficult (7)', '8': 'Difficult (8)', '9': 'Difficult (9)',
      '10': 'Critical (10)'
    };
    return laborMap[String(value)] || `Score: ${value}`;
  }

  if (keyPath === 'vision.polyhouseStatus') {
    const statusMap = {
      'none': 'No Plans',
      'own': 'Already Own',
      'planned': 'Planning Soon'
    };
    return statusMap[value] || String(value);
  }

  if (keyPath === 'vision.aquacultureStatus') {
    const statusMap = {
      'none': 'No Plans',
      'own': 'Already Own',
      'planned': 'Planning Soon'
    };
    return statusMap[value] || String(value);
  }

  if (keyPath === 'vision.organicFarmingInterest') {
    return value ? 'Yes - Interested' : 'No';
  }

  // Handle equipment as array
  if (keyPath === 'shed.equipment' && Array.isArray(value)) {
    if (!value || value.length === 0) return '';
    return value
      .map(equipmentId => {
        const equipment = EQUIPMENT_LIST.find(e => e.value === equipmentId);
        return equipment ? equipment.label : equipmentId;
      })
      .join(', ');
  }

  // Handle baseline fields
  if (keyPath === 'baseline.oldPumpTypes' && Array.isArray(value)) {
    return value.length ? value
      .map(v => v.charAt(0).toUpperCase() + v.slice(1))
      .join(', ') : '';
  }

  if (keyPath === 'baseline.starterCoilRepairs') {
    return value ? `${value} times/year` : '';
  }

  if (keyPath === 'baseline.motorBurnouts') {
    return value ? `${value} times/year` : '';
  }

  if (keyPath === 'baseline.pipeReuseStatus') {
    const statusMap = {
      'new': 'New Pipes',
      'reuse': 'Reuse Old Pipes'
    };
    return statusMap[value] || String(value);
  }

  // Handle deliveryTarget as array
  if (keyPath === 'arteries.deliveryTarget' && Array.isArray(value)) {
    return value.length ? value
      .map(v => v.charAt(0).toUpperCase() + v.slice(1))
      .join(', ') : '';
  }

  // Handle sourceType as array
  if (keyPath === 'heart.sourceType' && Array.isArray(value)) {
    return value.length ? value
      .map(v => toTitleCase(v))
      .join(', ') : '';
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : '';
  }

  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function flattenObject(obj, prefix = '') {
  if (!obj || typeof obj !== 'object') return {};

  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      Object.assign(out, flattenObject(value, path));
      continue;
    }

    out[path] = value;
  }
  return out;
}

function isEmptyDisplayValue(displayValue) {
  return displayValue === '' || displayValue === '0' || displayValue === 'No';
}

function shouldExcludeField(keyPath) {
  // Exclude internal/technical fields that shouldn't be displayed
  const excludedFields = [
    'topographyMapType',
    'topographyMapImage',
    'soilTestReportType',
    'soilTestReport',
    'pumpHousePictureType',
    'pumpHousePicture',
    'unknownDetails', // Internal flag for form flow
    'primaryCropType', // Removed field
    'secondaryCropType', // Removed field
    'rowCount', // Removed field
    'totalPlantCount', // Removed field
    'croppingPattern', // Removed field
    'irrigationEfficiency', // Technical field
    'pipeReuseStatus', // Removed field
    'footValveCondition', // Removed field
    'efficiencyGap', // Removed field
    'dryRunRisk', // Removed field - dry run assessment not required
    'municipalWaterAvailable', // Removed field - municipal water not required
    'municipalWaterVolume', // Removed field - municipal water not required
    'wiringHealth', // Removed field - replaced with currentWiringCondition
    'solarSystemVoltage', // Removed field - replaced with solarSystemVoltageToggle
    'tractorOwnership', // Old field - replaced with equipment array
    'droneOwnership', // Old field - replaced with equipment array
    'sprayerOwnership', // Old field - replaced with equipment array
    'evStatus', // Old field - replaced with equipment array
  ];
  
  return excludedFields.some(field => keyPath.includes(field));
}

function shouldExcludeForProjectType(keyPath, projectType) {
  // For greenfield (new install), exclude retrofit-specific fields
  if (projectType === 'greenfield') {
    const retrofitFields = [
      'baseline.oldPumpTypes',
      'baseline.oldPumpAge',
      'baseline.starterCoilRepairs',
      'baseline.motorBurnouts',
      'baseline.pipeReuseStatus',
    ];
    return retrofitFields.includes(keyPath);
  }
  
  // For retrofit, exclude greenfield-specific fields (none currently)
  return false;
}

export default function SubmissionPreview({ formData }) {
  return (
    <div className="space-y-5">
      <div
        className="rounded-2xl p-5"
        style={{
          backgroundColor: THEME.cardBg,
          border: `1px solid ${THEME.cardBorder}`,
          color: THEME.text,
        }}
      >
        <div className="text-xl font-semibold">Preview Submission</div>
        <div className="mt-1 text-sm" style={{ color: THEME.muted }}>
          Please review the details below. You can go back to edit before submitting.
        </div>
      </div>

      <div className="space-y-4">
        {MODULES.map((m) => {
          const moduleData = formData?.[m.id] || {};
          const flat = flattenObject(moduleData, m.id);
          const entries = Object.entries(flat)
            .map(([keyPath, value]) => ({
              keyPath,
              label: toTitleCase(keyPath.split('.').slice(1).join('.')),
              value: formatValue(value, keyPath, formData),
            }))
            .filter((e) => 
              !shouldExcludeField(e.keyPath) &&
              !shouldExcludeForProjectType(e.keyPath, formData?.baseline?.projectType) &&
              e.value !== '' && 
              e.value !== '[]' && 
              e.value !== '{}' && 
              !isEmptyDisplayValue(e.value)
            );

          return (
            <div
              key={m.id}
              className="rounded-2xl p-5"
              style={{
                backgroundColor: THEME.cardBg,
                border: `1px solid ${THEME.cardBorder}`,
              }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <div className="text-base font-semibold" style={{ color: THEME.text }}>
                    {m.name}
                  </div>
                  <div className="text-xs" style={{ color: THEME.muted }}>
                    {m.subtitle}
                  </div>
                </div>
                <div className="text-xs" style={{ color: THEME.muted }}>
                  {entries.length} field{entries.length === 1 ? '' : 's'}
                </div>
              </div>

              {entries.length ? (
                <div className="mt-4 grid grid-cols-1 gap-3">
                  {entries.map((e) => (
                    <div
                      key={e.keyPath}
                      className="rounded-xl px-4 py-3"
                      style={{
                        backgroundColor: 'rgba(229, 231, 235, 0.75)',
                        border: `1px solid ${THEME.border}`,
                      }}
                    >
                      <div className="text-xs font-medium" style={{ color: THEME.muted }}>
                        {e.label}
                      </div>
                      <div className="mt-1 text-sm" style={{ color: THEME.text, wordBreak: 'break-word' }}>
                        {e.value}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-sm" style={{ color: THEME.muted }}>
                  No details filled in this section.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

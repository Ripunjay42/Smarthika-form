import { MODULES, MONTHS, CROP_TYPES } from '../../constants/formConstants';

const THEME = {
  bg: '#FAF0BF',
  panel: 'rgba(250, 240, 191, 0.9)',
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

function formatValue(value, keyPath) {
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

  if (keyPath === 'shed.harvestMonths' && Array.isArray(value)) {
    const selected = value
      .map((active, idx) => (active ? MONTHS[idx] : null))
      .filter(Boolean);
    return selected.length ? selected.join(', ') : '';
  }

  // Handle crops array
  if (keyPath === 'biology.crops' && Array.isArray(value)) {
    return value.length ? value
      .map(crop => {
        const cropLabel = CROP_TYPES.find(c => c.value === crop.cropType)?.label || crop.cropType;
        return `${cropLabel} (${crop.estimatedCount || 0})`;
      })
      .join(', ') : '';
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
  ];
  
  return excludedFields.some(field => keyPath.includes(field));
}

function shouldExcludeForProjectType(keyPath, projectType) {
  // For greenfield (new install), exclude retrofit-specific fields
  if (projectType === 'greenfield') {
    const retrofitFields = [
      'baseline.oldPumpType',
      'baseline.oldPumpAge',
      'baseline.burnoutFrequency',
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
              value: formatValue(value, keyPath),
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
                        backgroundColor: 'rgba(250, 240, 191, 0.75)',
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

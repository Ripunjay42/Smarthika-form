const isBlank = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
};

const isPositiveNumber = (value) => {
  if (value === null || value === undefined || value === '') return false;
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) && num > 0;
};

const digitsOnly = (value) => String(value ?? '').replace(/\D/g, '');

export const MODULE_VALIDATION_RULES = {
  profile: [
    {
      field: 'customerName',
      message: 'Farmer full name is required',
      validate: (data) => !isBlank(data?.customerName),
    },
    {
      field: 'whatsappNumber',
      message: 'WhatsApp number is required',
      validate: (data) => digitsOnly(data?.whatsappNumber).length >= 10,
    },
  ],
  canvas: [
    {
      field: 'totalArea',
      message: 'Total land area is required',
      validate: (data) => isPositiveNumber(data?.totalArea),
    },
  ],
  heart: [
    {
      field: 'sourceType',
      message: 'At least one water source type is required',
      validate: (data) => !isBlank(data?.sourceType),
    },
    // {
    //   field: 'numberOfBorewells',
    //   message: 'Number of water sources is required',
    //   validate: (data) => isPositiveNumber(data?.numberOfBorewells),
    // },
    // {
    //   field: 'totalDepth',
    //   message: 'Total depth of borewell/source is required',
    //   validate: (data) => isPositiveNumber(data?.totalDepth),
    // },
    // {
    //   field: 'staticWaterLevel',
    //   message: 'Static water level is required',
    //   validate: (data) => !isBlank(data?.staticWaterLevel),
    // },
    // {
    //   field: 'dynamicWaterLevel',
    //   message: 'Dynamic water level is required',
    //   validate: (data) => !isBlank(data?.dynamicWaterLevel),
    // },
  ],
  arteries: [
    {
      field: 'deliveryTarget',
      message: 'At least one delivery target is required',
      validate: (data) => !isBlank(data?.deliveryTarget),
    },
    {
      field: 'totalPipeLength',
      message: 'Total pipe length is required',
      validate: (data) => isPositiveNumber(data?.totalPipeLength),
    },
  ],
  pulse: [
    // {
    //   field: 'distanceMeterToBorewell',
    //   message: 'Distance from meter to borewell is required',
    //   validate: (data) => isPositiveNumber(data?.distanceMeterToBorewell),
    // },
  ],
  shelter: [],
  biology: [
    // Crops and water demand validation removed - farms can proceed without crop details
  ],
  baseline: [],
  shed: [],
  vision: [],
};

export function validateModule(moduleId, moduleData) {
  const rules = MODULE_VALIDATION_RULES[moduleId] || [];
  const fieldErrors = {};

  for (const rule of rules) {
    const ok = rule.validate(moduleData);
    if (!ok) fieldErrors[rule.field] = rule.message;
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

export function validateAllModules(modules, formData) {
  const moduleErrors = {};
  let firstInvalidModuleIndex = -1;

  modules.forEach((module, index) => {
    const { isValid, fieldErrors } = validateModule(module.id, formData?.[module.id]);
    if (!isValid) {
      moduleErrors[module.id] = fieldErrors;
      if (firstInvalidModuleIndex === -1) firstInvalidModuleIndex = index;
    }
  });

  return {
    isValid: firstInvalidModuleIndex === -1,
    moduleErrors,
    firstInvalidModuleIndex,
  };
}

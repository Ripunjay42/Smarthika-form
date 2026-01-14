import { createContext, useContext, useState, useCallback } from 'react';

const FormContext = createContext(null);

const initialFormData = {
  // Module 1: Profile (Identity)
  profile: {
    customerName: '',
    age: '',
    whatsappNumber: '',
    emailAddress: '',
    country: 'india',
    state: '',
    district: '',
    village: '',
    // Whether the farmer lives on this farm: 'yes' | 'no'
    livesOnFarm: 'yes',
    laborCount: 0,
  },
  // Module 2: Canvas (Land & Topography)
  canvas: {
    unitSystem: 'feet',
    gpsLatitude: '',
    gpsLongitude: '',
    totalArea: '',
    perimeterLength: '',
    fieldGeometry: 'rectangular',
    sideDimensions: { length: '', width: '' },
    topographyType: 'flat',
    slopePercentage: 0,
    inferredSlopePercentage: 0, // Automatically inferred from topographyType
    slopeDirection: '',
    soilTextureTop: 'black-clay',
    soilTextureSub: '',
    inferredSoilDepth: 'normal', // Automatically inferred from soil type (shallow|normal|deep)
    drainageClass: 'good',
    exclusionZones: 0,
    cultivableArea: '',
    roadAccessDistance: '',
    roadAccessible: 'direct',
    soilTestStatus: 'no',
    soilTestReport: null,
  },
  // Module 3: Heart (Borewell Hydraulics)
  heart: {
    unitSystem: 'feet',
    sourceType: ['borewell'],
    // numberOfBorewells: 1,
    totalDepth: '',
    staticWaterLevel: '',
    dynamicWaterLevel: '',
    unknownDetails: false, // User clicked 'I don't know' option
    casingDiameter: '4',
    pumpSettingDepth: '',
    seasonalVariance: 0,
    waterQuality: 'clear',
    waterStorageType: '',
    suctionHead: '',
    footValveCondition: 'good',
    pumpSize: '',
  },
  // Module 4: Arteries (Piping & Storage)
  arteries: {
    unitSystem: 'feet',
    deliveryTarget: ['direct'],
    overheadTankHeight: 20,
    tankCapacity: '',
    groundSumpDepth: '',
    sumpDistance: '',
    mainlinePipeMaterial: 'hdpe',
    mainlineDiameter: '3',
    pipeCondition: 'old',
    frictionHeadPenalty: 0,
    totalPipeLength: '',
    flowmeterRequirement: false,
    auxiliaryOutletNeed: false,
  },
  // Module 5: Pulse (Power Connection)
  pulse: {
    hasExistingPower: true, // "Do you have an existing power connection?" - Yes/No
    primaryEnergySource: 'grid',
    gridPhase: '1-phase',
    solarSystemVoltage: '240',
    solarSystemVoltageToggle: '240', // Toggle for Solar: 240V or 415V
    averageGridVoltage: 400,
    voltageStability: 'stable',
    lowVoltageCutoff: false,
    highVoltageSurge: false,
    dailyAvailability: 12,
    powerSchedule: 'day',
    solarOpportunityScore: 0,
    currentWiringCondition: 'good', // Renamed from wiringHealth
    cableUpgradeRequired: false,
    distanceMeterToBorewell: '',
    gensetCapacity: '', // Generator capacity in KVA
    frequentPhaseCuts: false, // "Frequent Phase Cuts?" Yes/No
  },
  // Module 6: Shelter (Logistics & Safety)
  shelter: {
    shelterStructure: 'concrete',
    ipRatingRequirement: 'IP54',
    heatBuildupRisk: 'low',
    wallSpaceAvailable: 'standard', // 'tight' | 'standard' | 'spacious'
    mobileSignalStrength: '4g',
    gsmIotCompatibility: true,
    theftRiskLevel: 'safe',
    antiTheftHardwareNeed: false,
    lightningArrestor: 'present',
    earthingPit: 'present',
    distanceToMainSwitch: '', // Distance from main meter/switch to pump house
    installationPreference: 'expert',
    liftingGearAvailability: 'chain-pulley',
    electricalSupport: 'expert', // 'local-electrician' | 'expert'
    mechanicalSupport: 'expert', // 'local-team' | 'expert'
    pumpHousePicture: null, // File upload
    pumpHousePictureFile: '',
    pumpHousePictureType: '',
    siteAccessibility: 'truck',
  },
  // Module 7: Biology (Crops & Demand)
  biology: {
    croppingPattern: 'monoculture',
    plantSpacing: '',
    plantSpacingUnit: 'feet', // 'feet' | 'meters'
    tractorAccessRequirement: false,
    cropAge: 'sapling',
    crops: [],
    peakWaterDemand: '',
    irrigationMethod: 'drip',
    irrigationEfficiency: 90,
    numberOfZones: 1,
    filtrationRequired: false,
    liquidFertilizerUsage: false, // Renamed from slurryFertigationUsage
  },
  // Module 8: Baseline (Retrofit)
  baseline: {
    projectType: 'greenfield',
    oldPumpTypes: [], // Array for multi-select (e.g., ['monoblock', 'submersible'])
    pumpDetails: {}, // Object storing age, repairs, burnouts for each pump type
    // Structure: { 'monoblock': { age: 5, repairs: 2, burnouts: 0 }, ... }
    pipeReuseStatus: 'new', // 'new' | 'reuse'
  },
  // Module 9: Shed (Inventory)
  shed: {
    equipment: [], // Array of selected equipment values
  },
  // Module 10: Vision (Economics)
  vision: {
    laborPainScore: 0,
    targetLER: 1,
    harvestMonths: [],
    cash_flow_type: 'seasonal',
    polyhouseStatus: 'none',
    aquacultureStatus: 'none',
    organicFarmingInterest: false,
  },
};

export function FormProvider({ children }) {
  const [formData, setFormData] = useState(initialFormData);
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [moduleErrors, setModuleErrors] = useState({});

  const updateModuleData = useCallback((module, data) => {
    setFormData((prev) => ({
      ...prev,
      [module]: { ...prev[module], ...data },
    }));

    // Clear errors for any updated fields in this module.
    setModuleErrors((prev) => {
      const current = prev?.[module];
      if (!current) return prev;

      const nextForModule = { ...current };
      Object.keys(data || {}).forEach((key) => {
        if (key in nextForModule) delete nextForModule[key];
      });

      if (Object.keys(nextForModule).length === 0) {
        const { [module]: _removed, ...rest } = prev;
        return rest;
      }

      return { ...prev, [module]: nextForModule };
    });
  }, []);

  const setErrorsForModule = useCallback((module, fieldErrors) => {
    setModuleErrors((prev) => ({
      ...prev,
      [module]: fieldErrors,
    }));
  }, []);

  const clearErrorsForModule = useCallback((module) => {
    setModuleErrors((prev) => {
      if (!prev?.[module]) return prev;
      const { [module]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const setAllModuleErrors = useCallback((allErrors) => {
    setModuleErrors(allErrors || {});
  }, []);

  const completeModule = useCallback((moduleIndex) => {
    setCompletedModules((prev) => 
      prev.includes(moduleIndex) ? prev : [...prev, moduleIndex]
    );
  }, []);

  const goToModule = useCallback((index) => {
    setCurrentModule(index);
  }, []);

  const nextModule = useCallback(() => {
    setCurrentModule((prev) => Math.min(prev + 1, 9));
  }, []);

  const prevModule = useCallback(() => {
    setCurrentModule((prev) => Math.max(prev - 1, 0));
  }, []);

  return (
    <FormContext.Provider
      value={{
        formData,
        currentModule,
        completedModules,
        moduleErrors,
        updateModuleData,
        setErrorsForModule,
        clearErrorsForModule,
        setAllModuleErrors,
        completeModule,
        goToModule,
        nextModule,
        prevModule,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

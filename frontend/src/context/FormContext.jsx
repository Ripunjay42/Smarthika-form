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
    slopeDirection: '',
    soilTextureTop: 'clay',
    soilTextureSub: '',
    drainageClass: 'good',
    exclusionZones: 0,
    cultivableArea: '',
    roadAccessDistance: '',
    soilTestStatus: 'needs-kit',
    soilTestReport: null, // File upload
    soilPH: 7,
    soilEC: 0,
  },
  // Module 3: Heart (Borewell Hydraulics)
  heart: {
    unitSystem: 'feet',
    sourceType: ['borewell'],
    numberOfBorewells: 1,
    totalDepth: '',
    staticWaterLevel: '',
    dynamicWaterLevel: '',
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
  // Module 5: Pulse (Power Infrastructure)
  pulse: {
    primaryEnergySource: 'grid',
    gridPhase: '1-phase',
    solarSystemVoltage: '240',
    averageGridVoltage: 400,
    voltageStability: 'stable',
    lowVoltageCutoff: false,
    highVoltageSurge: false,
    dailyAvailability: 12,
    powerSchedule: 'day',
    solarOpportunityScore: 0,
    wiringHealth: 'good',
    cableUpgradeRequired: false,
    distanceMeterToBorewell: '',
  },
  // Module 6: Shelter (Logistics & Safety)
  shelter: {
    shelterStructure: 'concrete',
    ipRatingRequirement: 'IP54',
    heatBuildupRisk: 'low',
    wallSpaceAvailable: 'standard',
    mobileSignalStrength: '4g',
    gsmIotCompatibility: true,
    theftRiskLevel: 'safe',
    antiTheftHardwareNeed: false,
    lightningArrestor: 'present',
    earthingPit: 'present',
    installationPreference: 'expert',
    liftingGearAvailability: 'chain-pulley',
    siteAccessibility: 'truck',
  },
  // Module 7: Biology (Crops & Demand)
  biology: {
    croppingPattern: 'monoculture',
    plantSpacing: '',
    tractorAccessRequirement: false,
    cropAge: 'sapling',
    crops: [],
    peakWaterDemand: '',
    irrigationMethod: 'drip',
    irrigationEfficiency: 90,
    requiredDischarge: '',
    numberOfZones: 1,
    filtrationRequired: false,
    filtrationRequirement: 'screen',
    slurryFertigationUsage: false,
  },
  // Module 8: Baseline (Retrofit)
  baseline: {
    projectType: 'greenfield',
    oldPumpType: 'submersible',
    oldPumpAge: 0,
    burnoutFrequency: 0,
  },
  // Module 9: Shed (Inventory)
  shed: {
    tractorOwnership: false,
    droneOwnership: false,
    sprayerOwnership: false,
    harvestMonths: [],
    evStatus: false,
  },
  // Module 10: Vision (Economics)
  vision: {
    laborPainScore: 0,
    targetLER: 1,
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

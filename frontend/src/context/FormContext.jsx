import { createContext, useContext, useState, useCallback } from 'react';

const FormContext = createContext(null);

const initialFormData = {
  // Module 1: Profile (Identity)
  profile: {
    customerName: '',
    whatsappNumber: '',
    emailAddress: '',
    laborCount: 0,
  },
  // Module 2: Canvas (Land & Topography)
  canvas: {
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
    soilPH: 7,
    soilEC: 0,
  },
  // Module 3: Heart (Borewell Hydraulics)
  heart: {
    sourceType: 'borewell',
    totalDepth: '',
    staticWaterLevel: '',
    dynamicWaterLevel: '',
    drawdown: '',
    casingDiameter: '4',
    pumpSettingDepth: '',
    seasonalVariance: 'low',
    dryRunRisk: 'low',
    waterQuality: 'clear',
    scalingRisk: 'low',
    ironContentRisk: 'low',
    abrasionRisk: 'low',
    suctionHead: '',
    footValveCondition: 'good',
    numberOfBorewells: 1,
  },
  // Module 4: Arteries (Piping & Storage)
  arteries: {
    deliveryTarget: 'direct',
    overheadTankHeight: '',
    tankCapacity: '',
    groundSumpDepth: '',
    sumpDistance: '',
    mainlinePipeMaterial: 'hdpe',
    mainlineDiameter: '',
    roughnessCoefficient: 150,
    pipeCondition: 'new',
    frictionHeadPenalty: 0,
    totalPipeLength: '',
    numberOfElbows: 0,
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
    generatorOwnership: false,
    evChargingNeed: false,
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
    primaryCropType: '',
    secondaryCropType: '',
    croppingPattern: 'monoculture',
    rowCount: 0,
    plantSpacing: '',
    tractorAccessRequirement: false,
    totalPlantCount: 0,
    cropAge: 'sapling',
    peakWaterDemand: '',
    irrigationMethod: 'drip',
    irrigationEfficiency: 90,
    requiredDischarge: '',
    numberOfZones: 1,
    filtrationRequirement: 'screen',
    slurryFertigationUsage: false,
  },
  // Module 8: Baseline (Retrofit)
  baseline: {
    projectType: 'greenfield',
    oldPumpType: 'submersible',
    oldPumpAge: 0,
    burnoutFrequency: 0,
    efficiencyGap: 0,
    pipeReuseStatus: false,
    footValveCondition: 'good',
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

  const updateModuleData = useCallback((module, data) => {
    setFormData((prev) => ({
      ...prev,
      [module]: { ...prev[module], ...data },
    }));
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
        updateModuleData,
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

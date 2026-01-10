import { useFormContext } from '../../context/FormContext';
import { MODULES } from '../../constants/formConstants';
import { motion } from 'framer-motion';

// Import all animation components from separate files
import GlobeAnimation from './GlobeAnimation';
import TopographyAnimation from './TopographyAnimation';
import BorewellAnimation from './BorewellAnimation';
import PipeAnimation from './PipeAnimation';
import VoltmeterAnimation from './VoltmeterAnimation';
import ShelterAnimation from './ShelterAnimation';
import CropGridAnimation from './CropGridAnimation';
import BaselineAnimation from './BaselineAnimation';
import EquipmentAnimation from './EquipmentAnimation';
import HarvestWheelAnimation from './HarvestWheelAnimation';

// Re-export individual animations for direct imports
export {
  GlobeAnimation,
  TopographyAnimation,
  BorewellAnimation,
  PipeAnimation,
  VoltmeterAnimation,
  ShelterAnimation,
  CropGridAnimation,
  BaselineAnimation,
  EquipmentAnimation,
  HarvestWheelAnimation,
};

// Animation mapping by module
const ANIMATION_MAP = {
  profile: GlobeAnimation,
  canvas: TopographyAnimation,
  heart: BorewellAnimation,
  arteries: PipeAnimation,
  pulse: VoltmeterAnimation,
  shelter: ShelterAnimation,
  biology: CropGridAnimation,
  baseline: BaselineAnimation,
  shed: EquipmentAnimation,
  vision: HarvestWheelAnimation,
};

// Main AnimationPanel that renders based on current module and passes form data
export default function AnimationPanel() {
  const { currentModule, formData } = useFormContext();
  
  // Convert module index to module ID string
  const moduleId = MODULES[currentModule]?.id || 'profile';
  
  // Get the animation component for current module
  const AnimationComponent = ANIMATION_MAP[moduleId] || GlobeAnimation;
  
  // Get form data for current module to pass as props
  const moduleData = formData[moduleId] || {};

  // Map form data to animation props based on module
  const getAnimationProps = () => {
    switch (moduleId) {
      case 'profile':
        return {
          farmerName: moduleData.customerName,
          whatsappNumber: moduleData.whatsappNumber,
          laborCount: moduleData.laborCount || 0,
          age: moduleData.age || 0,
          country: moduleData.country,
          state: moduleData.state,
          city: moduleData.city,
          farmSameLocation: moduleData.farmSameLocation,
        };
      
      case 'canvas':
        return {
          topographyType: moduleData.topographyType,
          soilType: moduleData.soilTextureTop,
          totalArea: parseFloat(moduleData.totalArea) || 0,
          fieldGeometry: moduleData.fieldGeometry,
          sideLength: parseFloat(moduleData.sideDimensions?.length) || 0,
          sideWidth: parseFloat(moduleData.sideDimensions?.width) || 0,
          exclusionZones: moduleData.exclusionZones || 0,
        };
      
      case 'heart':
        return {
          staticWaterLevel: parseFloat(moduleData.staticWaterLevel) || 0,
          dynamicWaterLevel: parseFloat(moduleData.dynamicWaterLevel) || 0,
          waterQuality: moduleData.waterQuality || 'clear',
          totalDepth: parseFloat(moduleData.totalDepth) || 0,
          casingDiameter: parseFloat(moduleData.casingDiameter) || 4,
          sourceType: Array.isArray(moduleData.sourceType) ? moduleData.sourceType : (moduleData.sourceType ? [moduleData.sourceType] : []),
          seasonalVariance: moduleData.seasonalVariance || 'low',
          dryRunRisk: moduleData.dryRunRisk || 'low',
          numberOfBorewells: parseFloat(moduleData.numberOfBorewells) || 1,
          suctionHead: parseFloat(moduleData.suctionHead) || 0,
          footValveCondition: moduleData.footValveCondition || 'good',
          municipalWaterAvailable: moduleData.municipalWaterAvailable || 'no',
          municipalWaterVolume: parseFloat(moduleData.municipalWaterVolume) || 0,
          pumpSize: moduleData.pumpSize || '',
        };
      
      case 'arteries':
        return {
          deliveryTarget: Array.isArray(moduleData.deliveryTarget) ? moduleData.deliveryTarget : (moduleData.deliveryTarget ? [moduleData.deliveryTarget] : []),
          overheadTankHeight: parseFloat(moduleData.overheadTankHeight) || 20,
          tankCapacity: parseFloat(moduleData.tankCapacity) || 0,
          groundSumpDepth: parseFloat(moduleData.groundSumpDepth) || 0,
          sumpDistance: parseFloat(moduleData.sumpDistance) || 0,
          mainlinePipeMaterial: moduleData.mainlinePipeMaterial,
          mainlineDiameter: parseFloat(moduleData.mainlineDiameter) || 3,
          pipeCondition: moduleData.pipeCondition,
          frictionHeadPenalty: parseFloat(moduleData.frictionHeadPenalty) || 0,
          totalPipeLength: parseFloat(moduleData.totalPipeLength) || 100,
          flowmeterRequirement: moduleData.flowmeterRequirement || false,
          auxiliaryOutletNeed: moduleData.auxiliaryOutletNeed || false,
        };
      
      case 'pulse':
        return {
          averageGridVoltage: parseFloat(moduleData.averageGridVoltage) || 400,
          voltageStability: moduleData.voltageStability,
          primaryEnergySource: moduleData.primaryEnergySource,
          gridPhase: moduleData.gridPhase,
          solarSystemVoltage: parseFloat(moduleData.solarSystemVoltage) || 0,
          lowVoltageCutoff: moduleData.lowVoltageCutoff || false,
          highVoltageSurge: moduleData.highVoltageSurge || false,
          dailyAvailability: parseFloat(moduleData.dailyAvailability) || 24,
          powerSchedule: moduleData.powerSchedule,
          wiringHealth: moduleData.wiringHealth,
          cableUpgradeRequired: moduleData.cableUpgradeRequired || false,
          distanceMeterToBorewell: parseFloat(moduleData.distanceMeterToBorewell) || 0,
          generatorOwnership: moduleData.generatorOwnership || false,
          evChargingNeed: moduleData.evChargingNeed || false,
        };
      
      case 'shelter':
        return {
          shelterType: moduleData.shelterStructure,
          cellularSignalStrength: moduleData.mobileSignalStrength,
          ipRatingRequirement: moduleData.ipRatingRequirement,
          heatBuildupRisk: moduleData.heatBuildupRisk,
          wallSpaceAvailable: moduleData.wallSpaceAvailable,
          theftRiskLevel: moduleData.theftRiskLevel,
          antiTheftHardwareNeed: moduleData.antiTheftHardwareNeed || false,
          lightningArrestor: moduleData.lightningArrestor,
          earthingPit: moduleData.earthingPit,
          installationPreference: moduleData.installationPreference,
          liftingGearAvailability: moduleData.liftingGearAvailability,
          siteAccessibility: moduleData.siteAccessibility,
        };
      
      case 'biology':
        return {
          primaryCropType: moduleData.primaryCropType,
          secondaryCropType: moduleData.secondaryCropType,
          croppingPattern: moduleData.croppingPattern,
          rowCount: parseFloat(moduleData.rowCount) || 0,
          plantSpacing: parseFloat(moduleData.plantSpacing) || 10,
          tractorAccessRequirement: moduleData.tractorAccessRequirement || false,
          totalPlantCount: parseFloat(moduleData.totalPlantCount) || 0,
          cropAge: moduleData.cropAge,
          peakWaterDemand: parseFloat(moduleData.peakWaterDemand) || 0,
          irrigationMethod: moduleData.irrigationMethod,
          requiredDischarge: parseFloat(moduleData.requiredDischarge) || 0,
          numberOfZones: parseFloat(moduleData.numberOfZones) || 1,
          filtrationRequirement: moduleData.filtrationRequirement,
          slurryFertigationUsage: moduleData.slurryFertigationUsage || false,
        };
      
      case 'baseline':
        return {
          projectType: moduleData.projectType,
          oldPumpType: moduleData.oldPumpType,
          oldPumpAge: parseFloat(moduleData.oldPumpAge) || 0,
          burnoutFrequency: parseFloat(moduleData.burnoutFrequency) || 0,
          efficiencyGap: parseFloat(moduleData.efficiencyGap) || 0,
          pipeReuseStatus: moduleData.pipeReuseStatus || false,
          footValveCondition: moduleData.footValveCondition,
        };
      
      case 'shed':
        return {
          tractorOwnership: moduleData.tractorOwnership || false,
          droneOwnership: moduleData.droneOwnership || false,
          sprayerOwnership: moduleData.sprayerOwnership || false,
          evStatus: moduleData.evStatus || false,
          harvestMonths: moduleData.harvestMonths || [],
        };
      
      case 'vision':
        return {
          laborPainScore: parseFloat(moduleData.laborPainScore) || 0,
          targetLER: parseFloat(moduleData.targetLER) || 1.0,
          organicFarmingInterest: moduleData.organicFarmingInterest || false,
          polyhouseStatus: moduleData.polyhouseStatus || 'none',
          aquacultureStatus: moduleData.aquacultureStatus || 'none',
        };
      
      default:
        return {};
    }
  };

  return (
    <div className="w-full h-full overflow-hidden rounded-2xl" style={{ backgroundColor: '#EDEDE7' }}>
      <motion.div
        key={moduleId}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="w-full h-full"
      >
        <AnimationComponent {...getAnimationProps()} />
      </motion.div>
    </div>
  );
}

import { useFormContext } from '../../context/FormContext';
import { MODULES } from '../../constants/formConstants';

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
          projectName: moduleData.projectName,
          contactPerson: moduleData.contactPerson,
        };
      
      case 'canvas':
        return {
          topographyType: moduleData.topographyType,
          soilType: moduleData.soilType,
          landArea: moduleData.landArea,
        };
      
      case 'heart':
        return {
          staticLevel: moduleData.staticLevel || 0,
          dynamicLevel: moduleData.dynamicLevel || 0,
          waterQuality: moduleData.waterQuality,
          borewellDepth: moduleData.borewellDepth || 0,
        };
      
      case 'arteries':
        return {
          deliveryTarget: moduleData.deliveryTarget,
          tankHeight: moduleData.tankHeight || 0,
          pipeLength: moduleData.pipeLength || 0,
        };
      
      case 'pulse':
        return {
          voltage: moduleData.voltage || 0,
          stability: moduleData.stability,
          phaseType: moduleData.phaseType,
        };
      
      case 'shelter':
        return {
          shelterType: moduleData.shelterType,
          signalStrength: moduleData.signalStrength,
          shelterSize: moduleData.shelterSize,
        };
      
      case 'biology':
        return {
          cropType: moduleData.cropType,
          plantSpacing: moduleData.plantSpacing || 0,
          cropAge: moduleData.cropAge || 0,
          irrigationType: moduleData.irrigationType,
        };
      
      case 'baseline':
        return {
          projectType: moduleData.projectType,
          pumpAge: moduleData.pumpAge || 0,
          burnoutFrequency: moduleData.burnoutFrequency || 0,
          efficiencyGap: moduleData.efficiencyGap || 0,
        };
      
      case 'shed':
        return {
          selectedEquipment: moduleData.selectedEquipment || [],
          equipmentCondition: moduleData.equipmentCondition || {},
          equipmentNotes: moduleData.equipmentNotes || {},
        };
      
      case 'vision':
        return {
          plantingMonth: moduleData.plantingMonth || 0,
          harvestMonth: moduleData.harvestMonth || 6,
          expectedYield: moduleData.expectedYield || 0,
          yieldUnit: moduleData.yieldUnit || 'tonnes/acre',
        };
      
      default:
        return {};
    }
  };

  return (
    <div className="w-full h-full overflow-hidden rounded-2xl" style={{ backgroundColor: '#EDEDE7' }}>
      <AnimationComponent {...getAnimationProps()} />
    </div>
  );
}

/**
 * Location Service - Fetches Indian states, districts, and villages from APIs
 * Using free public APIs for location data
 */

const CACHE = {
  states: null,
  districts: {},
  villages: {}
};

/**
 * Fetch all Indian states
 * Using India locations API
 */
export const fetchStates = async () => {
  if (CACHE.states) return CACHE.states;

  try {
    // Using public India API for states
    const response = await fetch('https://raw.githubusercontent.com/sab99r/Indian-States-Districts/master/states.json');
    const data = await response.json();
    
    const states = data.map(state => ({
      value: state.toLowerCase().replace(/\s+/g, '-'),
      label: state
    }));
    
    CACHE.states = states;
    return states;
  } catch (error) {
    console.warn('Failed to fetch states from API:', error);
    // Fallback to default states
    return getDefaultStates();
  }
};

/**
 * Fetch districts for a given state
 * Using India districts API
 */
export const fetchDistricts = async (state) => {
  if (!state) return [];
  if (CACHE.districts[state]) return CACHE.districts[state];

  try {
    // Using public India API for districts
    const response = await fetch('https://raw.githubusercontent.com/sab99r/Indian-States-Districts/master/states_districts.json');
    const data = await response.json();
    
    // Find the state in the data and get its districts
    const stateData = data.find(s => 
      s.state.toLowerCase().replace(/\s+/g, '-') === state ||
      s.state.toLowerCase() === state.replace(/-/g, ' ')
    );
    
    if (stateData && stateData.districts) {
      const districts = stateData.districts.map(district => ({
        value: district.toLowerCase().replace(/\s+/g, '-'),
        label: district
      }));
      
      CACHE.districts[state] = districts;
      return districts;
    }
    
    return [];
  } catch (error) {
    console.warn('Failed to fetch districts from API:', error);
    return [];
  }
};

/**
 * Fetch villages/cities for a district
 * Note: Detailed village data is not widely available in public APIs
 * This returns empty by default, allowing user to type custom village name
 */
export const fetchVillages = async (state, district) => {
  if (!state || !district) return [];
  
  // Village-level data is not commonly available in free APIs
  // Returning empty array to allow users to type their own
  return [];
};

/**
 * Default fallback states for India
 */
const getDefaultStates = () => [
  { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
  { value: 'arunachal-pradesh', label: 'Arunachal Pradesh' },
  { value: 'assam', label: 'Assam' },
  { value: 'bihar', label: 'Bihar' },
  { value: 'chhattisgarh', label: 'Chhattisgarh' },
  { value: 'goa', label: 'Goa' },
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'haryana', label: 'Haryana' },
  { value: 'himachal-pradesh', label: 'Himachal Pradesh' },
  { value: 'jharkhand', label: 'Jharkhand' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'kerala', label: 'Kerala' },
  { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'manipur', label: 'Manipur' },
  { value: 'meghalaya', label: 'Meghalaya' },
  { value: 'mizoram', label: 'Mizoram' },
  { value: 'nagaland', label: 'Nagaland' },
  { value: 'odisha', label: 'Odisha' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'rajasthan', label: 'Rajasthan' },
  { value: 'sikkim', label: 'Sikkim' },
  { value: 'tamil-nadu', label: 'Tamil Nadu' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'tripura', label: 'Tripura' },
  { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
  { value: 'uttarakhand', label: 'Uttarakhand' },
  { value: 'west-bengal', label: 'West Bengal' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'puducherry', label: 'Puducherry' },
  { value: 'chandigarh', label: 'Chandigarh' },
  { value: 'lakshadweep', label: 'Lakshadweep' },
  { value: 'daman-diu', label: 'Daman & Diu' },
  { value: 'dadra-nagar-haveli', label: 'Dadra & Nagar Haveli' },
  { value: 'andaman-nicobar', label: 'Andaman & Nicobar Islands' },
];

/**
 * Clear cache (useful for testing or refreshing data)
 */
export const clearLocationCache = () => {
  CACHE.states = null;
  CACHE.districts = {};
  CACHE.villages = {};
};

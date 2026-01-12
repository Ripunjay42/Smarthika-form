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

  // Use default states directly (API is unreliable)
  const states = getDefaultStates();
  CACHE.states = states;
  return states;
};

/**
 * Fetch districts for a given state
 * Using India districts API
 */
export const fetchDistricts = async (state) => {
  if (!state) return [];
  if (CACHE.districts[state]) return CACHE.districts[state];

  // Return empty array - let users type their district
  // (API is unreliable, better to use free-text input)
  return [];
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

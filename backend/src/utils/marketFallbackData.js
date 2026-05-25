// backend/src/utils/marketFallbackData.js
// Fallback data used ONLY when live API is unavailable

export const fallbackMandiData = [
  {
    state: "Gujarat",
    district: "Gir Somnath",
    market: "Kodinar",
    commodity: "Groundnut",
    variety: "Bold",
    grade: "FAQ",
    arrival_date: "01/05/2025",
    min_price: "5200",
    max_price: "6100",
    modal_price: "5700",
  },
  {
    state: "Gujarat",
    district: "Gir Somnath",
    market: "Kodinar",
    commodity: "Cotton",
    variety: "Shankar-6",
    grade: "FAQ",
    arrival_date: "01/05/2025",
    min_price: "6500",
    max_price: "7200",
    modal_price: "6900",
  },
  {
    state: "Gujarat",
    district: "Gir Somnath",
    market: "Kodinar",
    commodity: "Onion",
    variety: "Local",
    grade: "Medium",
    arrival_date: "01/05/2025",
    min_price: "800",
    max_price: "1400",
    modal_price: "1100",
  },
  {
    state: "Gujarat",
    district: "Gir Somnath",
    market: "Kodinar",
    commodity: "Wheat",
    variety: "Lokwan",
    grade: "FAQ",
    arrival_date: "01/05/2025",
    min_price: "2100",
    max_price: "2400",
    modal_price: "2250",
  },
  {
    state: "Gujarat",
    district: "Rajkot",
    market: "Rajkot",
    commodity: "Groundnut",
    variety: "Bold",
    grade: "FAQ",
    arrival_date: "01/05/2025",
    min_price: "5100",
    max_price: "6000",
    modal_price: "5600",
  },
  {
    state: "Gujarat",
    district: "Rajkot",
    market: "Rajkot",
    commodity: "Cumin",
    variety: "Local",
    grade: "FAQ",
    arrival_date: "01/05/2025",
    min_price: "22000",
    max_price: "26000",
    modal_price: "24000",
  },
  {
    state: "Gujarat",
    district: "Banaskantha",
    market: "Deesa",
    commodity: "Potato",
    variety: "Jyoti",
    grade: "FAQ",
    arrival_date: "01/05/2025",
    min_price: "700",
    max_price: "1100",
    modal_price: "900",
  },
  {
    state: "Gujarat",
    district: "Banaskantha",
    market: "Deesa",
    commodity: "Bajra",
    variety: "Hybrid",
    grade: "FAQ",
    arrival_date: "01/05/2025",
    min_price: "1900",
    max_price: "2200",
    modal_price: "2050",
  },
  {
    state: "Gujarat",
    district: "Mehsana",
    market: "Unjha",
    commodity: "Cumin",
    variety: "Local",
    grade: "FAQ",
    arrival_date: "01/05/2025",
    min_price: "21000",
    max_price: "27000",
    modal_price: "24500",
  },
  {
    state: "Gujarat",
    district: "Mehsana",
    market: "Unjha",
    commodity: "Fennel",
    variety: "Local",
    grade: "FAQ",
    arrival_date: "01/05/2025",
    min_price: "8000",
    max_price: "11000",
    modal_price: "9500",
  },
  {
    state: "Gujarat",
    district: "Amreli",
    market: "Amreli",
    commodity: "Groundnut",
    variety: "Bold",
    grade: "FAQ",
    arrival_date: "01/05/2025",
    min_price: "5000",
    max_price: "5900",
    modal_price: "5500",
  },
  {
    state: "Gujarat",
    district: "Amreli",
    market: "Amreli",
    commodity: "Cotton",
    variety: "Shankar-6",
    grade: "FAQ",
    arrival_date: "01/05/2025",
    min_price: "6200",
    max_price: "7000",
    modal_price: "6600",
  },
];

// Gujarat district → nearest major market yard mapping
export const gujaratNearestMarketMap = {
  "Gir Somnath": {
    Kodinar: "Kodinar",
    Una: "Una",
    Veraval: "Veraval",
    Sutrapada: "Veraval",
    default: "Kodinar",
  },
  Rajkot: {
    Rajkot: "Rajkot",
    Gondal: "Gondal",
    Jetpur: "Jetpur",
    Wankaner: "Wankaner",
    default: "Rajkot",
  },
  Junagadh: {
    Junagadh: "Junagadh",
    Keshod: "Keshod",
    Veraval: "Veraval",
    default: "Junagadh",
  },
  Amreli: {
    Amreli: "Amreli",
    Savarkundla: "Savarkundla",
    Dhari: "Dhari",
    default: "Amreli",
  },
  Banaskantha: {
    Deesa: "Deesa",
    Palanpur: "Palanpur",
    Dhanera: "Dhanera",
    default: "Deesa",
  },
  Mehsana: {
    Unjha: "Unjha",
    Mehsana: "Mehsana",
    Visnagar: "Visnagar",
    default: "Unjha",
  },
  Ahmedabad: {
    Ahmedabad: "Ahmedabad",
    Sanand: "Sanand",
    Dholka: "Dholka",
    default: "Ahmedabad",
  },
  Surat: {
    Surat: "Surat",
    Bardoli: "Bardoli",
    Vyara: "Vyara",
    default: "Surat",
  },
  Vadodara: {
    Vadodara: "Vadodara",
    Anand: "Anand",
    Karjan: "Karjan",
    default: "Vadodara",
  },
  Anand: {
    Anand: "Anand",
    Petlad: "Petlad",
    Borsad: "Borsad",
    default: "Anand",
  },
  Kachchh: {
    Bhuj: "Bhuj",
    Gandhidham: "Gandhidham",
    Anjar: "Anjar",
    default: "Bhuj",
  },
  Patan: {
    Patan: "Patan",
    Sidhpur: "Sidhpur",
    default: "Patan",
  },
  Surendranagar: {
    Wadhwan: "Wadhwan",
    Limbdi: "Limbdi",
    Chotila: "Chotila",
    default: "Wadhwan",
  },
  Bhavnagar: {
    Bhavnagar: "Bhavnagar",
    Sihor: "Sihor",
    Palitana: "Palitana",
    default: "Bhavnagar",
  },
  Porbandar: {
    Porbandar: "Porbandar",
    Ranavav: "Ranavav",
    default: "Porbandar",
  },
  Jamnagar: {
    Jamnagar: "Jamnagar",
    Dhrol: "Dhrol",
    default: "Jamnagar",
  },
  Morbi: {
    Morbi: "Morbi",
    Tankara: "Tankara",
    default: "Morbi",
  },
  Gandhinagar: {
    Gandhinagar: "Gandhinagar",
    Mansa: "Mansa",
    default: "Gandhinagar",
  },
  Kheda: {
    Nadiad: "Nadiad",
    Kheda: "Kheda",
    default: "Nadiad",
  },
  Navsari: {
    Navsari: "Navsari",
    Gandevi: "Gandevi",
    default: "Navsari",
  },
  Valsad: {
    Valsad: "Valsad",
    Vapi: "Vapi",
    default: "Valsad",
  },
};

/**
 * Returns the nearest market yard name given state, district, taluka
 * @param {string} state
 * @param {string} district
 * @param {string} taluka
 * @returns {string} market yard name
 */
export function getNearestMarket(state, district, taluka) {
  if (!state || state.toLowerCase() !== "gujarat") return null;

  const districtMap = gujaratNearestMarketMap[district];
  if (!districtMap) return null;

  // Try exact taluka match first
  if (taluka && districtMap[taluka]) {
    return districtMap[taluka];
  }

  // Fall back to district default
  return districtMap.default || null;
}
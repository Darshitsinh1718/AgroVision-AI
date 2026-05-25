// frontend/src/data/marketMockData.js
// Mirror of backend mock data for client-side fallback.

export const MOCK_MANDI_PRICES = [
  { state:'Gujarat',        district:'Rajkot',       market:'Rajkot',       commodity:'Wheat',     variety:'Lokwan',    grade:'FAQ', minPrice:2180, maxPrice:2340, modalPrice:2260, date:'2025-05-14', unit:'Quintal' },
  { state:'Gujarat',        district:'Rajkot',       market:'Rajkot',       commodity:'Tomato',    variety:'Local',     grade:'FAQ', minPrice:2400, maxPrice:3200, modalPrice:2840, date:'2025-05-14', unit:'Quintal' },
  { state:'Gujarat',        district:'Rajkot',       market:'Rajkot',       commodity:'Cotton',    variety:'Shankar-6', grade:'FAQ', minPrice:6200, maxPrice:6680, modalPrice:6420, date:'2025-05-14', unit:'Quintal' },
  { state:'Gujarat',        district:'Rajkot',       market:'Rajkot',       commodity:'Groundnut', variety:'Bold',      grade:'FAQ', minPrice:5600, maxPrice:6100, modalPrice:5840, date:'2025-05-14', unit:'Quintal' },
  { state:'Gujarat',        district:'Junagadh',     market:'Junagadh',     commodity:'Groundnut', variety:'TG-37A',    grade:'FAQ', minPrice:5750, maxPrice:6200, modalPrice:5980, date:'2025-05-14', unit:'Quintal' },
  { state:'Gujarat',        district:'Junagadh',     market:'Junagadh',     commodity:'Wheat',     variety:'Lokwan',    grade:'FAQ', minPrice:2150, maxPrice:2310, modalPrice:2240, date:'2025-05-14', unit:'Quintal' },
  { state:'Gujarat',        district:'Amreli',       market:'Amreli',       commodity:'Soybean',   variety:'JS-335',    grade:'FAQ', minPrice:4050, maxPrice:4480, modalPrice:4260, date:'2025-05-14', unit:'Quintal' },
  { state:'Gujarat',        district:'Surendranagar',market:'Surendranagar',commodity:'Cotton',    variety:'Shankar-6', grade:'FAQ', minPrice:6300, maxPrice:6720, modalPrice:6500, date:'2025-05-14', unit:'Quintal' },
  { state:'Gujarat',        district:'Surat',        market:'Surat',        commodity:'Tomato',    variety:'Hybrid',    grade:'FAQ', minPrice:2600, maxPrice:3400, modalPrice:3000, date:'2025-05-14', unit:'Quintal' },
  { state:'Maharashtra',    district:'Nashik',       market:'Nashik',       commodity:'Tomato',    variety:'Hybrid',    grade:'FAQ', minPrice:1800, maxPrice:2800, modalPrice:2300, date:'2025-05-14', unit:'Quintal' },
  { state:'Maharashtra',    district:'Nashik',       market:'Nashik',       commodity:'Onion',     variety:'Nasik Red', grade:'FAQ', minPrice:1200, maxPrice:1800, modalPrice:1500, date:'2025-05-14', unit:'Quintal' },
  { state:'Maharashtra',    district:'Nashik',       market:'Nashik',       commodity:'Grape',     variety:'Thompson',  grade:'FAQ', minPrice:4200, maxPrice:5800, modalPrice:5000, date:'2025-05-14', unit:'Quintal' },
  { state:'Maharashtra',    district:'Pune',         market:'Pune',         commodity:'Wheat',     variety:'Lokwan',    grade:'FAQ', minPrice:2200, maxPrice:2400, modalPrice:2300, date:'2025-05-14', unit:'Quintal' },
  { state:'Maharashtra',    district:'Nagpur',       market:'Nagpur',       commodity:'Soybean',   variety:'JS-335',    grade:'FAQ', minPrice:4100, maxPrice:4500, modalPrice:4300, date:'2025-05-14', unit:'Quintal' },
  { state:'Maharashtra',    district:'Akola',        market:'Akola',        commodity:'Cotton',    variety:'Hybrid',    grade:'FAQ', minPrice:6400, maxPrice:6900, modalPrice:6650, date:'2025-05-14', unit:'Quintal' },
  { state:'Punjab',         district:'Ludhiana',     market:'Ludhiana',     commodity:'Wheat',     variety:'PBW-343',   grade:'FAQ', minPrice:2250, maxPrice:2450, modalPrice:2350, date:'2025-05-14', unit:'Quintal' },
  { state:'Punjab',         district:'Patiala',      market:'Patiala',      commodity:'Rice',      variety:'Basmati',   grade:'FAQ', minPrice:3200, maxPrice:4200, modalPrice:3700, date:'2025-05-14', unit:'Quintal' },
  { state:'Uttar Pradesh',  district:'Agra',         market:'Agra',         commodity:'Wheat',     variety:'K-307',     grade:'FAQ', minPrice:2100, maxPrice:2300, modalPrice:2200, date:'2025-05-14', unit:'Quintal' },
  { state:'Uttar Pradesh',  district:'Lucknow',      market:'Lucknow',      commodity:'Potato',    variety:'Kufri Jyoti',grade:'FAQ',minPrice:1100, maxPrice:1600, modalPrice:1350, date:'2025-05-14', unit:'Quintal' },
  { state:'Uttar Pradesh',  district:'Kanpur',       market:'Kanpur',       commodity:'Soybean',   variety:'JS-335',    grade:'FAQ', minPrice:3900, maxPrice:4300, modalPrice:4100, date:'2025-05-14', unit:'Quintal' },
  { state:'Madhya Pradesh', district:'Indore',       market:'Indore',       commodity:'Soybean',   variety:'JS-9560',   grade:'FAQ', minPrice:4100, maxPrice:4550, modalPrice:4325, date:'2025-05-14', unit:'Quintal' },
  { state:'Madhya Pradesh', district:'Bhopal',       market:'Bhopal',       commodity:'Wheat',     variety:'Sharbati',  grade:'FAQ', minPrice:2350, maxPrice:2600, modalPrice:2475, date:'2025-05-14', unit:'Quintal' },
  { state:'Rajasthan',      district:'Jaipur',       market:'Jaipur',       commodity:'Wheat',     variety:'Raj-4120',  grade:'FAQ', minPrice:2200, maxPrice:2400, modalPrice:2300, date:'2025-05-14', unit:'Quintal' },
  { state:'Rajasthan',      district:'Jodhpur',      market:'Jodhpur',      commodity:'Bajra',     variety:'HHB-67',    grade:'FAQ', minPrice:2000, maxPrice:2300, modalPrice:2150, date:'2025-05-14', unit:'Quintal' },
  { state:'Haryana',        district:'Hisar',        market:'Hisar',        commodity:'Wheat',     variety:'WH-711',    grade:'FAQ', minPrice:2250, maxPrice:2440, modalPrice:2345, date:'2025-05-14', unit:'Quintal' },
  { state:'Haryana',        district:'Karnal',       market:'Karnal',       commodity:'Rice',      variety:'Basmati',   grade:'FAQ', minPrice:3500, maxPrice:4500, modalPrice:4000, date:'2025-05-14', unit:'Quintal' },
  { state:'Karnataka',      district:'Bangalore',    market:'Bangalore',    commodity:'Tomato',    variety:'Hybrid',    grade:'FAQ', minPrice:2200, maxPrice:3200, modalPrice:2700, date:'2025-05-14', unit:'Quintal' },
  { state:'Karnataka',      district:'Dharwad',      market:'Dharwad',      commodity:'Cotton',    variety:'DCH-32',    grade:'FAQ', minPrice:6500, maxPrice:7000, modalPrice:6750, date:'2025-05-14', unit:'Quintal' },
  { state:'Tamil Nadu',     district:'Coimbatore',   market:'Coimbatore',   commodity:'Maize',     variety:'Hybrid',    grade:'FAQ', minPrice:1850, maxPrice:2150, modalPrice:2000, date:'2025-05-14', unit:'Quintal' },
  { state:'Tamil Nadu',     district:'Madurai',      market:'Madurai',      commodity:'Cotton',    variety:'CO-10',     grade:'FAQ', minPrice:6300, maxPrice:6800, modalPrice:6550, date:'2025-05-14', unit:'Quintal' },
]

export const PRICE_HISTORY = {
  'Wheat':     [2180, 2210, 2195, 2230, 2260, 2245, 2260],
  'Tomato':    [3200, 2900, 2650, 2750, 2840, 3100, 2840],
  'Cotton':    [6200, 6280, 6350, 6300, 6420, 6480, 6420],
  'Groundnut': [5600, 5680, 5720, 5800, 5840, 5900, 5840],
  'Soybean':   [4200, 4150, 4180, 4220, 4260, 4300, 4260],
  'Rice':      [3600, 3650, 3700, 3680, 3700, 3720, 3700],
  'Onion':     [1600, 1500, 1420, 1380, 1400, 1500, 1500],
  'Maize':     [1900, 1920, 1940, 1950, 1940, 1960, 1940],
  'Potato':    [1300, 1320, 1340, 1360, 1350, 1380, 1350],
  'Mustard':   [5300, 5350, 5400, 5420, 5450, 5480, 5450],
  'Bajra':     [2050, 2080, 2100, 2130, 2150, 2160, 2150],
  'Grape':     [4800, 4900, 4950, 5000, 5000, 5050, 5000],
}

export const MSP_PRICES = {
  'Wheat': 2275, 'Rice': 2300, 'Maize': 2090, 'Bajra': 2625,
  'Soybean': 4892, 'Groundnut': 6783, 'Mustard': 5950, 'Cotton': 7121,
}
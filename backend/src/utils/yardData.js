// backend/src/utils/yardData.js
// ─────────────────────────────────────────────────────────
// Market yard dataset for Gujarat — Saurashtra region focus.
// Covers 8 major yards with crop prices, coordinates, and
// taluka-level location data for nearest-yard logic.
//
// Data structure matches AgMarkNet / APMC Gujarat format.
// Prices in ₹/Quintal, arrivals in tonnes.
// ─────────────────────────────────────────────────────────

// ── Today's date string helper ────────────────────────────
const today = () => new Date().toISOString().split('T')[0]
const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

// ── Yard master database ──────────────────────────────────
export const YARDS = [
  {
    yardId:    'kodinar',
    name:      'Kodinar Market Yard',
    shortName: 'Kodinar',
    apmc:      'APMC Kodinar',
    state:     'Gujarat',
    district:  'Gir Somnath',
    taluka:    'Kodinar',
    address:   'APMC Yard, Kodinar, Gir Somnath - 362720',
    lat:       20.7967,
    lon:       70.7017,
    phone:     '02876-222234',
    workingDays: 'Mon–Sat',
    timings:   '7:00 AM – 2:00 PM',
    licenseNo: 'GJ/APMC/GIR/KOD/001',
    nearbyTalukas: ['Kodinar', 'Una', 'Sutrapada', 'Veraval'],
    description: 'Primary mandi for southern Gir Somnath region. Major crops: Groundnut, Castor, Wheat, Cotton.',
  },
  {
    yardId:    'veraval',
    name:      'Veraval Market Yard',
    shortName: 'Veraval',
    apmc:      'APMC Veraval',
    state:     'Gujarat',
    district:  'Gir Somnath',
    taluka:    'Veraval',
    address:   'APMC Yard, Veraval, Gir Somnath - 362265',
    lat:       20.9063,
    lon:       70.3678,
    phone:     '02876-243567',
    workingDays: 'Mon–Sat',
    timings:   '7:00 AM – 2:00 PM',
    licenseNo: 'GJ/APMC/GIR/VER/002',
    nearbyTalukas: ['Veraval', 'Sutrapada', 'Kodinar', 'Patan (Somnath)'],
    description: 'Coastal trading hub. Fish, Groundnut, Sesame, Cotton. Linked to Somnath area farmers.',
  },
  {
    yardId:    'una',
    name:      'Una Market Yard',
    shortName: 'Una',
    apmc:      'APMC Una',
    state:     'Gujarat',
    district:  'Gir Somnath',
    taluka:    'Una',
    address:   'APMC Yard, Una, Gir Somnath - 362560',
    lat:       20.8280,
    lon:       71.0380,
    phone:     '02876-221122',
    workingDays: 'Mon–Sat',
    timings:   '7:00 AM – 2:00 PM',
    licenseNo: 'GJ/APMC/GIR/UNA/003',
    nearbyTalukas: ['Una', 'Kodinar', 'Dhari', 'Diu'],
    description: 'Eastern Gir Somnath yard. Strong in Groundnut, Banana, Castor, Sesame.',
  },
  {
    yardId:    'talala',
    name:      'Talala (Gir) Market Yard',
    shortName: 'Talala',
    apmc:      'APMC Talala',
    state:     'Gujarat',
    district:  'Gir Somnath',
    taluka:    'Talala',
    address:   'APMC Yard, Talala, Gir Somnath - 362150',
    lat:       21.0342,
    lon:       70.4623,
    phone:     '02876-224500',
    workingDays: 'Mon–Sat',
    timings:   '7:30 AM – 1:30 PM',
    licenseNo: 'GJ/APMC/GIR/TAL/004',
    nearbyTalukas: ['Talala', 'Visavadar', 'Sutrapada'],
    description: 'Gir forest region yard. Known for Kesar Mango, Chikoo (Sapota), Groundnut.',
  },
  {
    yardId:    'junagadh',
    name:      'Junagadh Market Yard',
    shortName: 'Junagadh',
    apmc:      'APMC Junagadh',
    state:     'Gujarat',
    district:  'Junagadh',
    taluka:    'Junagadh',
    address:   'APMC Yard, Junagadh - 362001',
    lat:       21.5222,
    lon:       70.4579,
    phone:     '0285-2623456',
    workingDays: 'Mon–Sat',
    timings:   '6:00 AM – 3:00 PM',
    licenseNo: 'GJ/APMC/JUN/JUN/005',
    nearbyTalukas: ['Junagadh', 'Vanthali', 'Bhesan', 'Keshod', 'Mangrol'],
    description: 'Major regional hub. High volumes of Groundnut, Wheat, Maize, Cotton, Castor, Banana.',
  },
  {
    yardId:    'amreli',
    name:      'Amreli Market Yard',
    shortName: 'Amreli',
    apmc:      'APMC Amreli',
    state:     'Gujarat',
    district:  'Amreli',
    taluka:    'Amreli',
    address:   'APMC Yard, Amreli - 365601',
    lat:       21.6024,
    lon:       71.2211,
    phone:     '02792-223301',
    workingDays: 'Mon–Sat',
    timings:   '7:00 AM – 2:00 PM',
    licenseNo: 'GJ/APMC/AMR/AMR/006',
    nearbyTalukas: ['Amreli', 'Dhari', 'Rajula', 'Babra', 'Jafarabad'],
    description: 'Key Amreli district yard. Groundnut, Soybean, Cotton, Castor are major commodities.',
  },
  {
    yardId:    'rajkot',
    name:      'Rajkot Market Yard',
    shortName: 'Rajkot',
    apmc:      'APMC Rajkot',
    state:     'Gujarat',
    district:  'Rajkot',
    taluka:    'Rajkot',
    address:   'APMC Yard, 150 Ft. Ring Road, Rajkot - 360001',
    lat:       22.3039,
    lon:       70.8022,
    phone:     '0281-2463344',
    workingDays: 'Mon–Sat',
    timings:   '6:00 AM – 4:00 PM',
    licenseNo: 'GJ/APMC/RAJ/RAJ/007',
    nearbyTalukas: ['Rajkot', 'Gondal', 'Paddhari', 'Jasdan'],
    description: 'Largest Saurashtra hub. Cotton, Groundnut, Wheat, Castor, Cumin. High daily arrivals.',
  },
  {
    yardId:    'jamnagar',
    name:      'Jamnagar Market Yard',
    shortName: 'Jamnagar',
    apmc:      'APMC Jamnagar',
    state:     'Gujarat',
    district:  'Jamnagar',
    taluka:    'Jamnagar',
    address:   'APMC Yard, Indira Marg, Jamnagar - 361001',
    lat:       22.4707,
    lon:       70.0577,
    phone:     '0288-2551122',
    workingDays: 'Mon–Sat',
    timings:   '7:00 AM – 2:30 PM',
    licenseNo: 'GJ/APMC/JAM/JAM/008',
    nearbyTalukas: ['Jamnagar', 'Jodiya', 'Dhrol', 'Lalpur'],
    description: 'Jamnagar district main yard. Groundnut, Sesame, Cotton, Cumin, Wheat.',
  },
]

// ── Crop price data per yard ──────────────────────────────
// arrivalQty in tonnes, prices in ₹/Quintal
export const YARD_PRICES = {
  kodinar: [
    { commodity:'Groundnut (Bold)', variety:'TG-37A',    unit:'Quintal', arrivalQty:380, minPrice:5800, maxPrice:6350, modalPrice:6120, prevModalPrice:6050, date:today() },
    { commodity:'Groundnut (Ref.)', variety:'TG-37A',    unit:'Quintal', arrivalQty:210, minPrice:5500, maxPrice:5950, modalPrice:5720, prevModalPrice:5680, date:today() },
    { commodity:'Castor Seed',      variety:'GCH-4',     unit:'Quintal', arrivalQty:145, minPrice:5600, maxPrice:5950, modalPrice:5780, prevModalPrice:5820, date:today() },
    { commodity:'Wheat',            variety:'Lokwan',    unit:'Quintal', arrivalQty:95,  minPrice:2150, maxPrice:2340, modalPrice:2260, prevModalPrice:2230, date:today() },
    { commodity:'Cotton (Kapas)',   variety:'Shankar-6', unit:'Quintal', arrivalQty:62,  minPrice:6100, maxPrice:6550, modalPrice:6320, prevModalPrice:6280, date:today() },
    { commodity:'Sesame (Til)',     variety:'Local',     unit:'Quintal', arrivalQty:28,  minPrice:13500,maxPrice:14800,modalPrice:14200,prevModalPrice:14050, date:today() },
    { commodity:'Bajra',            variety:'GHB-558',   unit:'Quintal', arrivalQty:74,  minPrice:2050, maxPrice:2280, modalPrice:2180, prevModalPrice:2160, date:today() },
    { commodity:'Maize',            variety:'Hybrid',    unit:'Quintal', arrivalQty:55,  minPrice:1820, maxPrice:2050, modalPrice:1940, prevModalPrice:1960, date:today() },
    { commodity:'Onion',            variety:'Local',     unit:'Quintal', arrivalQty:110, minPrice:1200, maxPrice:1800, modalPrice:1480, prevModalPrice:1350, date:today() },
    { commodity:'Garlic',           variety:'Local',     unit:'Quintal', arrivalQty:32,  minPrice:4200, maxPrice:5800, modalPrice:5100, prevModalPrice:4950, date:today() },
    { commodity:'Banana',           variety:'Basrai',    unit:'Quintal', arrivalQty:420, minPrice:800,  maxPrice:1200, modalPrice:1050, prevModalPrice:1020, date:today() },
    { commodity:'Sapota (Chikoo)',  variety:'Kalipatti', unit:'Quintal', arrivalQty:85,  minPrice:1800, maxPrice:2600, modalPrice:2200, prevModalPrice:2150, date:today() },
  ],
  veraval: [
    { commodity:'Groundnut (Bold)', variety:'TG-37A',    unit:'Quintal', arrivalQty:290, minPrice:5750, maxPrice:6280, modalPrice:6050, prevModalPrice:5990, date:today() },
    { commodity:'Castor Seed',      variety:'GCH-4',     unit:'Quintal', arrivalQty:120, minPrice:5580, maxPrice:5900, modalPrice:5760, prevModalPrice:5800, date:today() },
    { commodity:'Sesame (Til)',     variety:'Local',     unit:'Quintal', arrivalQty:35,  minPrice:13200,maxPrice:14600,modalPrice:14000,prevModalPrice:13900, date:today() },
    { commodity:'Cotton (Kapas)',   variety:'Shankar-6', unit:'Quintal', arrivalQty:48,  minPrice:6050, maxPrice:6480, modalPrice:6270, prevModalPrice:6240, date:today() },
    { commodity:'Wheat',            variety:'Lokwan',    unit:'Quintal', arrivalQty:65,  minPrice:2140, maxPrice:2310, modalPrice:2230, prevModalPrice:2210, date:today() },
    { commodity:'Onion',            variety:'Local',     unit:'Quintal', arrivalQty:180, minPrice:1100, maxPrice:1750, modalPrice:1420, prevModalPrice:1280, date:today() },
    { commodity:'Bajra',            variety:'GHB-558',   unit:'Quintal', arrivalQty:58,  minPrice:2030, maxPrice:2250, modalPrice:2150, prevModalPrice:2140, date:today() },
    { commodity:'Banana',           variety:'Basrai',    unit:'Quintal', arrivalQty:350, minPrice:750,  maxPrice:1150, modalPrice:980,  prevModalPrice:950,  date:today() },
  ],
  una: [
    { commodity:'Groundnut (Bold)', variety:'TG-37A',    unit:'Quintal', arrivalQty:310, minPrice:5820, maxPrice:6310, modalPrice:6090, prevModalPrice:6020, date:today() },
    { commodity:'Groundnut (Ref.)', variety:'TG-37A',    unit:'Quintal', arrivalQty:180, minPrice:5520, maxPrice:5920, modalPrice:5700, prevModalPrice:5660, date:today() },
    { commodity:'Castor Seed',      variety:'GCH-4',     unit:'Quintal', arrivalQty:95,  minPrice:5610, maxPrice:5920, modalPrice:5770, prevModalPrice:5810, date:today() },
    { commodity:'Banana',           variety:'Basrai',    unit:'Quintal', arrivalQty:620, minPrice:780,  maxPrice:1180, modalPrice:1020, prevModalPrice:990,  date:today() },
    { commodity:'Sapota (Chikoo)',  variety:'Kalipatti', unit:'Quintal', arrivalQty:140, minPrice:1750, maxPrice:2550, modalPrice:2180, prevModalPrice:2120, date:today() },
    { commodity:'Cotton (Kapas)',   variety:'Shankar-6', unit:'Quintal', arrivalQty:55,  minPrice:6080, maxPrice:6500, modalPrice:6290, prevModalPrice:6260, date:today() },
    { commodity:'Wheat',            variety:'Lokwan',    unit:'Quintal', arrivalQty:70,  minPrice:2160, maxPrice:2320, modalPrice:2250, prevModalPrice:2230, date:today() },
    { commodity:'Sesame (Til)',     variety:'Local',     unit:'Quintal', arrivalQty:22,  minPrice:13400,maxPrice:14700,modalPrice:14100,prevModalPrice:13980, date:today() },
  ],
  talala: [
    { commodity:'Kesar Mango',      variety:'Kesar',     unit:'Quintal', arrivalQty:280, minPrice:8000, maxPrice:15000,modalPrice:11500,prevModalPrice:10800, date:today() },
    { commodity:'Sapota (Chikoo)',  variety:'Kalipatti', unit:'Quintal', arrivalQty:320, minPrice:1600, maxPrice:2800, modalPrice:2350, prevModalPrice:2280, date:today() },
    { commodity:'Groundnut (Bold)', variety:'TG-37A',    unit:'Quintal', arrivalQty:160, minPrice:5780, maxPrice:6250, modalPrice:6020, prevModalPrice:5980, date:today() },
    { commodity:'Castor Seed',      variety:'GCH-4',     unit:'Quintal', arrivalQty:80,  minPrice:5590, maxPrice:5880, modalPrice:5750, prevModalPrice:5790, date:today() },
    { commodity:'Banana',           variety:'Basrai',    unit:'Quintal', arrivalQty:480, minPrice:800,  maxPrice:1200, modalPrice:1040, prevModalPrice:1010, date:today() },
    { commodity:'Cotton (Kapas)',   variety:'Shankar-6', unit:'Quintal', arrivalQty:38,  minPrice:6090, maxPrice:6480, modalPrice:6280, prevModalPrice:6250, date:today() },
    { commodity:'Wheat',            variety:'Lokwan',    unit:'Quintal', arrivalQty:50,  minPrice:2140, maxPrice:2300, modalPrice:2220, prevModalPrice:2200, date:today() },
  ],
  junagadh: [
    { commodity:'Groundnut (Bold)', variety:'TG-37A',    unit:'Quintal', arrivalQty:920, minPrice:5750, maxPrice:6400, modalPrice:6180, prevModalPrice:6100, date:today() },
    { commodity:'Groundnut (Ref.)', variety:'TG-37A',    unit:'Quintal', arrivalQty:480, minPrice:5480, maxPrice:5980, modalPrice:5760, prevModalPrice:5720, date:today() },
    { commodity:'Castor Seed',      variety:'GCH-4',     unit:'Quintal', arrivalQty:380, minPrice:5620, maxPrice:5980, modalPrice:5810, prevModalPrice:5850, date:today() },
    { commodity:'Wheat',            variety:'Lokwan',    unit:'Quintal', arrivalQty:240, minPrice:2180, maxPrice:2360, modalPrice:2280, prevModalPrice:2250, date:today() },
    { commodity:'Cotton (Kapas)',   variety:'Shankar-6', unit:'Quintal', arrivalQty:165, minPrice:6120, maxPrice:6600, modalPrice:6380, prevModalPrice:6340, date:today() },
    { commodity:'Maize',            variety:'Hybrid',    unit:'Quintal', arrivalQty:210, minPrice:1850, maxPrice:2080, modalPrice:1980, prevModalPrice:1970, date:today() },
    { commodity:'Bajra',            variety:'GHB-558',   unit:'Quintal', arrivalQty:180, minPrice:2060, maxPrice:2300, modalPrice:2200, prevModalPrice:2180, date:today() },
    { commodity:'Banana',           variety:'Basrai',    unit:'Quintal', arrivalQty:850, minPrice:820,  maxPrice:1250, modalPrice:1080, prevModalPrice:1050, date:today() },
    { commodity:'Sesame (Til)',     variety:'Local',     unit:'Quintal', arrivalQty:75,  minPrice:13400,maxPrice:15000,modalPrice:14300,prevModalPrice:14150, date:today() },
    { commodity:'Kesar Mango',      variety:'Kesar',     unit:'Quintal', arrivalQty:190, minPrice:7500, maxPrice:14000,modalPrice:10800,prevModalPrice:10200, date:today() },
    { commodity:'Onion',            variety:'Local',     unit:'Quintal', arrivalQty:290, minPrice:1150, maxPrice:1850, modalPrice:1520, prevModalPrice:1380, date:today() },
    { commodity:'Garlic',           variety:'Local',     unit:'Quintal', arrivalQty:95,  minPrice:4400, maxPrice:6000, modalPrice:5300, prevModalPrice:5150, date:today() },
  ],
  amreli: [
    { commodity:'Groundnut (Bold)', variety:'SG-99',     unit:'Quintal', arrivalQty:680, minPrice:5820, maxPrice:6380, modalPrice:6150, prevModalPrice:6080, date:today() },
    { commodity:'Groundnut (Ref.)', variety:'SG-99',     unit:'Quintal', arrivalQty:340, minPrice:5520, maxPrice:5960, modalPrice:5740, prevModalPrice:5700, date:today() },
    { commodity:'Castor Seed',      variety:'GCH-4',     unit:'Quintal', arrivalQty:250, minPrice:5640, maxPrice:5980, modalPrice:5820, prevModalPrice:5860, date:today() },
    { commodity:'Cotton (Kapas)',   variety:'Hybrid',    unit:'Quintal', arrivalQty:140, minPrice:6150, maxPrice:6620, modalPrice:6400, prevModalPrice:6360, date:today() },
    { commodity:'Soybean',         variety:'JS-335',    unit:'Quintal', arrivalQty:195, minPrice:4100, maxPrice:4580, modalPrice:4320, prevModalPrice:4280, date:today() },
    { commodity:'Wheat',            variety:'Lokwan',    unit:'Quintal', arrivalQty:115, minPrice:2170, maxPrice:2340, modalPrice:2260, prevModalPrice:2240, date:today() },
    { commodity:'Bajra',            variety:'GHB-558',   unit:'Quintal', arrivalQty:130, minPrice:2040, maxPrice:2270, modalPrice:2170, prevModalPrice:2160, date:today() },
    { commodity:'Sesame (Til)',     variety:'Local',     unit:'Quintal', arrivalQty:42,  minPrice:13300,maxPrice:14800,modalPrice:14050,prevModalPrice:13900, date:today() },
    { commodity:'Onion',            variety:'Local',     unit:'Quintal', arrivalQty:160, minPrice:1180, maxPrice:1820, modalPrice:1500, prevModalPrice:1370, date:today() },
  ],
  rajkot: [
    { commodity:'Groundnut (Bold)', variety:'Bold',      unit:'Quintal', arrivalQty:1850,minPrice:5900, maxPrice:6500, modalPrice:6250, prevModalPrice:6180, date:today() },
    { commodity:'Groundnut (Ref.)', variety:'Bold',      unit:'Quintal', arrivalQty:920, minPrice:5600, maxPrice:6050, modalPrice:5820, prevModalPrice:5780, date:today() },
    { commodity:'Cotton (Kapas)',   variety:'Shankar-6', unit:'Quintal', arrivalQty:480, minPrice:6200, maxPrice:6700, modalPrice:6480, prevModalPrice:6440, date:today() },
    { commodity:'Castor Seed',      variety:'GCH-4',     unit:'Quintal', arrivalQty:520, minPrice:5680, maxPrice:6020, modalPrice:5860, prevModalPrice:5900, date:today() },
    { commodity:'Wheat',            variety:'Lokwan',    unit:'Quintal', arrivalQty:380, minPrice:2200, maxPrice:2390, modalPrice:2310, prevModalPrice:2280, date:today() },
    { commodity:'Maize',            variety:'Hybrid',    unit:'Quintal', arrivalQty:285, minPrice:1860, maxPrice:2100, modalPrice:1990, prevModalPrice:1980, date:today() },
    { commodity:'Soybean',         variety:'JS-9560',   unit:'Quintal', arrivalQty:240, minPrice:4150, maxPrice:4620, modalPrice:4380, prevModalPrice:4340, date:today() },
    { commodity:'Cumin (Jeera)',    variety:'Local',     unit:'Quintal', arrivalQty:85,  minPrice:24000,maxPrice:28000,modalPrice:26000,prevModalPrice:25500, date:today() },
    { commodity:'Sesame (Til)',     variety:'Local',     unit:'Quintal', arrivalQty:95,  minPrice:13600,maxPrice:15200,modalPrice:14500,prevModalPrice:14300, date:today() },
    { commodity:'Onion',            variety:'Local',     unit:'Quintal', arrivalQty:420, minPrice:1200, maxPrice:1900, modalPrice:1580, prevModalPrice:1450, date:today() },
    { commodity:'Garlic',           variety:'Local',     unit:'Quintal', arrivalQty:145, minPrice:4500, maxPrice:6200, modalPrice:5500, prevModalPrice:5350, date:today() },
    { commodity:'Bajra',            variety:'GHB-558',   unit:'Quintal', arrivalQty:320, minPrice:2070, maxPrice:2310, modalPrice:2220, prevModalPrice:2200, date:today() },
  ],
  jamnagar: [
    { commodity:'Groundnut (Bold)', variety:'TG-37A',    unit:'Quintal', arrivalQty:520, minPrice:5850, maxPrice:6350, modalPrice:6120, prevModalPrice:6060, date:today() },
    { commodity:'Castor Seed',      variety:'GCH-4',     unit:'Quintal', arrivalQty:180, minPrice:5620, maxPrice:5950, modalPrice:5800, prevModalPrice:5840, date:today() },
    { commodity:'Sesame (Til)',     variety:'Local',     unit:'Quintal', arrivalQty:55,  minPrice:13500,maxPrice:15000,modalPrice:14350,prevModalPrice:14200, date:today() },
    { commodity:'Cotton (Kapas)',   variety:'Shankar-6', unit:'Quintal', arrivalQty:210, minPrice:6180, maxPrice:6650, modalPrice:6440, prevModalPrice:6400, date:today() },
    { commodity:'Cumin (Jeera)',    variety:'Local',     unit:'Quintal', arrivalQty:65,  minPrice:23500,maxPrice:27500,modalPrice:25500,prevModalPrice:25000, date:today() },
    { commodity:'Wheat',            variety:'Lokwan',    unit:'Quintal', arrivalQty:130, minPrice:2190, maxPrice:2360, modalPrice:2280, prevModalPrice:2260, date:today() },
    { commodity:'Bajra',            variety:'GHB-558',   unit:'Quintal', arrivalQty:165, minPrice:2050, maxPrice:2290, modalPrice:2190, prevModalPrice:2180, date:today() },
    { commodity:'Onion',            variety:'Local',     unit:'Quintal', arrivalQty:240, minPrice:1150, maxPrice:1800, modalPrice:1460, prevModalPrice:1320, date:today() },
  ],
}

// ── 7-day price history per yard per commodity ────────────
export const YARD_PRICE_HISTORY = {
  'kodinar': {
    'Groundnut (Bold)': [5920, 5980, 6010, 6050, 6080, 6050, 6120],
    'Castor Seed':      [5850, 5820, 5800, 5820, 5830, 5820, 5780],
    'Cotton (Kapas)':   [6180, 6220, 6250, 6260, 6280, 6300, 6320],
    'Wheat':            [2200, 2210, 2220, 2225, 2230, 2245, 2260],
    'Sesame (Til)':     [13800,13900,14000,14050,14100,14150,14200],
    'Onion':            [1100, 1150, 1200, 1280, 1350, 1420, 1480],
    'Banana':           [980, 1000, 1020, 1020, 1030, 1040, 1050],
  },
  'veraval': {
    'Groundnut (Bold)': [5880, 5930, 5970, 5990, 5990, 5990, 6050],
    'Castor Seed':      [5830, 5810, 5790, 5800, 5810, 5800, 5760],
    'Cotton (Kapas)':   [6150, 6190, 6210, 6230, 6240, 6250, 6270],
    'Wheat':            [2180, 2190, 2200, 2205, 2210, 2220, 2230],
    'Onion':            [1050, 1100, 1150, 1200, 1280, 1350, 1420],
    'Banana':           [910, 930, 945, 950, 950, 960, 980],
  },
  'junagadh': {
    'Groundnut (Bold)': [5980, 6020, 6060, 6080, 6100, 6120, 6180],
    'Castor Seed':      [5870, 5840, 5820, 5840, 5850, 5850, 5810],
    'Cotton (Kapas)':   [6220, 6270, 6300, 6320, 6340, 6360, 6380],
    'Wheat':            [2210, 2220, 2235, 2240, 2250, 2260, 2280],
    'Sesame (Til)':     [13900,14000,14100,14150,14200,14250,14300],
    'Maize':            [1930, 1940, 1950, 1960, 1970, 1970, 1980],
    'Onion':            [1150, 1200, 1280, 1320, 1380, 1440, 1520],
    'Banana':           [1010, 1020, 1040, 1050, 1050, 1060, 1080],
  },
  'rajkot': {
    'Groundnut (Bold)': [6050, 6090, 6130, 6150, 6170, 6180, 6250],
    'Castor Seed':      [5900, 5870, 5850, 5870, 5880, 5900, 5860],
    'Cotton (Kapas)':   [6300, 6350, 6390, 6410, 6430, 6440, 6480],
    'Wheat':            [2230, 2245, 2255, 2260, 2270, 2280, 2310],
    'Cumin (Jeera)':    [24500,24800,25000,25200,25400,25500,26000],
    'Sesame (Til)':     [14000,14100,14200,14250,14300,14350,14500],
    'Onion':            [1200, 1280, 1350, 1400, 1450, 1500, 1580],
  },
}

// ── Nearest yard logic: location → sorted yard list ───────
//  Uses Haversine distance formula
function haversineKm(lat1, lon1, lat2, lon2) {
  const R  = 6371
  const dL = (lat2 - lat1) * Math.PI / 180
  const dl = (lon2 - lon1) * Math.PI / 180
  const a  = Math.sin(dL/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dl/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

// ── Known village/taluka coordinates (Gir Somnath focus) ──
const LOCATION_COORDS = {
  // Talukas
  'kodinar':   { lat: 20.7967, lon: 70.7017 },
  'una':       { lat: 20.8280, lon: 71.0380 },
  'veraval':   { lat: 20.9063, lon: 70.3678 },
  'talala':    { lat: 21.0342, lon: 70.4623 },
  'junagadh':  { lat: 21.5222, lon: 70.4579 },
  'sutrapada': { lat: 20.8850, lon: 70.5580 },
  'dhari':     { lat: 21.3240, lon: 71.0200 },
  'amreli':    { lat: 21.6024, lon: 71.2211 },
  'rajkot':    { lat: 22.3039, lon: 70.8022 },
  'jamnagar':  { lat: 22.4707, lon: 70.0577 },
  // Districts
  'gir somnath': { lat: 20.9063, lon: 70.3678 },
  // Common villages near Kodinar
  'simar':     { lat: 20.8100, lon: 70.6500 },
  'gavadka':   { lat: 20.7500, lon: 70.7300 },
  'kagvad':    { lat: 20.8400, lon: 70.6800 },
  'bherai':    { lat: 20.7700, lon: 70.7500 },
  'mota bhandariya': { lat: 20.7800, lon: 70.6900 },
  'nani khedoi': { lat: 20.7600, lon: 70.7100 },
}

export function getNearestYards({ state, district, taluka, village } = {}) {
  // Find coordinates for the given location
  let refLat, refLon, matchedLocation

  const lookup = (name) => name ? LOCATION_COORDS[name.toLowerCase().trim()] : null

  const coords = lookup(village) || lookup(taluka) || lookup(district)
  if (coords) {
    refLat = coords.lat
    refLon = coords.lon
    matchedLocation = village || taluka || district
  } else {
    // Default to Kodinar if no match
    refLat = 20.7967
    refLon = 70.7017
    matchedLocation = 'Kodinar'
  }

  // Filter yards by state if provided
  let yards = [...YARDS]
  if (state && state !== 'All') {
    yards = yards.filter(y => y.state.toLowerCase() === state.toLowerCase())
  }

  // Calculate distance and sort
  return yards
    .map(yard => ({
      ...yard,
      distanceKm: Math.round(haversineKm(refLat, refLon, yard.lat, yard.lon) * 10) / 10,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .map((yard, i) => ({ ...yard, rank: i + 1 }))
}

// ── Enrich price records ──────────────────────────────────
export const MSP_2025 = {
  'Wheat': 2275, 'Rice': 2300, 'Maize': 2090, 'Bajra': 2625,
  'Soybean': 4892, 'Groundnut (Bold)': 6783, 'Groundnut (Ref.)': 6783,
  'Mustard': 5950, 'Cotton (Kapas)': 7121, 'Sesame (Til)': 9267,
  'Castor Seed': 6481,
}

export function enrichPrices(records) {
  return records.map(r => {
    const prev   = r.prevModalPrice || r.modalPrice * 0.985
    const change = r.modalPrice - prev
    const msp    = MSP_2025[r.commodity] || null
    return {
      ...r,
      priceChange:    Math.round(change),
      priceChangePct: parseFloat(((change / prev) * 100).toFixed(2)),
      priceUp:        change >= 0,
      msp,
      aboveMSP:       msp ? r.modalPrice >= msp : null,
      mspDiff:        msp ? r.modalPrice - msp : null,
    }
  })
}

// ── Compare two yards for a commodity ────────────────────
export function compareYards(yard1Id, yard2Id, commodity) {
  const y1Prices = YARD_PRICES[yard1Id] || []
  const y2Prices = YARD_PRICES[yard2Id] || []

  const find = (prices, comm) => {
    if (!comm || comm === 'All') return prices
    return prices.filter(p => p.commodity.toLowerCase().includes(comm.toLowerCase()))
  }

  const y1 = find(y1Prices, commodity)
  const y2 = find(y2Prices, commodity)
  const yard1 = YARDS.find(y => y.yardId === yard1Id)
  const yard2 = YARDS.find(y => y.yardId === yard2Id)

  return {
    yard1: { info: yard1, prices: enrichPrices(y1) },
    yard2: { info: yard2, prices: enrichPrices(y2) },
    commodity,
  }
}
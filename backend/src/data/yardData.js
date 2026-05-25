// src/data/yardData.js
// Client-side mirror of backend/src/utils/yardData.js
// Used for offline fallback when backend is unavailable.

export const YARDS = [
  { yardId:'kodinar',  name:'Kodinar Market Yard',      shortName:'Kodinar',  apmc:'APMC Kodinar',  state:'Gujarat', district:'Gir Somnath', taluka:'Kodinar', lat:20.7967, lon:70.7017, nearbyTalukas:['Kodinar','Una','Sutrapada','Veraval'], description:'Primary mandi for southern Gir Somnath. Major crops: Groundnut, Castor, Wheat, Cotton.', timings:'7:00 AM – 2:00 PM', workingDays:'Mon–Sat', phone:'02876-222234' },
  { yardId:'veraval',  name:'Veraval Market Yard',      shortName:'Veraval',  apmc:'APMC Veraval',  state:'Gujarat', district:'Gir Somnath', taluka:'Veraval', lat:20.9063, lon:70.3678, nearbyTalukas:['Veraval','Sutrapada','Kodinar'], description:'Coastal hub. Groundnut, Sesame, Cotton.', timings:'7:00 AM – 2:00 PM', workingDays:'Mon–Sat', phone:'02876-243567' },
  { yardId:'una',      name:'Una Market Yard',          shortName:'Una',      apmc:'APMC Una',      state:'Gujarat', district:'Gir Somnath', taluka:'Una', lat:20.8280, lon:71.0380, nearbyTalukas:['Una','Kodinar','Dhari','Diu'], description:'Eastern Gir Somnath. Strong in Groundnut, Banana, Castor.', timings:'7:00 AM – 2:00 PM', workingDays:'Mon–Sat', phone:'02876-221122' },
  { yardId:'talala',   name:'Talala (Gir) Market Yard', shortName:'Talala',   apmc:'APMC Talala',   state:'Gujarat', district:'Gir Somnath', taluka:'Talala', lat:21.0342, lon:70.4623, nearbyTalukas:['Talala','Visavadar','Sutrapada'], description:'Gir forest region. Kesar Mango, Chikoo, Groundnut.', timings:'7:30 AM – 1:30 PM', workingDays:'Mon–Sat', phone:'02876-224500' },
  { yardId:'junagadh', name:'Junagadh Market Yard',     shortName:'Junagadh', apmc:'APMC Junagadh', state:'Gujarat', district:'Junagadh', taluka:'Junagadh', lat:21.5222, lon:70.4579, nearbyTalukas:['Junagadh','Vanthali','Bhesan','Keshod'], description:'Major regional hub. Groundnut, Wheat, Maize, Cotton, Banana.', timings:'6:00 AM – 3:00 PM', workingDays:'Mon–Sat', phone:'0285-2623456' },
  { yardId:'amreli',   name:'Amreli Market Yard',       shortName:'Amreli',   apmc:'APMC Amreli',   state:'Gujarat', district:'Amreli', taluka:'Amreli', lat:21.6024, lon:71.2211, nearbyTalukas:['Amreli','Dhari','Rajula','Babra'], description:'Amreli district hub. Groundnut, Soybean, Cotton, Castor.', timings:'7:00 AM – 2:00 PM', workingDays:'Mon–Sat', phone:'02792-223301' },
  { yardId:'rajkot',   name:'Rajkot Market Yard',       shortName:'Rajkot',   apmc:'APMC Rajkot',   state:'Gujarat', district:'Rajkot', taluka:'Rajkot', lat:22.3039, lon:70.8022, nearbyTalukas:['Rajkot','Gondal','Paddhari','Jasdan'], description:'Largest Saurashtra hub. Cotton, Groundnut, Cumin. High volumes.', timings:'6:00 AM – 4:00 PM', workingDays:'Mon–Sat', phone:'0281-2463344' },
  { yardId:'jamnagar', name:'Jamnagar Market Yard',     shortName:'Jamnagar', apmc:'APMC Jamnagar', state:'Gujarat', district:'Jamnagar', taluka:'Jamnagar', lat:22.4707, lon:70.0577, nearbyTalukas:['Jamnagar','Jodiya','Dhrol','Lalpur'], description:'Jamnagar district. Groundnut, Sesame, Cotton, Cumin.', timings:'7:00 AM – 2:30 PM', workingDays:'Mon–Sat', phone:'0288-2551122' },
]

const T = new Date().toISOString().split('T')[0]

export const YARD_PRICES = {
  kodinar: [
    { commodity:'Groundnut (Bold)', variety:'TG-37A',    unit:'Quintal', arrivalQty:380, minPrice:5800, maxPrice:6350, modalPrice:6120, prevModalPrice:6050, date:T },
    { commodity:'Groundnut (Ref.)', variety:'TG-37A',    unit:'Quintal', arrivalQty:210, minPrice:5500, maxPrice:5950, modalPrice:5720, prevModalPrice:5680, date:T },
    { commodity:'Castor Seed',      variety:'GCH-4',     unit:'Quintal', arrivalQty:145, minPrice:5600, maxPrice:5950, modalPrice:5780, prevModalPrice:5820, date:T },
    { commodity:'Wheat',            variety:'Lokwan',    unit:'Quintal', arrivalQty:95,  minPrice:2150, maxPrice:2340, modalPrice:2260, prevModalPrice:2230, date:T },
    { commodity:'Cotton (Kapas)',   variety:'Shankar-6', unit:'Quintal', arrivalQty:62,  minPrice:6100, maxPrice:6550, modalPrice:6320, prevModalPrice:6280, date:T },
    { commodity:'Sesame (Til)',     variety:'Local',     unit:'Quintal', arrivalQty:28,  minPrice:13500,maxPrice:14800,modalPrice:14200,prevModalPrice:14050,date:T },
    { commodity:'Bajra',            variety:'GHB-558',   unit:'Quintal', arrivalQty:74,  minPrice:2050, maxPrice:2280, modalPrice:2180, prevModalPrice:2160, date:T },
    { commodity:'Maize',            variety:'Hybrid',    unit:'Quintal', arrivalQty:55,  minPrice:1820, maxPrice:2050, modalPrice:1940, prevModalPrice:1960, date:T },
    { commodity:'Onion',            variety:'Local',     unit:'Quintal', arrivalQty:110, minPrice:1200, maxPrice:1800, modalPrice:1480, prevModalPrice:1350, date:T },
    { commodity:'Garlic',           variety:'Local',     unit:'Quintal', arrivalQty:32,  minPrice:4200, maxPrice:5800, modalPrice:5100, prevModalPrice:4950, date:T },
    { commodity:'Banana',           variety:'Basrai',    unit:'Quintal', arrivalQty:420, minPrice:800,  maxPrice:1200, modalPrice:1050, prevModalPrice:1020, date:T },
    { commodity:'Sapota (Chikoo)',  variety:'Kalipatti', unit:'Quintal', arrivalQty:85,  minPrice:1800, maxPrice:2600, modalPrice:2200, prevModalPrice:2150, date:T },
  ],
  veraval: [
    { commodity:'Groundnut (Bold)', variety:'TG-37A',    unit:'Quintal', arrivalQty:290, minPrice:5750, maxPrice:6280, modalPrice:6050, prevModalPrice:5990, date:T },
    { commodity:'Castor Seed',      variety:'GCH-4',     unit:'Quintal', arrivalQty:120, minPrice:5580, maxPrice:5900, modalPrice:5760, prevModalPrice:5800, date:T },
    { commodity:'Sesame (Til)',     variety:'Local',     unit:'Quintal', arrivalQty:35,  minPrice:13200,maxPrice:14600,modalPrice:14000,prevModalPrice:13900,date:T },
    { commodity:'Cotton (Kapas)',   variety:'Shankar-6', unit:'Quintal', arrivalQty:48,  minPrice:6050, maxPrice:6480, modalPrice:6270, prevModalPrice:6240, date:T },
    { commodity:'Wheat',            variety:'Lokwan',    unit:'Quintal', arrivalQty:65,  minPrice:2140, maxPrice:2310, modalPrice:2230, prevModalPrice:2210, date:T },
    { commodity:'Onion',            variety:'Local',     unit:'Quintal', arrivalQty:180, minPrice:1100, maxPrice:1750, modalPrice:1420, prevModalPrice:1280, date:T },
    { commodity:'Bajra',            variety:'GHB-558',   unit:'Quintal', arrivalQty:58,  minPrice:2030, maxPrice:2250, modalPrice:2150, prevModalPrice:2140, date:T },
    { commodity:'Banana',           variety:'Basrai',    unit:'Quintal', arrivalQty:350, minPrice:750,  maxPrice:1150, modalPrice:980,  prevModalPrice:950,  date:T },
  ],
  una: [
    { commodity:'Groundnut (Bold)', variety:'TG-37A',    unit:'Quintal', arrivalQty:310, minPrice:5820, maxPrice:6310, modalPrice:6090, prevModalPrice:6020, date:T },
    { commodity:'Groundnut (Ref.)', variety:'TG-37A',    unit:'Quintal', arrivalQty:180, minPrice:5520, maxPrice:5920, modalPrice:5700, prevModalPrice:5660, date:T },
    { commodity:'Castor Seed',      variety:'GCH-4',     unit:'Quintal', arrivalQty:95,  minPrice:5610, maxPrice:5920, modalPrice:5770, prevModalPrice:5810, date:T },
    { commodity:'Banana',           variety:'Basrai',    unit:'Quintal', arrivalQty:620, minPrice:780,  maxPrice:1180, modalPrice:1020, prevModalPrice:990,  date:T },
    { commodity:'Sapota (Chikoo)',  variety:'Kalipatti', unit:'Quintal', arrivalQty:140, minPrice:1750, maxPrice:2550, modalPrice:2180, prevModalPrice:2120, date:T },
    { commodity:'Cotton (Kapas)',   variety:'Shankar-6', unit:'Quintal', arrivalQty:55,  minPrice:6080, maxPrice:6500, modalPrice:6290, prevModalPrice:6260, date:T },
    { commodity:'Wheat',            variety:'Lokwan',    unit:'Quintal', arrivalQty:70,  minPrice:2160, maxPrice:2320, modalPrice:2250, prevModalPrice:2230, date:T },
    { commodity:'Sesame (Til)',     variety:'Local',     unit:'Quintal', arrivalQty:22,  minPrice:13400,maxPrice:14700,modalPrice:14100,prevModalPrice:13980,date:T },
  ],
  talala: [
    { commodity:'Kesar Mango',      variety:'Kesar',     unit:'Quintal', arrivalQty:280, minPrice:8000, maxPrice:15000,modalPrice:11500,prevModalPrice:10800,date:T },
    { commodity:'Sapota (Chikoo)',  variety:'Kalipatti', unit:'Quintal', arrivalQty:320, minPrice:1600, maxPrice:2800, modalPrice:2350, prevModalPrice:2280, date:T },
    { commodity:'Groundnut (Bold)', variety:'TG-37A',    unit:'Quintal', arrivalQty:160, minPrice:5780, maxPrice:6250, modalPrice:6020, prevModalPrice:5980, date:T },
    { commodity:'Castor Seed',      variety:'GCH-4',     unit:'Quintal', arrivalQty:80,  minPrice:5590, maxPrice:5880, modalPrice:5750, prevModalPrice:5790, date:T },
    { commodity:'Banana',           variety:'Basrai',    unit:'Quintal', arrivalQty:480, minPrice:800,  maxPrice:1200, modalPrice:1040, prevModalPrice:1010, date:T },
    { commodity:'Cotton (Kapas)',   variety:'Shankar-6', unit:'Quintal', arrivalQty:38,  minPrice:6090, maxPrice:6480, modalPrice:6280, prevModalPrice:6250, date:T },
    { commodity:'Wheat',            variety:'Lokwan',    unit:'Quintal', arrivalQty:50,  minPrice:2140, maxPrice:2300, modalPrice:2220, prevModalPrice:2200, date:T },
  ],
  junagadh: [
    { commodity:'Groundnut (Bold)', variety:'TG-37A',    unit:'Quintal', arrivalQty:920, minPrice:5750, maxPrice:6400, modalPrice:6180, prevModalPrice:6100, date:T },
    { commodity:'Groundnut (Ref.)', variety:'TG-37A',    unit:'Quintal', arrivalQty:480, minPrice:5480, maxPrice:5980, modalPrice:5760, prevModalPrice:5720, date:T },
    { commodity:'Castor Seed',      variety:'GCH-4',     unit:'Quintal', arrivalQty:380, minPrice:5620, maxPrice:5980, modalPrice:5810, prevModalPrice:5850, date:T },
    { commodity:'Wheat',            variety:'Lokwan',    unit:'Quintal', arrivalQty:240, minPrice:2180, maxPrice:2360, modalPrice:2280, prevModalPrice:2250, date:T },
    { commodity:'Cotton (Kapas)',   variety:'Shankar-6', unit:'Quintal', arrivalQty:165, minPrice:6120, maxPrice:6600, modalPrice:6380, prevModalPrice:6340, date:T },
    { commodity:'Maize',            variety:'Hybrid',    unit:'Quintal', arrivalQty:210, minPrice:1850, maxPrice:2080, modalPrice:1980, prevModalPrice:1970, date:T },
    { commodity:'Bajra',            variety:'GHB-558',   unit:'Quintal', arrivalQty:180, minPrice:2060, maxPrice:2300, modalPrice:2200, prevModalPrice:2180, date:T },
    { commodity:'Banana',           variety:'Basrai',    unit:'Quintal', arrivalQty:850, minPrice:820,  maxPrice:1250, modalPrice:1080, prevModalPrice:1050, date:T },
    { commodity:'Sesame (Til)',     variety:'Local',     unit:'Quintal', arrivalQty:75,  minPrice:13400,maxPrice:15000,modalPrice:14300,prevModalPrice:14150,date:T },
    { commodity:'Kesar Mango',      variety:'Kesar',     unit:'Quintal', arrivalQty:190, minPrice:7500, maxPrice:14000,modalPrice:10800,prevModalPrice:10200,date:T },
    { commodity:'Onion',            variety:'Local',     unit:'Quintal', arrivalQty:290, minPrice:1150, maxPrice:1850, modalPrice:1520, prevModalPrice:1380, date:T },
    { commodity:'Garlic',           variety:'Local',     unit:'Quintal', arrivalQty:95,  minPrice:4400, maxPrice:6000, modalPrice:5300, prevModalPrice:5150, date:T },
  ],
  amreli: [
    { commodity:'Groundnut (Bold)', variety:'SG-99',     unit:'Quintal', arrivalQty:680, minPrice:5820, maxPrice:6380, modalPrice:6150, prevModalPrice:6080, date:T },
    { commodity:'Groundnut (Ref.)', variety:'SG-99',     unit:'Quintal', arrivalQty:340, minPrice:5520, maxPrice:5960, modalPrice:5740, prevModalPrice:5700, date:T },
    { commodity:'Castor Seed',      variety:'GCH-4',     unit:'Quintal', arrivalQty:250, minPrice:5640, maxPrice:5980, modalPrice:5820, prevModalPrice:5860, date:T },
    { commodity:'Cotton (Kapas)',   variety:'Hybrid',    unit:'Quintal', arrivalQty:140, minPrice:6150, maxPrice:6620, modalPrice:6400, prevModalPrice:6360, date:T },
    { commodity:'Soybean',         variety:'JS-335',    unit:'Quintal', arrivalQty:195, minPrice:4100, maxPrice:4580, modalPrice:4320, prevModalPrice:4280, date:T },
    { commodity:'Wheat',            variety:'Lokwan',    unit:'Quintal', arrivalQty:115, minPrice:2170, maxPrice:2340, modalPrice:2260, prevModalPrice:2240, date:T },
    { commodity:'Bajra',            variety:'GHB-558',   unit:'Quintal', arrivalQty:130, minPrice:2040, maxPrice:2270, modalPrice:2170, prevModalPrice:2160, date:T },
    { commodity:'Sesame (Til)',     variety:'Local',     unit:'Quintal', arrivalQty:42,  minPrice:13300,maxPrice:14800,modalPrice:14050,prevModalPrice:13900,date:T },
    { commodity:'Onion',            variety:'Local',     unit:'Quintal', arrivalQty:160, minPrice:1180, maxPrice:1820, modalPrice:1500, prevModalPrice:1370, date:T },
  ],
  rajkot: [
    { commodity:'Groundnut (Bold)', variety:'Bold',      unit:'Quintal', arrivalQty:1850,minPrice:5900, maxPrice:6500, modalPrice:6250, prevModalPrice:6180, date:T },
    { commodity:'Groundnut (Ref.)', variety:'Bold',      unit:'Quintal', arrivalQty:920, minPrice:5600, maxPrice:6050, modalPrice:5820, prevModalPrice:5780, date:T },
    { commodity:'Cotton (Kapas)',   variety:'Shankar-6', unit:'Quintal', arrivalQty:480, minPrice:6200, maxPrice:6700, modalPrice:6480, prevModalPrice:6440, date:T },
    { commodity:'Castor Seed',      variety:'GCH-4',     unit:'Quintal', arrivalQty:520, minPrice:5680, maxPrice:6020, modalPrice:5860, prevModalPrice:5900, date:T },
    { commodity:'Wheat',            variety:'Lokwan',    unit:'Quintal', arrivalQty:380, minPrice:2200, maxPrice:2390, modalPrice:2310, prevModalPrice:2280, date:T },
    { commodity:'Maize',            variety:'Hybrid',    unit:'Quintal', arrivalQty:285, minPrice:1860, maxPrice:2100, modalPrice:1990, prevModalPrice:1980, date:T },
    { commodity:'Soybean',         variety:'JS-9560',   unit:'Quintal', arrivalQty:240, minPrice:4150, maxPrice:4620, modalPrice:4380, prevModalPrice:4340, date:T },
    { commodity:'Cumin (Jeera)',    variety:'Local',     unit:'Quintal', arrivalQty:85,  minPrice:24000,maxPrice:28000,modalPrice:26000,prevModalPrice:25500,date:T },
    { commodity:'Sesame (Til)',     variety:'Local',     unit:'Quintal', arrivalQty:95,  minPrice:13600,maxPrice:15200,modalPrice:14500,prevModalPrice:14300,date:T },
    { commodity:'Onion',            variety:'Local',     unit:'Quintal', arrivalQty:420, minPrice:1200, maxPrice:1900, modalPrice:1580, prevModalPrice:1450, date:T },
    { commodity:'Garlic',           variety:'Local',     unit:'Quintal', arrivalQty:145, minPrice:4500, maxPrice:6200, modalPrice:5500, prevModalPrice:5350, date:T },
    { commodity:'Bajra',            variety:'GHB-558',   unit:'Quintal', arrivalQty:320, minPrice:2070, maxPrice:2310, modalPrice:2220, prevModalPrice:2200, date:T },
  ],
  jamnagar: [
    { commodity:'Groundnut (Bold)', variety:'TG-37A',    unit:'Quintal', arrivalQty:520, minPrice:5850, maxPrice:6350, modalPrice:6120, prevModalPrice:6060, date:T },
    { commodity:'Castor Seed',      variety:'GCH-4',     unit:'Quintal', arrivalQty:180, minPrice:5620, maxPrice:5950, modalPrice:5800, prevModalPrice:5840, date:T },
    { commodity:'Sesame (Til)',     variety:'Local',     unit:'Quintal', arrivalQty:55,  minPrice:13500,maxPrice:15000,modalPrice:14350,prevModalPrice:14200,date:T },
    { commodity:'Cotton (Kapas)',   variety:'Shankar-6', unit:'Quintal', arrivalQty:210, minPrice:6180, maxPrice:6650, modalPrice:6440, prevModalPrice:6400, date:T },
    { commodity:'Cumin (Jeera)',    variety:'Local',     unit:'Quintal', arrivalQty:65,  minPrice:23500,maxPrice:27500,modalPrice:25500,prevModalPrice:25000,date:T },
    { commodity:'Wheat',            variety:'Lokwan',    unit:'Quintal', arrivalQty:130, minPrice:2190, maxPrice:2360, modalPrice:2280, prevModalPrice:2260, date:T },
    { commodity:'Bajra',            variety:'GHB-558',   unit:'Quintal', arrivalQty:165, minPrice:2050, maxPrice:2290, modalPrice:2190, prevModalPrice:2180, date:T },
    { commodity:'Onion',            variety:'Local',     unit:'Quintal', arrivalQty:240, minPrice:1150, maxPrice:1800, modalPrice:1460, prevModalPrice:1320, date:T },
  ],
}

export const YARD_PRICE_HISTORY = {
  'kodinar': {
    'Groundnut (Bold)': [5920,5980,6010,6050,6080,6050,6120],
    'Castor Seed':      [5850,5820,5800,5820,5830,5820,5780],
    'Cotton (Kapas)':   [6180,6220,6250,6260,6280,6300,6320],
    'Wheat':            [2200,2210,2220,2225,2230,2245,2260],
    'Sesame (Til)':     [13800,13900,14000,14050,14100,14150,14200],
    'Onion':            [1100,1150,1200,1280,1350,1420,1480],
    'Banana':           [980,1000,1020,1020,1030,1040,1050],
  },
  'veraval': {
    'Groundnut (Bold)': [5880,5930,5970,5990,5990,5990,6050],
    'Cotton (Kapas)':   [6150,6190,6210,6230,6240,6250,6270],
    'Wheat':            [2180,2190,2200,2205,2210,2220,2230],
    'Onion':            [1050,1100,1150,1200,1280,1350,1420],
  },
  'junagadh': {
    'Groundnut (Bold)': [5980,6020,6060,6080,6100,6120,6180],
    'Castor Seed':      [5870,5840,5820,5840,5850,5850,5810],
    'Cotton (Kapas)':   [6220,6270,6300,6320,6340,6360,6380],
    'Wheat':            [2210,2220,2235,2240,2250,2260,2280],
    'Sesame (Til)':     [13900,14000,14100,14150,14200,14250,14300],
    'Onion':            [1150,1200,1280,1320,1380,1440,1520],
    'Banana':           [1010,1020,1040,1050,1050,1060,1080],
  },
  'rajkot': {
    'Groundnut (Bold)': [6050,6090,6130,6150,6170,6180,6250],
    'Cotton (Kapas)':   [6300,6350,6390,6410,6430,6440,6480],
    'Wheat':            [2230,2245,2255,2260,2270,2280,2310],
    'Cumin (Jeera)':    [24500,24800,25000,25200,25400,25500,26000],
    'Sesame (Til)':     [14000,14100,14200,14250,14300,14350,14500],
    'Onion':            [1200,1280,1350,1400,1450,1500,1580],
  },
}

export const MSP_2025 = {
  'Wheat':2275,'Rice':2300,'Maize':2090,'Bajra':2625,
  'Soybean':4892,'Groundnut (Bold)':6783,'Groundnut (Ref.)':6783,
  'Mustard':5950,'Cotton (Kapas)':7121,'Sesame (Til)':9267,'Castor Seed':6481,
}

// Client-side haversine + nearest yard logic
function haversineKm(la1,lo1,la2,lo2) {
  const R=6371,dL=(la2-la1)*Math.PI/180,dl=(lo2-lo1)*Math.PI/180
  const a=Math.sin(dL/2)**2+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dl/2)**2
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
}

const LOC = {
  'kodinar':{lat:20.7967,lon:70.7017},'una':{lat:20.8280,lon:71.0380},
  'veraval':{lat:20.9063,lon:70.3678},'talala':{lat:21.0342,lon:70.4623},
  'junagadh':{lat:21.5222,lon:70.4579},'sutrapada':{lat:20.8850,lon:70.5580},
  'dhari':{lat:21.3240,lon:71.0200},'amreli':{lat:21.6024,lon:71.2211},
  'rajkot':{lat:22.3039,lon:70.8022},'jamnagar':{lat:22.4707,lon:70.0577},
  'gir somnath':{lat:20.9063,lon:70.3678},
  'simar':{lat:20.8100,lon:70.6500},'gavadka':{lat:20.7500,lon:70.7300},
  'kagvad':{lat:20.8400,lon:70.6800},'bherai':{lat:20.7700,lon:70.7500},
  'mota bhandariya':{lat:20.7800,lon:70.6900},'nani khedoi':{lat:20.7600,lon:70.7100},
}

export function getNearestYards({ state, district, taluka, village } = {}) {
  const lookup = (n) => n ? LOC[n.toLowerCase().trim()] : null
  const coords = lookup(village) || lookup(taluka) || lookup(district)
  const refLat = coords?.lat ?? 20.7967
  const refLon = coords?.lon ?? 70.7017
  let yards = [...YARDS]
  if (state && state !== 'All') yards = yards.filter(y => y.state.toLowerCase() === state.toLowerCase())
  return yards
    .map(y => ({ ...y, distanceKm: Math.round(haversineKm(refLat,refLon,y.lat,y.lon)*10)/10 }))
    .sort((a,b) => a.distanceKm - b.distanceKm)
    .map((y,i) => ({ ...y, rank: i+1 }))
}

export function enrichPrices(records) {
  return records.map(r => {
    const prev = r.prevModalPrice || r.modalPrice * 0.985
    const change = r.modalPrice - prev
    const msp = MSP_2025[r.commodity] || null
    return {
      ...r,
      priceChange:    Math.round(change),
      priceChangePct: parseFloat(((change/prev)*100).toFixed(2)),
      priceUp:        change >= 0,
      msp,
      aboveMSP:       msp ? r.modalPrice >= msp : null,
      mspDiff:        msp ? r.modalPrice - msp : null,
    }
  })
}

export function getYardPrices(yardId, crop) {
  const yard = YARDS.find(y => y.yardId === yardId)
  if (!yard) return null
  let prices = YARD_PRICES[yardId] || []
  if (crop && crop !== 'All')
    prices = prices.filter(p => p.commodity.toLowerCase().includes(crop.toLowerCase()))
  const history = YARD_PRICE_HISTORY[yardId] || {}
  return {
    yard,
    prices: enrichPrices(prices).map(p => ({ ...p, priceHistory: history[p.commodity] || null })),
    total:  prices.length,
    msps:   MSP_2025,
    date:   T,
  }
}

export function compareYardsClient(yard1Id, yard2Id, crop) {
  const y1 = getYardPrices(yard1Id, crop)
  const y2 = getYardPrices(yard2Id, crop)
  return { yard1: y1, yard2: y2, commodity: crop }
}

// All unique commodities across all yards
export const ALL_YARD_CROPS = [...new Set(
  Object.values(YARD_PRICES).flatMap(p => p.map(r => r.commodity))
)].sort()
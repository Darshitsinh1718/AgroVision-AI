export const DISEASE_DB = {
 
  // ══════════════════════════════════
  //  TOMATO
  // ══════════════════════════════════
  "Tomato___Early_blight": {
    crop: "Tomato", disease: "Early Blight",
    pathogen: "Alternaria solani (fungus)",
    severity: "moderate",
    affectedParts: ["leaves", "stem", "fruit"],
    spreadMethod: "Air, water splash, infected debris",
    description: "Early blight causes dark brown to black lesions with concentric rings (target-board pattern) on older leaves first. It weakens the plant progressively, reducing yield by 20–40% if untreated.",
    symptoms: ["Dark bull's-eye spots on lower leaves", "Yellow halo around lesions", "Lesions coalesce causing leaf drop", "Dark sunken spots on fruit near stem"],
    treatments: [
      { type: "chemical", name: "Chlorothalonil (Bravo)", dosage: "2.5 g/L water", frequency: "Every 7–10 days", notes: "Apply before infection or at first sign" },
      { type: "chemical", name: "Mancozeb 75 WP", dosage: "2.5 g/L water", frequency: "Every 7 days", notes: "Start when plants are 6 inches tall" },
      { type: "chemical", name: "Azoxystrobin (Amistar)", dosage: "1 ml/L water", frequency: "Every 14 days", notes: "Rotate with other fungicides to prevent resistance" },
    ],
    fertilizers: [
      { name: "Calcium Nitrate", purpose: "Strengthen cell walls, reduce disease entry", dosage: "5 g/L as foliar spray" },
      { name: "Potassium Sulphate (SOP)", purpose: "Boost plant immunity", dosage: "5 g/L fortnightly" },
      { name: "Boron (Borax)", purpose: "Improve cell integrity", dosage: "0.5 g/L monthly" },
    ],
    organic: [
      { name: "Copper Sulphate + Lime (Bordeaux Mixture)", dosage: "10 g + 10 g per L", notes: "Classic organic fungicide, apply weekly" },
      { name: "Neem Oil (2%)", dosage: "20 ml/L with emulsifier", notes: "Apply in evening, every 7 days" },
      { name: "Baking Soda spray", dosage: "5 g/L + few drops soap", notes: "Changes leaf surface pH, inhibits fungal growth" },
      { name: "Trichoderma viride (bio-fungicide)", dosage: "5 g/L soil drench", notes: "Weekly soil application at plant base" },
    ],
    prevention: [
      "Use certified disease-free seeds or resistant varieties (e.g. Arka Rakshak)",
      "Maintain 45–60 cm plant spacing for airflow",
      "Avoid overhead irrigation — use drip system",
      "Remove and destroy infected leaves immediately",
      "Rotate tomatoes with non-solanaceous crops (3-year rotation)",
      "Apply mulch to prevent soil splash onto leaves",
    ],
    recoveryTime: "2–4 weeks with treatment",
    yieldImpact: "20–40% reduction if untreated",
  },
 
  "Tomato___Late_blight": {
    crop: "Tomato", disease: "Late Blight",
    pathogen: "Phytophthora infestans (water mould)",
    severity: "high",
    affectedParts: ["leaves", "stem", "fruit"],
    spreadMethod: "Wind-dispersed spores, water splash",
    description: "Late blight is one of the most devastating tomato diseases. Water-soaked grey-green lesions appear on leaves and quickly turn brown-black. White fuzzy mould appears on leaf undersides in humid conditions. Can destroy an entire crop in 1–2 weeks.",
    symptoms: ["Irregular water-soaked spots on leaves", "White mould on leaf undersides", "Brown-black stem lesions", "Rotting brown fruit with firm flesh"],
    treatments: [
      { type: "chemical", name: "Metalaxyl + Mancozeb (Ridomil Gold)", dosage: "2.5 g/L", frequency: "Every 5–7 days", notes: "URGENT — apply immediately at first sign" },
      { type: "chemical", name: "Cymoxanil + Mancozeb (Curzate M)", dosage: "2 g/L", frequency: "Every 7 days", notes: "Systemic + contact action" },
      { type: "chemical", name: "Dimethomorph (Acrobat)", dosage: "1.5 g/L", frequency: "Every 7 days", notes: "Excellent for wet conditions" },
    ],
    fertilizers: [
      { name: "Calcium Nitrate", purpose: "Boost cell wall strength", dosage: "5 g/L foliar" },
      { name: "Potassium Phosphite", purpose: "Elicit plant immune response", dosage: "3 ml/L" },
    ],
    organic: [
      { name: "Copper Hydroxide (Kocide)", dosage: "3 g/L", notes: "Most effective organic option for late blight" },
      { name: "Bordeaux Mixture 1%", dosage: "10 g each copper sulphate + lime per L", notes: "Apply preventively weekly" },
      { name: "Bacillus subtilis (Serenade)", dosage: "4 ml/L", notes: "Bio-fungicide, apply every 7 days" },
    ],
    prevention: [
      "Plant resistant varieties: Mountain Magic, Defiant PhR, Jasper",
      "Avoid planting near potato fields (shares the same pathogen)",
      "Destroy all infected plant material — do not compost",
      "Apply preventive copper sprays before rainy periods",
      "Improve drainage — disease thrives in waterlogged soil",
      "Scout fields twice weekly during cool, wet weather",
    ],
    recoveryTime: "Full recovery unlikely — prioritise containment",
    yieldImpact: "50–100% crop loss if untreated",
  },
 
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
    crop: "Tomato", disease: "Yellow Leaf Curl Virus (TYLCV)",
    pathogen: "Begomovirus (transmitted by whitefly Bemisia tabaci)",
    severity: "high",
    affectedParts: ["leaves", "stem"],
    spreadMethod: "Whitefly (Bemisia tabaci) — persistent transmission",
    description: "TYLCV causes severe stunting and yellowing of leaves that curl upward. Infected plants are highly stunted and produce little or no fruit. The virus is transmitted by whiteflies and spreads rapidly across fields.",
    symptoms: ["Upward curling and yellowing of leaves", "Severe plant stunting", "Flower drop with minimal fruit set", "Interveinal chlorosis on young leaves"],
    treatments: [
      { type: "chemical", name: "Imidacloprid (Confidor)", dosage: "0.5 ml/L", frequency: "Every 10 days", notes: "Controls the whitefly vector — no cure for virus" },
      { type: "chemical", name: "Thiamethoxam (Actara)", dosage: "0.4 g/L", frequency: "Every 10 days", notes: "Rotate with imidacloprid" },
      { type: "chemical", name: "Spiromesifen (Oberon)", dosage: "0.5 ml/L", frequency: "Every 14 days", notes: "Targets whitefly eggs and nymphs" },
    ],
    fertilizers: [
      { name: "NPK 19:19:19", purpose: "Support stunted growth", dosage: "5 g/L foliar" },
      { name: "Zinc Sulphate", purpose: "Micronutrient support for virus-stressed plants", dosage: "0.5 g/L monthly" },
    ],
    organic: [
      { name: "Neem Oil 3%", dosage: "30 ml/L + emulsifier", notes: "Repels whitefly — apply evening, every 5 days" },
      { name: "Yellow sticky traps", dosage: "25 traps/acre", notes: "Monitor and mass-trap whitefly population" },
      { name: "Reflective silver mulch", dosage: "Lay on beds before transplant", notes: "Disorients and deters whitefly landing" },
    ],
    prevention: [
      "Use TYLCV-resistant varieties: Arka Samrat, Naveen, Sarpan",
      "Apply imidacloprid at transplanting as soil drench",
      "Install yellow sticky traps (25/acre) for early detection",
      "Uproot and destroy severely infected plants immediately",
      "Use fine mesh insect nets over nursery beds",
      "Avoid planting during peak whitefly season (Oct–Jan in Gujarat)",
    ],
    recoveryTime: "No recovery — manage vector, remove infected plants",
    yieldImpact: "60–100% loss in severely infected plants",
  },
 
  "Tomato___Leaf_Mold": {
    crop: "Tomato", disease: "Leaf Mould",
    pathogen: "Fulvia fulva (fungus)",
    severity: "moderate",
    affectedParts: ["leaves"],
    spreadMethod: "Airborne conidia, humidity > 85%",
    description: "Leaf mould causes pale green-yellow spots on leaf upper surfaces with olive-green to greyish-purple velvety mould on undersides. Common in greenhouses and humid environments. Reduces photosynthesis and can cause significant defoliation.",
    symptoms: ["Yellow patches on upper leaf surface", "Olive-brown velvety mould on leaf underside", "Leaves curl and turn brown", "Severe defoliation in humid conditions"],
    treatments: [
      { type: "chemical", name: "Chlorothalonil", dosage: "2 g/L", frequency: "Every 7 days", notes: "Contact fungicide, thorough coverage of leaf undersides essential" },
      { type: "chemical", name: "Iprodione (Rovral)", dosage: "2 g/L", frequency: "Every 10 days", notes: "Effective against Fulvia" },
    ],
    fertilizers: [
      { name: "Potassium Sulphate", purpose: "Reduce humidity-related susceptibility", dosage: "5 g/L fortnightly" },
    ],
    organic: [
      { name: "Neem Oil 2%", dosage: "20 ml/L", notes: "Every 7 days on leaf undersides" },
      { name: "Potassium bicarbonate", dosage: "5 g/L", notes: "Alkaline surface inhibits fungal sporulation" },
    ],
    prevention: [
      "Maintain relative humidity below 85%",
      "Ensure adequate ventilation in greenhouses",
      "Use drip irrigation instead of overhead sprinklers",
      "Remove and dispose of infected leaves",
      "Plant resistant varieties: Heinz 1350, Celebrity",
    ],
    recoveryTime: "2–3 weeks with treatment + humidity control",
    yieldImpact: "10–30% with defoliation",
  },
 
  "Tomato___Bacterial_spot": {
    crop: "Tomato", disease: "Bacterial Spot",
    pathogen: "Xanthomonas vesicatoria (bacteria)",
    severity: "moderate",
    affectedParts: ["leaves", "stem", "fruit"],
    spreadMethod: "Water splash, contaminated seeds, wind-driven rain",
    description: "Bacterial spot causes small, water-soaked lesions that turn brown with yellow halos on leaves. On fruit, raised, scabby spots develop which reduce marketability significantly.",
    symptoms: ["Small water-soaked lesions on leaves", "Brown spots with yellow halo", "Raised, scabby spots on green fruit", "Lesions may coalesce causing blighting"],
    treatments: [
      { type: "chemical", name: "Copper Hydroxide (Kocide 2000)", dosage: "2.5 g/L", frequency: "Every 5–7 days in wet weather", notes: "Most effective bactericide" },
      { type: "chemical", name: "Streptomycin Sulphate 90 SP", dosage: "0.6 g/L", frequency: "Every 5 days, max 3 applications", notes: "Restricted use — risk of resistance" },
    ],
    fertilizers: [
      { name: "Calcium Nitrate", purpose: "Strengthen epidermis", dosage: "5 g/L" },
    ],
    organic: [
      { name: "Copper-based Bordeaux Mixture", dosage: "1%", notes: "Best organic bactericide" },
      { name: "Hot water seed treatment", dosage: "50°C for 25 minutes before sowing", notes: "Eliminates seed-borne bacteria" },
    ],
    prevention: [
      "Use certified disease-free seeds and transplants",
      "Treat seeds with hot water (50°C for 25 min) before planting",
      "Avoid working in fields when plants are wet",
      "Use overhead irrigation alternatives",
      "3-year crop rotation",
    ],
    recoveryTime: "3–4 weeks with copper treatments",
    yieldImpact: "15–30% fruit quality loss",
  },
 
  "Tomato___healthy": {
    crop: "Tomato", disease: "Healthy",
    pathogen: null, severity: "none",
    affectedParts: [], spreadMethod: null,
    description: "The tomato plant appears healthy with no signs of disease, pest damage, or nutrient deficiency. Continue current management practices.",
    symptoms: [],
    treatments: [],
    fertilizers: [
      { name: "NPK 12:32:16 (at flowering)", purpose: "Fruit set and development", dosage: "5 g/L foliar" },
      { name: "Calcium Nitrate", purpose: "Prevent blossom end rot", dosage: "3 g/L bi-weekly" },
    ],
    organic: [
      { name: "Vermicompost tea", dosage: "100 ml/L soil drench weekly", notes: "Boosts soil microbiome" },
      { name: "Fish emulsion", dosage: "10 ml/L fortnightly", notes: "Balanced nutrition" },
    ],
    prevention: [
      "Continue regular scouting for early disease detection",
      "Maintain optimal irrigation schedule",
      "Apply preventive neem oil sprays monthly",
    ],
    recoveryTime: "N/A", yieldImpact: "None",
  },
 
  // ══════════════════════════════════
  //  POTATO
  // ══════════════════════════════════
  "Potato___Early_blight": {
    crop: "Potato", disease: "Early Blight",
    pathogen: "Alternaria solani (fungus)",
    severity: "moderate",
    affectedParts: ["leaves", "tuber"],
    spreadMethod: "Airborne spores, infected soil, contaminated tubers",
    description: "Dark concentric ring lesions appear on older leaves, expanding to cause yellowing and leaf drop. Tubers develop dark, sunken, dry lesions at harvest.",
    symptoms: ["Small dark spots with concentric rings on lower leaves", "Yellowing around lesions", "Defoliation starting from lower canopy", "Dry, dark surface lesions on tubers"],
    treatments: [
      { type: "chemical", name: "Mancozeb 75 WP", dosage: "2.5 g/L", frequency: "Every 7 days", notes: "Start 2 weeks after emergence" },
      { type: "chemical", name: "Chlorothalonil 75 WP", dosage: "2 g/L", frequency: "Every 7–10 days" },
    ],
    fertilizers: [
      { name: "Potassium Sulphate", purpose: "Improve tuber quality and disease resistance", dosage: "5 g/L" },
      { name: "Calcium Nitrate", purpose: "Strong cell structure", dosage: "3 g/L" },
    ],
    organic: [
      { name: "Copper Sulphate + Lime (Bordeaux 1%)", dosage: "10 g/L", notes: "Weekly preventive application" },
      { name: "Neem Oil 2%", dosage: "20 ml/L", notes: "Every 7 days" },
    ],
    prevention: ["Use certified seed tubers", "Crop rotation (3 years away from solanaceous crops)", "Adequate plant spacing (60 × 30 cm)", "Avoid late irrigation"],
    recoveryTime: "3–4 weeks", yieldImpact: "15–30%",
  },
 
  "Potato___Late_blight": {
    crop: "Potato", disease: "Late Blight",
    pathogen: "Phytophthora infestans (water mould)",
    severity: "critical",
    affectedParts: ["leaves", "stem", "tuber"],
    spreadMethod: "Wind-dispersed sporangia, water splash",
    description: "The most destructive potato disease globally (caused the Irish Famine, 1845). Water-soaked lesions rapidly turn brown-black. White sporulation on leaf undersides in moist weather. Tubers develop reddish-brown rot.",
    symptoms: ["Water-soaked, irregular dark spots on leaves", "White fuzzy growth on leaf undersides", "Brown-black stem collapse", "Reddish-brown granular rot inside tubers"],
    treatments: [
      { type: "chemical", name: "Metalaxyl-M + Mancozeb (Ridomil Gold MZ)", dosage: "2.5 g/L", frequency: "Every 5–7 days, begin before disease", notes: "CRITICAL — start before symptoms if conditions favour disease" },
      { type: "chemical", name: "Cymoxanil 8% + Mancozeb 64% WP (Curzate M8)", dosage: "2.5 g/L", frequency: "Every 7 days" },
      { type: "chemical", name: "Ametoctradin + Dimethomorph (Zampro)", dosage: "0.8 ml/L", frequency: "Every 7 days", notes: "Latest generation, excellent in wet conditions" },
    ],
    fertilizers: [
      { name: "Potassium Phosphite", purpose: "Elicit SAR (systemic acquired resistance)", dosage: "3 ml/L" },
    ],
    organic: [
      { name: "Copper Hydroxide (Kocide 3000)", dosage: "2 g/L", notes: "Best organic option; apply before rain" },
      { name: "Bacillus subtilis QST 713 (Serenade)", dosage: "4 ml/L", notes: "Preventive bio-fungicide" },
    ],
    prevention: ["Plant resistant varieties (Kufri Jyoti, Kufri Badshah)", "Monitor weather — spray when leaf wetness > 4 hrs + temp 10–20°C", "Destroy volunteer potato plants", "Harvest promptly after haulm destruction", "Ensure good drainage"],
    recoveryTime: "Containment only — no recovery of affected plants",
    yieldImpact: "40–100% loss",
  },
 
  "Potato___healthy": {
    crop: "Potato", disease: "Healthy",
    pathogen: null, severity: "none",
    affectedParts: [], spreadMethod: null,
    description: "Potato plant appears healthy. Continue preventive management.",
    symptoms: [],
    treatments: [],
    fertilizers: [
      { name: "NPK 10:26:26 (at tuber initiation)", purpose: "Tuber development", dosage: "Soil application" },
    ],
    organic: [{ name: "Wood ash", dosage: "200 g/plant in soil", notes: "Potassium source, suppresses some pathogens" }],
    prevention: ["Scout weekly", "Maintain soil pH 5.0–5.5", "Apply preventive copper sprays fortnightly in humid season"],
    recoveryTime: "N/A", yieldImpact: "None",
  },
 
  // ══════════════════════════════════
  //  CORN / MAIZE
  // ══════════════════════════════════
  "Corn_(maize)___Common_rust_": {
    crop: "Maize", disease: "Common Rust",
    pathogen: "Puccinia sorghi (fungus)",
    severity: "moderate",
    affectedParts: ["leaves"],
    spreadMethod: "Wind-dispersed urediniospores",
    description: "Small, oval, brick-red powdery pustules appear on both leaf surfaces. In severe infections, pustules cover most of the leaf area, reducing photosynthesis and grain fill. Most damaging if infection occurs before tasseling.",
    symptoms: ["Small oval brick-red pustules on both leaf surfaces", "Pustules rupture releasing reddish-brown spore powder", "Yellowing around pustule clusters", "Severe infections cause leaf death"],
    treatments: [
      { type: "chemical", name: "Propiconazole (Tilt 250 EC)", dosage: "1 ml/L", frequency: "Every 14 days, 2 applications max", notes: "Most effective fungicide for rust" },
      { type: "chemical", name: "Tebuconazole 25.9% EC", dosage: "1 ml/L", frequency: "Every 14 days", notes: "Good systemic control" },
    ],
    fertilizers: [
      { name: "Potassium Chloride (MOP)", purpose: "Potassium boosts rust resistance", dosage: "Top dress 30 kg/acre" },
      { name: "Sulphur 80 WG", purpose: "Micronutrient + mild fungicidal effect", dosage: "3 g/L" },
    ],
    organic: [
      { name: "Sulphur dust 300 mesh", dosage: "10 kg/acre dusting", notes: "Apply in morning dew" },
      { name: "Neem Oil 3%", dosage: "30 ml/L", notes: "Every 7 days" },
    ],
    prevention: ["Plant rust-resistant hybrids (DHM-117, HQPM-1)", "Avoid delayed planting (increases rust pressure)", "Adequate plant spacing for airflow", "Monitor regularly from V6 stage"],
    recoveryTime: "2–3 weeks with fungicide", yieldImpact: "10–40%",
  },
 
  "Corn_(maize)___Northern_Leaf_Blight": {
    crop: "Maize", disease: "Northern Leaf Blight",
    pathogen: "Exserohilum turcicum (fungus)",
    severity: "high",
    affectedParts: ["leaves"],
    spreadMethod: "Airborne conidia, infected crop residue",
    description: "Long, cigar-shaped grey-green lesions (2.5–15 cm) appear on leaves, starting with lower leaves. Lesions turn tan-brown and in humid conditions develop dark sporulation. Severe infection causes complete leaf death.",
    symptoms: ["Long cigar-shaped tan-grey lesions (5–15 cm)", "Lesions start on lower leaves, move upward", "Dark fungal sporulation inside lesions", "Complete leaf blight in severe cases"],
    treatments: [
      { type: "chemical", name: "Azoxystrobin + Propiconazole (Quilt Xcel)", dosage: "1 ml/L", frequency: "Every 14 days", notes: "Best combination for NLB" },
      { type: "chemical", name: "Mancozeb 75 WP", dosage: "2.5 g/L", frequency: "Every 7 days" },
    ],
    fertilizers: [
      { name: "NPK 28:0:0 Urea (top dress)", purpose: "Maintain plant vigour", dosage: "30 kg/acre at V6" },
    ],
    organic: [
      { name: "Copper Oxychloride 50 WP", dosage: "2 g/L", notes: "Every 10 days" },
    ],
    prevention: ["Use resistant hybrids (NK 6240, Dekalb 9144)", "Deep plough to bury infected residue", "Crop rotation with non-host crops", "Avoid overhead irrigation"],
    recoveryTime: "3–4 weeks", yieldImpact: "20–50%",
  },
 
  "Corn_(maize)___healthy": {
    crop: "Maize", disease: "Healthy",
    pathogen: null, severity: "none",
    affectedParts: [], spreadMethod: null,
    description: "Maize plant is healthy. Continue standard agronomic practices.",
    symptoms: [],
    treatments: [],
    fertilizers: [
      { name: "Urea (top dress at knee-high)", purpose: "Nitrogen for vegetative growth", dosage: "30 kg/acre" },
      { name: "Zinc Sulphate", purpose: "Prevent zinc deficiency (white strip syndrome)", dosage: "10 kg/acre soil, or 0.5 g/L foliar" },
    ],
    organic: [{ name: "Jeevamrut", dosage: "200 L/acre", notes: "Fermented cow dung preparation" }],
    prevention: ["Scout for fall armyworm weekly from V3", "Apply preventive fungicide at tasseling in high-humidity areas"],
    recoveryTime: "N/A", yieldImpact: "None",
  },
 
  // ══════════════════════════════════
  //  WHEAT
  // ══════════════════════════════════
  "Wheat___Yellow_Rust": {
    crop: "Wheat", disease: "Yellow Rust (Stripe Rust)",
    pathogen: "Puccinia striiformis f. sp. tritici (fungus)",
    severity: "high",
    affectedParts: ["leaves", "stem", "grain"],
    spreadMethod: "Wind-dispersed urediniospores over long distances",
    description: "Yellow rust is characterised by lemon-yellow uredinia arranged in stripes parallel to leaf veins. It thrives in cool, humid conditions (5–15°C) and can spread rapidly across regions. Major yield losses in north-west India.",
    symptoms: ["Lemon-yellow pustule stripes on leaves", "Yellow powder released when touched", "Pustules on leaf sheaths in severe cases", "Premature grain shrivelling"],
    treatments: [
      { type: "chemical", name: "Propiconazole 25 EC (Tilt)", dosage: "1 ml/L", frequency: "At first sign, repeat at 14 days", notes: "Most effective — apply early" },
      { type: "chemical", name: "Tebuconazole 250 EW (Folicur)", dosage: "1 ml/L", frequency: "Every 14 days" },
      { type: "chemical", name: "Triadimefon 25 WP (Bayleton)", dosage: "0.8 g/L", frequency: "Every 10–14 days" },
    ],
    fertilizers: [
      { name: "Potassium Nitrate KNO₃", purpose: "Strengthen resistance to rust", dosage: "5 g/L foliar" },
      { name: "Sulphur 90% WG", purpose: "Improve protein content + mild fungicidal", dosage: "2 g/L" },
    ],
    organic: [
      { name: "Sulphur dust 300 mesh", dosage: "10 kg/acre", notes: "Apply at dew — effective preventive" },
    ],
    prevention: ["Plant resistant varieties: HD 2967, WH 1105, PBW 723", "Monitor crop from boot stage onwards", "Early sowing reduces yellow rust pressure", "Balanced nitrogen — excess N increases susceptibility"],
    recoveryTime: "2–3 weeks", yieldImpact: "20–70%",
  },
 
  "Wheat___healthy": {
    crop: "Wheat", disease: "Healthy",
    pathogen: null, severity: "none",
    affectedParts: [], spreadMethod: null,
    description: "Wheat crop is healthy. Maintain current practices.",
    symptoms: [],
    treatments: [],
    fertilizers: [
      { name: "Urea top dress at crown root stage", purpose: "Tillering and stem elongation", dosage: "30 kg/acre" },
    ],
    organic: [{ name: "FYM (farmyard manure)", dosage: "5 tonnes/acre before sowing", notes: "Improves soil structure" }],
    prevention: ["Scout weekly from seedling stage", "Maintain optimal irrigation at crown root, jointing, flowering stages"],
    recoveryTime: "N/A", yieldImpact: "None",
  },
 
  // ══════════════════════════════════
  //  GRAPE
  // ══════════════════════════════════
  "Grape___Black_rot": {
    crop: "Grape", disease: "Black Rot",
    pathogen: "Guignardia bidwellii (fungus)",
    severity: "high",
    affectedParts: ["leaves", "fruit", "canes"],
    spreadMethod: "Ascospores from infected mummified berries",
    description: "Black rot causes tan lesions with dark borders on leaves and rapidly progresses to destroy entire fruit clusters. Berries turn brown-black, shrivel into hard mummified 'raisins' that remain on the vine and overwinter as infection source.",
    symptoms: ["Tan circular spots with dark border on leaves", "Black pycnidia (dots) within lesions", "Brown sunken spots on green berries", "Berries shrivel into black mummies"],
    treatments: [
      { type: "chemical", name: "Myclobutanil (Rally 40 WP)", dosage: "0.6 g/L", frequency: "Every 7–10 days from bud break", notes: "Critical early-season application" },
      { type: "chemical", name: "Captan 50 WP", dosage: "2 g/L", frequency: "Every 7 days" },
    ],
    fertilizers: [
      { name: "Calcium Boron (Solubor)", purpose: "Berry set and skin strength", dosage: "1 g/L at flowering" },
    ],
    organic: [
      { name: "Copper-based fungicides", dosage: "2 g/L", notes: "Apply from early bud break" },
      { name: "Potassium bicarbonate", dosage: "5 g/L", notes: "Post-infection rescue spray" },
    ],
    prevention: ["Remove all mummified berries in winter", "Prune to improve air circulation", "Apply fungicides from bud break through veraison", "Avoid mechanical injury to berries"],
    recoveryTime: "3–4 weeks (leaves) — infected fruit cannot recover",
    yieldImpact: "25–80%",
  },
 
  "Grape___healthy": {
    crop: "Grape", disease: "Healthy",
    pathogen: null, severity: "none",
    affectedParts: [], spreadMethod: null,
    description: "Grapevine appears healthy. Maintain preventive spray programme.",
    symptoms: [],
    treatments: [],
    fertilizers: [{ name: "Potassium Sulphate", purpose: "Berry quality and sugar accumulation", dosage: "3 g/L from veraison" }],
    organic: [{ name: "Copper-sulphur combination", dosage: "1 g/L copper + 2 g/L sulphur", notes: "Preventive monthly spray" }],
    prevention: ["Implement a complete 12-spray calendar from bud break", "Maintain open canopy through shoot thinning"],
    recoveryTime: "N/A", yieldImpact: "None",
  },
 
  // ══════════════════════════════════
  //  RICE
  // ══════════════════════════════════
  "Rice___Leaf_Blast": {
    crop: "Rice", disease: "Leaf Blast",
    pathogen: "Magnaporthe oryzae (fungus)",
    severity: "high",
    affectedParts: ["leaves", "panicle", "node"],
    spreadMethod: "Wind-dispersed conidia, water splash",
    description: "Rice blast is the most important rice disease worldwide. Diamond-shaped lesions with grey centres and brown borders appear on leaves. Neck blast causes panicle death at the point of attachment, often causing complete panicle blasting.",
    symptoms: ["Diamond-shaped grey-centred lesions with brown border", "Lesions coalesce causing large dead areas", "Node blast causes lodging", "Neck blast — panicle turns white-grey at base"],
    treatments: [
      { type: "chemical", name: "Tricyclazole 75 WP (Beam)", dosage: "0.6 g/L", frequency: "Every 10–14 days", notes: "Gold standard for blast; apply at first sign and preventively before expected rainfall" },
      { type: "chemical", name: "Isoprothiolane 40 EC (Fuji-One)", dosage: "1.5 ml/L", frequency: "Every 14 days", notes: "Also works on brown spot" },
    ],
    fertilizers: [
      { name: "Split nitrogen application", purpose: "Avoid excess N which increases blast severity", dosage: "Never apply all N at once — use 3 splits" },
      { name: "Potassium Chloride", purpose: "Improves blast resistance significantly", dosage: "Apply full recommended dose" },
      { name: "Silicon (Silicic Acid)", purpose: "Major blast resistance factor", dosage: "200 kg/ha calcium silicate soil application" },
    ],
    organic: [
      { name: "Pseudomonas fluorescens (bio-fungicide)", dosage: "5 g/L seed treatment OR 2.5 kg/acre soil drench", notes: "Apply at nursery stage" },
      { name: "Trichoderma harzianum", dosage: "5 g/L foliar spray", notes: "Every 7 days" },
    ],
    prevention: ["Plant blast-resistant varieties (Sahbhagi Dhan, IR64, BPT 5204)", "Avoid excessive nitrogen fertilisation", "Drain fields periodically — continuous flooding favours blast", "Apply silicon-based soil amendments", "Scout from tillering stage"],
    recoveryTime: "3–4 weeks", yieldImpact: "30–70%",
  },
 
  "Rice___Brown_Spot": {
    crop: "Rice", disease: "Brown Spot",
    pathogen: "Bipolaris oryzae (fungus)",
    severity: "moderate",
    affectedParts: ["leaves", "glumes", "grain"],
    spreadMethod: "Seed-borne, airborne conidia, potassium-deficient soils",
    description: "Brown spot produces oval to circular brown lesions with light-grey centres on leaves. Often associated with nutrient-deficient (especially potassium) conditions. Causes chalky grain and reduced germination.",
    symptoms: ["Circular to oval dark-brown lesions", "Light grey-brown centre with dark brown margin", "Lesions on leaf sheaths and glumes", "Discoloured brown grain"],
    treatments: [
      { type: "chemical", name: "Mancozeb 75 WP", dosage: "2.5 g/L", frequency: "Every 10 days" },
      { type: "chemical", name: "Carbendazim 50 WP + Mancozeb 25 WP", dosage: "2 g/L", frequency: "Every 10 days" },
    ],
    fertilizers: [
      { name: "Potassium Chloride (MOP)", purpose: "CRITICAL — brown spot strongly associated with K deficiency", dosage: "Apply full dose at transplanting" },
      { name: "Zinc Sulphate", purpose: "Correct zinc deficiency which makes plants susceptible", dosage: "10 kg/acre basally" },
    ],
    organic: [
      { name: "Hot water seed treatment", dosage: "53°C for 12 minutes", notes: "Eliminates seed-borne inoculum" },
    ],
    prevention: ["Apply full potassium dose at transplanting", "Treat seeds before planting", "Avoid water stress", "Correct soil nutrient deficiencies before planting"],
    recoveryTime: "3 weeks", yieldImpact: "10–35%",
  },
 
  "Rice___healthy": {
    crop: "Rice", disease: "Healthy",
    pathogen: null, severity: "none",
    affectedParts: [], spreadMethod: null,
    description: "Rice plant is healthy. Maintain crop monitoring schedule.",
    symptoms: [],
    treatments: [],
    fertilizers: [{ name: "NPK split application", purpose: "Optimal nutrition", dosage: "60:30:30 kg N:P:K per acre in 3 splits" }],
    organic: [{ name: "Green manure (Sesbania)", dosage: "Incorporate 45 days after sowing", notes: "Adds 40–60 kg N/acre" }],
    prevention: ["Scout weekly for BPH, stem borer, blast", "Maintain proper water management"],
    recoveryTime: "N/A", yieldImpact: "None",
  },
 
  // ══════════════════════════════════
  //  COTTON
  // ══════════════════════════════════
  "Cotton___Bacterial_blight": {
    crop: "Cotton", disease: "Bacterial Blight (Angular Leaf Spot)",
    pathogen: "Xanthomonas axonopodis pv. malvacearum (bacteria)",
    severity: "high",
    affectedParts: ["leaves", "stem", "boll"],
    spreadMethod: "Infected seeds, rain splash, insects",
    description: "Bacterial blight causes water-soaked angular spots on leaves that turn dark brown to black, limited by leaf veins giving them an angular shape. Boll infection causes brown watery rot. Can cause severe crop losses in humid seasons.",
    symptoms: ["Water-soaked angular leaf spots", "Spots turn dark brown to black", "Water-soaked streaks on stems", "Brown watery boll rot"],
    treatments: [
      { type: "chemical", name: "Copper Oxychloride 50 WP", dosage: "3 g/L", frequency: "Every 7 days in wet weather", notes: "Most effective bactericide for cotton blight" },
      { type: "chemical", name: "Streptomycin + Copper (COC + STM)", dosage: "0.5 g STM + 3 g COC per L", frequency: "Every 7 days", notes: "Use judiciously to prevent resistance" },
    ],
    fertilizers: [
      { name: "Potassium Sulphate (SOP)", purpose: "Improve cell strength and boll retention", dosage: "5 g/L foliar at squaring" },
    ],
    organic: [
      { name: "Bordeaux Mixture 1%", dosage: "10 g each per L", notes: "Preventive spray before rains" },
    ],
    prevention: ["Use disease-free certified seed or Bt cotton hybrids", "Treat seeds with Streptomycin 200 ppm + Copper 2000 ppm", "Remove and burn severely infected plants", "Avoid waterlogging"],
    recoveryTime: "3–4 weeks", yieldImpact: "20–50%",
  },
 
  "Cotton___healthy": {
    crop: "Cotton", disease: "Healthy",
    pathogen: null, severity: "none",
    affectedParts: [], spreadMethod: null,
    description: "Cotton plant is healthy. Continue current management practices.",
    symptoms: [],
    treatments: [],
    fertilizers: [{ name: "Boron (Borax)", purpose: "Boll retention and fibre quality", dosage: "0.5 g/L at square initiation" }],
    organic: [{ name: "Neem seed kernel extract (NSKE 5%)", dosage: "50 g/L", notes: "Repels sucking pests" }],
    prevention: ["Scout weekly for pink bollworm and whitefly", "Use pheromone traps"],
    recoveryTime: "N/A", yieldImpact: "None",
  },
}
 
// ── Utility: get by HuggingFace label (case-insensitive partial match) ──
export function getByLabel(label) {
  if (!label) return null
 
  // Direct key match
  if (DISEASE_DB[label]) return { ...DISEASE_DB[label], key: label }
 
  // Normalise and fuzzy match
  const norm = label.toLowerCase().replace(/[^a-z0-9]/g, '_')
  for (const [key, val] of Object.entries(DISEASE_DB)) {
    const keyNorm = key.toLowerCase().replace(/[^a-z0-9]/g, '_')
    if (keyNorm === norm || keyNorm.includes(norm) || norm.includes(keyNorm.split('___')[1] || '')) {
      return { ...val, key }
    }
  }
 
  // Match on crop + disease name separately
  const parts = label.split(/[_\s]+/).filter(Boolean)
  for (const [key, val] of Object.entries(DISEASE_DB)) {
    const matchCount = parts.filter(p =>
      key.toLowerCase().includes(p.toLowerCase()) && p.length > 3
    ).length
    if (matchCount >= 2) return { ...val, key }
  }
 
  return null
}
 
// ── List all crops ────────────────────────────────────────
export const SUPPORTED_CROPS = [...new Set(Object.values(DISEASE_DB).map(d => d.crop))].sort()
 
// ── List all diseases for a crop ─────────────────────────
export function getDiseasesForCrop(cropName) {
  return Object.entries(DISEASE_DB)
    .filter(([, v]) => v.crop.toLowerCase() === cropName.toLowerCase())
    .map(([k, v]) => ({ key: k, disease: v.disease, severity: v.severity }))
}
 
// ── Severity rank (for sorting) ──────────────────────────
export const SEVERITY_RANK = { none: 0, low: 1, moderate: 2, high: 3, critical: 4 }
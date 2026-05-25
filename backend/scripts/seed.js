// scripts/seed.js
// ─────────────────────────────────────────────────────────
// Database seeder — run with: npm run seed
// Creates an admin user + sample farmer for local development.
// ─────────────────────────────────────────────────────────

import { connectDB, disconnectDB } from '../src/config/database.js'
import User                        from '../src/models/User.js'
import CropRecommendation          from '../src/models/CropRecommendation.js'
import logger                      from '../src/utils/logger.js'

const SEED_USERS = [
  {
    name:       'Admin User',
    email:      'admin@agrovision.ai',
    password:   'Admin@1234',
    role:       'admin',
    farmName:   'AgroVision HQ',
    location:   'Ahmedabad, Gujarat',
  },
  {
    name:       'Arjun Verma',
    email:      'arjun@demo.com',
    password:   'Farmer@1234',
    role:       'farmer',
    farmName:   'Verma Farms',
    location:   'Junagadh, Gujarat',
    farmSizeHa: 12.5,
    coordinates: { lat: 21.5222, lon: 70.4579 },
  },
]

async function seed() {
  logger.info('🌱  Starting database seed…')
  await connectDB()

  for (const userData of SEED_USERS) {
    const existing = await User.findOne({ email: userData.email })
    if (existing) {
      logger.info(`  → User ${userData.email} already exists — skipping`)
      continue
    }
    const user = await User.create(userData)
    logger.info(`  ✓ Created ${user.role}: ${user.email}`)

    // Seed a sample recommendation for the farmer
    if (user.role === 'farmer') {
      await CropRecommendation.create({
        user:            user._id,
        inputs:          { nitrogen: 80, phosphorus: 40, potassium: 40, temperature: 26, humidity: 70, ph: 6.5, rainfall: 200 },
        recommendedCrop: 'Wheat',
        confidence:      0.89,
        alternatives:    [{ crop: 'Cotton', confidence: 0.72 }, { crop: 'Maize', confidence: 0.65 }],
        guidance:        { sowingTime: 'November', harvestTime: 'March–April', waterNeeds: 'Moderate (450mm)', fertilizerTip: 'Apply DAP at sowing' },
        modelVersion:    'v1.0-seed',
        latencyMs:       120,
        season:          'rabi',
        fieldName:       'Field 1',
      })
      logger.info(`  ✓ Seeded sample recommendation for ${user.email}`)
    }
  }

  logger.info('\n✅  Seed complete!')
  logger.info('   Admin:  admin@agrovision.ai / Admin@1234')
  logger.info('   Farmer: arjun@demo.com     / Farmer@1234\n')

  await disconnectDB()
  process.exit(0)
}

seed().catch(err => {
  logger.error(`Seed failed: ${err.message}`)
  process.exit(1)
})

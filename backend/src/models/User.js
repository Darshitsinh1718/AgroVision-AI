import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────
    farmerName: {
      type: String,
      required: [true, 'Farmer name is required'],
      trim: true,
    },

    // Alias used by some frontend/navbar code
    name: {
      type: String,
      trim: true,
      default: '',
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },

    phone: {
      type: String,
      trim: true,
      default: '',
    },

    // ── Location ──────────────────────────────────────────────
    state: {
      type: String,
      trim: true,
      default: '',
    },

    district: {
      type: String,
      trim: true,
      default: '',
    },

    taluka: {
      type: String,
      trim: true,
      default: '',
    },

    village: {
      type: String,
      trim: true,
      default: '',
    },

    nearestMarketYard: {
      type: String,
      trim: true,
      default: '',
    },

    // ── Farm Details ──────────────────────────────────────────
    farmName: {
      type: String,
      trim: true,
      default: '',
    },

    totalArea: {
      type: Number,
      min: 0,
      default: 0,
    },

    areaUnit: {
      type: String,
      trim: true,
      default: 'Acre',
    },

    soilType: {
      type: String,
      trim: true,
      default: '',
    },

    primaryCrop: {
      type: String,
      trim: true,
      default: '',
    },

    season: {
      type: String,
      trim: true,
      default: '',
    },

    irrigationType: {
      type: String,
      trim: true,
      default: '',
    },

    // ── Preferences ───────────────────────────────────────────
    language: {
      type: String,
      trim: true,
      default: 'English',
    },

    notificationPreference: {
      type: String,
      trim: true,
      default: 'Important alerts only',
    },

    preferredUnits: {
      type: String,
      trim: true,
      default: 'metric',
    },

    // ── Auth / Role ───────────────────────────────────────────
    role: {
      type: String,
      enum: ['farmer', 'admin'],
      default: 'farmer',
    },
  },
  {
    timestamps: true,
  }
)

// ── Keep name synced with farmerName ───────────────────────
userSchema.pre('save', async function (next) {
  if (this.farmerName && !this.name) {
    this.name = this.farmerName
  }

  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
  }

  next()
})

// ── Instance method: compare entered password with hash ────
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

// ── Instance method: return safe user object ───────────────
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject()

  delete obj.password
  delete obj.__v

  return obj
}

const User = mongoose.model('User', userSchema)

export default User
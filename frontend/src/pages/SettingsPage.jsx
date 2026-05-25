// src/pages/SettingsPage.jsx
import { useEffect, useState } from 'react'
import {
  Settings,
  MapPin,
  User,
  Tractor,
  Bell,
  CheckCircle,
} from 'lucide-react'

import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext.jsx'

const STATES = [
  'Gujarat',
  'Maharashtra',
  'Rajasthan',
  'Punjab',
  'Haryana',
  'Madhya Pradesh',
  'Uttar Pradesh',
  'Karnataka',
  'Tamil Nadu',
  'Telangana',
]

const SOIL_TYPES = [
  'Black',
  'Loamy',
  'Clay',
  'Sandy',
  'Red',
  'Alluvial',
  'Laterite',
]

const SEASONS = ['Kharif', 'Rabi', 'Zaid']

const IRRIGATION_TYPES = [
  'Rainfed',
  'Drip',
  'Sprinkler',
  'Canal',
  'Tube Well',
  'Borewell',
]

const AREA_UNITS = ['Acre', 'Hectare', 'Bigha']

const defaultProfile = {
  farmerName: '',
  phone: '',
  email: '',

  state: '',
  district: '',
  taluka: '',
  village: '',
  nearestMarketYard: '',

  farmName: '',
  totalArea: '',
  areaUnit: 'Acre',
  primaryCrop: '',
  soilType: '',
  irrigationType: '',
  season: '',

  language: 'English',
  notificationPreference: 'Important alerts only',
}

export default function SettingsPage() {
  const { user } = useAuth()

  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState(defaultProfile)

  useEffect(() => {
    const localProfile = localStorage.getItem('agrovision_farm_profile')
    const savedLocalProfile = localProfile ? JSON.parse(localProfile) : {}

    const signupUserProfile = {
      farmerName: user?.farmerName || user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',

      state: user?.state || '',
      district: user?.district || '',
      taluka: user?.taluka || '',
      village: user?.village || '',
      nearestMarketYard: user?.nearestMarketYard || '',

      farmName: user?.farmName || '',
      totalArea: user?.totalArea || '',
      areaUnit: user?.areaUnit || 'Acre',
      primaryCrop: user?.primaryCrop || '',
      soilType: user?.soilType || '',
      irrigationType: user?.irrigationType || '',
      season: user?.season || '',

      language: user?.language || 'English',
      notificationPreference:
        user?.notificationPreference || 'Important alerts only',
    }

    setProfile({
      ...defaultProfile,
      ...signupUserProfile,
      ...savedLocalProfile,
    })
  }, [user])

  const handleChange = (key, value) => {
    setProfile(prev => ({
      ...prev,
      [key]: value,
    }))
    setSaved(false)
  }

  const handleNumberChange = (key, value) => {
    if (value === '') {
      handleChange(key, '')
      return
    }

    const num = Number(value)
    if (Number.isNaN(num)) return

    handleChange(key, String(Math.max(0, num)))
  }

  const handleSave = () => {
    localStorage.setItem('agrovision_farm_profile', JSON.stringify(profile))
    localStorage.setItem('agrovision_user', JSON.stringify({
      ...(user || {}),
      ...profile,
    }))

    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  const inputClass =
    'w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-stone-200 placeholder-stone-700 focus:outline-none focus:border-leaf-600/60 transition-all duration-200'

  const readOnlyClass =
    'w-full px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-stone-500 cursor-not-allowed'

  const selectClass =
    'w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-stone-200 focus:outline-none focus:border-leaf-600/60 transition-all duration-200'

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Settings"
        subtitle="View and update your farmer profile created during signup."
      />

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-leaf-700/50 bg-leaf-950/50 px-4 py-3 text-sm text-leaf-300">
          <CheckCircle size={16} />
          Profile updated successfully.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <User size={17} className="text-leaf-400" />
            <h2 className="font-medium text-stone-200">Farmer Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-stone-500 block mb-1.5">
                Farmer Name
              </label>
              <input
                type="text"
                value={profile.farmerName}
                onChange={e => handleChange('farmerName', e.target.value)}
                placeholder="e.g. Darshit Chavda"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500 block mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={e => handleChange('phone', e.target.value)}
                placeholder="e.g. 9876543210"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500 block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className={readOnlyClass}
              />
              <p className="text-[11px] text-stone-600 mt-1">
                Email is linked to your login account.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <MapPin size={17} className="text-leaf-400" />
            <h2 className="font-medium text-stone-200">Farm Location</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-stone-500 block mb-1.5">
                State
              </label>
              <select
                value={profile.state}
                onChange={e => handleChange('state', e.target.value)}
                className={selectClass}
              >
                <option value="" className="bg-stone-900">
                  Select State
                </option>
                {STATES.map(state => (
                  <option key={state} value={state} className="bg-stone-900">
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500 block mb-1.5">
                District
              </label>
              <input
                type="text"
                value={profile.district}
                onChange={e => handleChange('district', e.target.value)}
                placeholder="e.g. Gir Somnath"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500 block mb-1.5">
                Taluka
              </label>
              <input
                type="text"
                value={profile.taluka}
                onChange={e => handleChange('taluka', e.target.value)}
                placeholder="e.g. Kodinar"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500 block mb-1.5">
                Village
              </label>
              <input
                type="text"
                value={profile.village}
                onChange={e => handleChange('village', e.target.value)}
                placeholder="e.g. Kodinar"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500 block mb-1.5">
                Nearest Market Yard
              </label>
              <input
                type="text"
                value={profile.nearestMarketYard}
                onChange={e => handleChange('nearestMarketYard', e.target.value)}
                placeholder="e.g. Kodinar Market Yard"
                className={inputClass}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <Tractor size={17} className="text-leaf-400" />
            <h2 className="font-medium text-stone-200">Farm Details</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-stone-500 block mb-1.5">
                Farm Name
              </label>
              <input
                type="text"
                value={profile.farmName}
                onChange={e => handleChange('farmName', e.target.value)}
                placeholder="e.g. Chavda Farms"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-500 block mb-1.5">
                  Total Area
                </label>
                <input
                  type="number"
                  min="0"
                  value={profile.totalArea}
                  onChange={e => handleNumberChange('totalArea', e.target.value)}
                  placeholder="e.g. 5"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-500 block mb-1.5">
                  Area Unit
                </label>
                <select
                  value={profile.areaUnit}
                  onChange={e => handleChange('areaUnit', e.target.value)}
                  className={selectClass}
                >
                  {AREA_UNITS.map(unit => (
                    <option key={unit} value={unit} className="bg-stone-900">
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500 block mb-1.5">
                Primary Crop
              </label>
              <input
                type="text"
                value={profile.primaryCrop}
                onChange={e => handleChange('primaryCrop', e.target.value)}
                placeholder="e.g. Groundnut"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500 block mb-1.5">
                Soil Type
              </label>
              <select
                value={profile.soilType}
                onChange={e => handleChange('soilType', e.target.value)}
                className={selectClass}
              >
                <option value="" className="bg-stone-900">
                  Select Soil Type
                </option>
                {SOIL_TYPES.map(type => (
                  <option key={type} value={type} className="bg-stone-900">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500 block mb-1.5">
                Irrigation Type
              </label>
              <select
                value={profile.irrigationType}
                onChange={e => handleChange('irrigationType', e.target.value)}
                className={selectClass}
              >
                <option value="" className="bg-stone-900">
                  Select Irrigation Type
                </option>
                {IRRIGATION_TYPES.map(type => (
                  <option key={type} value={type} className="bg-stone-900">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500 block mb-1.5">
                Season
              </label>
              <select
                value={profile.season}
                onChange={e => handleChange('season', e.target.value)}
                className={selectClass}
              >
                <option value="" className="bg-stone-900">
                  Select Season
                </option>
                {SEASONS.map(season => (
                  <option key={season} value={season} className="bg-stone-900">
                    {season}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <Bell size={17} className="text-leaf-400" />
            <h2 className="font-medium text-stone-200">Preferences</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-stone-500 block mb-1.5">
                Language
              </label>
              <select
                value={profile.language}
                onChange={e => handleChange('language', e.target.value)}
                className={selectClass}
              >
                <option value="English" className="bg-stone-900">
                  English
                </option>
                <option value="Hindi" className="bg-stone-900">
                  Hindi
                </option>
                <option value="Gujarati" className="bg-stone-900">
                  Gujarati
                </option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500 block mb-1.5">
                Notification Preference
              </label>
              <select
                value={profile.notificationPreference}
                onChange={e =>
                  handleChange('notificationPreference', e.target.value)
                }
                className={selectClass}
              >
                <option value="Important alerts only" className="bg-stone-900">
                  Important alerts only
                </option>
                <option value="All alerts" className="bg-stone-900">
                  All alerts
                </option>
                <option value="No alerts" className="bg-stone-900">
                  No alerts
                </option>
              </select>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <div className="flex items-start gap-3">
                <Settings size={16} className="text-leaf-400 mt-0.5" />
                <div>
                  <p className="text-sm text-stone-300 font-medium">
                    Signup data is used here
                  </p>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    This page loads your farmer information from your logged-in
                    account. Updates are saved locally for now. Backend profile
                    update can be connected later using PATCH /api/v1/users/profile.
                  </p>
                </div>
              </div>
            </div>

            <Button variant="primary" icon={Settings} onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
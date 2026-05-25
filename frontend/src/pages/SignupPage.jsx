import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// ── Step config ───────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Account',  icon: '👤' },
  { id: 2, label: 'Location', icon: '📍' },
  { id: 3, label: 'Farm',     icon: '🌾' },
];

const INITIAL_FORM = {
  farmerName: '', email: '', password: '', confirmPassword: '', phone: '',
  state: '', district: '', taluka: '', village: '',
  farmName: '', totalArea: '', areaUnit: 'acres', soilType: '',
  primaryCrop: '', season: '', irrigationType: '',
};

// ── Reusable field components ─────────────────────────────────
const Field = ({ label, required, children, hint }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1.5">
      {label}{required && <span className="text-green-400 ml-1">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
  </div>
);

const Input = ({ className = '', ...props }) => (
  <input
    {...props}
    className={`w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${className}`}
  />
);

const Select = ({ children, className = '', ...props }) => (
  <select
    {...props}
    className={`w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition appearance-none ${className}`}
  >
    {children}
  </select>
);

// ── Main component ────────────────────────────────────────────
const SignupPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  // ── Step validation ───────────────────────────────────────
  const validateStep = () => {
    if (step === 1) {
      if (!form.farmerName.trim()) return 'Full name is required.';
      if (!form.email.trim()) return 'Email is required.';
      if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Enter a valid email address.';
      if (!form.password) return 'Password is required.';
      if (form.password.length < 6) return 'Password must be at least 6 characters.';
      if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    }
    if (step === 2) {
      if (!form.state.trim()) return 'State is required.';
      if (!form.district.trim()) return 'District is required.';
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setStep((s) => s + 1);
  };

  const prevStep = () => { setError(''); setStep((s) => s - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.primaryCrop.trim()) { setError('Primary crop is required.'); return; }

    setLoading(true);
    setError('');
    try {
      const { confirmPassword, ...payload } = form;
      await register(payload);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step content renderers ────────────────────────────────
  const renderStep1 = () => (
    <div className="space-y-4">
      <Field label="Full Name" required>
        <Input name="farmerName" value={form.farmerName} onChange={handleChange} placeholder="Ramesh Patel" autoFocus />
      </Field>
      <Field label="Email Address" required>
        <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" />
      </Field>
      <Field label="Phone Number">
        <Input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
      </Field>
      <div className="grid grid-cols-1 gap-4">
        <Field label="Password" required>
          <div className="relative">
            <Input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" className="pr-11" />
            <button type="button" onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showPass
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                }
              </svg>
            </button>
          </div>
        </Field>
        <Field label="Confirm Password" required>
          <Input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" />
        </Field>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="State" required>
          <Input name="state" value={form.state} onChange={handleChange} placeholder="Gujarat" />
        </Field>
        <Field label="District" required>
          <Input name="district" value={form.district} onChange={handleChange} placeholder="Anand" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Taluka">
          <Input name="taluka" value={form.taluka} onChange={handleChange} placeholder="Anklav" />
        </Field>
        <Field label="Village">
          <Input name="village" value={form.village} onChange={handleChange} placeholder="Dharmaj" />
        </Field>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <Field label="Farm Name">
        <Input name="farmName" value={form.farmName} onChange={handleChange} placeholder="Patel Agro Farm" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Total Area">
          <Input type="number" name="totalArea" value={form.totalArea} onChange={handleChange} placeholder="12" min="0" />
        </Field>
        <Field label="Area Unit">
          <Select name="areaUnit" value={form.areaUnit} onChange={handleChange}>
            <option value="acres">Acres</option>
            <option value="hectares">Hectares</option>
            <option value="bigha">Bigha</option>
            <option value="guntha">Guntha</option>
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Soil Type">
          <Select name="soilType" value={form.soilType} onChange={handleChange}>
            <option value="">Select soil</option>
            <option value="black">Black (Regur)</option>
            <option value="red">Red Soil</option>
            <option value="alluvial">Alluvial</option>
            <option value="sandy">Sandy</option>
            <option value="loamy">Loamy</option>
            <option value="clayey">Clayey</option>
          </Select>
        </Field>
        <Field label="Season">
          <Select name="season" value={form.season} onChange={handleChange}>
            <option value="">Select season</option>
            <option value="kharif">Kharif</option>
            <option value="rabi">Rabi</option>
            <option value="zaid">Zaid</option>
            <option value="all-year">All Year</option>
          </Select>
        </Field>
      </div>
      <Field label="Primary Crop" required>
        <Input name="primaryCrop" value={form.primaryCrop} onChange={handleChange} placeholder="Cotton, Wheat, Rice…" />
      </Field>
      <Field label="Irrigation Type">
        <Select name="irrigationType" value={form.irrigationType} onChange={handleChange}>
          <option value="">Select irrigation</option>
          <option value="drip">Drip Irrigation</option>
          <option value="sprinkler">Sprinkler</option>
          <option value="flood">Flood / Furrow</option>
          <option value="rainfed">Rainfed</option>
          <option value="canal">Canal</option>
        </Select>
      </Field>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-900/15 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Brand */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/30 mb-3">
            <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3C7 3 3 7.5 3 12c0 2.5 1 4.8 2.6 6.4M12 3c5 0 9 4.5 9 9 0 2.5-1 4.8-2.6 6.4M12 3v18M3 12h18" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">AgroVision <span className="text-green-400">AI</span></h1>
          <p className="text-gray-400 text-sm mt-1">Create your farmer account</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-7">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex flex-col items-center ${step === s.id ? 'opacity-100' : step > s.id ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all
                  ${step === s.id ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-900/40'
                  : step > s.id ? 'bg-green-800 border-green-600 text-green-300'
                  : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                  {step > s.id ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s.id}
                </div>
                <span className={`text-xs mt-1 font-medium ${step === s.id ? 'text-green-400' : 'text-gray-500'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-16 h-0.5 mx-1 mb-4 transition-all ${step > s.id ? 'bg-green-600' : 'bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-7 shadow-2xl">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl">{STEPS[step - 1].icon}</span>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {step === 1 && 'Personal Details'}
                {step === 2 && 'Your Location'}
                {step === 3 && 'Farm Information'}
              </h2>
              <p className="text-xs text-gray-500">Step {step} of {STEPS.length}</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-400 text-sm flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button type="button" onClick={prevStep}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2.5 rounded-xl transition text-sm">
                  ← Back
                </button>
              )}
              <button type="submit" disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account…</>
                ) : step < 3 ? 'Continue →' : '🌱 Create Account'}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-green-400 hover:text-green-300 font-medium transition">Sign in</Link>
        </p>
        <p className="text-center text-xs text-gray-600 mt-3">
          © {new Date().getFullYear()} AgroVision AI · Empowering Indian Farmers
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
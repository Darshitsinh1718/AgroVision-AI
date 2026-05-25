// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import DashboardLayout from '@/components/layout/DashboardLayout'
// import HomePage from '@/pages/HomePage'
// import CropRecommendPage from '@/pages/CropRecommendPage'
// import DiagnosisPage from '@/pages/DiagnosisPage'
// import WeatherPage from '@/pages/WeatherPage'
// import MarketPage from '@/pages/MarketPage'
// import SchemesPage from '@/pages/SchemesPage'
// import AnalyticsPage from '@/pages/AnalyticsPage'
// import SettingsPage from '@/pages/SettingsPage'

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* All dashboard routes share the DashboardLayout */}
//         <Route path="/" element={<DashboardLayout />}>
//           <Route index element={<HomePage />} />
//           <Route path="recommend"  element={<CropRecommendPage />} />
//           <Route path="diagnosis"  element={<DiagnosisPage />} />
//           <Route path="weather"    element={<WeatherPage />} />
//           <Route path="market"     element={<MarketPage />} />
//           <Route path="schemes"    element={<SchemesPage />} />
//           <Route path="analytics"  element={<AnalyticsPage />} />
//           <Route path="settings"   element={<SettingsPage />} />
//           {/* Catch-all redirect */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   )
// }

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';

// Auth pages (public)
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

// App pages (protected)
import HomePage from './pages/HomePage.jsx';
import WeatherPage from './pages/WeatherPage.jsx';
import DiagnosisPage from './pages/DiagnosisPage.jsx';
import MarketPage from './pages/MarketPage.jsx';
import CropRecommendPage from './pages/CropRecommendPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ── Public auth routes ── */}
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* ── Protected dashboard routes ── */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="weather"    element={<WeatherPage />} />
            <Route path="diagnosis"  element={<DiagnosisPage />} />
            <Route path="market"     element={<MarketPage />} />
            <Route path="recommend"  element={<CropRecommendPage />} />
            <Route path="settings"   element={<SettingsPage />} />
          </Route>

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
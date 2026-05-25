import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setLoggingOut(false);
      setShowDropdown(false);
    }
  };

  // Initials avatar from farmer name
  const initials = user?.farmerName
    ? user.farmerName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header className="h-16 bg-gray-900/95 backdrop-blur border-b border-gray-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left: hamburger (mobile) + brand */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 text-white font-bold tracking-tight">
          <div className="w-7 h-7 rounded-lg bg-green-500/20 border border-green-500/40 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3C7 3 3 7.5 3 12c0 2.5 1 4.8 2.6 6.4M12 3c5 0 9 4.5 9 9 0 2.5-1 4.8-2.6 6.4M12 3v18M3 12h18" />
            </svg>
          </div>
          <span className="hidden sm:block">
            AgroVision <span className="text-green-400">AI</span>
          </span>
        </Link>
      </div>

      {/* Right: farmer info + dropdown */}
      <div className="flex items-center gap-3 relative">
        {/* Greeting — hidden on very small screens */}
        {user && (
          <span className="hidden md:block text-sm text-gray-400">
            Namaste,{' '}
            <span className="text-green-400 font-medium">{user.farmerName?.split(' ')[0]}</span>
          </span>
        )}

        {/* Avatar button */}
        <button
          onClick={() => setShowDropdown((v) => !v)}
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-800 transition group"
          aria-label="User menu"
        >
          <div className="w-8 h-8 rounded-full bg-green-600/20 border border-green-600/40 flex items-center justify-center text-xs font-bold text-green-400">
            {initials}
          </div>
          <svg className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
            <div className="absolute right-0 top-full mt-2 w-60 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-20 overflow-hidden">
              {/* User info header */}
              <div className="px-4 py-3.5 border-b border-gray-800">
                <p className="text-sm font-semibold text-white">{user?.farmerName || 'Farmer'}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                {user?.primaryCrop && (
                  <span className="inline-block mt-1.5 text-xs bg-green-900/40 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full">
                    🌱 {user.primaryCrop}
                  </span>
                )}
              </div>

              {/* Menu items */}
              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition disabled:opacity-50"
                >
                  {loggingOut ? (
                    <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  )}
                  {loggingOut ? 'Signing out…' : 'Sign out'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
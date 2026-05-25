# 🌿 AgroVision AI — Frontend

> Intelligent crop management and disease detection dashboard for modern farmers.
> Built with React + Vite + Tailwind CSS.

---

## 📁 Project Structure

```
agrovision-ai/
├── public/
│   └── favicon.svg                  # SVG leaf icon
├── src/
│   ├── assets/                      # Images, icons (add as needed)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.jsx  # Root layout: Navbar + Sidebar + <Outlet>
│   │   │   ├── Navbar.jsx           # Fixed top bar with search, notifications, user
│   │   │   └── Sidebar.jsx          # Fixed left nav with route links + field stats
│   │   └── ui/
│   │       ├── Button.jsx           # Reusable button — primary / secondary / ghost / danger
│   │       ├── Card.jsx             # Card, StatCard, FeatureCard, ActivityItem
│   │       ├── PageHeader.jsx       # Consistent page title + subtitle + action slot
│   │       └── Skeleton.jsx         # Loading skeletons for all card types
│   ├── data/
│   │   └── navigation.js            # All nav items — single source of truth
│   ├── hooks/
│   │   └── useSidebar.js            # Sidebar open/close state + mobile detection
│   ├── pages/
│   │   ├── HomePage.jsx             # Dashboard home — hero, stats, features, chart, activity
│   │   ├── CropRecommendPage.jsx    # Soil input form + recommendation result
│   │   ├── DiagnosisPage.jsx        # Image upload UI for disease detection
│   │   ├── WeatherPage.jsx          # 7-day forecast + current conditions
│   │   ├── MarketPage.jsx           # Live Mandi price table
│   │   ├── AnalyticsPage.jsx        # Yield analytics (stub)
│   │   └── SettingsPage.jsx         # Farm profile + API key settings
│   ├── utils/
│   │   └── cn.js                    # clsx wrapper for conditional class merging
│   ├── App.jsx                      # React Router setup — all routes
│   ├── index.css                    # Tailwind directives + custom CSS
│   └── main.jsx                     # ReactDOM.createRoot entry
├── index.html                       # HTML shell with Google Fonts
├── package.json
├── postcss.config.js
├── tailwind.config.js               # Custom earth/agriculture theme
└── vite.config.js
```

---

## ⚡ Quick Start

### 1. Clone and install

```bash
# Clone the project
git clone <your-repo-url>
cd agrovision-ai

# Install dependencies
npm install
```

### 2. Start dev server

```bash
npm run dev
# Open http://localhost:5173
```

### 3. Build for production

```bash
npm run build
npm run preview   # Preview the production build locally
```

---

## 🎨 Design System

### Color Palette (defined in `tailwind.config.js`)

| Token | Purpose | Key shades |
|-------|---------|-----------|
| `leaf` | Primary green — interactive elements, active states | `leaf-400` accent, `leaf-600` primary |
| `harvest` | Amber — warnings, badges, featured items | `harvest-400` accent |
| `soil` | Earth brown — decorative accents | — |
| `stone` | Neutral surface grays | `stone-900` cards, `stone-950` bg |
| `sky` | Info / weather | `sky-400` |

### Typography

- **Display:** `DM Serif Display` — headings, hero text
- **Body:** `DM Sans` — all UI text
- **Mono:** `JetBrains Mono` — values, badges, timestamps, code

### Component Classes (in `index.css`)

| Class | What it does |
|-------|-------------|
| `.skeleton` | Shimmer loading skeleton |
| `.glass-card` | Glassmorphism card with backdrop blur |
| `.glow-border` | Border glows green on hover |
| `.stat-pill` | Small badge/pill for labels |
| `.feature-badge` | Uppercase feature tag |
| `.grain-overlay` | Subtle noise texture overlay |

---

## 🧩 Adding New Pages

1. Create `src/pages/YourPage.jsx`
2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="your-path" element={<YourPage />} />
   ```
3. Add nav item in `src/data/navigation.js`:
   ```js
   { id: 'your-id', label: 'Your Page', path: '/your-path', icon: 'IconName', description: '...' }
   ```

---

## 🔌 Connecting the Backend

Each page stub is ready for API integration:

```jsx
// Replace the mock data at the top of any page with:
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch('/api/your-endpoint')
    .then(r => r.json())
    .then(d => { setData(d); setLoading(false) })
    .catch(() => setLoading(false))
}, [])

if (loading) return <YourPageSkeleton />
```

### API endpoints to connect (backend tasks):

| Page | Endpoint | Method |
|------|---------|--------|
| CropRecommendPage | `/api/recommend` | POST |
| DiagnosisPage | `/api/diagnose` | POST (multipart) |
| WeatherPage | `/api/weather?lat=&lon=` | GET |
| MarketPage | `/api/market-prices` | GET |
| AnalyticsPage | `/api/analytics/yield` | GET |

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 768px | Single column, sidebar hidden, hamburger menu |
| Tablet | 768px–1024px | Sidebar overlay, 2-col grids |
| Desktop | > 1024px | Persistent sidebar, full 3-4 col layouts |

---

## 🚀 Hackathon Checklist

- [x] React 18 + Vite 5
- [x] Tailwind CSS v3 with custom agriculture theme
- [x] React Router v6 with all routes
- [x] Responsive layout (mobile, tablet, desktop)
- [x] Navbar with notifications, search, user menu
- [x] Sidebar with live field conditions widget
- [x] Homepage with hero, stats, features, chart, activity feed
- [x] Crop Advisor page with full input form
- [x] Disease Scanner with drag-and-drop image upload
- [x] Weather, Market, Analytics, Settings pages
- [x] Loading skeletons for all card types
- [x] Reusable component library (Button, Card, StatCard, FeatureCard, etc.)
- [x] Animation system (slide-up, fade-in, shimmer, grow)
- [x] Dark theme with grain texture
- [ ] Connect Django/Flask backend
- [ ] Real OpenWeatherMap integration
- [ ] CNN model for disease detection

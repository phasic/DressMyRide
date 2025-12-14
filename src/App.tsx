import { useState, useEffect } from 'react';
import { Page, Location, RideConfig, WeatherSummary, ClothingRecommendation } from './types';
import { Home } from './pages/Home';
import { RideSetup } from './pages/RideSetup';
import { Recommendation } from './pages/Recommendation';
import { Settings } from './pages/Settings';
import { ClothingGuide } from './pages/ClothingGuide';
import { About } from './pages/About';
import { Welcome } from './pages/Welcome';
import { WardrobeManagement } from './pages/WardrobeManagement';
import { BottomTabBar } from './components/BottomTabBar';
import { InstallPrompt } from './components/InstallPrompt';
import { fetchWeatherForecast } from './services/weatherService';
import { recommendClothing } from './logic/clothingEngine';
import { storage } from './utils/storage';
import { generateDemoWeather } from './utils/demoWeather';
import './App.css';

function App() {
  const [page, setPage] = useState<Page>(() => {
    // Check if user has seen welcome screen
    if (!storage.getWelcomeSeen()) {
      return 'welcome';
    }
    return 'home';
  });
  const [location, setLocation] = useState<Location | null>(null);
  const [config, setConfig] = useState<RideConfig | null>(null);
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [recommendation, setRecommendation] = useState<ClothingRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherOverride, setWeatherOverride] = useState<Partial<WeatherSummary> | null>(null);
  const [forceShowInstallPrompt, setForceShowInstallPrompt] = useState(false);
  const [showFloatingActions, setShowFloatingActions] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll for floating actions visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // Always show at top
        setShowFloatingActions(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide
        setShowFloatingActions(false);
      } else {
        // Scrolling up - show
        setShowFloatingActions(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Initialize theme on app load
  useEffect(() => {
    const theme = storage.getTheme();
    const root = document.documentElement;
    
    if (theme === 'system') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
      root.classList.remove('light');
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches);
        root.classList.remove('light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Use manual selection
      root.classList.remove('dark', 'light');
      root.classList.add(theme);
    }
  }, []);

  const handleRideConfig = async (loc: Location, rideConfig: RideConfig) => {
    setLoading(true);
    setError(null);
    setLocation(loc);
    setConfig(rideConfig);

    try {
      let weatherData: WeatherSummary;
      
      // Use demo mode if enabled
      if (storage.getDemoMode()) {
        weatherData = generateDemoWeather(rideConfig.durationHours);
      } else {
        weatherData = await fetchWeatherForecast(loc, rideConfig);
      }
      
      // Apply weather override if in dev mode
      if (weatherOverride) {
        weatherData = { ...weatherData, ...weatherOverride };
      }
      
      const clothingRec = recommendClothing(weatherData, rideConfig);

      setWeather(weatherData);
      setRecommendation(clothingRec);
      setPage('recommendation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleNewRecommendation = () => {
    setPage('setup');
    setLocation(null);
    setConfig(null);
    setWeather(null);
    setRecommendation(null);
    setError(null);
  };

  return (
    <div className="app">
      {page !== 'welcome' && page !== 'settings' && page !== 'about' && (
      <div className={`floating-header-actions ${showFloatingActions ? 'visible' : 'hidden'}`}>
        {page === 'guide' && (
          <button
            className="btn-icon floating-action"
            onClick={() => {
              // Toggle edit mode - will be handled by ClothingGuide component
              const event = new CustomEvent('toggleWardrobeEdit');
              window.dispatchEvent(event);
            }}
            aria-label="Edit Wardrobe"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74169 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4584 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.5 18.3333H17.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <button
          className="btn-icon floating-action"
          onClick={() => setPage('settings')}
          aria-label="Settings"
        >
          <img
            src={`${import.meta.env.BASE_URL}settings.png`}
            alt="Settings"
            className="settings-icon"
          />
        </button>
      </div>
      )}

      <main>
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {!loading && page === 'welcome' && (
          <Welcome
            onGetStarted={() => setPage('settings')}
            onTryDemo={() => setPage('home')}
          />
        )}

            {!loading && page === 'home' && (
              <Home
                onLocationFound={() => setPage('setup')}
                onManualInput={() => setPage('setup')}
                onQuickRecommendation={(loc, weather, rec, cfg) => {
                  setLocation(loc);
                  setWeather(weather);
                  setRecommendation(rec);
                  setConfig(cfg);
                }}
                onNavigateToWardrobe={() => setPage('guide')}
                weatherOverride={weatherOverride}
              />
            )}

        {!loading && page === 'setup' && (
          <RideSetup
            onContinue={handleRideConfig}
          />
        )}

        {!loading && page === 'recommendation' && weather && recommendation && config && location && (
          <Recommendation
            recommendation={recommendation}
            weather={weather}
            config={config}
            location={location}
            onBack={handleNewRecommendation}
          />
        )}

        {!loading && page === 'settings' && (
          <Settings 
            onBack={() => setPage('home')} 
            onAbout={() => setPage('about')}
            onShowInstallPrompt={setForceShowInstallPrompt}
            onWeatherOverride={setWeatherOverride}
          />
        )}

        {!loading && page === 'about' && (
          <About onBack={() => setPage('settings')} />
        )}

        {!loading && page === 'wardrobes' && (
          <WardrobeManagement onBack={() => setPage('guide')} />
        )}

            {!loading && page === 'guide' && (
              <ClothingGuide />
            )}
          </main>

          {(page === 'home' || page === 'setup' || page === 'guide' || page === 'recommendation') && (
            <BottomTabBar
              currentPage={page}
              onHome={() => setPage('home')}
              onCustom={() => setPage('setup')}
              onGuide={() => setPage('guide')}
              customLoading={loading && page === 'setup'}
            />
          )}

          {page !== 'welcome' && (
            <InstallPrompt 
              forceShow={forceShowInstallPrompt}
              onForceShowChange={setForceShowInstallPrompt}
            />
          )}
        </div>
      );
    }

    export default App;


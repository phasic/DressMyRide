import { Page } from '../types';

interface BottomTabBarProps {
  currentPage: Page;
  onHome: () => void;
  onCustom: () => void;
  onGuide: () => void;
  customLoading?: boolean;
}

export function BottomTabBar({ currentPage, onHome, onCustom, onGuide, customLoading = false }: BottomTabBarProps) {
  return (
    <div className="ios-tab-bar">
      <button
        className={`ios-tab-item ${currentPage === 'home' ? 'active' : ''}`}
        onClick={onHome}
      >
        <div 
          className="ios-tab-icon-wrapper"
          style={currentPage === 'home' ? {
            '--icon-mask-url': `url(${import.meta.env.BASE_URL}flash.png)`
          } as React.CSSProperties : undefined}
        >
          <img 
            src={`${import.meta.env.BASE_URL}flash.png`} 
            alt="Quick view" 
            className="ios-tab-icon"
          />
        </div>
        <span className="ios-tab-label">Quick view</span>
      </button>
      <button
        className={`ios-tab-item ${currentPage === 'setup' ? 'active' : ''}`}
        onClick={onCustom}
        disabled={customLoading}
      >
        <div 
          className="ios-tab-icon-wrapper"
          style={currentPage === 'setup' ? {
            '--icon-mask-url': `url(${import.meta.env.BASE_URL}equalizer.png)`
          } as React.CSSProperties : undefined}
        >
          <img 
            src={`${import.meta.env.BASE_URL}equalizer.png`} 
            alt="Custom" 
            className="ios-tab-icon"
          />
        </div>
        <span className="ios-tab-label">{customLoading ? 'Loading...' : 'Custom'}</span>
      </button>
      <button
        className={`ios-tab-item ${currentPage === 'guide' ? 'active' : ''}`}
        onClick={onGuide}
      >
        <div 
          className="ios-tab-icon-wrapper"
          style={currentPage === 'guide' ? {
            '--icon-mask-url': `url(${import.meta.env.BASE_URL}wardrobe.png)`
          } as React.CSSProperties : undefined}
        >
          <img 
            src={`${import.meta.env.BASE_URL}wardrobe.png`} 
            alt="Wardrobe" 
            className="ios-tab-icon"
          />
        </div>
        <span className="ios-tab-label">Wardrobe</span>
      </button>
    </div>
  );
}


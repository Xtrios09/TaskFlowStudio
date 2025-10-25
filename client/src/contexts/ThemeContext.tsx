import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark-gradient' | 'minimalist-light' | 'cyberpunk-neon' | 'studio-professional';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('taskflow-theme');
    return (saved as Theme) || 'dark-gradient';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-minimalist-light', 'theme-cyberpunk-neon', 'theme-studio-professional');
    
    // Add the current theme class if not dark-gradient (which is default in :root)
    if (theme !== 'dark-gradient') {
      root.classList.add(`theme-${theme}`);
    }
    
    localStorage.setItem('taskflow-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export const themes: { value: Theme; label: string; description: string }[] = [
  {
    value: 'dark-gradient',
    label: 'Dark Gradient',
    description: 'Bold purple gradients with deep backgrounds',
  },
  {
    value: 'minimalist-light',
    label: 'Minimalist Light',
    description: 'Clean and professional light theme',
  },
  {
    value: 'cyberpunk-neon',
    label: 'Cyberpunk Neon',
    description: 'Electric pink and cyan with neon glow',
  },
  {
    value: 'studio-professional',
    label: 'Studio Professional',
    description: 'Refined green accents on neutral tones',
  },
];

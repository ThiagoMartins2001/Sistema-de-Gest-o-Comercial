'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export type Theme = 'light' | 'dark' | 'protanopia' | 'deuteranopia' | 'tritanopia';

export const themeOptions: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Claro', icon: 'light_mode' },
    { value: 'dark', label: 'Escuro', icon: 'dark_mode' },
    { value: 'protanopia', label: 'Protanopia', icon: 'visibility' },
    { value: 'deuteranopia', label: 'Deuteranopia', icon: 'visibility' },
    { value: 'tritanopia', label: 'Tritanopia', icon: 'visibility' },
];

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light');

    useEffect(() => {
        const savedTheme = Cookies.get('theme') as Theme | undefined;
        if (savedTheme && themeOptions.some(opt => opt.value === savedTheme)) {
            setThemeState(savedTheme);
            applyTheme(savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setThemeState('dark');
            applyTheme('dark');
        }
    }, []);

    const applyTheme = (newTheme: Theme) => {
        // Remove all theme classes
        document.documentElement.classList.remove('dark', 'protanopia', 'deuteranopia', 'tritanopia');
        // Add new theme class (except for 'light' which is the default)
        if (newTheme !== 'light') {
            document.documentElement.classList.add(newTheme);
        }
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        Cookies.set('theme', newTheme, { expires: 365 });
        applyTheme(newTheme);
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

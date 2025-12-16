'use client';

import { useState } from 'react';
import { useTheme, themeOptions } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FloatingSettings() {
    const [isOpen, setIsOpen] = useState(false);
    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const { theme, setTheme } = useTheme();
    const { language, setLanguage } = useLanguage();

    const getCurrentFlag = () => {
        switch (language) {
            case 'pt': return 'https://flagcdn.com/br.svg';
            case 'en': return 'https://flagcdn.com/us.svg';
            case 'es': return 'https://flagcdn.com/es.svg';
            default: return 'https://flagcdn.com/br.svg';
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 rounded-full bg-primary hover:bg-primary-hover text-white shadow-lg flex items-center justify-center transition-all hover:scale-105"
                title="Configurações de exibição"
            >
                <span className="material-symbols-outlined">{isOpen ? 'close' : 'settings'}</span>
            </button>

            {/* Settings Panel */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 bg-surface-white border border-border-light rounded-xl shadow-2xl p-4 min-w-[200px] flex flex-col gap-3">
                    <p className="text-sm font-bold text-text-main mb-1">Preferências</p>

                    {/* Theme Selector */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowThemeMenu(!showThemeMenu); setShowLangMenu(false); }}
                            className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-background-light hover:bg-border-light transition-colors text-text-secondary text-sm"
                        >
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">
                                    {themeOptions.find(opt => opt.value === theme)?.icon || 'light_mode'}
                                </span>
                                <span>{themeOptions.find(opt => opt.value === theme)?.label || 'Tema'}</span>
                            </span>
                            <span className="material-symbols-outlined text-[16px]">expand_more</span>
                        </button>
                        {showThemeMenu && (
                            <div className="absolute bottom-full mb-2 left-0 right-0 bg-surface-white border border-border-light rounded-lg shadow-xl py-1 z-50">
                                {themeOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setTheme(opt.value); setShowThemeMenu(false); }}
                                        className={`flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-background-light ${theme === opt.value ? 'bg-primary/10 text-primary' : 'text-text-main'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">{opt.icon}</span>
                                        <span>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Language Selector */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowLangMenu(!showLangMenu); setShowThemeMenu(false); }}
                            className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-background-light hover:bg-border-light transition-colors text-text-secondary text-sm"
                        >
                            <span className="flex items-center gap-2">
                                <img src={getCurrentFlag()} alt={language.toUpperCase()} className="w-5 h-3.5 rounded-sm object-cover" />
                                <span>{language === 'pt' ? 'Português' : language === 'en' ? 'English' : 'Español'}</span>
                            </span>
                            <span className="material-symbols-outlined text-[16px]">expand_more</span>
                        </button>
                        {showLangMenu && (
                            <div className="absolute bottom-full mb-2 left-0 right-0 bg-surface-white border border-border-light rounded-lg shadow-xl py-1 z-50">
                                <button onClick={() => { setLanguage('pt'); setShowLangMenu(false); }} className={`flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-background-light ${language === 'pt' ? 'bg-primary/10 text-primary' : 'text-text-main'}`}>
                                    <img src="https://flagcdn.com/br.svg" alt="BR" className="w-5 h-3.5 rounded-sm object-cover" />
                                    <span>Português</span>
                                </button>
                                <button onClick={() => { setLanguage('en'); setShowLangMenu(false); }} className={`flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-background-light ${language === 'en' ? 'bg-primary/10 text-primary' : 'text-text-main'}`}>
                                    <img src="https://flagcdn.com/us.svg" alt="US" className="w-5 h-3.5 rounded-sm object-cover" />
                                    <span>English</span>
                                </button>
                                <button onClick={() => { setLanguage('es'); setShowLangMenu(false); }} className={`flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-background-light ${language === 'es' ? 'bg-primary/10 text-primary' : 'text-text-main'}`}>
                                    <img src="https://flagcdn.com/es.svg" alt="ES" className="w-5 h-3.5 rounded-sm object-cover" />
                                    <span>Español</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

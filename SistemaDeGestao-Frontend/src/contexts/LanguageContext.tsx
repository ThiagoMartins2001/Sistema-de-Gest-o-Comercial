'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { pt, en, es } from '@/locales';

type Language = 'pt' | 'en' | 'es';
type Translations = typeof pt;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translationsMap = {
    pt,
    en,
    es
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('pt');

    useEffect(() => {
        const savedLang = Cookies.get('language') as Language | undefined;
        if (savedLang && ['pt', 'en', 'es'].includes(savedLang)) {
            setLanguageState(savedLang);
        } else {
            // Simple browser detection
            const browserLang = navigator.language.split('-')[0];
            if (browserLang === 'en') setLanguageState('en');
            else if (browserLang === 'es') setLanguageState('es');
            else setLanguageState('pt');
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        Cookies.set('language', lang, { expires: 365 });
    };

    const t = translationsMap[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

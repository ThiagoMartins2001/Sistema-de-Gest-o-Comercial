'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authService } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { useTheme, themeOptions } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

import ProductModal from '@/components/ProductModal';
import RecipeModal from '@/components/RecipeModal';
import ProductionModal from '@/components/ProductionModal';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [userInitial, setUserInitial] = useState('U');
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [showThemeMenu, setShowThemeMenu] = useState(false);

    // Modal State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
    const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);

    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    useEffect(() => {
        // Check auth and role
        const checkAuth = async () => {
            try {
                // Verify with backend me endpoint to be sure of role
                // For now, simpler optimization: trust cookie or local storage if available, 
                // but strictly we should fetch 'me'. 
                // Assuming authService stores basic info. If not, we fetch.
                const userDetails = await authService.getMe();
                setIsAdmin(userDetails.authorities?.includes('ROLE_ADMIN') || false);
                setUserInitial(userDetails.username.charAt(0).toUpperCase());
            } catch (e) {
                console.error("Auth check failed", e);
                router.push('/login');
            }
        };
        checkAuth();
    }, [router]);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display text-text-main">
            {/* Header / Navigation */}
            <header className="bg-inventory-bg shadow-lg z-50">
                <div className="layout-container flex w-full flex-col">
                    <div className="flex items-center justify-between whitespace-nowrap px-6 py-4 lg:px-10">
                        <div className="flex items-center gap-8">
                            <Link href="/dashboard" className="flex items-center gap-3 text-white group">
                                <div className="flex items-center justify-center rounded bg-white/10 p-2 group-hover:bg-white/20 transition-colors">
                                    <span className="material-symbols-outlined text-white text-2xl">inventory_2</span>
                                </div>
                                <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Gestão Inteligente</h2>
                            </Link>
                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center gap-1">
                                {/* Changed from Link to Button to open Modal */}
                                <button
                                    onClick={() => setIsProductModalOpen(true)}
                                    className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium leading-normal transition-all"
                                >
                                    Produtos
                                </button>
                                <button
                                    onClick={() => setIsRecipeModalOpen(true)}
                                    className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium leading-normal transition-all"
                                >
                                    Receitas
                                </button>
                                <button
                                    onClick={() => setIsProductionModalOpen(true)}
                                    className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium leading-normal transition-all"
                                >
                                    Produção
                                </button>
                                {isAdmin && (
                                    <Link href="/dashboard/users" className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium leading-normal transition-all">
                                        Usuários
                                    </Link>
                                )}
                            </nav>
                        </div>
                        <div className="flex flex-1 justify-end gap-6 items-center">
                            <div className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
                                <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-white/10 border border-white/20 focus-within:border-white/50 transition-colors">
                                    <div className="text-white/70 flex items-center justify-center pl-4 rounded-l-lg border-r-0">
                                        <span className="material-symbols-outlined text-[20px]">search</span>
                                    </div>
                                    <input
                                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-0 border-none bg-transparent h-full px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                                        placeholder="Buscar..."
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {/* Theme Switcher - Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowThemeMenu(!showThemeMenu)}
                                        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition-colors"
                                        title="Tema"
                                    >
                                        <span className="material-symbols-outlined text-white/80 text-[20px]">
                                            {themeOptions.find(opt => opt.value === theme)?.icon || 'light_mode'}
                                        </span>
                                        <span className="material-symbols-outlined text-white/80 text-[16px]">expand_more</span>
                                    </button>
                                    {showThemeMenu && (
                                        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-1 min-w-[160px] z-50">
                                            {themeOptions.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => { setTheme(opt.value); setShowThemeMenu(false); }}
                                                    className={`flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 ${theme === opt.value ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                                                >
                                                    <span className="material-symbols-outlined text-[18px] text-gray-600 dark:text-gray-300">{opt.icon}</span>
                                                    <span className="text-gray-800 dark:text-gray-200">{opt.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Language Switcher - Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowLangMenu(!showLangMenu)}
                                        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition-colors"
                                        title="Idioma"
                                    >
                                        <img
                                            src={language === 'pt' ? 'https://flagcdn.com/br.svg' : language === 'en' ? 'https://flagcdn.com/us.svg' : 'https://flagcdn.com/es.svg'}
                                            alt={language.toUpperCase()}
                                            className="w-6 h-4 rounded-sm object-cover"
                                        />
                                        <span className="material-symbols-outlined text-white/80 text-[16px]">expand_more</span>
                                    </button>
                                    {showLangMenu && (
                                        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-1 min-w-[140px] z-50">
                                            <button onClick={() => { setLanguage('pt'); setShowLangMenu(false); }} className={`flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 ${language === 'pt' ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                                                <img src="https://flagcdn.com/br.svg" alt="BR" className="w-5 h-3.5 rounded-sm object-cover" />
                                                <span className="text-gray-800 dark:text-gray-200">Português</span>
                                            </button>
                                            <button onClick={() => { setLanguage('en'); setShowLangMenu(false); }} className={`flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 ${language === 'en' ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                                                <img src="https://flagcdn.com/us.svg" alt="US" className="w-5 h-3.5 rounded-sm object-cover" />
                                                <span className="text-gray-800 dark:text-gray-200">English</span>
                                            </button>
                                            <button onClick={() => { setLanguage('es'); setShowLangMenu(false); }} className={`flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 ${language === 'es' ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                                                <img src="https://flagcdn.com/es.svg" alt="ES" className="w-5 h-3.5 rounded-sm object-cover" />
                                                <span className="text-gray-800 dark:text-gray-200">Español</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button className="relative text-white/80 hover:text-white transition-colors p-1">
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                                </button>
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold border-2 border-white/20 cursor-pointer hover:border-white transition-colors">
                                    {userInitial}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Mobile Navigation */}
                    <div className="md:hidden flex px-6 pb-4 gap-2 overflow-x-auto scrollbar-hide">
                        {/* Changed from Link to Button to open Modal */}
                        <button
                            onClick={() => setIsProductModalOpen(true)}
                            className="text-white bg-white/10 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                        >
                            Produtos
                        </button>
                        <button
                            onClick={() => setIsRecipeModalOpen(true)}
                            className="text-white/70 hover:text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                        >
                            Receitas
                        </button>
                        <button
                            onClick={() => setIsProductionModalOpen(true)}
                            className="text-white/70 hover:text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                        >
                            Produção
                        </button>
                        {isAdmin && (
                            <Link href="/dashboard/users" className="text-white/70 hover:text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
                                Usuários
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Rendered Here */}
            {children}

            {/* Product Modal */}
            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
            />
            {/* Recipe Modal */}
            <RecipeModal
                isOpen={isRecipeModalOpen}
                onClose={() => setIsRecipeModalOpen(false)}
            />
            {/* Production Modal */}
            <ProductionModal
                isOpen={isProductionModalOpen}
                onClose={() => setIsProductionModalOpen(false)}
            />
        </div>
    );
}

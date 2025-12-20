'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { dashboardService, DashboardStats } from '@/services/dashboard.service';
import { authService } from '@/services/auth';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DashboardPage() {
    const { t } = useLanguage();
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        totalStockValue: 0,
        totalRecipes: 0,
        totalProductions: 0,
        totalUsers: 0
    });
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const [financials, setFinancials] = useState({
        totalProfit: 0,
        totalCost: 0,
        productionCount: 0,
        avgProfitPerProduction: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, financialData] = await Promise.all([
                    dashboardService.getStats(),
                    dashboardService.getFinancials()
                ]);

                setStats(statsData);
                setFinancials(financialData);

                // Check admin status for Users card
                const userDetails = await authService.getMe();
                setIsAdmin(userDetails.authorities?.includes('ROLE_ADMIN') || false);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const managementModules = [
        {
            title: t.dashboard.modules.products.title,
            description: t.dashboard.modules.products.description,
            icon: "inventory_2",
            href: "/dashboard/products",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            count: `${stats.totalProducts} ${t.dashboard.modules.products.unit}`,
            subtext: `${t.dashboard.modules.products.stock_value}: ${formatCurrency(stats.totalStockValue)}`
        },
        {
            title: t.dashboard.modules.recipes.title,
            description: t.dashboard.modules.recipes.description,
            icon: "menu_book",
            href: "/dashboard/recipes",
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-900/20",
            count: `${stats.totalRecipes} ${t.dashboard.modules.recipes.unit}`
        },
        {
            title: t.dashboard.modules.production.title,
            description: t.dashboard.modules.production.description,
            icon: "precision_manufacturing",
            href: "/dashboard/production",
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            count: `${stats.totalProductions} ${t.dashboard.modules.production.unit}`
        },
        // Only show Users card if Admin
        ...(isAdmin ? [{
            title: t.dashboard.modules.users.title,
            description: t.dashboard.modules.users.description,
            icon: "group",
            href: "/dashboard/users",
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-900/20",
            count: `${stats.totalUsers} ${t.dashboard.modules.users.unit}`
        }] : [])
    ];

    if (loading) {
        return (
            <main className="flex flex-1 justify-center py-6 px-4 md:px-8 lg:px-40 min-h-screen items-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
                    <p className="text-text-secondary">{t.common.loading}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-1 justify-center py-6 px-4 md:px-8 lg:px-40">
            <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8">

                {/* Page Heading */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-text-main text-3xl md:text-4xl font-bold leading-tight tracking-tight">{t.dashboard.title}</h1>
                    <p className="text-text-secondary text-base font-normal">{t.dashboard.subtitle}</p>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface-white p-6 rounded-xl border border-border-light shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-green-50 text-green-600">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <span className="text-text-secondary font-medium">Lucro Total Estimado</span>
                        </div>
                        <div className="text-2xl font-bold text-text-main">{formatCurrency(financials.totalProfit)}</div>
                    </div>
                    <div className="bg-surface-white p-6 rounded-xl border border-border-light shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                <span className="material-symbols-outlined">trending_up</span>
                            </div>
                            <span className="text-text-secondary font-medium">Média de Lucro / Produção</span>
                        </div>
                        <div className="text-2xl font-bold text-text-main">{formatCurrency(financials.avgProfitPerProduction)}</div>
                    </div>
                    <div className="bg-surface-white p-6 rounded-xl border border-border-light shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                                <span className="material-symbols-outlined">monetization_on</span>
                            </div>
                            <span className="text-text-secondary font-medium">Custo Total Produção</span>
                        </div>
                        <div className="text-2xl font-bold text-text-main">{formatCurrency(financials.totalCost)}</div>
                    </div>
                </div>

                {/* Management Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {managementModules.map((module) => (
                        <Link
                            key={module.title}
                            href={module.href}
                            className="flex flex-col gap-4 rounded-xl p-6 bg-surface-white border border-border-light shadow-sm hover:shadow-md hover:border-primary/50 transition-all group"
                        >
                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-lg ${module.bg} ${module.color}`}>
                                    <span className="material-symbols-outlined text-3xl">{module.icon}</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">arrow_forward</span>
                            </div>

                            <div>
                                <h3 className="text-text-main text-xl font-bold mb-1 group-hover:text-primary transition-colors">{module.title}</h3>
                                <p className="text-text-secondary text-sm">{module.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl bg-surface-white border border-border-light shadow-sm p-6 mt-4">
                    <h3 className="text-text-main text-lg font-bold mb-4">{t.dashboard.quick_actions.title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="flex items-center justify-center gap-2 p-3 rounded-lg bg-background-light hover:bg-gray-100 dark:hover:bg-zinc-800 border border-border-light transition-colors text-text-secondary font-medium">
                            <span className="material-symbols-outlined text-primary">add</span>
                            {t.dashboard.quick_actions.new_product}
                        </button>
                        <button className="flex items-center justify-center gap-2 p-3 rounded-lg bg-background-light hover:bg-gray-100 dark:hover:bg-zinc-800 border border-border-light transition-colors text-text-secondary font-medium">
                            <span className="material-symbols-outlined text-primary">post_add</span>
                            {t.dashboard.quick_actions.new_recipe}
                        </button>
                        <button className="flex items-center justify-center gap-2 p-3 rounded-lg bg-background-light hover:bg-gray-100 dark:hover:bg-zinc-800 border border-border-light transition-colors text-text-secondary font-medium">
                            <span className="material-symbols-outlined text-primary">factory</span>
                            {t.dashboard.quick_actions.start_production}
                        </button>
                        {isAdmin && (
                            <button className="flex items-center justify-center gap-2 p-3 rounded-lg bg-background-light hover:bg-gray-100 dark:hover:bg-zinc-800 border border-border-light transition-colors text-text-secondary font-medium">
                                <span className="material-symbols-outlined text-primary">person_add</span>
                                {t.dashboard.quick_actions.invite_user}
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </main>
    );
}

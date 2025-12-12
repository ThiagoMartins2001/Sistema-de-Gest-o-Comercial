'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authService } from '@/services/auth';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchUser = async () => {
            try {
                const userData = await authService.getMe();
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch user', error);
                Cookies.remove('token');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = () => {
        Cookies.remove('token');
        router.push('/login');
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Carregando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                        Sair
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h2 className="text-xl font-semibold mb-2 text-gray-200">Informações do Usuário</h2>
                        <div className="text-gray-400 space-y-1">
                            <p><span className="text-gray-500">Usuário:</span> {user?.username}</p>
                            <p><span className="text-gray-500">Permissões:</span> {user?.authorities?.join(', ')}</p>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer group">
                        <h2 className="text-xl font-semibold mb-2 text-gray-200 group-hover:text-blue-400">Produtos</h2>
                        <p className="text-gray-400 text-sm">Gerencie o inventário de produtos.</p>
                        <a href="#" className="mt-4 inline-block text-blue-500 text-sm">Acessar &rarr;</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

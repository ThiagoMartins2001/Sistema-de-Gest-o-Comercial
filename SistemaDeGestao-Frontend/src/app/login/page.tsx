'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import Cookies from 'js-cookie';
import Link from 'next/link';
import FloatingSettings from '@/components/FloatingSettings';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await authService.login(username, password);
            if (data.token) {
                Cookies.set('token', data.token, { expires: 1 });
                router.push('/dashboard');
            } else {
                setError('Falha no login: Token não recebido.');
            }
        } catch (err: any) {
            console.error(err);
            setError('Credenciais inválidas ou erro no servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden font-display text-text-main antialiased selection:bg-primary selection:text-white bg-background-light">
            <div className="relative w-full h-64 lg:h-auto lg:w-1/2 flex-shrink-0 bg-inventory-bg overflow-hidden flex flex-col justify-between p-8 lg:p-16">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/4 overflow-hidden pointer-events-none">
                    <span className="material-symbols-outlined absolute text-blue-500/20 top-1/4 right-10" style={{ fontSize: '160px', transform: 'rotate(-10deg)' }}>inventory_2</span>
                    <span className="material-symbols-outlined absolute text-white/5 bottom-10 right-1/3" style={{ fontSize: '120px' }}>local_shipping</span>
                    <span className="material-symbols-outlined absolute text-blue-300/10 top-10 right-1/4" style={{ fontSize: '80px' }}>analytics</span>
                    <span className="material-symbols-outlined absolute text-white/5 top-1/2 left-10" style={{ fontSize: '64px', transform: 'rotate(15deg)' }}>qr_code_scanner</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#001d6c] via-transparent to-transparent"></div>
                <div className="relative z-10 mt-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-blue-600/20 p-2 rounded-lg backdrop-blur-sm border border-blue-400/30">
                            <span className="material-symbols-outlined text-white">warehouse</span>
                        </div>
                        <span className="text-blue-100 font-medium tracking-wide text-sm uppercase">Logística e Cadeia de Suprimentos</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">Controle total do seu estoque.</h2>
                    <p className="text-blue-100/80 text-lg max-w-md">Gerencie inventários, rastreie encomendas e otimize seus processos logísticos em uma única plataforma.</p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16 w-full lg:w-1/2 bg-surface-white">
                <div className="w-full max-w-[420px] flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>conveyor_belt</span>
                            <span className="text-xl font-bold tracking-tight text-text-main">Gestão Inteligente</span>
                        </div>
                        <h1 className="text-3xl font-bold text-text-main leading-tight">Bem-vindo</h1>
                        <p className="text-text-secondary">Entre com suas credenciais corporativas.</p>
                    </div>

                    {error && (
                        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg animate-pulse" role="alert">
                            <span className="font-bold mr-1">Erro!</span> {error}
                        </div>
                    )}

                    <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                        <div className="relative">
                            <input
                                id="username"
                                type="text"
                                className="floating-input block w-full border-b-2 border-border-light bg-transparent px-0 pt-4 pb-1 text-base text-text-main focus:border-primary focus:outline-none focus:ring-0 peer placeholder-transparent h-12"
                                placeholder="Nome de usuário"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                required
                            />
                            <label className="absolute left-0 top-4 origin-[0] -translate-y-0 scale-100 text-text-secondary duration-200 pointer-events-none" htmlFor="username">
                                Nome de usuário
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="floating-input block w-full border-b-2 border-border-light bg-transparent px-0 pt-4 pb-1 text-base text-text-main focus:border-primary focus:outline-none focus:ring-0 peer placeholder-transparent h-12 pr-10"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label className="absolute left-0 top-4 origin-[0] -translate-y-0 scale-100 text-text-secondary duration-200 pointer-events-none" htmlFor="password">
                                Senha
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-4 text-text-secondary hover:text-primary transition-colors focus:outline-none"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                    {showPassword ? 'visibility' : 'visibility_off'}
                                </span>
                            </button>
                        </div>

                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                                <span className="text-sm text-text-secondary">Lembrar acesso</span>
                            </label>
                            <a className="text-sm font-medium text-primary hover:text-primary-hover transition-colors" href="#">
                                Recuperar senha?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex w-full items-center justify-center rounded-lg bg-primary hover:bg-primary-hover py-3.5 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${loading ? 'opacity-80 cursor-wait' : ''}`}
                        >
                            <span className="text-base font-bold text-white">{loading ? 'Acessando...' : 'Acessar Painel'}</span>
                            {!loading && <span className="material-symbols-outlined ml-2 text-white" style={{ fontSize: '20px' }}>login</span>}
                        </button>
                    </form>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-border-light"></div>
                        <span className="flex-shrink-0 px-4 text-xs font-medium text-text-secondary uppercase">Ou acesse via SSO</span>
                        <div className="flex-grow border-t border-border-light"></div>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm text-text-secondary">
                            Ainda não tem conta?
                            <Link href="/register" className="font-bold text-primary hover:text-primary-hover transition-colors ml-1">
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <FloatingSettings />
        </div>
    );
}

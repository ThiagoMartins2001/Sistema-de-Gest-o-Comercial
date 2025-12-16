'use client';

import { useState } from 'react';
import Link from 'next/link';
import FloatingSettings from '@/components/FloatingSettings';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullname: '',
        age: '',
        phone: '',
        email: '',
        password: '',
        confirm_password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Register data:', formData);
        alert('Funcionalidade de cadastro em desenvolvimento. (Frontend Only)');
    };

    return (
        <div className="h-screen w-full flex flex-col lg:flex-row overflow-hidden font-display text-text-main antialiased selection:bg-primary selection:text-white bg-background-light">
            <div className="relative w-full h-64 lg:h-full lg:w-1/2 flex-shrink-0 bg-inventory-bg overflow-hidden flex flex-col justify-between p-8 lg:p-16">
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
                    <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">Comece a otimizar sua gestão hoje.</h2>
                    <p className="text-blue-100/80 text-lg max-w-md">Junte-se a milhares de empresas que transformaram sua logística com nossa plataforma.</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 w-full lg:w-1/2 bg-surface-white overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-[500px] flex flex-col gap-8 my-auto">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>conveyor_belt</span>
                            <span className="text-xl font-bold tracking-tight text-text-main">Gestão Inteligente</span>
                        </div>
                        <h1 className="text-3xl font-bold text-text-main leading-tight">Crie sua conta</h1>
                        <p className="text-text-secondary">Preencha os dados abaixo para começar.</p>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={handleRegister}>
                        <div className="relative">
                            <input
                                id="fullname"
                                type="text"
                                className="floating-input block w-full border-b-2 border-border-light bg-transparent px-0 pt-4 pb-1 text-base text-text-main focus:border-primary focus:outline-none focus:ring-0 peer placeholder-transparent h-12"
                                placeholder="Nome Completo"
                                value={formData.fullname}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                            <label className="absolute left-0 top-4 origin-[0] -translate-y-0 scale-100 text-text-secondary duration-200 pointer-events-none" htmlFor="fullname">
                                Nome completo
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="relative md:col-span-1">
                                <input
                                    id="age"
                                    type="number"
                                    min="18"
                                    className="floating-input block w-full border-b-2 border-border-light bg-transparent px-0 pt-4 pb-1 text-base text-text-main focus:border-primary focus:outline-none focus:ring-0 peer placeholder-transparent h-12"
                                    placeholder="Idade"
                                    value={formData.age}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                                <label className="absolute left-0 top-4 origin-[0] -translate-y-0 scale-100 text-text-secondary duration-200 pointer-events-none" htmlFor="age">
                                    Idade
                                </label>
                            </div>
                            <div className="relative md:col-span-2">
                                <input
                                    id="phone"
                                    type="tel"
                                    className="floating-input block w-full border-b-2 border-border-light bg-transparent px-0 pt-4 pb-1 text-base text-text-main focus:border-primary focus:outline-none focus:ring-0 peer placeholder-transparent h-12"
                                    placeholder="Número de celular"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                                <label className="absolute left-0 top-4 origin-[0] -translate-y-0 scale-100 text-text-secondary duration-200 pointer-events-none" htmlFor="phone">
                                    Número de celular
                                </label>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                className="floating-input block w-full border-b-2 border-border-light bg-transparent px-0 pt-4 pb-1 text-base text-text-main focus:border-primary focus:outline-none focus:ring-0 peer placeholder-transparent h-12"
                                placeholder="E-mail"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                            <label className="absolute left-0 top-4 origin-[0] -translate-y-0 scale-100 text-text-secondary duration-200 pointer-events-none" htmlFor="email">
                                Email
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    className="floating-input block w-full border-b-2 border-border-light bg-transparent px-0 pt-4 pb-1 text-base text-text-main focus:border-primary focus:outline-none focus:ring-0 peer placeholder-transparent h-12"
                                    placeholder="Senha"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <label className="absolute left-0 top-4 origin-[0] -translate-y-0 scale-100 text-text-secondary duration-200 pointer-events-none" htmlFor="password">
                                    Senha
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    id="confirm_password"
                                    type="password"
                                    className="floating-input block w-full border-b-2 border-border-light bg-transparent px-0 pt-4 pb-1 text-base text-text-main focus:border-primary focus:outline-none focus:ring-0 peer placeholder-transparent h-12"
                                    placeholder="Confirmar senha"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                />
                                <label className="absolute left-0 top-4 origin-[0] -translate-y-0 scale-100 text-text-secondary duration-200 pointer-events-none" htmlFor="confirm_password">
                                    Confirmar senha
                                </label>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center rounded-lg bg-primary hover:bg-primary-hover py-3.5 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group"
                            >
                                <span className="text-base font-bold text-white">Cadastrar</span>
                                <span className="material-symbols-outlined ml-2 text-white group-hover:translate-x-1 transition-transform" style={{ fontSize: '20px' }}>person_add</span>
                            </button>
                        </div>
                    </form>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-border-light"></div>
                        <span className="flex-shrink-0 px-4 text-xs font-medium text-text-secondary uppercase">Já possui uma conta?</span>
                        <div className="flex-grow border-t border-border-light"></div>
                    </div>

                    <div className="text-center">
                        <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-blue-50 px-6 py-2.5 text-sm font-bold text-primary hover:bg-blue-100 transition-colors w-full sm:w-auto">
                            Retornar ao Login
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>login</span>
                        </Link>
                    </div>
                </div>
            </div>
            <FloatingSettings />
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { productService, Product } from '@/services/product.service';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductModal({ isOpen, onClose }: ProductModalProps) {
    const { t } = useLanguage();
    // Controls the CSS transition state (0 -> 1)
    const [animate, setAnimate] = useState(false);
    // Controls whether the component is actually in the DOM (to allow exit animation)
    const [isVisible, setIsVisible] = useState(false);

    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Product>({
        nome: '',
        tipoControle: 'UNIT',
        unidadeMedida: 'UN',
        quantidadeInicial: 0,
        precoCompra: 0,
        precoVenda: 0
    });

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Double RAF ensures the browser has painted the initial 'scale-0' state
            // before we apply the 'scale-100' state, triggering the transition.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimate(true);
                });
            });
        } else {
            setAnimate(false);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantidadeInicial' ? parseFloat(value) : value
        }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Remove all non-digits
        const onlyDigits = value.replace(/\D/g, '');
        // Convert to float (cents)
        const floatValue = Number(onlyDigits) / 100;

        setFormData(prev => ({
            ...prev,
            [name]: floatValue
        }));
    };

    const formatCurrency = (value: number) => {
        // Handle 0 or NaN safely
        if (!value) return '0,00';
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await productService.create(formData);
            alert('Produto cadastrado com sucesso!');
            onClose();
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            alert('Erro ao cadastrar produto.');
        } finally {
            setLoading(false);
        }
    };

    // Only unmount when fully closed and invisible
    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-colors duration-700 ${animate ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}>
            <div
                className={`
                    relative bg-surface-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden
                    ${animate ? 'animate-explosion' : 'animate-implosion opacity-0'}
                `}
                style={{
                    transformOrigin: 'center center'
                }}
            >
                {/* Header */}
                <div className="bg-primary px-6 py-4 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined">inventory_2</span>
                        {t.dashboard.quick_actions?.new_product || 'Novo Produto'}
                    </h2>
                    <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-secondary mb-1">Nome do Produto</label>
                        <input
                            type="text"
                            name="nome"
                            required
                            className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                            placeholder="Ex: Farinha de Trigo"
                            value={formData.nome}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Control Type */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Tipo de Controle</label>
                        <select
                            name="tipoControle"
                            className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                            value={formData.tipoControle}
                            onChange={handleChange}
                        >
                            <option value="UNIT">Unitário</option>
                            <option value="WEIGHT">Peso (Kg)</option>
                            <option value="VOLUME">Volume (L)</option>
                        </select>
                    </div>

                    {/* Unit */}
                    {/* Unit */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Unidade</label>
                        <select
                            name="unidadeMedida"
                            required
                            className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                            value={formData.unidadeMedida}
                            onChange={handleChange}
                        >
                            <option value="UN">Unidade (UN)</option>
                            <option value="KG">Quilo (KG)</option>
                            <option value="G">Grama (G)</option>
                            <option value="MG">Miligrama (MG)</option>
                            <option value="L">Litro (L)</option>
                            <option value="ML">Mililitro (ML)</option>
                        </select>
                    </div>

                    {/* Initial Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Quantidade Inicial</label>
                        <input
                            type="number"
                            name="quantidadeInicial"
                            required
                            min="0"
                            step="0.01"
                            className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                            value={formData.quantidadeInicial || ''}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Purchase Price */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Preço de Compra (R$)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            name="precoCompra"
                            required
                            className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                            placeholder="0,00"
                            value={formatCurrency(formData.precoCompra)}
                            onChange={handlePriceChange}
                        />
                    </div>

                    {/* Sale Price */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-secondary mb-1">Preço de Venda (R$)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            name="precoVenda"
                            required
                            className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                            placeholder="0,00"
                            value={formatCurrency(formData.precoVenda)}
                            onChange={handlePriceChange}
                        />
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg border border-border-light text-text-secondary hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                            Salvar Produto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

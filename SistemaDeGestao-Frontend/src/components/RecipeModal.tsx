'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { recipeService } from '@/services/recipe.service';
import { productService, Product } from '@/services/product.service';

interface RecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface IngredientLine {
    productId: string; // Using string for select value
    quantity: number;
    observation: string;
}

export default function RecipeModal({ isOpen, onClose }: RecipeModalProps) {
    const { t } = useLanguage();
    const [animate, setAnimate] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);

    // Form State
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [quantidadePadrao, setQuantidadePadrao] = useState<number>(0);
    const [precoVenda, setPrecoVenda] = useState<number>(0);
    const [ingredients, setIngredients] = useState<IngredientLine[]>([]);

    // Computed Cost
    const totalCost = ingredients.reduce((acc, ing) => {
        const product = products.find(p => p.id === Number(ing.productId));
        if (product && product.precoCompra) {
            return acc + (product.precoCompra * ing.quantity);
        }
        return acc;
    }, 0);

    const estimatedProfit = precoVenda ? (precoVenda * quantidadePadrao) - totalCost : 0;
    const profitMargin = precoVenda && totalCost > 0 ? ((estimatedProfit / totalCost) * 100).toFixed(1) : '0.0';

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimate(true);
                });
            });
            // Load products for dropdown
            loadProducts();
        } else {
            setAnimate(false);
            const timer = setTimeout(() => {
                setIsVisible(false);
                resetForm();
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const loadProducts = async () => {
        try {
            const data = await productService.list();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products', error);
        }
    };

    const resetForm = () => {
        setNome('');
        setDescricao('');
        setQuantidadePadrao(0);
        setIngredients([]);
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { productId: '', quantity: 0, observation: '' }]);
    };

    const handleRemoveIngredient = (index: number) => {
        const newIngredients = [...ingredients];
        newIngredients.splice(index, 1);
        setIngredients(newIngredients);
    };

    const handleIngredientChange = (index: number, field: keyof IngredientLine, value: any) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setIngredients(newIngredients);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const recipePayload = {
                nome,
                descricao,
                quantidadePadraoProduzida: quantidadePadrao,
                precoVenda,
                ingredientes: ingredients.map(ing => ({
                    produto: { id: Number(ing.productId) } as Product,
                    quantidadeNecessaria: Number(ing.quantity),
                    observacoes: ing.observation
                }))
            };

            await recipeService.create(recipePayload);
            alert('Receita cadastrada com sucesso!');
            onClose();
        } catch (error) {
            console.error('Erro ao cadastrar receita:', error);
            alert('Erro ao cadastrar receita.');
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-colors duration-700 ${animate ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}>
            <div
                className={`
                    relative bg-surface-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col
                    ${animate ? 'animate-explosion' : 'animate-implosion opacity-0'}
                `}
                style={{
                    transformOrigin: 'center center'
                }}
            >
                {/* Header */}
                <div className="bg-primary px-6 py-4 flex justify-between items-center text-white shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined">menu_book</span>
                        Nova Receita
                    </h2>
                    <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body - Scrollable */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-secondary mb-1">Nome da Receita</label>
                            <input
                                type="text"
                                required
                                className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                placeholder="Ex: Bolo de Chocolate"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>

                        {/* Standard Base Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Qtd. Padrão Produzida</label>
                            <input
                                type="number"
                                required
                                min="1"
                                className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                value={quantidadePadrao || ''}
                                onChange={(e) => setQuantidadePadrao(Number(e.target.value))}
                            />
                        </div>

                        {/* Selling Price */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Preço Sugerido (Unid.)</label>
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                value={precoVenda || ''}
                                onChange={(e) => setPrecoVenda(Number(e.target.value))}
                            />
                        </div>

                        {/* Cost & Profit Info */}
                        <div className="md:col-span-1 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                            <div className="text-sm text-text-secondary">Custo T. Ingredientes</div>
                            <div className="text-lg font-bold text-text-main">R$ {totalCost.toFixed(2)}</div>
                        </div>
                        <div className={`md:col-span-1 p-4 rounded-lg border ${estimatedProfit >= 4 && estimatedProfit <= 10 ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
                            <div className="text-sm text-text-secondary">Lucro Estimado (Total)</div>
                            <div className={`text-lg font-bold ${estimatedProfit >= 4 ? 'text-green-600' : 'text-orange-600'}`}>
                                R$ {estimatedProfit.toFixed(2)}
                            </div>
                            <div className="text-xs text-text-secondary mt-1">Margem: {profitMargin}%</div>
                            {(estimatedProfit < 4 || estimatedProfit > 10) && (
                                <div className="text-xs text-orange-600 font-medium mt-1">
                                    Meta: R$ 4,00 - R$ 10,00
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-secondary mb-1">Descrição / Modo de Preparo</label>
                            <textarea
                                className="w-full h-24 px-4 py-2 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-none"
                                placeholder="Descreva o processo de produção..."
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Ingredients Section */}
                    <div className="border-t border-border-light pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-text-main">Ingredientes</h3>
                            <button
                                type="button"
                                onClick={handleAddIngredient}
                                className="text-sm px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                                Adicionar Ingrediente
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {ingredients.map((ing, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-3 bg-background-light p-3 rounded-lg border border-border-light items-start">
                                    <div className="flex-1 w-full">
                                        <select
                                            required
                                            className="w-full h-10 px-3 rounded-md border border-border-light bg-white focus:ring-1 focus:ring-primary outline-none text-sm"
                                            value={ing.productId}
                                            onChange={(e) => handleIngredientChange(index, 'productId', e.target.value)}
                                        >
                                            <option value="">Selecione um produto...</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.nome} ({p.unidadeMedida})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-32">
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            placeholder="Qtd"
                                            className="w-full h-10 px-3 rounded-md border border-border-light bg-white focus:ring-1 focus:ring-primary outline-none text-sm"
                                            value={ing.quantity || ''}
                                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <input
                                            type="text"
                                            placeholder="Obs (opcional)"
                                            className="w-full h-10 px-3 rounded-md border border-border-light bg-white focus:ring-1 focus:ring-primary outline-none text-sm"
                                            value={ing.observation}
                                            onChange={(e) => handleIngredientChange(index, 'observation', e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveIngredient(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                        title="Remover"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            ))}
                            {ingredients.length === 0 && (
                                <p className="text-center text-text-secondary text-sm py-4 italic">Nenhum ingrediente adicionado.</p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-border-light">
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
                            Salvar Receita
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

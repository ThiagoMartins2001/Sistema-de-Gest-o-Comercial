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
    productId: string;
    quantity: number;
    unit: string;
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
    const [margemLucro, setMargemLucro] = useState<number>(50); // Default 50%
    const [ingredients, setIngredients] = useState<IngredientLine[]>([]);

    // Computed Cost
    const [totalCost, setTotalCost] = useState(0);
    const [suggestedPrice, setSuggestedPrice] = useState(0);

    useEffect(() => {
        const calculateBackendCost = async () => {
            if (ingredients.length === 0) {
                setTotalCost(0);
                setSuggestedPrice(0);
                return;
            }

            const payload = {
                ingredientes: ingredients.map(ing => ({
                    produtoId: Number(ing.productId),
                    quantidade: Number(ing.quantity),
                    unidadeMedida: ing.unit
                })),
                margemLucro: margemLucro
            };

            try {
                const result = await recipeService.calculateCost(payload);
                setTotalCost(result.custoTotal);
                if (result.precoSugerido) setSuggestedPrice(result.precoSugerido);
            } catch (error) {
                console.error("Error calculating cost:", error);
            }
        };

        const timer = setTimeout(() => {
            calculateBackendCost();
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [ingredients, margemLucro]); // Recalculate if margin changes too

    const estimatedProfit = precoVenda ? (precoVenda * quantidadePadrao) - totalCost : 0;
    const profitMargin = precoVenda && totalCost > 0 ? ((estimatedProfit / totalCost) * 100).toFixed(1) : '0.0';

    const applySuggestedPrice = () => {
        if (suggestedPrice > 0 && quantidadePadrao > 0) {
            // Suggestion is for total, convert to unit if needed, but backend suggestion usually is total cost * margin
            // Wait, backend logic was: custoTotal * (1 + margin). Since custoTotal is for the WHOLE recipe output, suggestedPrice is also for WHOLE output.
            // If user wants unit price, we divide by quantity.

            setPrecoVenda(parseFloat((suggestedPrice / quantidadePadrao).toFixed(2)));
        }
    };

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
        setPrecoVenda(0);
        setMargemLucro(50);
        setIngredients([]);
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { productId: '', quantity: 0, unit: 'UN', observation: '' }]);
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
                margemLucro,
                ingredientes: ingredients.map(ing => ({
                    produto: { id: Number(ing.productId) } as Product,
                    quantidadeNecessaria: Number(ing.quantity),
                    unidadeMedida: ing.unit,
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

                        {/* Profit Margin */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Margem Lucro Desejada (%)</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                value={margemLucro || ''}
                                onChange={(e) => setMargemLucro(Number(e.target.value))}
                            />
                        </div>

                        {/* Cost & Suggestion Info */}
                        <div className="md:col-span-2 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <div>
                                <div className="text-xs text-text-secondary">Custo Produção (Total)</div>
                                <div className="text-base font-bold text-text-main">R$ {totalCost.toFixed(2)}</div>
                            </div>
                            <div>
                                <div className="text-xs text-text-secondary">Preço Sugerido (Total da Receita)</div>
                                <div className="text-lg font-bold text-primary">R$ {suggestedPrice.toFixed(2)}</div>
                                <div className="text-xs text-text-secondary">
                                    {(quantidadePadrao > 0) ? `~ R$ ${(suggestedPrice / quantidadePadrao).toFixed(2)} por unidade` : ''}
                                </div>
                                <button type="button" onClick={applySuggestedPrice} className="text-xs text-primary hover:underline mt-1 font-medium">
                                    Aplicar Sugestão ao Unitário
                                </button>
                            </div>
                        </div>

                        {/* Selling Price */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Preço Venda Unitário (Real)</label>
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                value={precoVenda || ''}
                                onChange={(e) => setPrecoVenda(Number(e.target.value))}
                            />
                        </div>

                        {/* Final Profit Analysis */}
                        <div className={`p-4 rounded-lg border ${estimatedProfit > 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                            <div className="text-sm text-text-secondary">Lucro Real Estimado (Total)</div>
                            <div className={`text-lg font-bold ${estimatedProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                R$ {estimatedProfit.toFixed(2)}
                            </div>
                            <div className="text-xs text-text-secondary mt-1">Margem Real: {profitMargin}%</div>
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
                                            step="0.001"
                                            placeholder="Qtd"
                                            className="w-full h-10 px-3 rounded-md border border-border-light bg-white focus:ring-1 focus:ring-primary outline-none text-sm"
                                            value={ing.quantity || ''}
                                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                        />
                                    </div>
                                    <div className="w-24">
                                        <select
                                            required
                                            className="w-full h-10 px-3 rounded-md border border-border-light bg-white focus:ring-1 focus:ring-primary outline-none text-sm"
                                            value={ing.unit}
                                            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                        >
                                            <option value="UN">UN</option>
                                            <option value="KG">KG</option>
                                            <option value="G">G</option>
                                            <option value="MG">MG</option>
                                            <option value="L">L</option>
                                            <option value="ML">ML</option>
                                        </select>
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

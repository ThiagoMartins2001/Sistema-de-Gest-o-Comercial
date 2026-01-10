'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { recipeService, Receita } from '@/services/recipe.service';
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

type Tab = 'form' | 'list';

export default function RecipeModal({ isOpen, onClose }: RecipeModalProps) {
    const { t } = useLanguage();
    const [animate, setAnimate] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);

    // Tab State
    const [activeTab, setActiveTab] = useState<Tab>('form');
    const [recipes, setRecipes] = useState<Receita[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [editingId, setEditingId] = useState<number | null>(null);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [quantidadePadrao, setQuantidadePadrao] = useState<number>(0);
    const [precoVenda, setPrecoVenda] = useState<number>(0);
    const [margemLucro, setMargemLucro] = useState<number>(50); // Default 50%
    const [ingredients, setIngredients] = useState<IngredientLine[]>([]);

    // Computed Cost
    const [totalCost, setTotalCost] = useState(0);
    const [suggestedPrice, setSuggestedPrice] = useState(0);

    // Partition State
    const [isPartitioned, setIsPartitioned] = useState(false);
    const [partitionCount, setPartitionCount] = useState(1);
    const [partitionPrice, setPartitionPrice] = useState(0);

    const formatCurrency = (value: number | undefined) => {
        if (value === undefined || value === null) return '0,00';
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
            loadRecipes();
        } else {
            setAnimate(false);
            const timer = setTimeout(() => {
                setIsVisible(false);
                resetForm();
                setActiveTab('form'); // Reset to form on close
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

    const loadRecipes = async () => {
        try {
            const data = await recipeService.list();
            setRecipes(data);
        } catch (error) {
            console.error('Error loading recipes', error);
        }
    };

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
            margemLucro: margemLucro,
            quantidadePartes: isPartitioned ? partitionCount : 1
        };

        try {
            const result = await recipeService.calculateCost(payload);
            setTotalCost(result.custoTotal);
            if (result.precoSugerido) setSuggestedPrice(result.precoSugerido);
            if (result.precoPorParte) setPartitionPrice(result.precoPorParte);
        } catch (error) {
            console.error("Error calculating cost:", error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            calculateBackendCost();
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [ingredients, margemLucro, isPartitioned, partitionCount]);

    // Auto-update selling price when suggested price changes
    useEffect(() => {
        if (suggestedPrice > 0 && quantidadePadrao > 0) {
            setPrecoVenda(parseFloat((suggestedPrice / quantidadePadrao).toFixed(2)));
        } else {
            setPrecoVenda(0);
        }
    }, [suggestedPrice, quantidadePadrao]);

    const resetForm = () => {
        setEditingId(null);
        setNome('');
        setDescricao('');
        setQuantidadePadrao(0);
        setPrecoVenda(0);
        setMargemLucro(50);
        setIngredients([]);
        setTotalCost(0);
        setSuggestedPrice(0);
        setIsPartitioned(false);
        setPartitionCount(1);
        setPartitionPrice(0);
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

    const handleEdit = (recipe: Receita) => {
        setEditingId(recipe.id || null);
        setNome(recipe.nome);
        setDescricao(recipe.descricao || '');
        setQuantidadePadrao(recipe.quantidadePadraoProduzida);
        setPrecoVenda(recipe.precoVenda || 0);
        setMargemLucro(recipe.margemLucro || 50);
        setIsPartitioned(recipe.emReparticao || false);
        setPartitionCount(recipe.quantidadePartes || 1);
        setPartitionPrice(recipe.precoPorParte || 0);

        // Map ingredients
        if (recipe.ingredientes) {
            setIngredients(recipe.ingredientes.map(ing => ({
                productId: ing.produto.id!.toString(),
                quantity: ing.quantidadeNecessaria,
                unit: ing.unidadeMedida as string, // Cast since backend sends string enum but frontend uses string for select
                observation: ing.observacoes || ''
            })));
        } else {
            setIngredients([]);
        }

        setActiveTab('form');
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta receita?')) {
            try {
                await recipeService.delete(id);
                loadRecipes();
                if (editingId === id) resetForm();
            } catch (error) {
                console.error('Error deleting recipe', error);
                alert('Erro ao excluir receita.');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const recipePayload = {
                id: editingId || undefined,
                nome,
                descricao,
                quantidadePadraoProduzida: quantidadePadrao,
                precoVenda: suggestedPrice, // Use auto-calculated price
                margemLucro: margemLucro,
                emReparticao: isPartitioned,
                quantidadePartes: partitionCount,
                precoPorParte: partitionPrice,
                ingredientes: ingredients.map((ing) => ({
                    produto: { id: parseInt(ing.productId) } as any,
                    quantidadeNecessaria: ing.quantity,
                    unidadeMedida: ing.unit,
                    observacoes: ing.observation,
                })),
            };

            if (editingId) {
                await recipeService.update(editingId, recipePayload);
                alert('Receita atualizada com sucesso!');
            } else {
                await recipeService.create(recipePayload);
                alert('Receita cadastrada com sucesso!');
            }

            resetForm();
            loadRecipes();
            setActiveTab('list'); // Switch to list after save
        } catch (error) {
            console.error('Erro ao salvar receita:', error);
            alert('Erro ao salvar receita.');
        } finally {
            setLoading(false);
        }
    };

    const filteredRecipes = recipes.filter(r =>
        r.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        Gerenciar Receitas
                    </h2>
                    <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border-light bg-gray-50">
                    <button
                        type="button"
                        onClick={() => { setActiveTab('form'); if (!editingId) resetForm(); }}
                        className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'form'
                            ? 'border-primary text-primary bg-white'
                            : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-gray-100'
                            }`}
                    >
                        {editingId ? 'Editar Receita' : 'Nova Receita'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('list')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'list'
                            ? 'border-primary text-primary bg-white'
                            : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-gray-100'
                            }`}
                    >
                        Lista de Receitas
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {activeTab === 'form' ? (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

                                {/* Finance Card */}
                                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">attach_money</span>
                                        Financeiro (Precificação)
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {/* Custo Total */}
                                        <div>
                                            <div className="text-xs text-text-secondary mb-1">Custo Produção (Total)</div>
                                            <div className="text-base font-bold text-text-main">R$ {formatCurrency(totalCost)}</div>
                                            <div className="text-xs text-text-secondary">
                                                {quantidadePadrao > 0 ? `~ R$ ${formatCurrency(totalCost / quantidadePadrao)} un.` : '-'}
                                            </div>
                                        </div>

                                        {/* Margem Input */}
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1">Margem Lucro (%)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full h-9 px-3 rounded border border-border-light bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm font-medium"
                                                value={margemLucro || ''}
                                                onChange={(e) => setMargemLucro(Number(e.target.value))}
                                            />
                                        </div>

                                        {/* Preco Venda (Calculado) */}
                                        <div>
                                            <div className="text-xs text-text-secondary mb-1">Preço Venda (Sugerido)</div>
                                            <div className="text-base font-bold text-primary">R$ {formatCurrency(suggestedPrice)}</div>
                                            <div className="text-xs text-primary/80 font-medium">
                                                {quantidadePadrao > 0 ? `~ R$ ${formatCurrency(suggestedPrice / quantidadePadrao)} un.` : '-'}
                                            </div>
                                        </div>

                                        {/* Lucro Estimado */}
                                        <div>
                                            <div className="text-xs text-text-secondary mb-1">Lucro Estimado (Total)</div>
                                            <div className="text-base font-bold text-green-600">R$ {formatCurrency(suggestedPrice - totalCost)}</div>
                                        </div>

                                        {/* Partitioning Section */}
                                        <div className="col-span-2 md:col-span-4 mt-2 pt-3 border-t border-gray-200">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-sm font-medium text-text-secondary">Produto em Repartição?</span>
                                                <div className="form-check flex items-center gap-2">
                                                    <input
                                                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
                                                        type="checkbox"
                                                        id="checkPartition"
                                                        checked={isPartitioned}
                                                        onChange={(e) => setIsPartitioned(e.target.checked)}
                                                    />
                                                    <label className="text-sm text-text-secondary cursor-pointer select-none" htmlFor="checkPartition">
                                                        Sim, calcular porções
                                                    </label>
                                                </div>
                                            </div>

                                            {isPartitioned && (
                                                <div className="grid grid-cols-2 gap-4 bg-white p-3 rounded border border-gray-200">
                                                    <div>
                                                        <label className="block text-xs font-medium text-text-secondary mb-1">Qtd. de Cortes/Unidades</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            className="w-full h-9 px-3 rounded border border-border-light bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                                                            value={partitionCount}
                                                            onChange={(e) => setPartitionCount(Math.max(1, Number(e.target.value)))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-text-secondary mb-1">Preço Sugerido (Por Porção)</div>
                                                        <div className="text-base font-bold text-primary">
                                                            R$ {formatCurrency(partitionPrice)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Baseado no preço total da receita
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
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
                                    {editingId ? 'Atualizar Receita' : 'Salvar Receita'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Buscar receitas..."
                                className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <div className="border border-border-light rounded-lg overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 text-text-secondary text-sm font-medium">
                                        <tr>
                                            <th className="p-3">ID</th>
                                            <th className="p-3">Nome</th>
                                            <th className="p-3 text-center">Qtd. Padrão</th>
                                            <th className="p-3 text-right">Preço Venda Unit.</th>
                                            <th className="p-3 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-light text-sm text-text-primary">
                                        {filteredRecipes.length > 0 ? (
                                            filteredRecipes.map((recipe) => (
                                                <tr key={recipe.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-3 text-text-secondary">#{recipe.id}</td>
                                                    <td className="p-3 font-medium">{recipe.nome}</td>
                                                    <td className="p-3 text-center">{recipe.quantidadePadraoProduzida}</td>
                                                    <td className="p-3 text-right">R$ {formatCurrency(recipe.precoVenda)}</td>
                                                    <td className="p-3 text-right space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(recipe)}
                                                            className="text-primary hover:bg-primary/10 p-1.5 rounded-full transition-colors"
                                                            title="Editar"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(Number(recipe.id))}
                                                            className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                                                            title="Excluir"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-text-secondary italic">
                                                    Nenhuma receita encontrada.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

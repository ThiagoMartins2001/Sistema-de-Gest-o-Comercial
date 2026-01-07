'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { productionService, ProducaoResultado } from '@/services/production.service';
import { recipeService, Receita } from '@/services/recipe.service';
import { productService, Product } from '@/services/product.service';

interface ProductionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductionModal({ isOpen, onClose }: ProductionModalProps) {
    const { t } = useLanguage();
    const [animate, setAnimate] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState<Receita[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    // Form State
    const [selectedRecipeId, setSelectedRecipeId] = useState('');
    const [quantidadeLotes, setQuantidadeLotes] = useState<number>(1);
    const [dataProducao, setDataProducao] = useState('');
    const [observacao, setObservacao] = useState('');

    // Results State
    const [results, setResults] = useState<ProducaoResultado[]>([{
        quantidade: 0,
        unidadeMedida: 'UN',
        observacoes: ''
    }]);

    // Computed
    const selectedRecipe = recipes.find(r => r.id === Number(selectedRecipeId));
    const expectedYield = selectedRecipe ? (selectedRecipe.quantidadePadraoProduzida * quantidadeLotes) : 0;

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimate(true);
                });
            });

            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            setDataProducao(now.toISOString().slice(0, 16));

            loadData();
        } else {
            setAnimate(false);
            const timer = setTimeout(() => {
                setIsVisible(false);
                resetForm();
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const loadData = async () => {
        try {
            const [recipesData, productsData] = await Promise.all([
                recipeService.list(),
                productService.list()
            ]);
            setRecipes(recipesData);
            setProducts(productsData);
        } catch (error) {
            console.error('Error loading data', error);
        }
    };

    const resetForm = () => {
        setSelectedRecipeId('');
        setQuantidadeLotes(1);
        setObservacao('');
        setResults([{ quantidade: 0, unidadeMedida: 'UN', observacoes: '' }]);
    };

    const handleAddResult = () => {
        setResults([...results, { quantidade: 0, unidadeMedida: 'UN', observacoes: '' }]);
    };

    const handleRemoveResult = (index: number) => {
        setResults(results.filter((_, i) => i !== index));
    };

    const updateResult = (index: number, field: keyof ProducaoResultado, value: any) => {
        const newResults = [...results];
        if (field === 'produto') {
            const prod = products.find(p => p.id === Number(value));
            newResults[index].produto = prod ? { id: prod.id!, nome: prod.nome } : undefined;
            // Auto complete unit if product selected
            if (prod) newResults[index].unidadeMedida = prod.unidadeMedida;
        } else {
            (newResults[index] as any)[field] = value;
        }
        setResults(newResults);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Filter out empty results
            const validResults = results.filter(r => r.quantidade > 0);

            await productionService.create({
                receita: { id: Number(selectedRecipeId) } as Receita,
                quantidadeLotes: quantidadeLotes,
                dataProducao: new Date(dataProducao).toISOString(),
                observacoes: observacao,
                estoqueDescontado: false,
                resultados: validResults
            });
            alert('Produção registrada e estoque atualizado!');
            onClose();
        } catch (error) {
            console.error('Erro ao registrar produção:', error);
            alert('Erro ao registrar produção.');
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-colors duration-700 ${animate ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}>
            <div
                className={`
                    relative bg-surface-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]
                    ${animate ? 'animate-explosion' : 'animate-implosion opacity-0'}
                `}
                style={{ transformOrigin: 'center center' }}
            >
                {/* Header */}
                <div className="bg-primary px-6 py-4 flex justify-between items-center text-white shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined">factory</span>
                        Nova Produção
                    </h2>
                    <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Scrollable Body */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Receita Utilizada</label>
                            <select
                                required
                                className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                value={selectedRecipeId}
                                onChange={(e) => setSelectedRecipeId(e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                {recipes.map(r => (
                                    <option key={r.id} value={r.id}>{r.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Qtd. Lotes (Entrada)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                value={quantidadeLotes}
                                onChange={(e) => setQuantidadeLotes(Number(e.target.value))}
                            />
                            {selectedRecipe && (
                                <p className="text-xs text-text-secondary mt-1">
                                    Base: {selectedRecipe.quantidadePadraoProduzida} un/lote. Total Teórico: {expectedYield}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-2"></div>

                    {/* Results Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-bold text-text-main">
                                O que foi produzido? (Saídas)
                            </label>
                            <button
                                type="button"
                                onClick={handleAddResult}
                                className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                                Adicionar Saída
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {results.map((res, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div className="flex-1 w-full">
                                        <select
                                            className="w-full h-10 px-3 rounded border border-gray-200 text-sm focus:border-primary outline-none"
                                            value={res.produto?.id || ''}
                                            onChange={(e) => updateResult(index, 'produto', e.target.value)}
                                        >
                                            <option value="">-- Apenas Registro (Sem Estoque) --</option>
                                            <option disabled>-- Produtos Cadastrados --</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-24">
                                        <input
                                            type="number"
                                            placeholder="Qtd"
                                            min="0"
                                            step="0.001"
                                            className="w-full h-10 px-3 rounded border border-gray-200 text-sm focus:border-primary outline-none"
                                            value={res.quantidade}
                                            onChange={(e) => updateResult(index, 'quantidade', Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="w-28">
                                        <select
                                            className="w-full h-10 px-3 rounded border border-gray-200 text-sm focus:border-primary outline-none"
                                            value={res.unidadeMedida}
                                            onChange={(e) => updateResult(index, 'unidadeMedida', e.target.value)}
                                        >
                                            <option value="UN">UN</option>
                                            <option value="KG">KG</option>
                                            <option value="G">G</option>
                                            <option value="L">L</option>
                                            <option value="ML">ML</option>
                                        </select>
                                    </div>
                                    <div className="flex-1 w-full">
                                        <input
                                            type="text"
                                            placeholder="Obs: (ex: Cortado em cubos)"
                                            className="w-full h-10 px-3 rounded border border-gray-200 text-sm focus:border-primary outline-none"
                                            value={res.observacoes}
                                            onChange={(e) => updateResult(index, 'observacoes', e.target.value)}
                                        />
                                    </div>
                                    {results.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveResult(index)}
                                            className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            * Se selecionar um Produto, o estoque dele será aumentado automaticamente.
                        </p>
                    </div>

                    {/* Date & Global Obs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Data Produção</label>
                            <input
                                type="datetime-local"
                                required
                                className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                value={dataProducao}
                                onChange={(e) => setDataProducao(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Observações Gerais</label>
                            <input
                                type="text"
                                className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 shrink-0">
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
                            Confirmar Produção
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

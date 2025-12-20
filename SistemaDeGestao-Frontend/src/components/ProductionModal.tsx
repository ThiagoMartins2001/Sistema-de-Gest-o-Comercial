'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { productionService } from '@/services/production.service';
import { recipeService, Receita } from '@/services/recipe.service';

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

    // Form State
    const [selectedRecipeId, setSelectedRecipeId] = useState('');
    const [quantidadeLotes, setQuantidadeLotes] = useState<number>(1);
    const [quantidadeProduzida, setQuantidadeProduzida] = useState<number>(0);
    const [dataProducao, setDataProducao] = useState(''); // ISO Date string (YYYY-MM-DDTHH:mm)
    const [observacao, setObservacao] = useState('');

    // Computed
    const selectedRecipe = recipes.find(r => r.id === Number(selectedRecipeId));
    const expectedYield = selectedRecipe ? (selectedRecipe.quantidadePadraoProduzida * quantidadeLotes) : 0;
    const efficiency = quantidadeProduzida - expectedYield;

    useEffect(() => {
        if (selectedRecipe) {
            setQuantidadeProduzida(selectedRecipe.quantidadePadraoProduzida * quantidadeLotes);
        }
    }, [selectedRecipe, quantidadeLotes]);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimate(true);
                });
            });
            // Initialize date to now
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            setDataProducao(now.toISOString().slice(0, 16));

            loadRecipes();
        } else {
            setAnimate(false);
            const timer = setTimeout(() => {
                setIsVisible(false);
                resetForm();
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const loadRecipes = async () => {
        try {
            const data = await recipeService.list();
            setRecipes(data);
        } catch (error) {
            console.error('Error loading recipes', error);
        }
    };

    const resetForm = () => {
        setSelectedRecipeId('');
        setQuantidadeLotes(1);
        setQuantidadeProduzida(0);
        setObservacao('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await productionService.create({
                receita: { id: Number(selectedRecipeId) } as Receita,
                quantidadeLotes: quantidadeLotes,
                quantidadeProduzida: quantidadeProduzida,
                dataProducao: new Date(dataProducao).toISOString(),
                observacoes: observacao,
                estoqueDescontado: false // Default false as per backend logic
            });
            alert('Produção registrada com sucesso!');
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
                    relative bg-surface-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden
                    ${animate ? 'animate-explosion' : 'animate-implosion opacity-0'}
                `}
                style={{
                    transformOrigin: 'center center'
                }}
            >
                {/* Header */}
                <div className="bg-primary px-6 py-4 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined">factory</span>
                        Nova Produção
                    </h2>
                    <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                    {/* Recipe Selection */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Receita</label>
                        <select
                            required
                            className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                            value={selectedRecipeId}
                            onChange={(e) => setSelectedRecipeId(e.target.value)}
                        >
                            <option value="">Selecione uma receita...</option>
                            {recipes.map(r => (
                                <option key={r.id} value={r.id}>{r.nome}</option>
                            ))}
                        </select>
                    </div>

                    {/* Quantity Section */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Batches */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Qtd. Lotes</label>
                            <input
                                type="number"
                                required
                                min="1"
                                className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                value={quantidadeLotes}
                                onChange={(e) => setQuantidadeLotes(Number(e.target.value))}
                            />
                        </div>

                        {/* Expected Yield Display */}
                        <div className="bg-gray-50 rounded-lg p-3 flex flex-col justify-center border border-gray-100">
                            <span className="text-xs text-text-secondary">Padão Esperado</span>
                            <span className="text-lg font-semibold text-text-main">{expectedYield} un</span>
                        </div>
                    </div>

                    {/* Actual Production */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Quantidade Produzida (Real)</label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="number"
                                required
                                min="0"
                                className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none flex-1"
                                value={quantidadeProduzida}
                                onChange={(e) => setQuantidadeProduzida(Number(e.target.value))}
                            />
                            {/* Efficiency Badge */}
                            {selectedRecipe && (
                                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${efficiency >= 0 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                    {efficiency > 0 ? '+' : ''}{efficiency} un
                                </div>
                            )}
                        </div>
                        {efficiency < 0 && (
                            <p className="text-xs text-red-500 mt-1 ml-1">
                                Perda registrada. Ingredientes serão descontados baseados nos {quantidadeLotes} lotes.
                            </p>
                        )}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Data/Hora</label>
                        <input
                            type="datetime-local"
                            required
                            className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                            value={dataProducao}
                            onChange={(e) => setDataProducao(e.target.value)}
                        />
                    </div>

                    {/* Observations */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Observações (Opcional)</label>
                        <textarea
                            className="w-full h-20 px-4 py-2 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-none"
                            value={observacao}
                            onChange={(e) => setObservacao(e.target.value)}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-2">
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
                            Salvar Produção
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

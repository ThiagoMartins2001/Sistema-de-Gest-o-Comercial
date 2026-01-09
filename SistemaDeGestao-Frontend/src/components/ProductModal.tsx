'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { productService, Product } from '@/services/product.service';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ProductFormState {
    id?: number;
    nome: string;
    unidadeMedida: string;
    quantidadeInicial: string | number;
    quantidadeAtual: string | number;
    precoCompra: number;
    precoVenda: number;

    // Novos campos para logica de peso
    pesoPorUnidade: string | number;
    numeroEmbalagens: string | number;
}

export default function ProductModal({ isOpen, onClose }: ProductModalProps) {
    const { t } = useLanguage();
    const [animate, setAnimate] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
    const [productList, setProductList] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState<ProductFormState>({
        nome: '',
        unidadeMedida: 'UN',
        quantidadeInicial: 0,
        quantidadeAtual: 0,
        precoCompra: 0,
        precoVenda: 0,
        pesoPorUnidade: 0,
        numeroEmbalagens: 0
    });

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            requestAnimationFrame(() => setAnimate(true));
            loadProducts();
        } else {
            setAnimate(false);
            const timer = setTimeout(() => {
                setIsVisible(false);
                resetForm();
                setActiveTab('form');
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const loadProducts = async () => {
        try {
            const data = await productService.list();
            setProductList(data);
        } catch (error) {
            console.error('Error loading products', error);
        }
    };

    const resetForm = () => {
        setFormData({
            nome: '',
            unidadeMedida: 'UN',
            quantidadeInicial: 0,
            quantidadeAtual: 0,
            precoCompra: 0,
            precoVenda: 0,
            pesoPorUnidade: 0,
            numeroEmbalagens: 0
        });
    };

    const handleEdit = (product: Product) => {
        // Se temos pesoPorUnidade salvo, tentamos calcular o numero de embalagens
        let numEmbalagens: string | number = 0;
        let pesoUnit: string | number = 0;

        if (product.pesoPorUnidade && product.pesoPorUnidade > 0) {
            pesoUnit = product.pesoPorUnidade;
            // Se QuantidadeAtual (Total) = 2000g e PesoUnit = 1000g -> Num = 2
            if (product.quantidadeAtual) {
                numEmbalagens = product.quantidadeAtual / product.pesoPorUnidade;
            }
        }

        setFormData({
            ...product,
            quantidadeInicial: product.quantidadeInicial || 0,
            quantidadeAtual: product.quantidadeAtual || 0,
            precoCompra: product.precoCompra || 0,
            precoVenda: product.precoVenda || 0,
            pesoPorUnidade: pesoUnit,
            numeroEmbalagens: numEmbalagens
        });
        setActiveTab('form');
    };

    const handleDelete = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await productService.delete(id);
                loadProducts();
            } catch (error) {
                console.error('Error deleting product', error);
                alert('Erro ao excluir produto.');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Logica de calculo automatico
            if (newData.unidadeMedida !== 'UN') {
                if (name === 'numeroEmbalagens' || name === 'pesoPorUnidade' || name === 'unidadeMedida') {
                    const packs = parseFloat(String(newData.numeroEmbalagens || 0));
                    const weight = parseFloat(String(newData.pesoPorUnidade || 0));
                    if (!isNaN(packs) && !isNaN(weight)) {
                        // Total = Pacotes * Peso
                        const total = packs * weight;
                        newData.quantidadeInicial = total;
                        newData.quantidadeAtual = total; // Assumindo que ao editar/criar estamos definindo o estoque atual
                    }
                }
            } else {
                // Se for UN, numeroEmbalagens = quantidade
                if (name === 'numeroEmbalagens') {
                    newData.quantidadeInicial = value;
                    newData.quantidadeAtual = value;
                }
            }
            return newData;
        });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const onlyDigits = value.replace(/\D/g, '');
        const floatValue = Number(onlyDigits) / 100;
        setFormData(prev => ({ ...prev, [name]: floatValue }));
    };

    const formatCurrency = (value: number) => {
        if (!value) return '0,00';
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload: Product = {
                ...formData,
                id: formData.id,
                nome: formData.nome,
                unidadeMedida: formData.unidadeMedida,
                precoCompra: formData.precoCompra,
                precoVenda: formData.precoVenda,
                quantidadeInicial: Number(formData.quantidadeInicial),
                quantidadeAtual: formData.quantidadeAtual ? Number(formData.quantidadeAtual) : undefined,
                pesoPorUnidade: Number(formData.pesoPorUnidade)
            };

            if (formData.id) {
                await productService.update(formData.id, payload);
                alert('Produto atualizado com sucesso!');
            } else {
                await productService.create(payload);
                alert('Produto cadastrado com sucesso!');
            }
            loadProducts();
            resetForm();
            if (formData.id) setActiveTab('list');
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            alert('Erro ao salvar produto.');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = productList.filter(p =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-colors duration-700 ${animate ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}>
            <div
                className={`
                    relative bg-surface-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]
                    ${animate ? 'animate-explosion' : 'animate-implosion opacity-0'}
                `}
                style={{ transformOrigin: 'center center' }}
            >
                {/* Header */}
                <div className="bg-primary px-6 py-4 flex justify-between items-center text-white shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined">inventory_2</span>
                        Gerenciar Produtos
                    </h2>
                    <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border-light bg-gray-50 shrink-0">
                    <button
                        onClick={() => setActiveTab('form')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'form' ? 'bg-white text-primary border-t-2 border-primary' : 'text-text-secondary hover:bg-gray-100'}`}
                    >
                        {formData.id ? 'Editar Produto' : 'Novo Produto'}
                    </button>
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-white text-primary border-t-2 border-primary' : 'text-text-secondary hover:bg-gray-100'}`}
                    >
                        Lista de Produtos
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {activeTab === 'form' ? (
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-secondary mb-1">Nome do Produto</label>
                                <input
                                    type="text"
                                    name="nome"
                                    required
                                    className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                    placeholder="Ex: Farinha de Trigo"
                                    value={formData.nome || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Unit */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Unidade de Medida (do Estoque)</label>
                                <select
                                    name="unidadeMedida"
                                    required
                                    className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                    value={formData.unidadeMedida || 'UN'}
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

                            {/* LOGIC DIVIDER: If UN, simple quantity. If KG/L, detailed. */}
                            {formData.unidadeMedida === 'UN' ? (
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Quantidade de Itens</label>
                                    <input
                                        type="number"
                                        name="numeroEmbalagens" // Using helper field mapped to quantity
                                        required
                                        min="0"
                                        step="1"
                                        className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                        value={formData.numeroEmbalagens || ''}
                                        onChange={handleChange}
                                        placeholder="Ex: 10"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Total no Estoque: {formData.quantidadeAtual} UN</p>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Qtd. de Embalagens/Pacotes</label>
                                        <input
                                            type="number"
                                            name="numeroEmbalagens"
                                            required
                                            min="0"
                                            step="0.01"
                                            className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                            value={formData.numeroEmbalagens || ''}
                                            onChange={handleChange}
                                            placeholder="Ex: 2 (sacos)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Peso/Volume por Embalagem</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                name="pesoPorUnidade"
                                                required
                                                min="0"
                                                step="0.001"
                                                className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                                value={formData.pesoPorUnidade || ''}
                                                onChange={handleChange}
                                                placeholder={`Ex: 1 (${formData.unidadeMedida})`}
                                            />
                                            <span className="text-gray-500 font-medium">{formData.unidadeMedida}</span>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-100 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-blue-800 font-medium">Estoque Total Calculado</p>
                                            <p className="text-xs text-blue-600">O sistema usará este valor para baixar receitas.</p>
                                        </div>
                                        <div className="text-xl font-bold text-blue-700">
                                            {Number(formData.quantidadeAtual).toFixed(3)} <span className="text-sm font-medium">{formData.unidadeMedida}</span>
                                        </div>
                                    </div>
                                </>
                            )}



                            {/* Actions */}
                            <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
                                {formData.id && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 py-2 rounded-lg border border-border-light text-text-secondary hover:bg-gray-50 transition-colors font-medium mr-auto"
                                    >
                                        Cancelar Edição
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2 rounded-lg border border-border-light text-text-secondary hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Fechar Janela
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                    {formData.id ? 'Atualizar Produto' : 'Salvar Produto'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {/* List */}
                            {activeTab === 'list' && (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Buscar produtos..."
                                        className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />

                                    <div className="overflow-x-auto rounded-lg border border-border-light">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-gray-50 text-text-secondary text-sm font-medium">
                                                <tr>
                                                    <th className="p-3">ID</th>
                                                    <th className="p-3">Nome</th>
                                                    <th className="p-3 text-center">Unid. (Estoque)</th>
                                                    <th className="p-3">Peso (Unit.)</th>
                                                    <th className="p-3">Vlr. Compra</th>
                                                    <th className="p-3 text-right">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border-light text-sm text-text-primary">
                                                {filteredProducts.map((product) => {
                                                    // Calculation Logic
                                                    let unitsDisplay = product.quantidadeAtual?.toFixed(2);
                                                    let weightDisplay = "-";

                                                    if (product.pesoPorUnidade && product.pesoPorUnidade > 0) {
                                                        // Calculate number of packs/units
                                                        const packs = (product.quantidadeAtual || 0) / product.pesoPorUnidade;
                                                        // User requested integer-like display for packs (no trailing zeros)
                                                        unitsDisplay = packs.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
                                                        weightDisplay = `${product.pesoPorUnidade} ${product.unidadeMedida}`;
                                                    } else {
                                                        unitsDisplay = (product.quantidadeAtual || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
                                                    }

                                                    return (
                                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="p-3 text-text-secondary">#{product.id}</td>
                                                            <td className="p-3 font-medium">{product.nome}</td>
                                                            <td className="p-3 text-center">{unitsDisplay}</td>
                                                            <td className="p-3 text-gray-600">{weightDisplay}</td>
                                                            <td className="p-3">R$ {formatCurrency(product.precoCompra)}</td>
                                                            <td className="p-3 text-right space-x-2">
                                                                <button
                                                                    onClick={() => handleEdit(product)}
                                                                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                                                                    title="Editar"
                                                                >
                                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => product.id && handleDelete(product.id)}
                                                                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                                                                    title="Excluir"
                                                                >
                                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                {filteredProducts.length === 0 && (
                                                    <tr>
                                                        <td colSpan={6} className="p-8 text-center text-text-secondary">
                                                            Nenhum produto encontrado.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

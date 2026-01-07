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
}

export default function ProductModal({ isOpen, onClose }: ProductModalProps) {
    const { t } = useLanguage();
    // Controls the CSS transition state (0 -> 1)
    const [animate, setAnimate] = useState(false);
    // Controls whether the component is actually in the DOM (to allow exit animation)
    const [isVisible, setIsVisible] = useState(false);

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
    const [productList, setProductList] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState<ProductFormState>({
        nome: '',
        unidadeMedida: 'UN',
        quantidadeInicial: 0,
        quantidadeAtual: 0,
        precoCompra: 0,
        precoVenda: 0
    });

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimate(true);
                });
            });
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
            precoVenda: 0
        });
    };

    const handleEdit = (product: Product) => {
        setFormData({
            ...product,
            quantidadeInicial: product.quantidadeInicial || 0,
            quantidadeAtual: product.quantidadeAtual || 0,
            precoCompra: product.precoCompra || 0,
            precoVenda: product.precoVenda || 0
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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
                quantidadeInicial: Number(formData.quantidadeInicial),
                quantidadeAtual: formData.quantidadeAtual ? Number(formData.quantidadeAtual) : undefined,
                precoCompra: formData.precoCompra,
                precoVenda: formData.precoVenda
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
                                <label className="block text-sm font-medium text-text-secondary mb-1">Unidade</label>
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

                            {/* Initial/Current Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">{formData.id ? 'Estoque Atual' : 'Quantidade Inicial'}</label>
                                <input
                                    type="number"
                                    name={formData.id ? "quantidadeAtual" : "quantidadeInicial"}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full h-11 px-4 rounded-lg border border-border-light bg-background-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                    value={(formData.id ? formData.quantidadeAtual : formData.quantidadeInicial) || ''}
                                    onChange={handleChange}
                                />
                            </div>



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
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                <input
                                    type="text"
                                    placeholder="Buscar produto..."
                                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:border-primary outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-gray-100">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 font-medium">
                                        <tr>
                                            <th className="px-4 py-3">Nome</th>
                                            <th className="px-4 py-3">Unid.</th>
                                            <th className="px-4 py-3">Estoque</th>
                                            <th className="px-4 py-3">Vlr. Compra (Unit.)</th>
                                            <th className="px-4 py-3 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredProducts.map(product => (
                                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-800">{product.nome}</td>
                                                <td className="px-4 py-3 text-gray-600">{product.unidadeMedida}</td>
                                                <td className="px-4 py-3 font-medium text-blue-600">{product.quantidadeAtual?.toFixed(2) || '0.00'}</td>
                                                <td className="px-4 py-3 text-gray-800">R$ {product.precoCompra?.toFixed(2) || '0.00'}</td>
                                                <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Editar"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id!)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Excluir"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredProducts.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-8 text-center text-gray-400 italic">
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
            </div>
        </div>
    );
}

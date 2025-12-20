import api from './api';

export interface Product {
    id?: number;
    nome: string;
    tipoControle: string;
    unidadeMedida: string;
    quantidadeInicial: number;
    quantidadeAtual?: number;
    precoCompra: number;
    precoVenda: number;
}

export const productService = {
    async create(product: Product): Promise<Product> {
        const response = await api.post<Product>('/products/create', product);
        return response.data;
    },

    async list(): Promise<Product[]> {
        const response = await api.get<Product[]>('/products/list');
        return response.data;
    }
};

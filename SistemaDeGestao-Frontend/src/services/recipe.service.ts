import api from './api';
import { Product } from './product.service';

export interface IngredienteDaReceita {
    id?: number;
    produto: Product;
    quantidadeNecessaria: number;
    observacoes?: string;
}

export interface Receita {
    id?: number;
    nome: string;
    descricao?: string;
    quantidadePadraoProduzida: number;
    precoVenda?: number; // New field
    ingredientes: IngredienteDaReceita[];
}

export const recipeService = {
    async create(receita: Receita): Promise<Receita> {
        const response = await api.post<Receita>('/receitas/criar', receita);
        return response.data;
    },

    async list(): Promise<Receita[]> {
        const response = await api.get<Receita[]>('/receitas/listar');
        return response.data;
    }
};

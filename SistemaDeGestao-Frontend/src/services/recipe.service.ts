import api from './api';
import { Product } from './product.service';

export interface IngredienteDaReceita {
    id?: number;
    produto: Product;
    quantidadeNecessaria: number;
    unidadeMedida: string;
    observacoes?: string;
}

export interface Receita {
    id?: number;
    nome: string;
    descricao?: string;
    quantidadePadraoProduzida: number;
    precoVenda?: number;
    margemLucro?: number;
    emReparticao?: boolean;
    quantidadePartes?: number;
    precoPorParte?: number;
    ingredientes: IngredienteDaReceita[];
}


export interface ItemCalculoDTO {
    produtoId: number;
    quantidade: number;
    unidadeMedida: string;
}

export interface CalculoCustoDTO {
    ingredientes: ItemCalculoDTO[];
    margemLucro?: number; // New field
    quantidadePartes?: number;
}

export interface ResultadoCalculoDTO {
    custoTotal: number;
    precoSugerido?: number; // New field
    precoPorParte?: number;
}

export const recipeService = {
    async create(receita: Receita): Promise<Receita> {
        const response = await api.post<Receita>('/receitas/criar', receita);
        return response.data;
    },

    async list(): Promise<Receita[]> {
        const response = await api.get<Receita[]>('/receitas/listar');
        return response.data;
    },

    async calculateCost(dto: CalculoCustoDTO): Promise<ResultadoCalculoDTO> {
        const response = await api.post<ResultadoCalculoDTO>('/receitas/calcular-custo', dto);
        return response.data;
    },

    async update(id: number, receita: Receita): Promise<Receita> {
        const response = await api.put<Receita>(`/receitas/atualizar/${id}`, receita);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/receitas/excluir/${id}`);
    }
};

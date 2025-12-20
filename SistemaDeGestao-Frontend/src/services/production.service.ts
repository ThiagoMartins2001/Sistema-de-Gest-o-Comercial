import api from './api';
import { Receita } from './recipe.service';

export interface Producao {
    id?: number;
    receita: Receita;
    quantidadeProduzida: number;
    quantidadeLotes: number; // New Field
    custoTotal?: number; // New Field
    lucroEstimado?: number; // New Field
    dataProducao?: string; // ISO string
    observacoes?: string;
    estoqueDescontado?: boolean;
}

export const productionService = {
    async create(producao: Producao): Promise<Producao> {
        const response = await api.post<Producao>('/producoes/registrar', producao);
        return response.data;
    },

    async list(): Promise<Producao[]> {
        const response = await api.get<Producao[]>('/producoes/listar');
        return response.data;
    }
};

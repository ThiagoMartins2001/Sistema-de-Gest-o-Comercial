import api from './api';
import { Receita } from './recipe.service';

export interface ProducaoResultado {
    id?: number;
    produto?: { id: number; nome?: string }; // Produto vinculado
    quantidade: number;
    unidadeMedida: string;
    observacoes?: string;
}

export interface Producao {
    id?: number;
    receita: Receita;
    quantidadeProduzida?: number; // Agora opcional se tiver resultados
    quantidadeLotes: number;
    custoTotal?: number;
    lucroEstimado?: number;
    dataProducao?: string;
    observacoes?: string;
    estoqueDescontado?: boolean;
    resultados?: ProducaoResultado[];
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

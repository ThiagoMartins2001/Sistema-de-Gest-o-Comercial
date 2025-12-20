import api from './api';

export interface Product {
    id: number;
    nome: string;
    precoVenda: number;
    quantidadeAtual: number;
}

export interface Receita {
    id: number;
    nome: string;
}

export interface Producao {
    id: number;
    quantidadeProduzida: number;
    dataProducao: string;
    receita: Receita;
}

export interface User {
    username: string;
    role: string;
}

export interface DashboardStats {
    totalProducts: number;
    totalStockValue: number;
    totalRecipes: number;
    totalProductions: number;
    totalUsers: number;
}

export const dashboardService = {
    async getStats(): Promise<DashboardStats> {
        try {
            // Parallel requests for performance
            const [productsRes, recipesRes, productionsRes] = await Promise.all([
                api.get<Product[]>('/products/list'),
                api.get<Receita[]>('/receitas/listar'),
                api.get<Producao[]>('/producoes/listar')
            ]);

            const products = productsRes.data;
            const recipes = recipesRes.data;
            const productions = productionsRes.data;

            // Calculate Stock Value (Price * Quantity)
            const totalStockValue = products.reduce((acc, curr) => {
                return acc + (curr.precoVenda * curr.quantidadeAtual);
            }, 0);

            // Fetch users only if admin (this might fail if not admin, so we wrap in try/catch or skip)
            let totalUsers = 0;
            try {
                const usersRes = await api.get<User[]>('/users/listAll');
                totalUsers = usersRes.data.length;
            } catch (error) {
                // Ignore 403/401 for users list if not admin
                console.log("Not authorized to list users or error fetching users.");
            }

            return {
                totalProducts: products.length,
                totalStockValue,
                totalRecipes: recipes.length,
                totalProductions: productions.length,
                totalUsers
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },
    async getFinancials() {
        const response = await api.get('/dashboard/financials');
        return response.data;
    }
};

import api from './api';

export const authService = {
    login: async (username: string, password: string): Promise<{ token: string }> => {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    logout: () => {
        // Implement logout logic if needed (e.g., calling backend blacklist)
    }
};

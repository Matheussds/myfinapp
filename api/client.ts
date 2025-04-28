import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Crie uma instância do Axios
const api: AxiosInstance = axios.create({
    baseURL: apiUrl, // Ex.: https://api.exemplo.com
    timeout: 10000,
});

// Interceptor de requisição: Adiciona o token ao cabeçalho
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('authToken');
        const userGuid = await SecureStore.getItemAsync('authUserGUID');
        if (!config.url) {
            throw new Error('URL não definida no interceptor de requisição');
        }

        config.url = '/api' + config.url

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.url.startsWith('/api/users/auth/')) {
            return config; // Não adiciona o token para URLs de autenticação
        }

        if (config.url!.startsWith('/api/users/')) {
            if (!userGuid) {
                throw new Error('userGuid não encontrado no interceptor de requisição');
            }
            config.url = config.url?.replace('/users/', `/users/${userGuid}/`);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de resposta: Trata erros 401
api.interceptors.response.use(
    (response) => {
        if (response.status === 401) {
            // Token inválido ou expirado
            SecureStore.deleteItemAsync('authToken');
            SecureStore.deleteItemAsync('authUser');
            SecureStore.deleteItemAsync('authUserGUID');
            router.replace('/login'); // Redireciona para login
        }
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            // Token inválido ou expirado
            await SecureStore.deleteItemAsync('authToken');
            await SecureStore.deleteItemAsync('authUser');
            await SecureStore.deleteItemAsync('authUserGUID');
            router.replace('/login'); // Redireciona para login
        }
        return Promise.reject(error);
    }
);

export default api;
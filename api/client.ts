// import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import axios, { isAxiosError } from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Crie uma instância do Axios
const api = axios.create({
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
                SecureStore.deleteItemAsync('authToken');
                SecureStore.deleteItemAsync('authUser');
                SecureStore.deleteItemAsync('authUserGUID');
                router.replace('/login'); // Redireciona para login
            }
            config.url = config.url?.replace('/users/', `/users/${userGuid}/`);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de resposta: Trata erros 401
api.interceptors.response.use(
    async (response) => {
        console.log("Resp")
        // console.log(response);
        if (response.status === 401) {
            // Token inválido ou expirado
            await resetStorage();
            router.replace('/login'); // Redireciona para login
        }
        return response;
    },
    async (error) => {
        console.log("Error");
        console.log(error);

        if (isAxiosError(error) && error.response?.status !== 401) {
            return router.replace('/error');
        }

        if (error.response?.status === 401) {
            console.log("Error 401");
            // Token inválido ou expirado
            await resetStorage();
            return router.replace('/login'); // Redireciona para login
        }
        return Promise.reject(error);
    }
);

const resetStorage = async () => {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('authUser');
    await SecureStore.deleteItemAsync('authUserGUID');
}

export default api;
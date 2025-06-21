import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import useErrorStore from 'store/errorStore';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Crie uma instância do Axios
const api = axios.create({
    baseURL: apiUrl, // Ex.: https://api.exemplo.com
    timeout: 10000,
});

let isInterceptorConfigured = false;

export const setupInterceptors = (signOut: () => Promise<void>) => {
    if (isInterceptorConfigured) {
        return;
    }
    // Interceptor de requisição: Adiciona o token ao cabeçalho
    api.interceptors.request.use(
        async (config) => {
            const token = await SecureStore.getItemAsync('authToken');
            const userGuid = await SecureStore.getItemAsync('authUserGUID');
            if (!config.url) {
                throw new Error('URL não definida no interceptor de requisição');
            }

            config.url = '/api' + config.url
            console.log("Busca em: " + config.url);

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            if (config.url.startsWith('/api/users/auth/')) {
                return config; // Não adiciona o token para URLs de autenticação
            }
            
            if (config.data) {
                console.log("Dados da requisição:", config.data);
            }

            if (config.url!.startsWith('/api/users/')) {
                
                if (!userGuid) {
                    await signOut();
                }
                config.url = config.url?.replace('/users/', `/users/${userGuid}/`);
            }

            return config;
        },
        (error) => {
            console.log("Erro no interceptor de requisição:", error);
            return Promise.reject(error)
        }
    );

    //Interceptor de resposta: Trata erros 401
    api.interceptors.response.use(
        async (response) => {
            console.log(`Resposta da API (${response.status}):`, response.config.url);
            if (response.status === 401) {
                // Token inválido ou expirado
                await signOut();
            }
            return response;
        },
        async (error) => {
            console.log("Erro na resposta da API:", error.config?.url, error.response?.status, error.message);
            
            if (!error.response) {
                console.log("Erro de rede ou timeout");
                useErrorStore.getState().setError('Erro de conexão com o servidor');
            }

            if (error.response?.status === 401) {
                console.log("Erro 401 - Token inválido");
                useErrorStore.getState().setError('Usuário não autenticado');
                await signOut();
            }
            
            if (error.response?.status >= 500) {
                console.log("Erro do servidor:", error.response.status);
                useErrorStore.getState().setError('Erro interno do servidor');
            }
            
            return Promise.reject(error);
        }
    );

    isInterceptorConfigured = true;
}


export default api;
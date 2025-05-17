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

            if (config.url!.startsWith('/api/users/')) {
                if (!userGuid) {
                    await signOut();
                }
                config.url = config.url?.replace('/users/', `/users/${userGuid}/`);
            }

            return config;
        },
        (error) => {
            console.log("######################################################################")
            console.log(error)

            return Promise.reject(error)
        }
    );

    //Interceptor de resposta: Trata erros 401
    api.interceptors.response.use(
        async (response) => {
            // console.log(response);
            if (response.status === 401) {
                // Token inválido ou expirado
                await signOut();
            }
            return response;
        },
        async (error) => {
            if (!error.response) {
                console.log("Error no AXIOS");
                useErrorStore.getState().setError('Erro desconhecido no servidor');
            }

            if (error.response?.status === 401) {
                console.log("Error 401");
                useErrorStore.getState().setError('Usuário não autenticado');
                signOut();
            }
            return Promise.reject(error);
        }
    );

    isInterceptorConfigured = true;
}


export default api;
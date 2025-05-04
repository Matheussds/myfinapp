import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { UserCredentialsDTO } from '@api/DTOs/credentionsDTO';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

WebBrowser.maybeCompleteAuthSession();

const Login: React.FC = () => {
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [userInfo, setUserInfo] = useState(null);
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: '1000500310954-b0b5dqdbn3665jsapn3pim3s3ehubs1l.apps.googleusercontent.com',
        redirectUri: 'https://auth.expo.io/@matheussds/myfin',
    });

    const router = useRouter();

    // const loadCredentials = async (email: string, password: string) => {
    //     try {
    //         const tokenValid = await checkToken(); // Verifica se o token está válido
    //         console.log('Token válido:', tokenValid);

    //         if (tokenValid) {
    //             signIn(tokenValid); // Chama a função para marcar como autenticado
    //             router.push('/'); // Redireciona para a tela inicial após o login
    //         } else {
    //             console.log('Tentando fazer login com email e senha...');
    //             const credentials = await fetch(`${apiUrl}/api/users/auth/login`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({ email, password }),
    //             });
    //             const json = await credentials.json();
    //             if (!credentials.ok) {
    //                 console.error('Erro ao validar:', json);
    //                 Alert.alert('Erro', 'Usuário ou senha inválidos!');
    //                 return
    //             }
    //             console.log('Resposta:', json);
    //             const { accessToken } = json; // Supondo que o token esteja na resposta
    //             signIn(accessToken); // Chama a função para marcar como autenticado
    //             router.push('/');
    //         }
    //     }
    //     catch (error) {
    //         console.error('Erro ao carregar as credenciais', error);
    //     }
    // };

    const handleLogin = async () => {
        try {
            //Definir os tipos dos dados de resposta UserDTO
            //o response.data deve ser do tipo UserDTO
            const response: { data: UserCredentialsDTO }= await axios.post(apiUrl + '/api/users/auth/login', { email, password });
            const { token, user } = response.data;

            if (!user.guid) {
                Alert.alert("Usuário sem identificador único")
                return
            }

            await signIn(token, user.guid, user); // Chama a função para marcar como autenticado
            router.replace('/'); // Redireciona para a tela inicial após o login
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        }
    };

    // const handleSubmit = () => {
    //     try {
    //         loadCredentials(email, password); // Chama a função para carregar as credenciai
    //     } catch (error) {
    //         if (error instanceof z.ZodError) {
    //             Alert.alert('Erro', error.errors.map(err => err.message).join('\n'));
    //         }
    //     }
    // };

    // useEffect(() => {
    //     console.log('tela de loguin', request);
    // }, []);

    // useEffect(() => {
    //     const checkAuth = async () => {
    //         console.log("useEffect Login.tsx -> checkToken()");
    //         try {
    //             const tokenValid = await checkToken(); // Verifica se o token está válido

    //             if (tokenValid) {
    //                 console.log('useEffect Login.tsx -> Token válidado');
    //                 console.log('useEffect Login.tsx -> Armazenando token com signIn...');
    //                 signIn(tokenValid); // Chama a função para marcar como autenticado
    //                 console.log('Redirect -> /home');
    //                 router.push('/'); // Redireciona para a tela inicial após o login
    //             }
    //         } catch (error) {
    //             console.error('Erro ao carregar as credenciais', error);
    //         }
    //     }

    //     checkAuth(); // Verifica se o token está válido quando a tela de login é carregada

    //     if (response?.type === 'success') {
    //         // if (response?.type === 'dismiss') {
    //         const { id_token } = response.params;
    //         const { authentication } = response;
    //         // Aqui você pode tratar o token e fazer a autenticação
    //         console.log(authentication);
    //         console.log('JWT Token:', id_token);

    //         fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${id_token}`)
    //             .then(response => response.json())
    //             .then(data => {
    //                 setUserInfo(data);
    //                 // Você pode salvar o email ou outros dados que precisar
    //                 console.log('User Info:', data);
    //                 signInWithGoogle(data); // Chama a função para marcar como autenticado
    //             })
    //             .catch(error => console.error('Error fetching user info:', error));

    //         // router.push('/'); // Redireciona para a tela inicial após o login
    //     }
    // }, [response]);

    return (
        <View style={styles.container}>
            <Text>Acessar</Text>
            <View style={{ width: '100%', alignItems: 'center' }}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            <TouchableOpacity style={[styles.button, styles.buttonLogin]} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonGoogle]} onPress={() => promptAsync()}>
                <MaterialCommunityIcons name="google" size={24} color="white" />
                <Text style={styles.buttonText}>Acessar com Google</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={[styles.button, styles.buttonGoogle]} onPress={() => router.push('/signup')}>
                <MaterialCommunityIcons name="account-plus" size={24} color="white" />
                <Text style={styles.buttonText}>Cadastre-se</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
    },
    input: {
        height: 40,
        marginBottom: 15,
        paddingHorizontal: 10,
        width: '80%',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
    },
    separator: {
        height: 1,
        backgroundColor: 'black',
        marginVertical: 10,
        width: '80%',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 5,
        width: '80%',
        gap: 10
    },
    buttonGoogle: {
        backgroundColor: '#4285F4',
    },
    buttonLogin: {
        backgroundColor: '#000',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    }
});

export default Login;
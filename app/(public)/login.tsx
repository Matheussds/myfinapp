import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { UserCredentialsDTO } from '@api/DTOs/credentionsDTO';
import useErrorStore from 'store/errorStore';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

WebBrowser.maybeCompleteAuthSession();

const Login: React.FC = () => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [userInfo, setUserInfo] = useState(null);
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: '1000500310954-b0b5dqdbn3665jsapn3pim3s3ehubs1l.apps.googleusercontent.com',
        redirectUri: 'https://auth.expo.io/@matheussds/myfin',
    });
    const { clearError } = useErrorStore();

    const router = useRouter();

    const handleLogin = async () => {
        try {
            //Definir os tipos dos dados de resposta UserDTO
            //o response.data deve ser do tipo UserDTO
            const response: { data: UserCredentialsDTO } = await axios.post(apiUrl + '/api/users/auth/login', { email, password });
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

    useEffect(() => {
        console.log("Login renderizada");
        clearError();
    }, [])

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
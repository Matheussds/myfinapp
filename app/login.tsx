import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { z } from 'zod';

const userSchema = z.object({
    username: z.string().min(1, 'Nome de usuário é obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string()
        .min(8, 'A senha deve ter pelo menos 8 caracteres')
        .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
        .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
        .regex(/[\W_]/, 'A senha deve conter pelo menos um caractere especial'),
});

WebBrowser.maybeCompleteAuthSession();

const Login: React.FC = () => {
    const { signIn } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: '1000500310954-b0b5dqdbn3665jsapn3pim3s3ehubs1l.apps.googleusercontent.com',
        redirectUri: 'https://auth.expo.io/@matheussds/myfin',
    });

    const router = useRouter();

    const handleSubmit = () => {
        try {
            userSchema.parse({ username, email, password });
            // Se a validação passar, você pode prosseguir com o cadastro
            Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');

            signIn(); // Chama a função para marcar como autenticado
            router.push('/'); // Redireciona para a tela inicial após o login

        } catch (error) {
            if (error instanceof z.ZodError) {
                Alert.alert('Erro', error.errors.map(err => err.message).join('\n'));
            }
        }
    };

    // useEffect(() => {
    //     console.log('rodou');
    //     Alert.alert('Erro', 'Login');

    // }, []);

    useEffect(() => {
        console.log('rodou');
        console.log(response);
        if (response?.type === 'success') {
            // if (response?.type === 'dismiss') {
            const { id_token } = response.params;
            const { authentication } = response;
            // Aqui você pode tratar o token e fazer a autenticação
            console.log(authentication);
            console.log('JWT Token:', id_token);

            fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${id_token}`)
                .then(response => response.json())
                .then(data => {
                    setUserInfo(data);
                    // Você pode salvar o email ou outros dados que precisar
                    console.log('User Info:', data);
                })
                .catch(error => console.error('Error fetching user info:', error));

            signIn(); // Chama a função para marcar como autenticado
            router.push('/'); // Redireciona para a tela inicial após o login
        }

        signIn(); // Chama a função para marcar como autenticado
        router.push('/');
    }, [response]);

    return (
        <View style={styles.container}>
            <Text>Login Screen Teste</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome de usuário"
                value={username}
                onChangeText={setUsername}
            />
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
            <Button title="Cadastrar" onPress={handleSubmit} />
            <View style={styles.separator} />;
            <TouchableOpacity style={styles.buttonGoogle} onPress={() => promptAsync()}>
                <MaterialCommunityIcons name="google" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Acessar com Google</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    separator: {
        height: 1,          // Altura da linha
        backgroundColor: 'black', // Cor da linha
        marginVertical: 10, // Espaçamento acima e abaixo
    },
    buttonGoogle: {
        backgroundColor: '#4285F4',
        padding: 15,
        borderRadius: 5,
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginLeft: 10, // Espaço entre o ícone e o texto
    },
    icon: {
        marginRight: 10, // Espaço entre o ícone e o texto
    },
});

export default Login;
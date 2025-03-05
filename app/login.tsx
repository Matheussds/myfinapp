import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { MaterialCommunityIcons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

const Login: React.FC = () => {
    const { signIn } = useAuth();
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    });

    const router = useRouter();

    useEffect(() => {
        console.log('rodou');
        console.log(response);
        // if (response?.type === 'success') {
        if (response?.type === 'dismiss') {
            // const { authentication } = response;
            // Aqui você pode tratar o token e fazer a autenticação
            // console.log(authentication); 

            signIn(); // Chama a função para marcar como autenticado
            router.push('/'); // Redireciona para a tela inicial após o login
        }
    }, [response]);

    return (
        <View style={styles.container}>
            <Text>Login Screen</Text>
            <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
                <MaterialCommunityIcons name="google" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Acessar com Google</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
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
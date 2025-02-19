import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const Login: React.FC = () => {
    const { signIn } = useAuth();
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    });

    const router = useRouter();

    useEffect(() => {
        console.log(response);
        if (response?.type === 'success') {
            const { authentication } = response;
            // Aqui você pode tratar o token e fazer a autenticação 

            signIn(); // Chama a função para marcar como autenticado
            router.push('/'); // Redireciona para a tela inicial após o login
        }
    }, [response]);

    return (
        <View style={styles.container}>
            <Text>Login Screen</Text>
            <Button
                title="Sign in with Google"
                disabled={!request}
                onPress={() => promptAsync()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Login;
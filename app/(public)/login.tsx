import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { UserCredentialsDTO } from '@api/DTOs/credentionsDTO';
import useErrorStore from 'store/errorStore';
import { colors, spacing, borderRadius, shadows } from '../../utils/designSystem';
import Text from '../../components/ui/base/Text';
import Button from '../../components/ui/base/Button';
import Card from '../../components/ui/base/Card';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

WebBrowser.maybeCompleteAuthSession();

const Login: React.FC = () => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: '1000500310954-b0b5dqdbn3665jsapn3pim3s3ehubs1l.apps.googleusercontent.com',
        redirectUri: 'https://auth.expo.io/@matheussds/myfin',
    });
    const { clearError } = useErrorStore();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);
        try {
            const response: { data: UserCredentialsDTO } = await axios.post(apiUrl + '/api/users/auth/login', { email, password });
            const { token, user } = response.data;

            if (!user.guid) {
                Alert.alert("Erro", "Usuário sem identificador único");
                return;
            }

            await signIn(token, user.guid, user);
            router.replace('/');
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            Alert.alert('Erro', 'Email ou senha incorretos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("Login renderizada");
        clearError();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text variant="h1" color="primary" weight="bold" align="center">
                            MyFin
                        </Text>
                        <Text variant="body" color="secondary" align="center" style={styles.subtitle}>
                            Gerencie suas finanças de forma simples e eficiente
                        </Text>
                    </View>

                    {/* Formulário */}
                    <Card variant="elevated" style={styles.formCard}>
                        <Text variant="h3" color="primary" weight="semibold" align="center" style={styles.formTitle}>
                            Acessar Conta
                        </Text>

                        {/* Campo Email */}
                        <View style={styles.inputContainer}>
                            <Text variant="label" color="primary" style={styles.inputLabel}>
                                Email
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        {/* Campo Senha */}
                        <View style={styles.inputContainer}>
                            <Text variant="label" color="primary" style={styles.inputLabel}>
                                Senha
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite sua senha"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Botão de Login */}
                        <Button
                            title="Entrar"
                            onPress={handleLogin}
                            variant="primary"
                            size="large"
                            loading={loading}
                            fullWidth
                            style={styles.loginButton}
                        />

                        {/* Separador */}
                        <View style={styles.separator}>
                            <View style={styles.separatorLine} />
                            <Text variant="caption" color="secondary" style={styles.separatorText}>
                                ou
                            </Text>
                            <View style={styles.separatorLine} />
                        </View>

                        {/* Botão Google */}
                        <Button
                            title="Continuar com Google"
                            onPress={() => promptAsync()}
                            variant="outline"
                            size="large"
                            fullWidth
                            icon={<MaterialCommunityIcons name="google" size={20} color={colors.primary[500]} />}
                            style={styles.googleButton}
                        />

                        {/* Link para cadastro */}
                        <View style={styles.signupContainer}>
                            <Text variant="bodySmall" color="secondary" align="center">
                                Não tem uma conta?{' '}
                            </Text>
                            <Button
                                title="Cadastre-se"
                                onPress={() => router.push('/signup')}
                                variant="secondary"
                                size="small"
                            />
                        </View>
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.secondary,
    },
    
    keyboardView: {
        flex: 1,
    },
    
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    
    header: {
        alignItems: 'center',
        marginBottom: spacing['2xl'],
    },
    
    subtitle: {
        marginTop: spacing.sm,
        paddingHorizontal: spacing.lg,
    },
    
    formCard: {
        padding: spacing.lg,
    },
    
    formTitle: {
        marginBottom: spacing.lg,
    },
    
    inputContainer: {
        marginBottom: spacing.md,
    },
    
    inputLabel: {
        marginBottom: spacing.xs,
    },
    
    input: {
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: colors.neutral[300],
        fontSize: 16,
        color: colors.text.primary,
    },
    
    loginButton: {
        marginTop: spacing.md,
    },
    
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.lg,
    },
    
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.neutral[300],
    },
    
    separatorText: {
        marginHorizontal: spacing.md,
    },
    
    googleButton: {
        marginBottom: spacing.lg,
    },
    
    signupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Login;
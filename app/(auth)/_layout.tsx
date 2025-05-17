import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import useErrorStore from 'store/errorStore';

export default function AuthLayout() {
  const { loading, signed, signOut } = useAuth();
  const { error } = useErrorStore();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      if (error === 'Usuário não autenticado') {
        signOut();
        router.replace('/(public)/login');
        return
      }

      router.replace('/error'); // Use replace para evitar empilhar rotas
      // Limpa o erro após navegar (opcional)
      return
    }

    if (!loading && !signed) {
      console.log("Redirecionado para login.")
      router.replace('/login');
    }
  }, [signed, loading, error]);


  if (loading) {
    return null; // Ou uma tela de carregamento
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

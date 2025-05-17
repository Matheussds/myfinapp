import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import useErrorStore from 'store/errorStore';

export default function PublicLayout() {
  const { signed, loading } = useAuth();
  const router = useRouter();
  const { error } = useErrorStore();

  useEffect(() => {
    if (error) {
      if (error === 'Usuário não autenticado') {
        router.replace('/(public)/login');
        return
      }
  
      router.replace('/error'); // Use replace para evitar empilhar rotas
      return
    }
  
    if (!loading && signed) {
      console.log("Redirecionado para home.")
      router.replace('/home');
    }

  }, [signed, loading, error]);

  if (loading) {
    return null; // Ou uma tela de carregamento
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

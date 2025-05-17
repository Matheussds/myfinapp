import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { setupInterceptors } from '@api/client';
import { useAuth } from 'context/AuthContext';

export default function Index() {
  const { signed, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setupInterceptors(signOut)
    console.log("Interceptors iniciados");
    if (!loading) {
      console.log("Indo para: " + (signed ? '/home' : '/login'))
      router.replace(signed ? '/home' : '/login');
    }
  }, [signed, loading]);

  return null; // Ou uma tela de splash
}
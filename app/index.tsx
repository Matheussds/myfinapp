import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { setupInterceptors } from '@api/client';
import { useAuth } from 'context/AuthContext';

export default function Index() {
  console.log("Index component renderizado");
  const { signed, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("Index useEffect executado - signed:", signed, "loading:", loading);
    setupInterceptors(signOut)
    console.log("Interceptors iniciados");
    if (!loading) {
      console.log("Indo para: " + (signed ? '/home' : '/login'))
      router.replace(signed ? '/home' : '/login');
    }
  }, [signed, loading, signOut, router]);

  return null; // Ou uma tela de splash
}
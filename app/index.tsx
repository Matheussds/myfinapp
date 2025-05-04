import { useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

export default function Index() {
  const { signed, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.replace(signed ? '/home' : '/login');
    }
  }, [signed, loading]);

  return null; // Ou uma tela de splash
}
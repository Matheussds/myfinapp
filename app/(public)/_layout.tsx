// import { Stack, Redirect } from 'expo-router';
// import { useAuth } from '../../context/AuthContext';

import { Stack, useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';

export default function PublicLayout() {
  const { signed, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && signed) {
      router.replace('/home');
    }
  }, [signed, loading]);

  if (loading) {
    return null; // Ou uma tela de carregamento
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

// export default function AuthLayout() {
//   const { isAuthenticated } = useAuth();

//   if (isAuthenticated) {
//     console.log("Autenticado")
//     return <Redirect href="/" />;
//   }

//   return <Stack screenOptions={{ headerShown: false }}/>;
// }
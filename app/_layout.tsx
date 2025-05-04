import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* As rotas filhas serão renderizadas automaticamente */}
      </Stack>
    </AuthProvider>
  );
}

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <AuthLayout />
//     </AuthProvider>
//   );
// }

// function AuthLayout() {
//   const { loading } = useAuth();

//   if (loading) {
//     console.log("Loading raiz")
//     return <LoadingScreen />;
//   }

//   //Talvez o uso de slot não seja mais util
//   return <Slot screenOptions={{ headerShown: false }}/>;
// }
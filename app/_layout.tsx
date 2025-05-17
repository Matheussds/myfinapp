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

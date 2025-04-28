import { Slot, Redirect } from 'expo-router';
import { AuthProvider, useAuth } from '../context/ctx';
import LoadingScreen from '@components/ui/LoadingScreen';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthLayout />
    </AuthProvider>
  );
}

function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return <Slot screenOptions={{ headerShown: false }}/>;
}
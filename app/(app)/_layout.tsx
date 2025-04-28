import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../context/ctx';
import LoadingScreen from '@components/ui/LoadingScreen';

export default function AppLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }}/>;
}
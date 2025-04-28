import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../context/ctx';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }}/>;
}
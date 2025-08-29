import { useAuth } from '@clerk/clerk-expo';
import { router, Stack, Redirect } from 'expo-router'; // Fixed: Redirect is a named export
import { View, Text } from 'react-native';
import PageLoader from '../components/PageLoader';

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  // If user is signed in, redirect to home
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
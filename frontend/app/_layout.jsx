import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Redirect, Slot } from 'expo-router'
import PageLoader from './components/PageLoader'

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <AuthGate/>
        <Slot />
    </ClerkProvider>
  )
}

const AuthGate = ({ children }) => {
  const { isLoading, isSignedIn } = useAuth()

  // Show loader while checking auth status
  if (isLoading) {
    return <PageLoader />
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />
  }

  // Render protected content
  return <Redirect href="/"/>
}

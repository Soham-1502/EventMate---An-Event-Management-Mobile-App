import { Stack } from 'expo-router';
import React from 'react'
import SafeScreen from '../components/SafeScreen';

function Layout() {
  return (
    <SafeScreen>
        <Stack screenOptions={{headerShown:false}}/>
    </SafeScreen>
  );
}

export default Layout

import { AuthProvider } from '@/contexts/authContext'
import { Stack } from 'expo-router'
import React from 'react'
import { KeyboardProvider } from 'react-native-keyboard-controller';
import useNetwork from '@/utils/useNetwork'
import { connectSocket, disconnectSocket } from '@/socket/socket';
import { useEffect } from 'react';

const StackLayout = () => {
  return <Stack screenOptions={{ headerShown: false }}>
    {/* <Stack.Screen name='(main)/profileModels' options={{presentation:"modal"}} /> */}
  </Stack>

}

const RootLayout = () => {
  const isOnline = useNetwork();

  useEffect(() => {

    async function initSocket() {

      if (isOnline) {

        try {
          await connectSocket();
          console.log("Socket connected");
        } catch {
          console.log("Socket failed but app continues");
        }

      } else {

        disconnectSocket();
        console.log("Offline mode");

      }

    }

    initSocket();

  }, [isOnline]);

  return (
    <KeyboardProvider>
        <AuthProvider>
            <StackLayout/>
        </AuthProvider>
    </KeyboardProvider>

  )
}
export default RootLayout;
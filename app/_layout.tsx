import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { AuthProvider, useAuth } from '@/contexts/authContext';
import useNetwork from '@/utils/useNetwork';
import { connectSocket, disconnectSocket } from '@/socket/socket';
import { API_URL } from '@/constants';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Updates from 'expo-updates';



// ---------------- STACK ----------------
const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name='(main)/profileModels' options={{presentation:"modal"}} /> */}
    </Stack>
  );
};


// ---------------- MAIN LOGIC ----------------
const AppInitializer = () => {

  const router = useRouter();
  const isOnline = useNetwork();
  const { user } = useAuth();

  

  // 🔌 SOCKET CONNECTION
  useEffect(() => {
    async function initSocket() {
      if (isOnline) {
        try {
          await connectSocket();
          console.log("✅ Socket connected");
        } catch {
          console.log("⚠️ Socket failed but app continues");
        }
      } else {
        disconnectSocket();
        console.log("📴 Offline mode");
      }
    }

    initSocket();
  }, [isOnline]);


  

useEffect(() => {
  async function forceUpdate() {
    try {
      const update = await Updates.checkForUpdateAsync();

      

      if (update.isAvailable) {
        
        await Updates.fetchUpdateAsync();

        
        await Updates.reloadAsync();
      } else {
        console.log("something went wrong");
      }
    } catch (e) {
      console.log("Update error:", e);
    }
  }

  forceUpdate();
}, []);


  return <StackLayout />;
};


// ---------------- ROOT ----------------
const RootLayout = () => {
  return (
    <KeyboardProvider>
      <AuthProvider>
        <AppInitializer />
      </AuthProvider>
    </KeyboardProvider>
  );
};

export default RootLayout;
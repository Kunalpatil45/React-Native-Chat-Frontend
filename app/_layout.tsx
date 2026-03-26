import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {registerForPushNotifications } from "../utils/notification"
import { AuthProvider, useAuth } from '@/contexts/authContext';
import useNetwork from '@/utils/useNetwork';
import { connectSocket, disconnectSocket } from '@/socket/socket';
import { API_URL } from '@/constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Updates from 'expo-updates';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: false,
  }),
});
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


  // 🔔 PUSH NOTIFICATION SETUP
  useEffect(() => {
    if (!user?._id) return; // 🧠 WAIT FOR AUTH

    const setupPush = async () => {
      try {
        const token = await registerForPushNotifications();

        if (!token) return;

        console.log("📲 Sending token to backend:", token);

        await fetch(`${API_URL}/save-token`, { // ⚠️ CHANGE IP
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            token,
          }),
        });

        console.log("✅ Push token saved");
      } catch (err) {
        console.log("❌ Push setup error:", err);
      }
    };

    setupPush();
  }, [user]);

  useEffect(() => {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }
}, []);

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

useEffect(() => {
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    console.log("Notification clicked:", response);

    const chatId =
      response.notification.request.content.data?.chatId as string | undefined;

    if (chatId) {
      router.push({
        pathname: "/(main)/Conversation" as any,
        params: { id: chatId },
      });
    }
  });

  

  return () => subscription.remove();
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
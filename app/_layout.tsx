import { Stack } from "expo-router";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NotificationProvider } from "@/context/NotificationsContext";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync"; // ⬅️ buraya ekle
import { savePushTokenToFirestore } from "@/utils/savePushTokenToFirestore";

// Bildirimleri otomatik işleme
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("✅ Push token alındı:", token);
        savePushTokenToFirestore(token); // ⬅️ direkt Firestore'a yaz
      })
      .catch((err) => {
        console.error("❌ Push token alınamadı:", err);
      });
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("✅ Push token alındı:", token);
      })
      .catch((err) => {
        console.error("❌ Push token alınamadı:", err);
      });
  }, []);

  return (
    <NotificationProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </NotificationProvider>
  );
}

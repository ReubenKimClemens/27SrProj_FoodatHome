import { Nunito_500Medium, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { Quicksand_700Bold } from "@expo-google-fonts/quicksand";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useAuthUser } from "@/lib/auth";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({ Quicksand_700Bold, Nunito_500Medium, Nunito_700Bold });
  const user = useAuthUser();

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!user} redirectTo="/login">
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="scan/index" />
          <Stack.Screen name="scan/manual-items" />
          <Stack.Screen name="scan/scanned-items" />
          <Stack.Screen name="scan/scanning-tips" />
        </Stack.Protected>
        <Stack.Protected guard={!user} redirectTo="/">
          <Stack.Screen name="login" />
        </Stack.Protected>
      </Stack>
    </GestureHandlerRootView>
  );
}

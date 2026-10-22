import { Tabs } from "expo-router/js-tabs";

import NavigationBar from "@/components/NavigationBar";
import { Colors } from "@/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <NavigationBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Colors.bgPagePrimary },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="inventory" options={{ title: "Inventory" }} />
      <Tabs.Screen name="scan" options={{ title: "Receipt" }} />
      <Tabs.Screen name="metrics" options={{ title: "Metrics" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

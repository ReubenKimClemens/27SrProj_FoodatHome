import { router } from "expo-router";
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
      <Tabs.Screen
        name="receipt"
        options={{ title: "Receipt" }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/scan");
          },
        }}
      />
      <Tabs.Screen name="metrics" options={{ title: "Metrics" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

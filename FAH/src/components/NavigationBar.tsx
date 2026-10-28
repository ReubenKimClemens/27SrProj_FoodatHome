import { Image, type ImageSource } from "expo-image";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Fonts, Shadows } from "@/constants/theme";

type NavIcons = { active: ImageSource; inactive: ImageSource };

const ICONS: Record<string, NavIcons> = {
  index: {
    active: require("@/assets/icons/nav_home_active.svg"),
    inactive: require("@/assets/icons/nav_home_inactive.svg"),
  },
  inventory: {
    active: require("@/assets/icons/nav_inventory_active.svg"),
    inactive: require("@/assets/icons/nav_inventory_inactive.svg"),
  },
  metrics: {
    active: require("@/assets/icons/nav_metrics_active.svg"),
    inactive: require("@/assets/icons/nav_metrics_inactive.svg"),
  },
  profile: {
    active: require("@/assets/icons/nav_profile_active.svg"),
    inactive: require("@/assets/icons/nav_profile_inactive.svg"),
  },
};

const SCAN_ROUTE = "scan";

export default function NavigationBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.navbar, { paddingBottom: 16 + insets.bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const isFocused = state.index === index;
        const isScan = route.name === SCAN_ROUTE;

        function onPress() {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        }

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.navItem}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: isFocused }}
          >
            {isScan ? (
              <View style={styles.scanIcon}>
                <Image
                  source={require("@/assets/icons/nav_receipt.svg")}
                  tintColor={Colors.textOnAction}
                  contentFit="contain"
                  style={styles.scanImage}
                />
              </View>
            ) : (
              <View style={styles.iconWrapper}>
                <Image
                  source={isFocused ? ICONS[route.name]?.active : ICONS[route.name]?.inactive}
                  contentFit="contain"
                  style={styles.navImage}
                />
              </View>
            )}
            <Text style={styles.navLabel}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.bgPageSecondary,
    boxShadow: Shadows.navBar,
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  navImage: {
    width: 28,
    height: 28,
  },
  scanIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  scanImage: {
    width: 32,
    height: 32,
  },
  navLabel: {
    color: Colors.textDefault,
    fontFamily: Fonts.nunitoMedium,
    fontSize: 14,
    lineHeight: 20,
  },
});

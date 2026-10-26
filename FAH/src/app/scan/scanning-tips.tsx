import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconButton } from "@/components/IconButton";
import { ScanningTips } from "@/components/ScanningTips";
import { COLORS } from "@/lib/theme";

export default function ScanningTipsScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <View style={styles.heading}>
        <IconButton name="arrow-left" label="Back" onPress={() => router.back()} style={styles.backBtn} />
        <Text style={styles.title}>Help</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <ScanningTips />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.pagePrimary,
    paddingHorizontal: 16,
  },
  heading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  backBtn: {
    position: "absolute",
    left: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textDefault,
  },
  content: {
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 2,
  },
});

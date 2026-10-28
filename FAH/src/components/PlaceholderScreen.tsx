import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PageHeader from "@/components/PageHeader";
import { Colors, Fonts } from "@/constants/theme";

// Stand-in for tabs that haven't been ported from the web app yet.
export default function PlaceholderScreen({ title }: { title: string }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <PageHeader title={title} />
      <View style={styles.body}>
        <Text style={styles.text}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: Colors.bgPagePrimary,
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Colors.textSecondary,
    fontFamily: Fonts.nunitoMedium,
    fontSize: 16,
  },
});

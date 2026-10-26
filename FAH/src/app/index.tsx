import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

import { COLORS } from "@/lib/theme";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
      <Link href="/scan" style={styles.link}>
        Scan a receipt
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  link: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.brandPrimary,
  },
});

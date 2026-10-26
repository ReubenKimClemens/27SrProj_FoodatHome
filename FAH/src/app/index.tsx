import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
      <Link href="/metrics" style={styles.link}>
        Metrics
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
    color: "#0FA376",
  },
});

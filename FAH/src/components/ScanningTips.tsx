import { StyleSheet, Text, View } from "react-native";

import { COLORS, SHADOW } from "@/lib/theme";

const TIPS = [
  {
    title: "Capture the Important Info",
    description: "Make sure your photo clearly shows the store name, location, items, prices, and the total amount.",
  },
  {
    title: "Take a Clear Photo",
    description: "Use even lighting, flatten your receipt, and tap the screen to focus before taking the picture.",
  },
  {
    title: "Remove Background Clutter",
    description: "Place the receipt on a clean, solid and dark surface so the scanner can easily detect edges.",
  },
  {
    title: "Smooth Out Wrinkles",
    description: "Gently smooth out creases or folds so the printed text is easier for the system to read.",
  },
];

export function ScanningTips() {
  return (
    <View style={styles.list}>
      {TIPS.map((tip, index) => (
        <View key={tip.title} style={styles.card}>
          <View style={styles.number}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{tip.title}</Text>
            <Text style={styles.description}>{tip.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    width: "100%",
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: COLORS.pageSecondary,
    borderRadius: 8,
    ...SHADOW,
  },
  number: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brandSecondaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    color: COLORS.brandSecondary,
    fontSize: 20,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: COLORS.textDefault,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
  },
});

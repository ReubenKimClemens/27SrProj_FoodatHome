import { StyleSheet, Text } from "react-native";

import { getCategoryColor } from "@/lib/categories";

export function CategoryBadge({ category }: { category: string }) {
  const color = getCategoryColor(category);
  return <Text style={[styles.badge, { backgroundColor: color.light, color: color.dark }]}>{category}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    fontSize: 13,
    fontWeight: "700",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 6,
    overflow: "hidden",
  },
});

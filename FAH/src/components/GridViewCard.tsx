import { Pressable, StyleSheet, Text, View } from "react-native";

import { CategoryBadge } from "@/components/CategoryBadge";
import { addedText } from "@/lib/mockInventory";
import { COLORS, RADIUS, SHADOW } from "@/lib/theme";
import { Typography } from "@/constants/theme";

type GridViewCardProps = {
  itemName: string;
  quantity: number;
  category: string;
  createdAt: string;
  onPress: () => void;
};

export function GridViewCard({ itemName, quantity, category, createdAt, onPress }: GridViewCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{quantity}</Text>
      </View>
      <CategoryBadge category={category} />
      <Text style={styles.name}>{itemName}</Text>
      <Text style={styles.added}>{addedText(createdAt)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: COLORS.pageSecondary,
    borderRadius: RADIUS.rounded,
    ...SHADOW,
  },
  countBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.brandSecondaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    ...Typography.bodySmBold,
    color: COLORS.brandSecondary,
  },
  name: {
    ...Typography.bodyMdBold,
    color: COLORS.textDefault,
    textAlign: "center",
  },
  added: {
    ...Typography.bodySm,
    color: COLORS.textSecondary,
  },
});

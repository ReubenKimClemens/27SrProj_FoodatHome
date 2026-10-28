import { StyleSheet, Text, View } from "react-native";

import { CategoryBadge } from "@/components/CategoryBadge";
import { addedText } from "@/lib/mockInventory";
import { COLORS } from "@/lib/theme";
import { Typography } from "@/constants/theme";

type InventoryItemCardProps = {
  itemName: string;
  quantity: number;
  category: string;
  createdAt: string;
};

export function InventoryItemCard({ itemName, quantity, category, createdAt }: InventoryItemCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.itemName}>{itemName}</Text>
      <View style={styles.meta}>
        <CategoryBadge category={category} />
        <Text style={styles.metaText}>Qty: {quantity}</Text>
      </View>
      <Text style={styles.metaText}>{addedText(createdAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 4,
    padding: 16,
    backgroundColor: COLORS.pageSecondary,
  },
  itemName: {
    ...Typography.titleSm,
    color: COLORS.textDefault,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    ...Typography.bodySm,
    color: COLORS.textSecondary,
  },
});

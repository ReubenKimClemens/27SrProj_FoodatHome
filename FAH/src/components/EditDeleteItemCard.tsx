import { StyleSheet, Text, View } from "react-native";

import { CategoryBadge } from "@/components/CategoryBadge";
import { IconButton } from "@/components/IconButton";
import { COLORS, RADIUS, SHADOW } from "@/lib/theme";
import { Typography } from "@/constants/theme";

type EditDeleteItemCardProps = {
  itemName: string;
  category: string;
  quantity: number;
  price: number;
  onEdit: () => void;
  onDelete: () => void;
};

export function EditDeleteItemCard({
  itemName,
  category,
  quantity,
  price,
  onEdit,
  onDelete,
}: EditDeleteItemCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.details}>
        <Text style={styles.itemName} numberOfLines={2}>
          {itemName}
        </Text>
        <View style={styles.footer}>
          <CategoryBadge category={category} />
          <Text style={styles.quantity}>Qty: {quantity}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
        <View style={styles.actions}>
          <IconButton name="trash-2" label={`Delete ${itemName}`} onPress={onDelete} size={22} style={styles.iconBtn} />
          <IconButton name="edit-2" label={`Edit ${itemName}`} onPress={onEdit} size={22} style={styles.iconBtn} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: COLORS.pageSecondary,
    borderRadius: RADIUS.rounded,
    paddingVertical: 16,
    paddingHorizontal: 20,
    ...SHADOW,
  },
  details: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  itemName: {
    ...Typography.titleSm,
    color: COLORS.textDefault,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  quantity: {
    ...Typography.bodyMdBold,
    color: COLORS.textSecondary,
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 6,
  },
  price: {
    ...Typography.titleSm,
    color: COLORS.textDefault,
  },
  actions: {
    flexDirection: "row",
    gap: 4,
  },
  iconBtn: {
    padding: 4,
  },
});

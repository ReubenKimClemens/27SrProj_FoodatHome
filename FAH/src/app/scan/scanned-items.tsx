import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { IconButton } from "@/components/IconButton";
import { ReceiptItemsReview } from "@/components/ReceiptItemsReview";
import { COLORS } from "@/lib/theme";
import { useReceiptItemEditor } from "@/lib/useReceiptItemEditor";
import { Typography } from "@/constants/theme";

export default function ScannedItemsScreen() {
  const editor = useReceiptItemEditor();
  const { draft } = editor;

  const storeName = draft.storeName || "Unknown Store";
  const date = draft.date || new Date().toLocaleDateString();
  const total = `$${(draft.total ?? 0).toFixed(2)}`;

  return (
    <ReceiptItemsReview
      editor={editor}
      emptyText="No items found. Tap + to add one."
      backLabel="Rescan"
      onBack={() => router.back()}
      header={
        <View style={styles.header}>
          <IconButton name="arrow-left" label="Back" onPress={() => router.back()} />
          <View style={styles.storeInfo}>
            <Text style={styles.storeName} numberOfLines={1}>
              {storeName}
            </Text>
            <Text style={styles.subtitle}>
              {date} - {total}
            </Text>
          </View>
          <IconButton name="plus" label="Add item" onPress={editor.openAdd} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  storeInfo: {
    flex: 1,
    alignItems: "center",
  },
  storeName: {
    ...Typography.titleMd,
    color: COLORS.textDefault,
  },
  subtitle: {
    ...Typography.bodySm,
    color: COLORS.textSecondary,
  },
});

import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { IconButton } from "@/components/IconButton";
import { InputField } from "@/components/InputField";
import { ReceiptItemsReview } from "@/components/ReceiptItemsReview";
import { setReceiptDraft } from "@/lib/receiptDraft";
import { COLORS } from "@/lib/theme";
import { useReceiptItemEditor } from "@/lib/useReceiptItemEditor";
import { Typography } from "@/constants/theme";

function today() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function ManualItemsScreen() {
  const editor = useReceiptItemEditor();
  const { draft } = editor;

  const date = draft.date || today();
  const total = draft.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <ReceiptItemsReview
      editor={editor}
      emptyText="No items yet. Tap + to add one."
      backLabel="Upload Receipt"
      onBack={() => router.back()}
      header={
        <>
          <View style={styles.titleRow}>
            <IconButton name="arrow-left" label="Back" onPress={() => router.back()} />
            <Text style={styles.title}>Add Items Manually</Text>
            <IconButton name="plus" label="Add item" onPress={editor.openAdd} />
          </View>
          <InputField
            label="Store"
            value={draft.storeName}
            onChangeText={(storeName) => setReceiptDraft({ storeName })}
            placeholder="e.g., Walmart"
          />
          <View style={styles.row}>
            <View style={styles.col}>
              <InputField
                label="Purchased Date"
                value={date}
                onChangeText={(value) => setReceiptDraft({ date: value })}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={[styles.col, styles.totalCol]}>
              <Text style={styles.totalLabel}>Receipt Total:</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    ...Typography.titleMd,
    color: COLORS.textDefault,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  col: {
    flex: 1,
  },
  totalCol: {
    alignItems: "center",
    paddingBottom: 6,
  },
  totalLabel: {
    ...Typography.bodyMdBold,
    color: COLORS.textDefault,
  },
  totalValue: {
    ...Typography.titleMd,
    color: COLORS.textDefault,
  },
});

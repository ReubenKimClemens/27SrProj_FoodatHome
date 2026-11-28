import type { ReactNode } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ButtonPair } from "@/components/Button";
import { EditDeleteItemCard } from "@/components/EditDeleteItemCard";
import { ItemModal } from "@/components/ItemModal";
import { COLORS } from "@/lib/theme";
import type { useReceiptItemEditor } from "@/lib/useReceiptItemEditor";
import { Layout, Typography } from "@/constants/theme";

type ReceiptItemsReviewProps = {
  editor: ReturnType<typeof useReceiptItemEditor>;
  header: ReactNode;
  emptyText: string;
  backLabel: string;
  onBack: () => void;
};

export function ReceiptItemsReview({ editor, header, emptyText, backLabel, onBack }: ReceiptItemsReviewProps) {
  const { draft, modal, openEdit, deleteItem, confirm, saving, saveError } = editor;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>{header}</View>

      <FlatList
        data={draft.items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>{emptyText}</Text>}
        renderItem={({ item }) => (
          <EditDeleteItemCard
            itemName={item.itemName}
            category={item.category}
            quantity={item.quantity}
            price={item.price}
            onEdit={() => openEdit(item)}
            onDelete={() => deleteItem(item.id)}
          />
        )}
      />

      {saveError ? <Text style={styles.saveError}>{saveError}</Text> : null}

      <ButtonPair
        buttons={[
          { label: backLabel, variant: "outline", onPress: onBack, disabled: saving },
          { label: saving ? "Saving..." : "Confirm", variant: "primary", onPress: confirm, disabled: saving },
        ]}
      />

      <ItemModal {...modal} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.pagePrimary,
    paddingHorizontal: Layout.pagePadding,
    paddingBottom: 16,
    gap: 12,
  },
  header: {
    paddingTop: 8,
    gap: 12,
  },
  list: {
    gap: 12,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  empty: {
    ...Typography.bodyMd,
    textAlign: "center",
    color: COLORS.textSecondary,
    marginTop: 32,
  },
  saveError: {
    ...Typography.bodySm,
    color: COLORS.textDanger,
    textAlign: "center",
  },
});

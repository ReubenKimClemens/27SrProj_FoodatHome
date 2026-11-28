import { router } from "expo-router";
import { useState } from "react";

import type { ItemFormData } from "@/components/ItemModal";
import { saveReceiptItems } from "@/lib/mockApi";
import { setReceiptDraft, useReceiptDraft } from "@/lib/receiptDraft";
import type { ReceiptItem } from "@/lib/receiptParser";

export function useReceiptItemEditor() {
  const draft = useReceiptDraft();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ReceiptItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  function openModal(item: ReceiptItem | null) {
    setEditingItem(item);
    setModalVisible(true);
  }

  function deleteItem(id: number) {
    setReceiptDraft({ items: draft.items.filter((item) => item.id !== id) });
  }

  function saveItem(data: ItemFormData) {
    const items = editingItem
      ? draft.items.map((item) => (item.id === editingItem.id ? itemFromForm(data, item.id) : item))
      : [...draft.items, itemFromForm(data)];
    setReceiptDraft({ items });
  }

  async function confirm() {
    if (draft.items.length === 0) {
      setSaveError("Add at least one item before confirming.");
      return;
    }
    setSaveError("");
    setSaving(true);
    try {
      await saveReceiptItems(draft.items);
      router.dismissTo("/");
    } catch {
      setSaveError("Failed to save items. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return {
    draft,
    modal: {
      visible: modalVisible,
      title: editingItem ? "Edit Item" : "Add New Item",
      initialData: editingItem,
      onClose: () => setModalVisible(false),
      onSubmit: saveItem,
    },
    openAdd: () => openModal(null),
    openEdit: openModal,
    deleteItem,
    confirm,
    saving,
    saveError,
  };
}

export function itemFromForm(data: ItemFormData, id = Date.now()): ReceiptItem {
  return {
    id,
    itemName: data.itemName,
    category: data.category,
    quantity: data.quantity,
    price: data.price,
    unit: data.unit,
    date: data.date,
    note: data.note,
  };
}

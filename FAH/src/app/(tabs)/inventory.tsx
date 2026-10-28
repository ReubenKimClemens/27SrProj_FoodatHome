import { Feather } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CategoryChip } from "@/components/CategoryChip";
import { GridViewCard } from "@/components/GridViewCard";
import { IconButton } from "@/components/IconButton";
import { ItemModal, type ItemFormData } from "@/components/ItemModal";
import { SwipeableItem } from "@/components/SwipeableItem";
import { CATEGORIES } from "@/lib/categories";
import { SAMPLE_INVENTORY, type InventoryItem } from "@/lib/mockInventory";
import { COLORS, RADIUS } from "@/lib/theme";
import { Layout, Typography } from "@/constants/theme";

type SortOrder = "Newest First" | "Oldest First";

function dateInputToIso(value: string): string | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])).toISOString();
}

function isoToDateInput(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fieldsFromForm(data: ItemFormData) {
  return {
    itemName: data.itemName,
    quantity: data.quantity,
    unit: data.unit,
    category: data.category,
    price: data.price,
    note: data.note,
  };
}

export default function InventoryScreen() {
  const [allItems, setAllItems] = useState<InventoryItem[]>(SAMPLE_INVENTORY);
  const [view, setView] = useState<"list" | "grid">("list");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("Newest First");
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [lastAddedItem, setLastAddedItem] = useState<InventoryItem | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const query = searchQuery.trim().toLowerCase();
  const filteredAndSortedItems = allItems
    .filter((item) => selectedCategory === "All" || item.category === selectedCategory)
    .filter((item) => !query || item.itemName.toLowerCase().includes(query) || item.category.toLowerCase().includes(query))
    .sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortOrder === "Newest First" ? diff : -diff;
    });

  function handleDelete(itemId: number) {
    setAllItems((current) => current.filter((item) => item.id !== itemId));
  }

  function consumeOne(item: InventoryItem) {
    if (item.quantity <= 1) {
      handleDelete(item.id);
    } else {
      setAllItems((current) => current.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i)));
    }
  }

  function handleAdd(data: ItemFormData) {
    const newItem: InventoryItem = {
      id: Date.now(),
      ...fieldsFromForm(data),
      createdAt: dateInputToIso(data.date) ?? new Date().toISOString(),
    };
    setAllItems((current) => [...current, newItem]);
    setLastAddedItem(newItem);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setLastAddedItem(null), 4000);
  }

  function handleUndoAdd() {
    if (!lastAddedItem) return;
    handleDelete(lastAddedItem.id);
    setLastAddedItem(null);
  }

  function handleEdit(data: ItemFormData) {
    if (!editingItem) return;
    setAllItems((current) =>
      current.map((item) =>
        item.id === editingItem.id
          ? { ...item, ...fieldsFromForm(data), createdAt: dateInputToIso(data.date) ?? item.createdAt }
          : item,
      ),
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Inventory</Text>
          <IconButton name="plus" label="Add new item" onPress={() => setAddModalOpen(true)} size={28} />
        </View>

        <View style={styles.search}>
          <Feather name="search" size={18} color={COLORS.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search"
            placeholderTextColor={COLORS.textSecondary}
            style={styles.searchInput}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {["All", ...CATEGORIES].map((name) => (
            <CategoryChip
              key={name}
              name={name}
              selected={selectedCategory === name}
              onPress={() => setSelectedCategory(name)}
            />
          ))}
        </ScrollView>

        <View style={styles.filters}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setSortOrder(sortOrder === "Newest First" ? "Oldest First" : "Newest First")}
            style={styles.sortBtn}
          >
            <Text style={styles.sortText}>{sortOrder}</Text>
            <Feather name="chevron-down" size={18} color={COLORS.textDefault} />
          </Pressable>

          <View style={styles.toggle}>
            {(["list", "grid"] as const).map((mode) => (
              <Pressable
                key={mode}
                accessibilityRole="button"
                accessibilityLabel={mode === "list" ? "List view" : "Grid view"}
                accessibilityState={{ selected: view === mode }}
                onPress={() => setView(mode)}
                style={[styles.toggleBtn, view === mode && styles.toggleBtnActive]}
              >
                <Feather name={mode} size={18} color={view === mode ? COLORS.white : COLORS.textDefault} />
              </Pressable>
            ))}
          </View>
        </View>

        {view === "list" ? (
          <>
            <Text style={styles.tip}>Swipe right to TOSS | Swipe left to CHOMP | Tap to EDIT</Text>
            {filteredAndSortedItems.map((item) => (
              <SwipeableItem
                key={item.id}
                itemName={item.itemName}
                quantity={item.quantity}
                category={item.category}
                createdAt={item.createdAt}
                onToss={() => consumeOne(item)}
                onChomp={() => consumeOne(item)}
                onTap={() => setEditingItem(item)}
              />
            ))}
          </>
        ) : (
          <View style={styles.grid}>
            {filteredAndSortedItems.map((item) => (
              <GridViewCard
                key={item.id}
                itemName={item.itemName}
                quantity={item.quantity}
                category={item.category}
                createdAt={item.createdAt}
                onPress={() => setEditingItem(item)}
              />
            ))}
          </View>
        )}

        {filteredAndSortedItems.length === 0 ? <Text style={styles.empty}>No items found.</Text> : null}
      </ScrollView>

      {lastAddedItem ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Item has been added!</Text>
          <Pressable accessibilityRole="button" onPress={handleUndoAdd} hitSlop={8}>
            <Text style={styles.toastUndo}>Undo</Text>
          </Pressable>
        </View>
      ) : null}

      <ItemModal
        visible={addModalOpen}
        title="Add New Item"
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAdd}
      />

      <ItemModal
        visible={editingItem !== null}
        title="Edit Item"
        initialData={editingItem && { ...editingItem, date: isoToDateInput(editingItem.createdAt) }}
        onClose={() => setEditingItem(null)}
        onSubmit={handleEdit}
        onDelete={() => editingItem && handleDelete(editingItem.id)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.pagePrimary,
  },
  content: {
    paddingHorizontal: Layout.pagePadding,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
  },
  title: {
    ...Typography.titleLg,
    color: COLORS.textDefault,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.pageSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    borderRadius: RADIUS.rounded,
  },
  searchInput: {
    ...Typography.bodyMd,
    flex: 1,
    paddingVertical: 10,
    color: COLORS.textDefault,
  },
  chips: {
    gap: 8,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.pageSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    borderRadius: RADIUS.rounded,
  },
  sortText: {
    ...Typography.bodyMd,
    color: COLORS.textDefault,
  },
  toggle: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    borderRadius: RADIUS.rounded,
    overflow: "hidden",
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.pageSecondary,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.brandPrimary,
  },
  tip: {
    ...Typography.bodyXsm,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  empty: {
    ...Typography.bodyMd,
    textAlign: "center",
    color: COLORS.textSecondary,
    marginTop: 24,
  },
  toast: {
    position: "absolute",
    left: Layout.pagePadding,
    right: Layout.pagePadding,
    bottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.textDefault,
    borderRadius: RADIUS.rounded,
  },
  toastText: {
    ...Typography.bodyMd,
    color: COLORS.white,
  },
  toastUndo: {
    ...Typography.bodyMdBold,
    color: COLORS.white,
    textDecorationLine: "underline",
  },
});

import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { CategoryChip } from "@/components/CategoryChip";
import { IconButton } from "@/components/IconButton";
import { InputField } from "@/components/InputField";
import { CATEGORIES } from "@/lib/categories";
import { COLORS, RADIUS } from "@/lib/theme";

export type ItemFormData = {
  itemName: string;
  price: number;
  category: string;
  quantity: number;
  unit: string;
  date: string;
  note: string;
};

export type ItemModalInitialData = {
  itemName: string;
  price: number;
  category: string;
  quantity: number;
  unit?: string;
  date?: string;
  note?: string;
};

type ItemModalProps = {
  visible: boolean;
  title: string;
  initialData?: ItemModalInitialData | null;
  onClose: () => void;
  onSubmit: (data: ItemFormData) => void;
  onDelete?: () => void;
};

export function ItemModal({ visible, title, initialData = null, onClose, onSubmit, onDelete }: ItemModalProps) {
  const insets = useSafeAreaInsets();
  const [formKey, setFormKey] = useState(0);
  const keyboard = useAnimatedKeyboard();
  const bottomGap = Math.max(insets.bottom, 8);
  const keyboardSpace = useAnimatedStyle(() => ({
    paddingBottom: Math.max(keyboard.height.value + 8, bottomGap),
  }));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, keyboardSpace]}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <IconButton name="x" label="Close" onPress={onClose} size={30} style={styles.closeBtn} />
          </View>
          {visible ? (
            <ItemForm
              key={formKey}
              initialData={initialData}
              isEditMode={!!initialData}
              onReset={() => setFormKey((key) => key + 1)}
              onSubmit={(data) => {
                onSubmit(data);
                onClose();
              }}
              onDelete={
                onDelete &&
                (() => {
                  onClose();
                  onDelete();
                })
              }
            />
          ) : null}
        </View>
      </Animated.View>
    </Modal>
  );
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatPrice(value: number | null) {
  return value === null || Number.isNaN(value) ? "" : currencyFormatter.format(value);
}

function normalizePriceInput(value: string) {
  const digitsAndDotOnly = value.replace(/[^\d.]/g, "");
  const [whole = "", ...fractionParts] = digitsAndDotOnly.split(".");
  if (fractionParts.length === 0) return whole;
  return `${whole}.${fractionParts.join("").slice(0, 2)}`;
}

type ItemFormProps = {
  initialData: ItemModalInitialData | null;
  isEditMode: boolean;
  onReset: () => void;
  onSubmit: (data: ItemFormData) => void;
  onDelete?: () => void;
};

function ItemForm({ initialData, isEditMode, onReset, onSubmit, onDelete }: ItemFormProps) {
  const [itemName, setItemName] = useState(initialData?.itemName ?? "");
  const [price, setPrice] = useState<number | null>(initialData?.price ?? null);
  const [priceInput, setPriceInput] = useState(formatPrice(initialData?.price ?? null));
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [quantity, setQuantity] = useState(initialData?.quantity ?? 1);
  const [unit, setUnit] = useState(initialData?.unit ?? "");
  const [date, setDate] = useState(initialData?.date ?? "");
  const [note, setNote] = useState(initialData?.note ?? "");
  const [showErrors, setShowErrors] = useState(false);

  const itemNameError = !itemName.trim() ? "Item name is required." : "";
  const priceError =
    price === null ? "Price is required." : !Number.isFinite(price) || price < 0 ? "Enter a valid price." : "";
  const categoryError = !category ? "Category is required." : "";
  const isValid = !itemNameError && !priceError && !categoryError;

  function handleSubmit() {
    if (!isValid || price === null) {
      setShowErrors(true);
      return;
    }
    onSubmit({ itemName: itemName.trim(), price, category, quantity, unit, date, note });
  }

  function handlePriceChange(text: string) {
    const normalized = normalizePriceInput(text);
    setPriceInput(normalized);
    setPrice(normalized === "" ? null : Number(normalized));
  }

  return (
    <>
      <ScrollView style={styles.form} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
        <View style={styles.firstRow}>
          <View style={styles.nameCol}>
            <InputField
              label="Item Name"
              required
              value={itemName}
              onChangeText={setItemName}
              error={showErrors ? itemNameError : ""}
              returnKeyType="next"
            />
          </View>
          <View style={styles.priceCol}>
            <InputField
              label="Price"
              required
              value={priceInput}
              onChangeText={handlePriceChange}
              onFocus={() => setPriceInput(price === null ? "" : price.toFixed(2))}
              onBlur={() => setPriceInput(formatPrice(price))}
              placeholder="$0.00"
              keyboardType="decimal-pad"
              error={showErrors ? priceError : ""}
            />
          </View>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>
            Category<Text style={styles.required}> *</Text>
          </Text>
          <View style={styles.chips}>
            {CATEGORIES.map((name) => (
              <CategoryChip key={name} name={name} selected={category === name} onPress={() => setCategory(name)} />
            ))}
          </View>
          {showErrors && categoryError ? <Text style={styles.errorText}>{categoryError}</Text> : null}
        </View>

        <View style={styles.quantityRow}>
          <View style={styles.stepper}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Decrease quantity"
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              hitSlop={6}
              style={styles.stepBtn}
            >
              <Text style={styles.stepText}>−</Text>
            </Pressable>
            <TextInput
              accessibilityLabel="Quantity"
              value={String(quantity)}
              onChangeText={(text) => {
                const n = parseInt(text.replace(/\D/g, ""), 10);
                setQuantity(Number.isNaN(n) ? 1 : Math.max(1, n));
              }}
              keyboardType="number-pad"
              style={styles.qtyInput}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Increase quantity"
              onPress={() => setQuantity((q) => q + 1)}
              hitSlop={6}
              style={styles.stepBtn}
            >
              <Text style={styles.stepText}>+</Text>
            </Pressable>
          </View>
          <View style={styles.unitCol}>
            <InputField value={unit} onChangeText={setUnit} placeholder="Unit (e.g., lbs, oz)" accessibilityLabel="Unit" />
          </View>
        </View>

        <InputField label="Date Added" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
        <InputField label="Note" value={note} onChangeText={setNote} multiline style={styles.note} />

        {showErrors && !isValid ? <Text style={styles.formError}>Please fill out all required fields.</Text> : null}
      </ScrollView>

      <View style={styles.actions}>
        {!isEditMode ? (
          <View style={styles.actionItem}>
            <Button label="Reset" variant="secondary" onPress={onReset} />
          </View>
        ) : null}
        <View style={styles.actionItem}>
          <Button label={isEditMode ? "Save" : "Add"} onPress={handleSubmit} />
        </View>
      </View>
      {isEditMode && onDelete ? <Button label="Delete" variant="danger" onPress={onDelete} /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    maxHeight: "92%",
    flexShrink: 1,
    marginHorizontal: 8,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sheet,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 16,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDefault,
  },
  closeBtn: {
    position: "absolute",
    right: 0,
  },
  form: {
    flexGrow: 0,
    flexShrink: 1,
  },
  formContent: {
    gap: 16,
    paddingBottom: 4,
  },
  firstRow: {
    flexDirection: "row",
    gap: 12,
  },
  nameCol: {
    flex: 1,
  },
  priceCol: {
    width: 130,
  },
  group: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDefault,
  },
  required: {
    color: COLORS.textDanger,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.textDanger,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  stepBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    fontSize: 20,
    color: COLORS.textDefault,
  },
  qtyInput: {
    width: 40,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDefault,
  },
  unitCol: {
    flex: 1,
  },
  note: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  formError: {
    textAlign: "center",
    fontSize: 14,
    color: COLORS.textDanger,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionItem: {
    flex: 1,
  },
});

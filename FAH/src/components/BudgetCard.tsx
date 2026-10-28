import { Image } from "expo-image";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ProgressBar from "@/components/ProgressBar";
import { Colors, Fonts, Shadows } from "@/constants/theme";

type Props = {
  spent: number;
  budget: number;
  lastMonthSpent: number;
  onBudgetChange: (newBudget: number) => void;
  showTitle?: boolean;
};

const MAX_BUDGET = 99999;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function normalizeBudgetInput(value: string) {
  const digitsAndDotOnly = value.replace(/[^\d.]/g, "");
  const [whole = "", ...fractionParts] = digitsAndDotOnly.split(".");
  const limitedWhole = whole.slice(0, 8);
  if (fractionParts.length === 0) return limitedWhole;
  return `${limitedWhole}.${fractionParts.join("").slice(0, 2)}`;
}

export default function BudgetCard({ spent, budget, lastMonthSpent, onBudgetChange, showTitle = true }: Props) {
  const insets = useSafeAreaInsets();
  const [showModal, setShowModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [budgetError, setBudgetError] = useState("");

  const isOverBudget = spent > budget;
  const statusColor = isOverBudget ? Colors.warning : Colors.brandPrimary;
  const percentage = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const diff = spent - lastMonthSpent;
  const diffPercent = lastMonthSpent ? (Math.abs(diff) / lastMonthSpent) * 100 : 0;
  const comparisonText = lastMonthSpent
    ? `${diffPercent.toFixed(1)}% ${diff > 0 ? "more" : "less"} than last month`
    : `${percentage}%`;

  function openModal() {
    setBudgetInput(currencyFormatter.format(budget));
    setBudgetError("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function handleBudgetInput(rawValue: string) {
    if (/[^\d.$,]/.test(rawValue)) {
      setBudgetInput(rawValue);
      setBudgetError("Please enter a valid number.");
      return;
    }
    setBudgetInput(normalizeBudgetInput(rawValue));
    setBudgetError("");
  }

  function handleBudgetFocus() {
    setBudgetInput(normalizeBudgetInput(budgetInput));
  }

  function handleConfirm() {
    const newAmount = parseFloat(budgetInput.replace(/[$,]/g, ""));

    if (isNaN(newAmount) || newAmount <= 0) {
      setBudgetError("Please enter a valid budget amount.");
      return;
    }
    if (newAmount > MAX_BUDGET) {
      setBudgetError("We only accept budget up to $99,999");
      return;
    }

    // TODO: Save to Supabase (updateBudgetAmount on the active `budgets` row).
    onBudgetChange(newAmount);
    closeModal();
  }

  return (
    <View style={styles.budgetCheck}>
      {showTitle ? <Text style={styles.sectionTitle}>Budget Check</Text> : null}

      <View
        style={[
          styles.budgetContent,
          { backgroundColor: isOverBudget ? Colors.warningLight : Colors.brandPrimaryLight },
        ]}
      >
        <View style={styles.spendingRow}>
          <Image
            source={
              isOverBudget
                ? require("@/assets/icons/icon_budgetcheck_orange.svg")
                : require("@/assets/icons/icon_budgetcheck_green.svg")
            }
            style={styles.statusIcon}
          />

          <View style={styles.spendingInfo}>
            <View style={styles.amountSpent}>
              <Text style={[styles.spentAmount, { color: statusColor }]}>
                ${spent.toFixed(2)} spent
              </Text>
              <Text style={[styles.bodyXsm, { color: statusColor }]}>{comparisonText}</Text>
            </View>
            <View>
              <Text style={styles.totalAmount}>${budget.toFixed(0)}</Text>
              <Text style={styles.budgetLabel}>Budget</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressWrapper}>
          <ProgressBar value={spent} max={budget} color={statusColor} />
          <View style={styles.spentText}>
            <Text style={[styles.bodyXsm, styles.secondaryText]}>${spent.toFixed(2)} spent</Text>
            <Text style={[styles.bodyXsm, styles.secondaryText]}>out of ${budget.toFixed(0)}</Text>
          </View>
        </View>

        <Pressable onPress={openModal} hitSlop={8} accessibilityRole="button">
          <Text style={styles.setBudgetLink}>Set New Monthly Budget</Text>
        </Pressable>
      </View>

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={closeModal}>
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
          <View style={[styles.modal, { paddingBottom: 32 + insets.bottom }]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Set Your Monthly Budget</Text>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Enter Your Budget Here</Text>
              <TextInput
                value={budgetInput}
                onChangeText={handleBudgetInput}
                onFocus={handleBudgetFocus}
                placeholder="$0.00"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="decimal-pad"
                returnKeyType="done"
                onSubmitEditing={handleConfirm}
                style={[styles.input, budgetError ? styles.inputError : null]}
                accessibilityLabel="Enter Your Budget Here"
              />
              <Text style={styles.errorMessage} accessibilityLiveRegion="polite">
                {budgetError}
              </Text>
            </View>

            <Pressable
              onPress={handleConfirm}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  budgetCheck: {
    gap: 8,
  },
  sectionTitle: {
    color: Colors.textDefault,
    fontFamily: Fonts.quicksandBold,
    fontSize: 20,
    lineHeight: 24,
    paddingTop: 24,
  },
  budgetContent: {
    padding: 24,
    borderRadius: 8,
    boxShadow: Shadows.card,
    gap: 16,
  },
  spendingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusIcon: {
    width: 56,
    height: 56,
  },
  spendingInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  amountSpent: {
    flex: 1,
    gap: 4,
  },
  spentAmount: {
    fontFamily: Fonts.quicksandBold,
    fontSize: 18,
    lineHeight: 24,
  },
  totalAmount: {
    color: Colors.textDefault,
    fontFamily: Fonts.quicksandBold,
    fontSize: 24,
    lineHeight: 32,
    textAlign: "right",
  },
  budgetLabel: {
    color: Colors.textSecondary,
    fontFamily: Fonts.nunitoMedium,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "right",
  },
  bodyXsm: {
    fontFamily: Fonts.nunitoMedium,
    fontSize: 12,
    lineHeight: 16,
  },
  secondaryText: {
    color: Colors.textSecondary,
  },
  progressWrapper: {
    gap: 8,
  },
  spentText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  setBudgetLink: {
    color: Colors.textSecondary,
    fontFamily: Fonts.nunitoBold,
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    paddingTop: 32,
    paddingHorizontal: 16,
    backgroundColor: Colors.bgPageSecondary,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    alignItems: "center",
    gap: 24,
  },
  modalHandle: {
    width: 50,
    height: 5,
    backgroundColor: Colors.borderSecondary,
    borderRadius: 2.5,
  },
  modalTitle: {
    color: Colors.textDefault,
    fontFamily: Fonts.quicksandBold,
    fontSize: 24,
    lineHeight: 32,
    textAlign: "center",
  },
  inputSection: {
    width: "100%",
    gap: 8,
  },
  inputLabel: {
    color: Colors.textDefault,
    fontFamily: Fonts.nunitoBold,
    fontSize: 14,
    lineHeight: 16,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderSecondary,
    borderRadius: 8,
    color: Colors.textDefault,
    fontFamily: Fonts.nunitoMedium,
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.textDanger,
  },
  errorMessage: {
    minHeight: 18,
    color: Colors.textDanger,
    fontFamily: Fonts.nunitoMedium,
    fontSize: 12,
    lineHeight: 17,
  },
  button: {
    width: "100%",
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.brandPrimary,
    boxShadow: Shadows.card,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: Colors.textOnAction,
    fontFamily: Fonts.quicksandBold,
    fontSize: 18,
    lineHeight: 24,
  },
});

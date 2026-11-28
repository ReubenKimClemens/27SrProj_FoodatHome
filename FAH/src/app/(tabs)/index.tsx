import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BudgetCard from "@/components/BudgetCard";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import { Colors, Fonts } from "@/constants/theme";
import {
  activeBudget,
  inventoryCounts,
  lastMonthSpent,
  type InventoryCounts,
} from "@/lib/homeData";

const inventoryRows: { key: keyof InventoryCounts; label: string }[] = [
  { key: "protein", label: "Protein" },
  { key: "produce", label: "Produce" },
  { key: "bread", label: "Bread" },
  { key: "dairy", label: "Dairy" },
  { key: "drinks", label: "Drinks" },
  { key: "snacks", label: "Snacks" },
  { key: "pantry", label: "Pantry" },
  { key: "sauces", label: "Sauces" },
  { key: "spices", label: "Spices" },
  { key: "leftover", label: "Leftover" },
  { key: "frozen", label: "Frozen" },
  { key: "misc", label: "Misc" },
];

export default function Index() {
  const [budget, setBudget] = useState(activeBudget.budget_amount);
  const spent = activeBudget.total_spent;
  const totalCount = inventoryRows.reduce((sum, row) => sum + inventoryCounts[row.key], 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <PageHeader userName="Cronch" />

        <BudgetCard
          spent={spent}
          budget={budget}
          lastMonthSpent={lastMonthSpent}
          onBudgetChange={setBudget}
        />

        <SectionCard title="inventory" linkText="View All" linkHref="/inventory">
          <View style={styles.inventoryContent}>
            <View style={styles.inventoryRow}>
              <Text style={[styles.bodyMdBold, styles.totalText]}>Total Items</Text>
              <Text style={[styles.bodyMdBold, styles.totalText]}>{totalCount}</Text>
            </View>
            {inventoryRows
              .filter((row) => inventoryCounts[row.key] > 0)
              .map((row) => (
                <View key={row.key} style={styles.inventoryRow}>
                  <Text style={[styles.bodyMd, styles.itemText]}>{row.label}</Text>
                  <Text style={[styles.bodyMd, styles.itemText]}>{inventoryCounts[row.key]}</Text>
                </View>
              ))}
          </View>
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgPagePrimary,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 24,
  },
  inventoryContent: {
    gap: 16,
  },
  inventoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bodyMd: {
    fontFamily: Fonts.nunitoMedium,
    fontSize: 16,
    lineHeight: 20,
  },
  bodyMdBold: {
    fontFamily: Fonts.nunitoBold,
    fontSize: 16,
    lineHeight: 20,
  },
  totalText: {
    color: Colors.textBrandSecondary,
  },
  itemText: {
    color: Colors.textSecondary,
  },
});

import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BudgetCard from "@/components/BudgetCard";
import PageHeader from "@/components/PageHeader";
import ProgressBar from "@/components/ProgressBar";
import { Fonts, Layout, Typography } from "@/constants/theme";
import { getCategoryColor } from "@/lib/categories";
import {
  ACTIVE_BUDGET,
  BUDGET_HISTORY,
  HIGHEST_RECEIPT,
  LOWEST_RECEIPT,
  NUMBER_OF_ITEMS,
  NUMBER_OF_RECEIPTS,
  SPENT_PER_DAY,
  STORE_VISITS,
  TOP_CATEGORIES,
  TOTAL_CHOMP,
  TOTAL_SPENT,
  TOTAL_TOSS,
} from "@/lib/mockMetrics";
import { COLORS, RADIUS, SHADOW } from "@/lib/theme";

const CHART_HEIGHT = 180;

const money = (amount: number, digits = 2) => `$${amount.toFixed(digits)}`;

type Metric = { title: string; count?: number; amount?: number; date?: string };

const METRICS: Metric[] = [
  { title: "Total Items", count: NUMBER_OF_ITEMS },
  { title: "Total Receipts", count: NUMBER_OF_RECEIPTS },
  { title: "Total Toss", count: TOTAL_TOSS },
  { title: "Total Chomp", count: TOTAL_CHOMP },
  { title: "Avg per Day", amount: TOTAL_SPENT / 30 },
  { title: "Avg per Receipt", amount: TOTAL_SPENT / NUMBER_OF_RECEIPTS },
  { title: "Highest Receipt", amount: HIGHEST_RECEIPT.amount, date: HIGHEST_RECEIPT.date },
  { title: "Lowest Receipt", amount: LOWEST_RECEIPT.amount, date: LOWEST_RECEIPT.date },
];

export default function MetricsScreen() {
  const [budget, setBudget] = useState(ACTIVE_BUDGET.budget);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <PageHeader title="Metrics" />
        <Text style={styles.month}>December</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <BudgetCard
            spent={ACTIVE_BUDGET.spent}
            budget={budget}
            lastMonthSpent={ACTIVE_BUDGET.lastMonthSpent}
            onBudgetChange={setBudget}
            showTitle={false}
          />
          <View style={styles.metricGrid}>
            {METRICS.map((metric) => (
              <View key={metric.title} style={styles.metricCard}>
                <Text style={styles.metricLabel}>{metric.title}</Text>
                {metric.count !== undefined ? <Text style={styles.metricValue}>{metric.count}</Text> : null}
                {metric.amount !== undefined ? (
                  <Text style={styles.metricValue}>{money(metric.amount)}</Text>
                ) : null}
                {metric.date ? <Text style={styles.metricLabel}>{metric.date}</Text> : null}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount Spent Per Day</Text>
          <BarChart
            bars={SPENT_PER_DAY.map((d) => ({ label: String(d.day), value: d.amount }))}
            color={COLORS.brandPrimary}
            barWidth={30}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget History</Text>
          <BarChart
            bars={BUDGET_HISTORY.map((m) => ({ label: m.month, value: m.amount, goal: m.goal }))}
            color="#B5E2D5"
            barWidth={36}
          />
          <View style={styles.legend}>
            <View style={[styles.legendSwatch, { backgroundColor: "#B5E2D5" }]} />
            <Text style={styles.legendText}>Amount Spent</Text>
            <View style={[styles.legendLine, { backgroundColor: COLORS.brandSecondary }]} />
            <Text style={styles.legendText}>Budget Goal</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Store Visits</Text>
          {STORE_VISITS.map((store) => (
            <View key={store.name} style={styles.storeCard}>
              <View>
                <Text style={styles.storeName}>
                  {store.name} <Text style={styles.storeDate}>- {store.date}</Text>
                </Text>
                <Text style={styles.storeItems}>{store.items} items</Text>
              </View>
              <Text style={styles.storePrice}>{money(store.price)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          <View style={styles.card}>
            {TOP_CATEGORIES.map((cat) => {
              const color = getCategoryColor(cat.name);
              return (
                <View key={cat.name} style={styles.categoryRow}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryName}>{cat.name}</Text>
                    <Text style={styles.categoryAmount}>
                      {money(cat.amount)} ({cat.percentage}%)
                    </Text>
                  </View>
                  <ProgressBar value={cat.percentage} max={100} color={color.dark} />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type Bar = { label: string; value: number; goal?: number | null };

function BarChart({ bars, color, barWidth }: { bars: Bar[]; color: string; barWidth: number }) {
  const max = Math.max(...bars.map((b) => Math.max(b.value, b.goal ?? 0)), 1);
  const scale = (value: number) => (value / max) * (CHART_HEIGHT - 20);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.card}>
      <View style={styles.chart}>
        {bars.map((bar) => (
          <View key={bar.label} style={[styles.barColumn, { width: barWidth + 16 }]}>
            <View style={[styles.barArea, { height: CHART_HEIGHT }]}>
              {bar.value > 0 ? <Text style={styles.barValue}>{money(bar.value)}</Text> : null}
              <View
                style={[
                  styles.bar,
                  { width: barWidth, height: scale(bar.value), backgroundColor: color },
                ]}
              />
              {bar.goal ? (
                <View
                  style={[
                    styles.goalLine,
                    { width: barWidth + 12, bottom: scale(bar.goal) },
                  ]}
                />
              ) : null}
            </View>
            <Text style={styles.barLabel}>{bar.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const SURFACE = { backgroundColor: COLORS.pageSecondary, borderRadius: RADIUS.rounded, ...SHADOW };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.pagePrimary,
  },
  content: {
    paddingHorizontal: Layout.pagePadding,
    paddingBottom: 32,
    gap: Layout.sectionGap,
  },
  month: {
    ...Typography.titleLg,
    color: COLORS.textDefault,
    textAlign: "center",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    ...Typography.titleMd,
    color: COLORS.textDefault,
  },
  card: {
    padding: 16,
    gap: 12,
    ...SURFACE,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },
  metricCard: {
    width: "49%",
    padding: 12,
    gap: 2,
    ...SURFACE,
  },
  metricLabel: {
    ...Typography.bodySm,
    color: COLORS.textSecondary,
  },
  metricValue: {
    ...Typography.titleMd,
    color: COLORS.textDefault,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  barColumn: {
    alignItems: "center",
  },
  barArea: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barValue: {
    fontFamily: Fonts.nunitoMedium,
    fontSize: 9,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  goalLine: {
    position: "absolute",
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.brandSecondary,
  },
  barLabel: {
    ...Typography.bodyXsm,
    marginTop: 4,
    color: COLORS.textSecondary,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendLine: {
    width: 16,
    height: 3,
    borderRadius: 2,
    marginLeft: 10,
  },
  legendText: {
    ...Typography.bodyXsm,
    color: COLORS.textSecondary,
  },
  storeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    ...SURFACE,
  },
  storeName: {
    ...Typography.bodyMdBold,
    color: COLORS.textDefault,
  },
  storeDate: {
    ...Typography.bodyXsm,
    color: COLORS.textSecondary,
  },
  storeItems: {
    ...Typography.bodyXsmBold,
    color: COLORS.textSecondary,
  },
  storePrice: {
    ...Typography.titleSm,
    color: COLORS.textDefault,
  },
  categoryRow: {
    gap: 6,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryName: {
    ...Typography.bodyMdBold,
    color: COLORS.textDefault,
  },
  categoryAmount: {
    ...Typography.bodySm,
    color: COLORS.textSecondary,
  },
});

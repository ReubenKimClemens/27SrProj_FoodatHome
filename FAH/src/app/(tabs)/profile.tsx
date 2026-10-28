import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PageHeader from "@/components/PageHeader";
import { Colors, Layout, Shadows, Typography } from "@/constants/theme";

const achievements = [
  { id: "fah", title: "Do you have FAH?" },
  { id: "chomp", title: "Chomp Machine" },
  { id: "receipt", title: "Receipt Warrior" },
];

const howToItems = [
  "Scan and Upload a Receipt",
  "Manually Add a Receipt",
  "How to Read the Analytics Graph",
  "How to Use Analytics to Help You Budget",
  "How to Set a New Budget",
];

const settingItems = [
  { label: "Recently Deleted Items", icon: "trash-2" },
  { label: "Notifications", icon: "bell" },
  { label: "Sign Out", icon: "log-out" },
] as const;

type RowProps = {
  label: string;
  icon?: React.ComponentProps<typeof Feather>["name"];
  isLast?: boolean;
  onPress?: () => void;
};

function ListRow({ label, icon, isLast, onPress }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, !isLast && styles.rowDivider, pressed && styles.pressed]}
    >
      <View style={styles.rowLeft}>
        {icon && <Feather name={icon} size={18} color={Colors.textDefault} />}
        <Text style={styles.rowText}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={22} color={Colors.textDefault} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader title="Profile" />

        <View>
          <View style={styles.achievementHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <Pressable style={styles.viewAllTab} onPress={() => console.log("View All")}>
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>
          <View style={[styles.card, styles.achievementCard]}>
            {achievements.map((a) => (
              <View key={a.id} style={styles.achievement}>
                <View style={styles.badgePlaceholder} />
                <Text style={styles.achievementText}>{a.title}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How To Use</Text>
          <View style={styles.card}>
            {howToItems.map((label, i) => (
              <ListRow
                key={label}
                label={label}
                isLast={i === howToItems.length - 1}
                onPress={() => console.log(label)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            {settingItems.map((item, i) => (
              <ListRow
                key={item.label}
                label={item.label}
                icon={item.icon}
                isLast={i === settingItems.length - 1}
                onPress={() => console.log(item.label)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bgPagePrimary,
  },
  content: {
    paddingHorizontal: Layout.pagePadding,
    paddingBottom: 32,
    gap: Layout.sectionGap,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    ...Typography.titleMd,
    color: Colors.textDefault,
  },
  achievementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAllTab: {
    paddingVertical: 8,
    paddingLeft: 32,
    paddingRight: 24,
    backgroundColor: Colors.brandPrimary,
    borderTopLeftRadius: 360,
    borderTopRightRadius: 16,
  },
  viewAllText: {
    ...Typography.bodyMdBold,
    color: Colors.textOnAction,
    textDecorationLine: "underline",
  },
  card: {
    backgroundColor: Colors.bgPageSecondary,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 8,
    boxShadow: Shadows.card,
  },
  achievementCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 12,
    paddingVertical: 24,
    borderTopRightRadius: 0,
  },
  achievement: {
    alignItems: "center",
    width: 100,
  },
  badgePlaceholder: {
    width: 72,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#E8E8E8",
    marginBottom: 12,
  },
  achievementText: {
    ...Typography.bodySm,
    color: Colors.textDefault,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSecondary,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    paddingRight: 12,
  },
  rowText: {
    ...Typography.bodyMd,
    color: Colors.textDefault,
  },
  pressed: {
    opacity: 0.6,
  },
});

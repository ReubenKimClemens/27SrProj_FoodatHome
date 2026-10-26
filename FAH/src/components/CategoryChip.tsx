import { Pressable, StyleSheet, Text } from "react-native";

import { getCategoryColor } from "@/lib/categories";
import { COLORS } from "@/lib/theme";

type CategoryChipProps = {
  name: string;
  selected: boolean;
  onPress: () => void;
};

export function CategoryChip({ name, selected, onPress }: CategoryChipProps) {
  const color = getCategoryColor(name);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, { backgroundColor: selected ? color.dark : color.light, borderColor: color.dark }]}
    >
      <Text style={[styles.text, { color: selected ? COLORS.white : color.dark }]}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: "700",
  },
});

import { Feather } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";

import { COLORS } from "@/lib/theme";

type IconButtonProps = {
  name: ComponentProps<typeof Feather>["name"];
  label: string;
  onPress: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({ name, label, onPress, size = 26, style }: IconButtonProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={8} style={style}>
      <Feather name={name} size={size} color={COLORS.textDefault} />
    </Pressable>
  );
}

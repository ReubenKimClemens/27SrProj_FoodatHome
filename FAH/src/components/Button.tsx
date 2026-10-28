import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS, RADIUS } from "@/lib/theme";
import { Typography } from "@/constants/theme";

type Variant = "primary" | "outline" | "secondary" | "danger";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
};

export function Button({ label, onPress, variant = "primary", disabled = false }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, variant === "primary" || variant === "danger" ? styles.labelLight : styles.labelDark]}>
        {label}
      </Text>
    </Pressable>
  );
}

type ButtonPairProps = {
  buttons: [ButtonProps, ButtonProps];
};

export function ButtonPair({ buttons }: ButtonPairProps) {
  return (
    <View style={styles.pair}>
      {buttons.map((button) => (
        <View key={button.label} style={styles.pairItem}>
          <Button {...button} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: RADIUS.rounded,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  primary: {
    backgroundColor: COLORS.brandPrimary,
    borderColor: COLORS.brandPrimary,
  },
  outline: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.brandPrimary,
  },
  secondary: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderSecondary,
  },
  danger: {
    backgroundColor: COLORS.textDanger,
    borderColor: COLORS.textDanger,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...Typography.button,
  },
  labelLight: {
    color: COLORS.white,
  },
  labelDark: {
    color: COLORS.textDefault,
  },
  pair: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  pairItem: {
    flex: 1,
  },
});

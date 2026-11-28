import { useState } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { COLORS, RADIUS } from "@/lib/theme";
import { Typography } from "@/constants/theme";

type InputFieldProps = TextInputProps & {
  label?: string;
  required?: boolean;
  error?: string;
};

export function InputField({ label, required = false, error, style, onFocus, onBlur, ...inputProps }: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={COLORS.textSecondary}
        style={[styles.input, focused && styles.inputFocused, !!error && styles.inputError, style]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
    width: "100%",
  },
  label: {
    ...Typography.bodyMdBold,
    color: COLORS.textDefault,
  },
  required: {
    color: COLORS.textDanger,
  },
  input: {
    ...Typography.bodyMd,
    minHeight: 46,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.pageSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    borderRadius: RADIUS.rounded,
    color: COLORS.textDefault,
  },
  inputFocused: {
    borderColor: COLORS.brandPrimary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: COLORS.textDanger,
    backgroundColor: COLORS.bgDanger,
  },
  error: {
    ...Typography.bodyXsm,
    color: COLORS.textDanger,
  },
});

import { Image } from "expo-image";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { InputField } from "@/components/InputField";
import { sendPhoneCode, verifyPhoneCode } from "@/lib/auth";
import { COLORS, RADIUS, SHADOW } from "@/lib/theme";
import { Layout, Typography } from "@/constants/theme";

// US numbers only for now: 10 digits -> "+1XXXXXXXXXX".
function toE164(input: string): string | null {
  const digits = input.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  return digits.length === 10 ? `+1${digits}` : null;
}

export default function LoginScreen() {
  const [phoneInput, setPhoneInput] = useState("");
  const [phone, setPhone] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<void>) {
    setError("");
    setBusy(true);
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function handleSendCode() {
    const e164 = toE164(phoneInput);
    if (!e164) return setError("Enter a 10-digit US phone number.");
    run(async () => {
      await sendPhoneCode(e164);
      setPhone(e164);
    });
  }

  function handleVerify() {
    if (!phone) return;
    run(() => verifyPhoneCode(phone, code));
  }

  function changeNumber() {
    setPhone(null);
    setCode("");
    setError("");
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Image source={require("@/assets/images/fah-text-logo.svg")} style={styles.logo} contentFit="contain" />

          <View style={styles.card}>
            {phone === null ? (
              <>
                <Text style={styles.title}>Log in or sign up</Text>
                <Text style={styles.subtitle}>We&apos;ll text you a code to confirm your number.</Text>
                <InputField
                  label="Phone Number"
                  value={phoneInput}
                  onChangeText={setPhoneInput}
                  placeholder="(555) 123-4567"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  error={error}
                />
                <Button label="Send Code" onPress={handleSendCode} disabled={busy} />
              </>
            ) : (
              <>
                <Text style={styles.title}>Enter your code</Text>
                <Text style={styles.subtitle}>Sent to {phone}</Text>
                <InputField
                  label="6-Digit Code"
                  value={code}
                  onChangeText={(value) => setCode(value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  keyboardType="number-pad"
                  autoComplete="sms-otp"
                  textContentType="oneTimeCode"
                  maxLength={6}
                  error={error}
                />
                <Button label="Verify" onPress={handleVerify} disabled={busy || code.length !== 6} />
                <View style={styles.linkRow}>
                  <Text style={styles.link} onPress={busy ? undefined : () => run(() => sendPhoneCode(phone))}>
                    Resend code
                  </Text>
                  <Text style={styles.link} onPress={busy ? undefined : changeNumber}>
                    Change number
                  </Text>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.pagePrimary,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Layout.pagePadding,
    paddingVertical: 32,
    gap: 32,
  },
  logo: {
    width: 200,
    height: 110,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.pageSecondary,
    borderRadius: RADIUS.card,
    padding: 24,
    gap: 16,
    ...SHADOW,
  },
  title: {
    ...Typography.titleMd,
    color: COLORS.textDefault,
  },
  subtitle: {
    ...Typography.bodySm,
    color: COLORS.textSecondary,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  link: {
    ...Typography.bodySmBold,
    color: COLORS.brandPrimary,
  },
});

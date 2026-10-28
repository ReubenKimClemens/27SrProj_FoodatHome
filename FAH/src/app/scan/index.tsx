import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ButtonPair } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { ItemModal } from "@/components/ItemModal";
import { getTextFromImage } from "@/lib/mockApi";
import { resetReceiptDraft } from "@/lib/receiptDraft";
import { parseReceipt } from "@/lib/receiptParser";
import { COLORS, RADIUS } from "@/lib/theme";
import { itemFromForm } from "@/lib/useReceiptItemEditor";
import { Fonts, Layout, Typography } from "@/constants/theme";

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = { mediaTypes: ["images"], quality: 0.7 };

export default function ScanScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  async function readReceipt(uri: string) {
    setImageUri(uri);
    setIsScanning(true);
    setScanError("");
    try {
      const rawText = await getTextFromImage(uri);
      const receipt = parseReceipt(rawText);
      resetReceiptDraft(receipt);
      router.push("/scan/scanned-items");
    } catch (err) {
      setScanError(err instanceof Error ? err.message : "Could not read the receipt.");
    } finally {
      setIsScanning(false);
    }
  }

  async function takePhoto() {
    setScanError("");
    if (Platform.OS !== "web") {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setScanError("Camera access is off. Turn it on in Settings, or upload a photo instead.");
        return;
      }
    }
    try {
      await readPickedImage(await ImagePicker.launchCameraAsync(PICKER_OPTIONS));
    } catch {
      setScanError("The camera isn't available on this device. Try uploading a photo instead.");
    }
  }

  async function uploadPhoto() {
    setScanError("");
    await readPickedImage(await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS));
  }

  async function readPickedImage(result: ImagePicker.ImagePickerResult) {
    if (!result.canceled && result.assets[0]) await readReceipt(result.assets[0].uri);
  }

  function close() {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topNav}>
        <IconButton name="x" label="Close" onPress={close} size={30} />
        <IconButton name="help-circle" label="Scanning tips" onPress={() => router.push("/scan/scanning-tips")} size={28} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Take a photo of your receipt"
        onPress={takePhoto}
        disabled={isScanning}
        style={styles.scanFrame}
      >
        {isScanning ? (
          <View style={styles.scanningState}>
            <ActivityIndicator size="large" color={COLORS.brandPrimary} />
            <Text style={styles.scanningText}>Reading receipt...</Text>
          </View>
        ) : imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} contentFit="contain" />
        ) : (
          <View style={styles.placeholder}>
            <Feather name="camera" size={50} color={COLORS.textDefault} />
            <Text style={styles.placeholderText}>Tap to take a photo of your receipt</Text>
          </View>
        )}
      </Pressable>

      {scanError ? <Text style={styles.errorMsg}>{scanError}</Text> : null}

      <View style={styles.bottom}>
        <View style={styles.tips}>
          <Feather name="zap" size={20} color={COLORS.textDefault} />
          <Text style={styles.tipsText}>
            <Text style={styles.bold}>Tips: </Text>Bright light works best
          </Text>
        </View>

        <ButtonPair
          buttons={[
            { label: "Add Manually", variant: "outline", onPress: () => setModalVisible(true), disabled: isScanning },
            { label: "Scan Receipt", variant: "primary", onPress: takePhoto, disabled: isScanning },
          ]}
        />

        <Pressable accessibilityRole="button" onPress={uploadPhoto} disabled={isScanning} hitSlop={8}>
          <Text style={styles.uploadLink}>Upload from photos instead</Text>
        </Pressable>
      </View>

      <ItemModal
        visible={modalVisible}
        title="Add New Item"
        onClose={() => setModalVisible(false)}
        onSubmit={(data) => {
          resetReceiptDraft({ items: [itemFromForm(data)] });
          router.push("/scan/manual-items");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.pagePrimary,
    paddingHorizontal: Layout.pagePadding,
    paddingBottom: 16,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  topNav: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  scanFrame: {
    flex: 1,
    width: "85%",
    maxHeight: 520,
    borderWidth: 4,
    borderStyle: "dashed",
    borderColor: COLORS.brandPrimary,
    borderRadius: RADIUS.rounded,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  placeholder: {
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  placeholderText: {
    ...Typography.bodyMd,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  scanningState: {
    alignItems: "center",
    gap: 12,
  },
  scanningText: {
    ...Typography.bodyMd,
    color: COLORS.textSecondary,
  },
  errorMsg: {
    ...Typography.bodySm,
    color: COLORS.textDanger,
    textAlign: "center",
  },
  bottom: {
    width: "100%",
    gap: 12,
  },
  tips: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  tipsText: {
    ...Typography.bodyMd,
    color: COLORS.textDefault,
  },
  bold: {
    fontFamily: Fonts.nunitoBold,
  },
  uploadLink: {
    ...Typography.bodyMdBold,
    textAlign: "center",
    color: COLORS.brandPrimary,
    textDecorationLine: "underline",
  },
});

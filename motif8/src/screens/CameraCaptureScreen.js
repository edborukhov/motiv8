import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useAppData } from "../storage/AppContext";
import { colors, radius, spacing } from "../theme";

export default function CameraCaptureScreen({ navigation }) {
  const { state, addPhoto } = useAppData();
  const [previewUri, setPreviewUri] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleOpenCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Camera access needed", "Enable camera access in your phone settings to log a progress photo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: false });
    if (result.canceled) return;
    setPreviewUri(result.assets[0].uri);
  }

  async function handleUsePhoto() {
    setSaving(true);
    try {
      const dir = `${FileSystem.documentDirectory}motif8_photos/`;
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(() => {});
      const destUri = `${dir}day-${state.currentDay}-${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: previewUri, to: destUri });

      const info = await FileSystem.getInfoAsync(destUri);
      if (!info.exists) {
        throw new Error("File copy reported success but destination file does not exist.");
      }

      await addPhoto(destUri);
      setSaving(false);
      // Go straight to the Gallery tab so you can immediately confirm it saved,
      // instead of silently returning to Today.
      navigation.navigate("Tabs", { screen: "Gallery" });
    } catch (err) {
      setSaving(false);
      console.error("Photo save failed:", err);
      Alert.alert(
        "Couldn't save photo",
        "Something went wrong saving your progress photo. Want to retake it?",
        [
          { text: "Retake", onPress: () => setPreviewUri(null) },
          { text: "Cancel", style: "cancel", onPress: () => navigation.goBack() },
        ]
      );
    }
  }

  if (previewUri) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Text style={styles.title}>Use this photo?</Text>
        <Image source={{ uri: previewUri }} style={styles.preview} />
        {saving ? (
          <ActivityIndicator color={colors.accent} style={{ marginVertical: spacing.md }} />
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleUsePhoto}>
              <Text style={styles.buttonText}>Use photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancel} onPress={() => setPreviewUri(null)}>
              <Text style={styles.cancelText}>Retake</Text>
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>Progress photo</Text>
      <Text style={styles.subtitle}>
        Photos are stored only on this device, never uploaded anywhere.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleOpenCamera}>
        <Text style={styles.buttonText}>Open camera</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancel} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  preview: { width: "100%", aspectRatio: 3 / 4, borderRadius: radius.md, backgroundColor: colors.card, marginBottom: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: "600", marginBottom: spacing.xs },
  subtitle: { color: colors.textSecondary, fontSize: 13, marginBottom: spacing.xl },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  buttonText: { color: colors.accentText, fontSize: 14, fontWeight: "600" },
  cancel: { alignItems: "center", paddingVertical: 12 },
  cancelText: { color: colors.textSecondary, fontSize: 14 },
});

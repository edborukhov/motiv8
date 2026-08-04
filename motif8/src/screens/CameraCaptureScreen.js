import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useAppData } from "../storage/AppContext";
import { colors, radius, spacing } from "../theme";

export default function CameraCaptureScreen({ navigation }) {
  const { state, addPhoto } = useAppData();

  async function handleTakePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Camera access needed", "Enable camera access in your phone settings to log a progress photo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: false });
    if (result.canceled) return;

    const sourceUri = result.assets[0].uri;
    const dir = `${FileSystem.documentDirectory}motif8_photos/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(() => {});
    const destUri = `${dir}day-${state.currentDay}-${Date.now()}.jpg`;
    await FileSystem.copyAsync({ from: sourceUri, to: destUri });

    await addPhoto(destUri);
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress photo</Text>
      <Text style={styles.subtitle}>
        Photos are stored only on this device, never uploaded anywhere.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
        <Text style={styles.buttonText}>Open camera</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancel} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, paddingTop: spacing.xl * 2 },
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

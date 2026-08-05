import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppData } from "../storage/AppContext";
import ProgressRing from "../components/ProgressRing";
import { SECTIONS } from "../constants/sections";
import { colors, radius, spacing } from "../theme";

export default function DayCompleteScreen({ navigation }) {
  const { state } = useAppData();
  if (!state) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ProgressRing completed={SECTIONS.length} total={SECTIONS.length} size={120} />
      <Text style={styles.title}>Day {state.currentDay} complete</Text>
      <Text style={styles.subtitle}>{SECTIONS.length}/{SECTIONS.length} sections closed</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Tabs")}>
        <Text style={styles.buttonText}>Back to today</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: "600", marginTop: spacing.lg },
  subtitle: { color: colors.textSecondary, fontSize: 17, marginTop: spacing.xs, marginBottom: spacing.xl },
  button: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: colors.cardBorder,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: { color: colors.textSecondary, fontSize: 18 },
});

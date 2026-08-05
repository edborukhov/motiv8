import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppData } from "../storage/AppContext";
import { colors, radius, spacing } from "../theme";

export default function FailureScreen({ navigation }) {
  const { state, acknowledgeFailureAndRestart } = useAppData();
  if (!state || !state.pendingFailure) return null;
  const { day, missedSections } = state.pendingFailure;

  async function handleRestart() {
    await acknowledgeFailureAndRestart();
    navigation.navigate("Tabs");
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>No excuses.</Text>
        <Text style={styles.bannerSubtitle}>Day {day} failed. Day 1 starts now.</Text>
      </View>

      <View style={styles.missedCard}>
        <Text style={styles.missedLabel}>Missed sections</Text>
        {missedSections.map((label) => (
          <Text key={label} style={styles.missedItem}>✕ {label}</Text>
        ))}
      </View>

      <View style={styles.resetWrap}>
        <Text style={styles.resetLabel}>Streak reset</Text>
        <Text style={styles.resetValue}>Day 1 <Text style={styles.resetTotal}>/ 90</Text></Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRestart}>
        <Text style={styles.buttonText}>Start day 1 again</Text>
      </TouchableOpacity>
      <Text style={styles.bestRun}>{Math.max(day - 1, 0)} days was your best run yet</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: "center" },
  banner: { backgroundColor: colors.dangerBg, borderRadius: radius.lg, padding: spacing.lg, alignItems: "center", marginBottom: spacing.lg },
  bannerTitle: { color: colors.dangerText, fontSize: 22, fontWeight: "600" },
  bannerSubtitle: { color: colors.danger, fontSize: 18, marginTop: spacing.xs },
  missedCard: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.dangerBg, marginBottom: spacing.lg },
  missedLabel: { color: colors.textSecondary, fontSize: 16, marginBottom: spacing.sm },
  missedItem: { color: colors.danger, fontSize: 17, marginBottom: 4 },
  resetWrap: { alignItems: "center", marginBottom: spacing.lg },
  resetLabel: { color: colors.textMuted, fontSize: 17 },
  resetValue: { color: colors.danger, fontSize: 40, fontWeight: "700" },
  resetTotal: { color: colors.textMuted, fontSize: 20 },
  button: { backgroundColor: colors.danger, borderRadius: radius.md, paddingVertical: 14, alignItems: "center" },
  buttonText: { color: colors.dangerBg, fontSize: 18, fontWeight: "600" },
  bestRun: { color: colors.textMuted, fontSize: 16, textAlign: "center", marginTop: spacing.md },
});

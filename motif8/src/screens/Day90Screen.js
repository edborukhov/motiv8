import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppData } from "../storage/AppContext";
import { colors, radius, spacing } from "../theme";

export default function Day90Screen({ navigation }) {
  const { state, startNewCycle } = useAppData();
  if (!state || !state.pendingDay90) return null;
  const stats = state.pendingDay90;

  async function handleNewCycle() {
    await startNewCycle();
    navigation.navigate("Tabs");
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
    <ScrollView contentContainerStyle={{ padding: spacing.xl, alignItems: "center" }}>
      <Text style={styles.trophy}>🏆</Text>
      <Text style={styles.title}>90 days done.</Text>
      <Text style={styles.subtitle}>You showed up, no excuses.</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.daysCompleted}</Text>
          <Text style={styles.statLabel}>days completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalResets}</Text>
          <Text style={styles.statLabel}>resets along the way</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.sectionsCompleted}</Text>
          <Text style={styles.statLabel}>sections completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.photosLogged}</Text>
          <Text style={styles.statLabel}>photos logged</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleNewCycle}>
        <Text style={styles.primaryButtonText}>Start a new 90-day cycle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Gallery")}>
        <Text style={styles.secondaryButtonText}>View full comparison</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  trophy: { fontSize: 40, marginBottom: spacing.sm },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: "600" },
  subtitle: { color: colors.textSecondary, fontSize: 13, marginBottom: spacing.lg },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, width: "100%", marginBottom: spacing.lg },
  statCard: {
    width: "47%",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
  },
  statValue: { color: colors.accent, fontSize: 20, fontWeight: "600" },
  statLabel: { color: colors.textMuted, fontSize: 10, marginTop: 2, textAlign: "center" },
  primaryButton: {
    width: "100%",
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  primaryButtonText: { color: colors.accentText, fontSize: 14, fontWeight: "600" },
  secondaryButton: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: colors.cardBorder,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: { color: colors.textSecondary, fontSize: 14 },
});

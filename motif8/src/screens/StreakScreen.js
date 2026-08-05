import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppData } from "../storage/AppContext";
import { TRANSFORMATION_LENGTH } from "../constants/sections";
import { colors, radius, spacing } from "../theme";

export default function StreakScreen() {
  const { state } = useAppData();
  if (!state) return null;

  const cells = [];
  for (let day = 1; day <= TRANSFORMATION_LENGTH; day++) {
    if (day < state.currentDay) cells.push("complete");
    else if (day === state.currentDay) cells.push("today");
    else cells.push("upcoming");
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={styles.title}>Streak</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.accent }]}>{state.currentDay}</Text>
          <Text style={styles.statLabel}>current streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{TRANSFORMATION_LENGTH}</Text>
          <Text style={styles.statLabel}>day goal</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{state.totalResets}</Text>
          <Text style={styles.statLabel}>resets so far</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {cells.map((status, i) => (
          <View
            key={i}
            style={[
              styles.cell,
              status === "complete" && styles.cellComplete,
              status === "today" && styles.cellToday,
            ]}
          />
        ))}
      </View>

      <View style={styles.legendRow}>
        <View style={[styles.legendDot, { backgroundColor: colors.cardBorder }]} />
        <Text style={styles.legendText}>missed</Text>
        <View style={[styles.legendDot, { backgroundColor: colors.accent, marginLeft: spacing.md }]} />
        <Text style={styles.legendText}>complete</Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: "600", marginBottom: spacing.md },
  statsRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, alignItems: "center" },
  statValue: { color: colors.textPrimary, fontSize: 20, fontWeight: "600" },
  statLabel: { color: colors.textMuted, fontSize: 10, marginTop: 2, textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  cell: { width: 18, height: 18, borderRadius: 3, backgroundColor: colors.card },
  cellComplete: { backgroundColor: colors.accent },
  cellToday: { borderWidth: 1.5, borderColor: colors.accent, backgroundColor: "transparent" },
  legendRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.md },
  legendDot: { width: 10, height: 10, borderRadius: 2, marginRight: spacing.xs },
  legendText: { color: colors.textMuted, fontSize: 11 },
});

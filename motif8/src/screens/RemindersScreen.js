import React from "react";
import { View, Text, Switch, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppData } from "../storage/AppContext";
import { SECTIONS } from "../constants/sections";
import { colors, radius, spacing } from "../theme";

export default function RemindersScreen({ navigation }) {
  const { state, setReminder, resetAllData } = useAppData();
  if (!state) return null;

  function handleResetPress() {
    Alert.alert(
      "Reset all data?",
      "This wipes your streak, history, notes, and photo references, and starts a brand new Day 1. This cannot be undone. This button is for testing only and should be removed before publishing.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset everything",
          style: "destructive",
          onPress: async () => {
            await resetAllData();
            navigation.navigate("Tabs", { screen: "Today" });
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={styles.title}>Reminders</Text>
      <Text style={styles.subtitle}>Set a nudge time for each section</Text>

      {SECTIONS.map((sec) => {
        const r = state.reminders[sec.key];
        return (
          <View key={sec.key} style={styles.row}>
            <Text style={styles.label}>{sec.label}</Text>
            <View style={styles.controls}>
              <TextInput
                style={styles.timeInput}
                value={r.time}
                onChangeText={(t) => setReminder(sec.key, { time: t })}
                placeholder="HH:MM"
                placeholderTextColor={colors.textMuted}
                editable={r.enabled}
              />
              <Switch
                value={r.enabled}
                onValueChange={(v) => setReminder(sec.key, { enabled: v })}
                trackColor={{ false: colors.cardBorder, true: colors.accent }}
                thumbColor={colors.accentText}
              />
            </View>
          </View>
        );
      })}

      <Text style={styles.note}>
        Reminders fire locally on your device at the time you set. Actual notification
        scheduling is wired up in notifications.js once you're testing on a real device.
      </Text>

      <View style={styles.debugSection}>
        <Text style={styles.debugLabel}>Debug tools</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetPress}>
          <Text style={styles.resetButtonText}>Reset all data</Text>
        </TouchableOpacity>
        <Text style={styles.debugNote}>Testing only. Remove this before publishing.</Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: "600" },
  subtitle: { color: colors.textSecondary, fontSize: 16, marginBottom: spacing.lg },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  label: { color: colors.textPrimary, fontSize: 18 },
  controls: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  timeInput: {
    color: colors.accent,
    fontSize: 17,
    minWidth: 56,
    textAlign: "right",
  },
  note: { color: colors.textMuted, fontSize: 14, marginTop: spacing.lg, lineHeight: 16 },
  debugSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    alignItems: "center",
  },
  debugLabel: { color: colors.textMuted, fontSize: 12, marginBottom: spacing.sm, textTransform: "uppercase" },
  resetButton: {
    backgroundColor: colors.dangerBg,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    width: "100%",
    alignItems: "center",
  },
  resetButtonText: { color: colors.dangerText, fontSize: 15, fontWeight: "600" },
  debugNote: { color: colors.textMuted, fontSize: 11, marginTop: spacing.xs, textAlign: "center" },
});

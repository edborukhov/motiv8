import React from "react";
import { View, Text, Switch, TextInput, ScrollView, StyleSheet } from "react-native";
import { useAppData } from "../storage/AppContext";
import { SECTIONS } from "../constants/sections";
import { colors, radius, spacing } from "../theme";

export default function RemindersScreen() {
  const { state, setReminder } = useAppData();
  if (!state) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: "600" },
  subtitle: { color: colors.textSecondary, fontSize: 12, marginBottom: spacing.lg },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  label: { color: colors.textPrimary, fontSize: 14 },
  controls: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  timeInput: {
    color: colors.accent,
    fontSize: 13,
    minWidth: 56,
    textAlign: "right",
  },
  note: { color: colors.textMuted, fontSize: 11, marginTop: spacing.lg, lineHeight: 16 },
});

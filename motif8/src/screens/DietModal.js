import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppData } from "../storage/AppContext";
import { DIET_ITEMS } from "../constants/sections";
import { colors, radius, spacing } from "../theme";

export default function DietModal({ navigation }) {
  const { state, setDietSub } = useAppData();
  if (!state) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>Diet</Text>
      <Text style={styles.subtitle}>Log at least one to mark today's diet done.</Text>

      {DIET_ITEMS.map((item) => {
        const done = state.dietSub[item.key];
        return (
          <TouchableOpacity
            key={item.key}
            disabled={state.dayLocked}
            style={styles.row}
            onPress={() => setDietSub(item.key, !done)}
          >
            <View style={[styles.checkCircle, done && styles.checkCircleDone]}>
              {done ? <Text style={styles.checkMark}>✓</Text> : null}
            </View>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: "600", marginBottom: spacing.xs },
  subtitle: { color: colors.textSecondary, fontSize: 17, marginBottom: spacing.lg },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  checkCircleDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  checkMark: { color: colors.accentText, fontSize: 17, fontWeight: "700" },
  label: { color: colors.textPrimary, fontSize: 18 },
  doneButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  doneButtonText: { color: colors.accentText, fontSize: 18, fontWeight: "600" },
});

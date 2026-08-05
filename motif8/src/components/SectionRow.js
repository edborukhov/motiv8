import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { colors, radius, spacing } from "../theme";

export default function SectionRow({ label, subtitle, done, disabled, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={[styles.row, disabled && styles.rowDisabled]}
    >
      <View style={[styles.checkCircle, done && styles.checkCircleDone]}>
        {done ? <Text style={styles.checkMark}>✓</Text> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  rowDisabled: { opacity: 0.6 },
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
  label: { color: colors.textPrimary, fontSize: 18, flexShrink: 0 },
  subtitle: { color: colors.textMuted, fontSize: 16, marginLeft: "auto" },
});

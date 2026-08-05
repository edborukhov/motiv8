import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, spacing } from "../theme";

export default function CompareScreen({ route }) {
  const { photos } = route.params;
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(photos.length - 1);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>Compare</Text>

      <View style={styles.row}>
        <Image source={{ uri: photos[leftIndex].uri }} style={styles.image} />
        <Image source={{ uri: photos[rightIndex].uri }} style={styles.image} />
      </View>
      <View style={styles.row}>
        <Text style={styles.dayLabel}>Day {photos[leftIndex].day}</Text>
        <Text style={styles.dayLabel}>Day {photos[rightIndex].day}</Text>
      </View>

      <Text style={styles.pickerLabel}>Jump to a day</Text>
      <View style={styles.pickerRow}>
        {photos.map((p, i) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.chip, (i === leftIndex || i === rightIndex) && styles.chipActive]}
            onPress={() => setRightIndex(i)}
            onLongPress={() => setLeftIndex(i)}
          >
            <Text style={styles.chipText}>{p.day}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.hint}>Tap to set the right photo, hold to set the left photo.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: "600", marginBottom: spacing.md },
  row: { flexDirection: "row", gap: spacing.sm },
  image: { flex: 1, aspectRatio: 3 / 4, borderRadius: radius.md, backgroundColor: colors.card },
  dayLabel: { flex: 1, color: colors.accent, fontSize: 16, textAlign: "center", marginTop: spacing.xs },
  pickerLabel: { color: colors.textSecondary, fontSize: 16, marginTop: spacing.lg, marginBottom: spacing.sm },
  pickerRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  chip: {
    borderWidth: 0.5,
    borderColor: colors.cardBorder,
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  chipActive: { borderColor: colors.accent },
  chipText: { color: colors.textSecondary, fontSize: 16 },
  hint: { color: colors.textMuted, fontSize: 14, marginTop: spacing.md },
});

import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useAppData } from "../storage/AppContext";
import ProgressRing from "../components/ProgressRing";
import SectionRow from "../components/SectionRow";
import { SECTIONS, TRANSFORMATION_LENGTH } from "../constants/sections";
import { colors, spacing } from "../theme";

export default function TodayScreen({ navigation }) {
  const { state, toggleSection, closeOutDay } = useAppData();
  if (!state) return null;

  const completed = Object.values(state.sections).filter(Boolean).length;

  async function handleToggle(key) {
    if (key === "diet") {
      navigation.navigate("DietModal");
      return;
    }
    if (key === "progress") {
      navigation.navigate("CameraCapture");
      return;
    }
    toggleSection(key);
  }

  React.useEffect(() => {
    const allDone = Object.values(state.sections).every(Boolean);
    if (allDone && !state.dayLocked) {
      closeOutDay().then(({ isDay90 }) => {
        navigation.navigate(isDay90 ? "Day90" : "DayComplete");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sections]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <View style={styles.header}>
        <Text style={styles.dayLabel}>Day {state.currentDay} of {TRANSFORMATION_LENGTH}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Reminders")}>
          <Text style={styles.settingsLink}>Reminders</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ringWrap}>
        <ProgressRing completed={completed} total={SECTIONS.length} subtitle="complete" />
      </View>

      {SECTIONS.map((sec) => (
        <SectionRow
          key={sec.key}
          label={sec.label}
          subtitle={sec.subtitle}
          done={state.sections[sec.key]}
          disabled={state.dayLocked}
          onPress={() => handleToggle(sec.key)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm },
  dayLabel: { color: colors.textSecondary, fontSize: 13 },
  settingsLink: { color: colors.accent, fontSize: 13 },
  ringWrap: { alignItems: "center", marginVertical: spacing.lg },
});

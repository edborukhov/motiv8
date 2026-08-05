import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppData } from "../storage/AppContext";
import { colors, radius, spacing } from "../theme";

export default function NotesScreen() {
  const { state, addNote } = useAppData();
  const [draft, setDraft] = useState("");
  if (!state) return null;

  function handleSave() {
    if (!draft.trim()) return;
    addNote(draft);
    setDraft("");
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>Notes</Text>

      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind today..."
          placeholderTextColor={colors.textMuted}
          multiline
          value={draft}
          onChangeText={setDraft}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.pastLabel}>Past entries</Text>
      <FlatList
        data={state.notes}
        keyExtractor={(n) => n.id}
        renderItem={({ item }) => (
          <View style={styles.noteRow}>
            <Text style={styles.noteDay}>Day {item.day}</Text>
            <Text style={styles.noteText}>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No notes yet.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: "600", marginBottom: spacing.md },
  inputCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.lg },
  input: { minHeight: 70, color: colors.textPrimary, fontSize: 18, textAlignVertical: "top" },
  saveButton: {
    alignSelf: "flex-end",
    backgroundColor: colors.accent,
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginTop: spacing.sm,
  },
  saveButtonText: { color: colors.accentText, fontSize: 17, fontWeight: "600" },
  pastLabel: { color: colors.textSecondary, fontSize: 16, marginBottom: spacing.sm },
  noteRow: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  noteDay: { color: colors.textMuted, fontSize: 14 },
  noteText: { color: colors.textPrimary, fontSize: 17, marginTop: spacing.xs },
  empty: { color: colors.textMuted, fontSize: 17, marginTop: spacing.lg, textAlign: "center" },
});

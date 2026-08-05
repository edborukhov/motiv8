import React from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppData } from "../storage/AppContext";
import { colors, radius, spacing } from "../theme";

export default function GalleryScreen({ navigation }) {
  const { state } = useAppData();
  if (!state) return null;

  const photos = [...state.photos].sort((a, b) => a.day - b.day);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>Progress</Text>
      <Text style={styles.subtitle}>{photos.length} photos since day 1</Text>

      {photos.length >= 2 && (
        <TouchableOpacity
          style={styles.compareButton}
          onPress={() => navigation.navigate("Compare", { photos })}
        >
          <Text style={styles.compareButtonText}>Compare day 1 vs latest</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ gap: spacing.sm }}
        contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.xl }}
        renderItem={({ item }) => (
          <View style={styles.tile}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <Text style={styles.dayTag}>Day {item.day}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No photos yet. Take today's photo from the checklist.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: "600" },
  subtitle: { color: colors.textSecondary, fontSize: 12, marginBottom: spacing.md },
  compareButton: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  compareButtonText: { color: colors.accent, fontSize: 13, fontWeight: "600" },
  tile: { flex: 1 / 3, aspectRatio: 3 / 4 },
  image: { width: "100%", height: "100%", borderRadius: radius.sm, backgroundColor: colors.card },
  dayTag: { color: colors.textSecondary, fontSize: 10, position: "absolute", bottom: 4, left: 6 },
  empty: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xl, textAlign: "center" },
});

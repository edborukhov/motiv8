import React, { useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppDataProvider, useAppData } from "./src/storage/AppContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { colors } from "./src/theme";

const navigationRef = createNavigationContainerRef();

function StartupRouter() {
  const { ready, state } = useAppData();

  useEffect(() => {
    if (!ready || !state || !navigationRef.isReady()) return;
    if (state.pendingFailure) {
      navigationRef.navigate("Failure");
    } else if (state.pendingDay90) {
      navigationRef.navigate("Day90");
    }
  }, [ready, state]);

  return null;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <NavigationContainer ref={navigationRef} theme={{ dark: true, colors: { background: colors.background, card: colors.background, text: colors.textPrimary, border: colors.cardBorder, primary: colors.accent, notification: colors.accent } }}>
          <StatusBar style="light" />
          <RootNavigator />
          <StartupRouter />
        </NavigationContainer>
      </AppDataProvider>
    </SafeAreaProvider>
  );
}

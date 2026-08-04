import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { colors } from "../theme";

import TodayScreen from "../screens/TodayScreen";
import GalleryScreen from "../screens/GalleryScreen";
import NotesScreen from "../screens/NotesScreen";
import StreakScreen from "../screens/StreakScreen";
import DietModal from "../screens/DietModal";
import CameraCaptureScreen from "../screens/CameraCaptureScreen";
import RemindersScreen from "../screens/RemindersScreen";
import DayCompleteScreen from "../screens/DayCompleteScreen";
import Day90Screen from "../screens/Day90Screen";
import FailureScreen from "../screens/FailureScreen";
import CompareScreen from "../screens/CompareScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.cardBorder },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      <Tab.Screen name="Notes" component={NotesScreen} />
      <Tab.Screen name="Streak" component={StreakScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="DietModal" component={DietModal} options={{ presentation: "modal" }} />
      <Stack.Screen name="CameraCapture" component={CameraCaptureScreen} options={{ presentation: "modal" }} />
      <Stack.Screen name="Reminders" component={RemindersScreen} options={{ presentation: "modal" }} />
      <Stack.Screen name="DayComplete" component={DayCompleteScreen} options={{ presentation: "modal", gestureEnabled: false }} />
      <Stack.Screen name="Day90" component={Day90Screen} options={{ presentation: "modal", gestureEnabled: false }} />
      <Stack.Screen name="Failure" component={FailureScreen} options={{ presentation: "modal", gestureEnabled: false }} />
      <Stack.Screen name="Compare" component={CompareScreen} />
    </Stack.Navigator>
  );
}

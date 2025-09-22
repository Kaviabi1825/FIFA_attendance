import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StoreInitializer } from "../components/StoreInitializer";
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from "../lib/apollo";

// Create custom theme based on Murali Tex brand colors
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#009688',
    secondary: '#4A90E2',
    tertiary: '#50C878',
    error: '#FF6B6B',
    background: '#F5F5F5',
    surface: '#FFFFFF',
  },
};

// We don't need to adapt navigation theme for now as it might be causing issues

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="light" />
        <ApolloProvider client={apolloClient}>
        <StoreInitializer>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="orders" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="search" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="notification-detail" />
          <Stack.Screen name="accounts" />
          <Stack.Screen name="report" />
          <Stack.Screen name="attendance" />
          <Stack.Screen name="attendance/select-staff" />
          <Stack.Screen name="attendance/mark-attendance" />
          <Stack.Screen name="attendance/calendar-view" />
          <Stack.Screen name="attendance/details" />
          <Stack.Screen name="attendance/reports" />
          <Stack.Screen name="attendance/bulk-update" />
          <Stack.Screen name="attendance/settings" />
          <Stack.Screen name="profile/personal-info" />
          <Stack.Screen name="profile/settings" />
          <Stack.Screen name="profile/notifications" />
          <Stack.Screen name="profile/help-support" />
        </Stack>
        </StoreInitializer>
        </ApolloProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

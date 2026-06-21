import React from "react";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Home } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // 1. Hide the Header globally to avoid the page name at the top
        headerShown: false,

        // 2. Styling the Tab Bar for responsiveness and a modern minimal look
        tabBarActiveTintColor: "#FFA500", // Audiomack Orange
        tabBarInactiveTintColor: "#8E8E93",
        tabBarShowLabel: false, // Modern minimal look (icons only)
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
          // Fixed small bottom bar dimensions across platforms
          height: Platform.OS === "ios" ? 75 : 65,
          backgroundColor:
            Platform.OS === "ios" ? "transparent" : "rgba(5, 5, 5, 0.9)",
          paddingBottom: Platform.OS === "ios" ? 25 : 12,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={70}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      }}
    >
      {/* Main Library / Home Screen 
        Ensure your file inside app/(tabs)/index.tsx manages the listing.
      */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Home color={color} size={26} strokeWidth={focused ? 2.5 : 1.5} />
          ),
        }}
      />
    </Tabs>
  );
}

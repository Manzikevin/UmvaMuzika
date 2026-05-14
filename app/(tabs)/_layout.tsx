import React from "react";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Home, Play } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // 1. Hide the Header globally to avoid the page name at the top
        headerShown: false,

        // 2. Styling the Tab Bar
        tabBarActiveTintColor: "#FFA500", // Audiomack Orange
        tabBarInactiveTintColor: "#8E8E93",
        tabBarShowLabel: false, // Modern minimal look (icons only)
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
          // Shrinking the height for a "small" bottom bar feel
          height: Platform.OS === "ios" ? 70 : 60,
          backgroundColor:
            Platform.OS === "ios" ? "transparent" : "rgba(0, 0, 0, 0.85)",
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={60}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Home color={color} size={26} strokeWidth={focused ? 2.5 : 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="player"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Play
              color={color}
              size={26}
              fill={focused ? color : "none"}
              strokeWidth={1.5}
            />
          ),
        }}
      />
    </Tabs>
  );
}

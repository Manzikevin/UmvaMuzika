import { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Stack, useRouter, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Play, Pause } from "lucide-react-native"; // Import icons
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname(); // Used to hide mini-player on the full player screen

  const [loaded, error] = useFonts({
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
    "Poppins-Black": Poppins_900Black,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  // Don't show mini player if we are currently ON the full player page
  const showMiniPlayer = pathname !== "/player";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />

        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="player" options={{ presentation: "modal" }} />
          </Stack>

          {/* Persistent Mini Player */}
          {showMiniPlayer && (
            <TouchableOpacity
              style={styles.miniPlayer}
              onPress={() => router.push("/player")}
              activeOpacity={0.9}
            >
              <View style={styles.miniContent}>
                <View style={styles.miniInfo}>
                  <Text style={styles.miniTitle} numberOfLines={1}>
                    Now Playing...
                  </Text>
                  <Text style={styles.miniArtist} numberOfLines={1}>
                    Select a track
                  </Text>
                </View>
                <TouchableOpacity style={styles.miniPlayBtn}>
                  <Play size={24} color="#fff" fill="#fff" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  miniPlayer: {
    position: "absolute",
    bottom: 90, // Positioned above the Tab Bar
    left: 10,
    right: 10,
    height: 65,
    backgroundColor: "rgba(20, 20, 20, 0.95)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 15,
    justifyContent: "center",
    overflow: "hidden",
  },
  miniContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  miniInfo: { flex: 1 },
  miniTitle: { color: "#fff", fontSize: 14, fontWeight: "700" },
  miniArtist: { color: "rgba(255, 255, 255, 0.6)", fontSize: 12 },
  miniPlayBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

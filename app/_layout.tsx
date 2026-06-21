import { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Stack, useRouter, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Play, Pause } from "lucide-react-native";
import { AudioProvider, useAudio } from "../src/context/AudioContext";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const { width } = Dimensions.get("window");

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentTrack, isPlaying, player } = useAudio();

  const showMiniPlayer = pathname !== "/player" && currentTrack !== null;

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="player" options={{ presentation: "modal" }} />
      </Stack>

      {/* Persistent Mini Player linked globally */}
      {showMiniPlayer && (
        <TouchableOpacity
          style={styles.miniPlayer}
          onPress={() => router.push("/player")}
          activeOpacity={0.9}
        >
          <View style={styles.miniContent}>
            <View style={styles.miniInfo}>
              <Text style={styles.miniTitle} numberOfLines={1}>
                {currentTrack?.title}
              </Text>
              <Text style={styles.miniArtist} numberOfLines={1}>
                {currentTrack?.artist}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.miniPlayBtn}
              onPress={() => (isPlaying ? player?.pause() : player?.play())}
            >
              {isPlaying ? (
                <Pause size={22} color="#fff" fill="#fff" />
              ) : (
                <Play size={22} color="#fff" fill="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AudioProvider>
          <StatusBar style="light" />
          <RootLayoutContent />
        </AudioProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  miniPlayer: {
    position: "absolute",
    bottom: width > 400 ? 85 : 75, // Responsive adjustment
    left: 12,
    right: 12,
    height: 65,
    backgroundColor: "rgba(20, 20, 20, 0.95)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  miniContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  miniInfo: { flex: 1, marginRight: 10 },
  miniTitle: { color: "#fff", fontSize: 14, fontFamily: "Poppins-SemiBold" },
  miniArtist: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  miniPlayBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

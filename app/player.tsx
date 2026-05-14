import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useLocalSearchParams, useRouter } from "expo-router"; // Added router hooks
import { MotiView } from "moti";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Heart,
  ListMusic,
  ChevronDown,
  Volume2,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

// Default fallback cover for local files without art
const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop";

export default function ModernPlayer() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // 1. Grab the data passed from the Library Screen
  const { title, artist, source, cover } = useLocalSearchParams<{
    title: string;
    artist: string;
    source: string;
    cover?: string;
  }>();

  // 2. Initialize player with the dynamic source
  const player = useAudioPlayer(source || "");
  const status = useAudioPlayerStatus(player);

  const progress = useMemo(() => {
    if (!status.duration || status.duration <= 0) return 0;
    return (status.currentTime / status.duration) * 100;
  }, [status.currentTime, status.duration]);

  const togglePlayback = () =>
    status.playing ? player.pause() : player.play();

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Dynamic Background */}
      <ImageBackground
        source={{ uri: cover || DEFAULT_COVER }}
        style={StyleSheet.absoluteFillObject}
      >
        <BlurView
          intensity={80}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)", "#000"]}
          style={StyleSheet.absoluteFillObject}
        />
      </ImageBackground>

      <View
        style={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Header Navigation */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.glassBtn}
            onPress={() => router.back()}
          >
            <ChevronDown color="#fff" size={24} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.nowPlayingText}>PLAYING LOCAL FILE</Text>
            <Text style={styles.albumText} numberOfLines={1}>
              {title || "Unknown Track"}
            </Text>
          </View>
          <TouchableOpacity style={styles.glassBtn}>
            <ListMusic color="#fff" size={24} />
          </TouchableOpacity>
        </View>

        {/* Floating Artwork */}
        <MotiView
          animate={{ scale: status.playing ? 1 : 0.92, opacity: 1 }}
          transition={{ type: "timing", duration: 500 }}
          style={styles.artContainer}
        >
          <ImageBackground
            source={{ uri: cover || DEFAULT_COVER }}
            style={styles.artwork}
            imageStyle={{ borderRadius: 40 }}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.2)", "transparent"]}
              style={StyleSheet.absoluteFillObject}
            />
          </ImageBackground>
        </MotiView>

        {/* Title & Favorite */}
        <View style={styles.metaRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.titleText} numberOfLines={1}>
              {title || "Unknown Title"}
            </Text>
            <Text style={styles.artistText} numberOfLines={1}>
              {artist || "Unknown Artist"}
            </Text>
          </View>
          <TouchableOpacity style={styles.heartCircle}>
            <Heart size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressWrapper}>
          <View style={styles.trackBase}>
            <MotiView
              animate={{ width: `${progress}%` }}
              style={styles.trackFill}
            />
          </View>
          <View style={styles.timeLabels}>
            <Text style={styles.timeText}>
              {formatTime(status.currentTime)}
            </Text>
            <Text style={styles.timeText}>{formatTime(status.duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity>
            <Shuffle size={20} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>

          <View style={styles.mainControls}>
            <TouchableOpacity
              onPress={() =>
                player.seekTo(Math.max(0, status.currentTime - 10000))
              }
            >
              <SkipBack size={32} color="#fff" fill="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePlayback}
              style={styles.playContainer}
            >
              <LinearGradient
                colors={["#fff", "#e0e0e0"]}
                style={styles.playGradient}
              >
                {status.isBuffering ? (
                  <ActivityIndicator color="#000" />
                ) : status.playing ? (
                  <Pause size={32} color="#000" fill="#000" />
                ) : (
                  <Play
                    size={32}
                    color="#000"
                    fill="#000"
                    style={{ marginLeft: 4 }}
                  />
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                player.seekTo(
                  Math.min(status.duration, status.currentTime + 10000),
                )
              }
            >
              <SkipForward size={32} color="#fff" fill="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Repeat size={20} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.devicePicker}>
            <Volume2 size={16} color="#FFA500" />
            <Text style={styles.deviceText}>Phone Speaker</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { flex: 1, justifyContent: "space-between", paddingHorizontal: 25 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  glassBtn: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { alignItems: "center", flex: 1, marginHorizontal: 10 },
  nowPlayingText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  albumText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  artContainer: {
    width: "100%",
    aspectRatio: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  artwork: { flex: 1 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  titleText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  artistText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 18,
    fontWeight: "500",
  },
  heartCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressWrapper: { marginTop: 20 },
  trackBase: {
    height: 6,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 3,
  },
  trackFill: { height: "100%", backgroundColor: "#fff", borderRadius: 3 },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  timeText: { color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: "600" },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  mainControls: { flexDirection: "row", alignItems: "center", gap: 30 },
  playContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    elevation: 10,
    shadowColor: "#fff",
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  playGradient: {
    flex: 1,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: { alignItems: "center" },
  devicePicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  deviceText: { color: "#FFA500", fontWeight: "700", fontSize: 12 },
});

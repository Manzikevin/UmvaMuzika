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
import { useAudioPlayerStatus } from "expo-audio";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import Slider from "@react-native-community/slider"; // Standard high-performance gesture tracking slider
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronDown,
} from "lucide-react-native";
import { useAudio } from "../src/context/AudioContext";

const { height } = Dimensions.get("window");
const DEFAULT_COVER =
  "https://res.cloudinary.com/duhvufmjp/image/upload/v1782063912/umva_whibml.png";

export default function ModernPlayer() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { player, currentTrack, isPlaying, playNext, playPrevious } =
    useAudio();

  // Observe global audio player runtime hooks seamlessly
  const status = useAudioPlayerStatus(player!);

  // Fix: formatTime expects seconds because expo-audio outputs currentTime and duration in seconds
  const formatTime = (secondsTotal: number) => {
    if (isNaN(secondsTotal) || secondsTotal <= 0) return "0:00";
    const minutes = Math.floor(secondsTotal / 60);
    const seconds = Math.floor(secondsTotal % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!currentTrack) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={{ color: "#fff" }}>No Track Selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{ uri: DEFAULT_COVER }}
        style={StyleSheet.absoluteFillObject}
      >
        <BlurView
          intensity={90}
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
          { paddingTop: insets.top, paddingBottom: insets.bottom + 15 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.glassBtn}
            onPress={() => router.back()}
          >
            <ChevronDown color="#fff" size={24} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.nowPlayingText}>NOW PLAYING</Text>
          </View>
          <View style={{ width: 45 }} />
        </View>

        {/* Album Artwork */}
        <MotiView
          animate={{ scale: isPlaying ? 1 : 0.94 }}
          transition={{ type: "timing", duration: 400 }}
          style={styles.artContainer}
        >
          <ImageBackground
            source={{ uri: DEFAULT_COVER }}
            style={styles.artwork}
            imageStyle={{ borderRadius: 24 }}
          />
        </MotiView>

        {/* Metadata */}
        <View style={styles.metaRow}>
          <Text style={styles.titleText} numberOfLines={1}>
            {currentTrack.title || "Unknown Title"}
          </Text>
          <Text style={styles.artistText} numberOfLines={1}>
            {currentTrack.artist || "Unknown Artist"}
          </Text>
        </View>

        {/* Interactive Progress Seeker */}
        <View style={styles.progressWrapper}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={status.duration || 1}
            value={status.currentTime || 0}
            minimumTrackTintColor="#0ba000"
            maximumTrackTintColor="rgba(255,255,255,0.2)"
            thumbTintColor="#1e810088"
            // Updates current position smoothly on slide complete
            onSlidingComplete={(value) => {
              player?.seekTo(value);
            }}
          />
          <View style={styles.timeLabels}>
            <Text style={styles.timeText}>
              {formatTime(status.currentTime)}
            </Text>
            <Text style={styles.timeText}>{formatTime(status.duration)}</Text>
          </View>
        </View>

        {/* Media Control System */}
        <View style={styles.controlsRow}>
          {/* True Song Skipping Backwards */}
          <TouchableOpacity onPress={playPrevious}>
            <SkipBack size={32} color="#fff" fill="#fff" />
          </TouchableOpacity>

          {/* Toggle Action Center */}
          <TouchableOpacity
            onPress={() => (isPlaying ? player?.pause() : player?.play())}
            style={styles.playContainer}
          >
            <View style={styles.playButtonInside}>
              {status.isBuffering ? (
                <ActivityIndicator color="#fff" />
              ) : isPlaying ? (
                <Pause size={30} color="#fff" fill="#fff" />
              ) : (
                <Play
                  size={30}
                  color="#fff"
                  fill="#fff"
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
          </TouchableOpacity>

          {/* True Song Skipping Forwards */}
          <TouchableOpacity onPress={playNext}>
            <SkipForward size={32} color="#fff" fill="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  centered: { justifyContent: "center", alignItems: "center" },
  content: { flex: 1, justifyContent: "space-between", paddingHorizontal: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  glassBtn: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { alignItems: "center", flex: 1 },
  nowPlayingText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  artContainer: {
    width: "100%",
    aspectRatio: 1,
    alignSelf: "center",
    marginVertical: height > 700 ? 20 : 10,
  },
  artwork: { flex: 1 },
  metaRow: { alignItems: "flex-start" },
  titleText: {
    color: "#fff",
    fontSize: height > 700 ? 24 : 20,
    fontWeight: "800",
  },
  artistText: { color: "rgba(255,255,255,0.5)", fontSize: 16, marginTop: 4 },
  progressWrapper: { marginVertical: 10, width: "100%" },
  slider: { width: "100%", height: 40 },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  timeText: { color: "rgba(255,255,255,0.4)", fontSize: 12 },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 20,
  },
  playContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#0ba000",
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonInside: { justifyContent: "center", alignItems: "center" },
});

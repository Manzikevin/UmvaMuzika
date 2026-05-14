import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Heart,
  Share2,
  ChevronDown,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

// PERMANENT LINK: Internet Archive (Creative Commons Lofi)
const songSource =
  "https://archive.org/download/78_the-story-of-the-old-town_geovane-bruno_gb-records_6b8a8b/The%20Story%20of%20the%20Old%20Town%20-%20Geovane%20Bruno.mp3";

export default function PlayerScreen() {
  const insets = useSafeAreaInsets();

  // Initialize the Audio Player
  const player = useAudioPlayer(songSource);
  const status = useAudioPlayerStatus(player);

  const togglePlayback = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const progress =
    status.duration > 0 ? (status.currentTime / status.duration) * 100 : 0;

  const formatTime = (ms: number) => {
    if (!ms || ms <= 0) return "0:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
      ]}
    >
      <View style={styles.header}>
        <ChevronDown color="#fff" size={28} />
        <Text style={styles.headerText}>Now Playing</Text>
        <Share2 color="#fff" size={24} />
      </View>

      <View style={styles.artworkContainer}>
        <Image
          source={{ uri: "https://picsum.photos/id/145/600/600" }}
          style={styles.artwork}
        />
      </View>

      <View style={styles.metaContainer}>
        <View style={styles.titleWrapper}>
          <Text style={styles.songTitle} numberOfLines={1}>
            Old Town Story
          </Text>
          <Text style={styles.artistName}>Geovane Bruno</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Heart color="#FFA500" size={30} fill="#FFA500" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.timeWrapper}>
          <Text style={styles.timeText}>{formatTime(status.currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(status.duration)}</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity>
          <Shuffle color="#B3B3B3" size={24} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => player.seekTo(0)}
        >
          <SkipBack color="#fff" size={34} fill="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playPauseBtn}
          onPress={togglePlayback}
          activeOpacity={0.9}
          disabled={status.isBuffering}
        >
          {status.isBuffering ? (
            <ActivityIndicator color="#000" />
          ) : status.playing ? (
            <Pause color="#000" size={32} fill="#000" />
          ) : (
            <Play
              color="#000"
              size={32}
              fill="#000"
              style={{ marginLeft: 4 }}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn}>
          <SkipForward color="#fff" size={34} fill="#fff" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Repeat color="#B3B3B3" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 30,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  artworkContainer: {
    alignItems: "center",
    shadowColor: "#FFA500",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
  },
  artwork: {
    width: width * 0.82,
    height: width * 0.82,
    borderRadius: 24,
    backgroundColor: "#1A1A1A",
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleWrapper: { flex: 1, paddingRight: 20 },
  songTitle: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "Poppins-Black",
    letterSpacing: -0.5,
  },
  artistName: {
    color: "#B3B3B3",
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    marginTop: -2,
  },
  progressContainer: { width: "100%" },
  progressBar: {
    height: 4,
    backgroundColor: "#222",
    borderRadius: 2,
    width: "100%",
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#FFA500" },
  timeWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  timeText: { color: "#8E8E93", fontSize: 12, fontFamily: "Poppins-Bold" },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  playPauseBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  skipBtn: { padding: 5 },
});

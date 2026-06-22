// app/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import * as MediaLibrary from "expo-media-library";
import { Search, Music2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAudio } from "../../src/context/AudioContext";

const { width } = Dimensions.get("window");

interface AudioFile {
  id: string;
  title: string;
  artist: string;
  uri: string;
  duration: number;
}

export default function LocalLibrary() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { playTrack } = useAudio();

  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState<AudioFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadLocalMusic();
  }, []);

  const loadLocalMusic = async () => {
    setLoading(true);
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow media access to scan system folders.",
      );
      setLoading(false);
      return;
    }

    try {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
        first: 1000,
        // Fix: Updated to match modern expo-media-library layout spec mapping
        sortBy: ["creationTime"],
      });

      const formattedSongs = media.assets.map((asset) => ({
        id: asset.id,
        title: asset.filename
          ? asset.filename.replace(/\.[^/.]+$/, "")
          : "Unknown Track",
        artist: "Unknown Album / Folder",
        uri: asset.uri,
        duration: asset.duration,
      }));

      setSongs(formattedSongs);
    } catch (error) {
      console.error("Storage Indexing Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.mainTitle}>My Files</Text>
        <View style={styles.searchContainer}>
          <Search color="#888" size={18} style={{ marginLeft: 12 }} />
          <TextInput
            placeholder="Search all local files..."
            placeholderTextColor="#666"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3dd700" />
        </View>
      ) : (
        <FlatList
          data={filteredSongs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 140 },
          ]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.fileRow}
              onPress={() => {
                // Pass the single item alongside the matching array to instantiate the play context queue cleanly
                playTrack(item, filteredSongs);
                router.push("/player");
              }}
            >
              <View style={styles.fileIconBase}>
                <Music2 color="#0ba000" size={20} />
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.metaText}>Audio File</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  header: { paddingHorizontal: 20, paddingBottom: 15 },
  mainTitle: {
    fontSize: width > 400 ? 34 : 28,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 15,
  },
  searchContainer: {
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  searchInput: { flex: 1, color: "#fff", paddingHorizontal: 10 },
  listContent: { paddingHorizontal: 20 },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  fileIconBase: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  fileInfo: { flex: 1 },
  fileName: { color: "#fff", fontSize: 15, fontWeight: "600" },
  metaText: { color: "#666", fontSize: 12, marginTop: 2 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

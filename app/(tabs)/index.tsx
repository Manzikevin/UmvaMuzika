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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as MediaLibrary from "expo-media-library";
import {
  Search,
  FolderDown,
  Music2,
  Clock,
  ListMusic,
  MoreVertical,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";
import { requestMediaLibraryPermissions } from "../../src/utils/permissions";

interface AudioFile {
  id: string;
  title: string;
  artist: string;
  uri: string;
  duration: number;
  size?: number;
}

const QuickAction = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
    <View style={styles.actionIcon}>{icon}</View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function LocalLibrary() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState<AudioFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadLocalMusic();
  }, []);

  const loadLocalMusic = async () => {
    setLoading(true);
    const hasPermission = await requestMediaLibraryPermissions();

    if (!hasPermission) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your media library to play local music.",
      );
      setLoading(false);
      return;
    }

    try {
      // Fetch audio assets from local storage
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
      });

      const formattedSongs = media.assets.map((asset) => ({
        id: asset.id,
        title: asset.filename,
        artist: "Local Storage",
        uri: asset.uri,
        duration: asset.duration,
      }));

      setSongs(formattedSongs);
    } catch (error) {
      console.error("Error loading music:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const renderFileItem = ({
    item,
    index,
  }: {
    item: AudioFile;
    index: number;
  }) => (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 30 }}
    >
      <TouchableOpacity
        style={styles.fileRow}
        activeOpacity={0.7}
        onPress={() => {
          router.push({
            pathname: "/player",
            params: {
              title: item.title,
              artist: item.artist,
              source: item.uri, // Passing the actual local file URI
            },
          });
        }}
      >
        <View style={styles.iconContainer}>
          <LinearGradient colors={["#222", "#111"]} style={styles.fileIconBase}>
            <Music2 color="#FFA500" size={20} />
          </LinearGradient>
        </View>

        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Audio</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>{formatDuration(item.duration)}</Text>
          </View>
        </View>

        <TouchableOpacity hitSlop={15} style={styles.moreBtn}>
          <MoreVertical color="#666" size={20} />
        </TouchableOpacity>
      </TouchableOpacity>
    </MotiView>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.mainTitle}>My Files</Text>

        <BlurView intensity={20} tint="dark" style={styles.searchContainer}>
          <Search color="#888" size={18} style={{ marginLeft: 12 }} />
          <TextInput
            placeholder="Search local music..."
            placeholderTextColor="#666"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </BlurView>

        <View style={styles.quickActions}>
          <QuickAction
            icon={<FolderDown size={22} color="#fff" />}
            label="Downloads"
          />
          <QuickAction icon={<Clock size={22} color="#fff" />} label="Recent" />
          <QuickAction
            icon={<ListMusic size={22} color="#fff" />}
            label="Folders"
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
          <Text style={styles.loaderText}>Scanning storage...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSongs}
          keyExtractor={(item) => item.id}
          renderItem={renderFileItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 120 },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.listLabel}>
              {filteredSongs.length} Audio Files Found
            </Text>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No music files found on this device.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#050505",
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
    marginBottom: 15,
  },
  searchContainer: {
    height: 50,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  searchInput: { flex: 1, color: "#fff", fontSize: 16, paddingHorizontal: 10 },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  actionItem: { alignItems: "center", width: "30%" },
  actionIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "rgba(255,165,0,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,165,0,0.1)",
  },
  actionLabel: { color: "#999", fontSize: 12, fontWeight: "600" },
  listContent: { paddingHorizontal: 20 },
  listLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 20,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
  },
  iconContainer: { marginRight: 15 },
  fileIconBase: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  fileInfo: { flex: 1 },
  fileName: { color: "#fff", fontSize: 15, fontWeight: "700", marginBottom: 5 },
  metaRow: { flexDirection: "row", alignItems: "center" },
  metaText: { color: "#666", fontSize: 12, fontWeight: "500" },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#333",
    marginHorizontal: 8,
  },
  moreBtn: { padding: 5 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { color: "#666", marginTop: 10, fontWeight: "600" },
  emptyText: {
    color: "#444",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});

import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { Play, MoreHorizontal, Heart } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const MOCK_SONGS = [
  {
    id: "1",
    title: "Flowing Spirit",
    artist: "Geovane Bruno",
    artwork: "https://picsum.photos/id/1/300/300",
  },
  {
    id: "2",
    title: "Midnight City",
    artist: "Dreams",
    artwork: "https://picsum.photos/id/10/300/300",
  },
  {
    id: "3",
    title: "Acoustic Vibe",
    artist: "Sunny Morning",
    artwork: "https://picsum.photos/id/20/300/300",
  },
  {
    id: "4",
    title: "Urban Jungle",
    artist: "Street Beats",
    artwork: "https://picsum.photos/id/35/300/300",
  },
];

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const topPadding = Platform.OS === "ios" ? insets.top + 20 : insets.top + 10;

  const renderTrendingItem = (item: (typeof MOCK_SONGS)[0]) => (
    <TouchableOpacity
      key={item.id}
      style={styles.trendingCard}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.artwork }} style={styles.trendingImage} />
        <View style={styles.playButtonOverlay}>
          <Play color="#fff" size={18} fill="#fff" />
        </View>
      </View>
      <Text style={styles.trendingTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.trendingArtist}>{item.artist}</Text>
    </TouchableOpacity>
  );

  const renderSongItem = ({ item }: { item: (typeof MOCK_SONGS)[0] }) => (
    <TouchableOpacity style={styles.songRow} activeOpacity={0.7}>
      <Image source={{ uri: item.artwork }} style={styles.thumbnail} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity hitSlop={10}>
          <Heart color="#B3B3B3" size={20} style={{ marginRight: 16 }} />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={10}>
          <MoreHorizontal color="#B3B3B3" size={20} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_SONGS}
        keyExtractor={(item) => item.id}
        renderItem={renderSongItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={{ paddingTop: topPadding }}>
            <Text style={styles.mainTitle}>Feed</Text>

            <Text style={styles.sectionTitle}>Trending Now</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
              decelerationRate="fast"
              snapToInterval={168} // Card width + margin
            >
              {MOCK_SONGS.map(renderTrendingItem)}
            </ScrollView>

            <View style={styles.listHeaderRow}>
              <Text style={styles.sectionTitle}>Recently Added</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: tabBarHeight + 40,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  mainTitle: {
    fontFamily: "Poppins-Black",
    fontSize: 36,
    color: "#FFA500",
    marginBottom: 20,
    letterSpacing: -1.5,
  },
  sectionTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: "#fff",
    marginBottom: 15,
    letterSpacing: -0.5,
  },
  horizontalScroll: { marginBottom: 30 },
  trendingCard: { width: 150, marginRight: 18 },
  imageContainer: { position: "relative", marginBottom: 10 },
  trendingImage: {
    width: 150,
    height: 150,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
  },
  playButtonOverlay: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  trendingTitle: {
    fontFamily: "Poppins-Bold",
    color: "#fff",
    fontSize: 15,
    marginTop: 2,
  },
  trendingArtist: {
    fontFamily: "Poppins-Regular",
    color: "#8E8E93",
    fontSize: 13,
  },
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAll: {
    fontFamily: "Poppins-Bold",
    color: "#FFA500",
    fontSize: 14,
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  thumbnail: { width: 58, height: 58, borderRadius: 10 },
  songInfo: { flex: 1, marginLeft: 16 },
  songTitle: {
    fontFamily: "Poppins-Bold",
    color: "#fff",
    fontSize: 16,
  },
  songArtist: {
    fontFamily: "Poppins-Regular",
    color: "#8E8E93",
    fontSize: 14,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
});

// src/context/AudioContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  createAudioPlayer,
  useAudioPlayerStatus,
  setAudioModeAsync,
  AudioPlayer,
} from "expo-audio";

interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  uri: string;
  duration: number;
}

interface AudioContextType {
  player: AudioPlayer | null;
  currentTrack: AudioTrack | null;
  playlist: AudioTrack[];
  playTrack: (track: AudioTrack, newPlaylist?: AudioTrack[]) => void;
  playNext: () => void;
  playPrevious: () => void;
  isPlaying: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Default placeholder cover art for system notification display
const DEFAULT_COVER =
  "https://res.cloudinary.com/duhvufmjp/image/upload/v1782063912/umva_whibml.png";

// Instantiate ONE single persistent player outside the react life-cycle
const globalAudioInstance = createAudioPlayer("");

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [playlist, setPlaylist] = useState<AudioTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  // Tracks whether we've already activated lock screen controls,
  // so subsequent track changes use the lighter "update" call.
  const lockScreenActiveRef = useRef(false);

  // Configure the audio session ONCE so playback survives backgrounding/locking.
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix", // required for setActiveForLockScreen to work reliably
    }).catch((err) => console.warn("Failed to set audio mode:", err));

    // Release lock screen / notification controls when the provider unmounts.
    // Wrapped in try/catch: on a cold close/reopen the native module may not
    // have anything active yet, and calling this in that state can throw
    // instead of safely no-op-ing.
    return () => {
      try {
        if (lockScreenActiveRef.current) {
          globalAudioInstance.clearLockScreenControls();
        }
      } catch (err) {
        console.warn("clearLockScreenControls failed (safe to ignore):", err);
      } finally {
        lockScreenActiveRef.current = false;
      }
    };
  }, []);

  // Link status updates reactively to our single persistent player
  const status = useAudioPlayerStatus(globalAudioInstance);

  // Auto-skip logic when the current audio track completes naturally
  useEffect(() => {
    if (status.didJustFinish && playlist.length > 0) {
      playNext();
    }
  }, [status.didJustFinish, playlist.length]);


  const updateSystemControlsNotification = (track: AudioTrack) => {
    const metadata = {
      title: track.title || "Unknown Title",
      artist: track.artist || "UmvaMuzika",
      albumTitle: "Local Storage",
      artworkUrl: DEFAULT_COVER,
    };

    try {
      if (!lockScreenActiveRef.current) {
        globalAudioInstance.setActiveForLockScreen(true, metadata, {
          showSeekForward: true,
          showSeekBackward: true,
        });
        lockScreenActiveRef.current = true;
      } else {
        globalAudioInstance.updateLockScreenMetadata(metadata);
      }
    } catch (err) {
      console.warn("Lock screen metadata update failed:", err);
      lockScreenActiveRef.current = false;
    }
  };

  const playTrack = (track: AudioTrack, newPlaylist?: AudioTrack[]) => {
    if (newPlaylist && newPlaylist.length > 0) {
      setPlaylist(newPlaylist);
      const index = newPlaylist.findIndex((t) => t.id === track.id);
      setCurrentIndex(index !== -1 ? index : 0);
    } else {
      setPlaylist([track]);
      setCurrentIndex(0);
    }

    setCurrentTrack(track);

    globalAudioInstance.replace(track.uri);
    globalAudioInstance.play();

    updateSystemControlsNotification(track);
  };

  const playNext = () => {
    if (playlist.length === 0) return;

    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % playlist.length;
      const nextTrack = playlist[nextIndex];

      setCurrentTrack(nextTrack);
      globalAudioInstance.replace(nextTrack.uri);
      globalAudioInstance.play();

      updateSystemControlsNotification(nextTrack);
      return nextIndex;
    });
  };

  const playPrevious = () => {
    if (playlist.length === 0) return;

    if (status.currentTime > 3) {
      globalAudioInstance.seekTo(0);
      return;
    }

    setCurrentIndex((prevIndex) => {
      const prevIndexCalculated =
        (prevIndex - 1 + playlist.length) % playlist.length;
      const prevTrack = playlist[prevIndexCalculated];

      setCurrentTrack(prevTrack);
      globalAudioInstance.replace(prevTrack.uri);
      globalAudioInstance.play();

      updateSystemControlsNotification(prevTrack);
      return prevIndexCalculated;
    });
  };

  return (
    <AudioContext.Provider
      value={{
        player: globalAudioInstance,
        currentTrack,
        playlist,
        playTrack,
        playNext,
        playPrevious,
        isPlaying: status.playing,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context)
    throw new Error("useAudio must be used within an AudioProvider");
  return context;
};

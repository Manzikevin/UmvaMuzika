// src/context/AudioContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createAudioPlayer,
  useAudioPlayerStatus,
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

// Instantiate ONE single persistent player outside the react life-cycle
// so minimizing or changing components never tears down the audio instance.
const globalAudioInstance = createAudioPlayer("");

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [playlist, setPlaylist] = useState<AudioTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  // Link status updates reactively to our single persistent player
  const status = useAudioPlayerStatus(globalAudioInstance);

  // Auto-skip logic when the current audio track completes
  useEffect(() => {
    if (status.didJustFinish && playlist.length > 0) {
      playNext();
    }
  }, [status.didJustFinish, playlist.length]);

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

    // Explicitly update our single master native engine instance
    globalAudioInstance.replace(track.uri);
    globalAudioInstance.play();
  };

  const playNext = () => {
    if (playlist.length === 0) return;

    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % playlist.length;
      const nextTrack = playlist[nextIndex];

      setCurrentTrack(nextTrack);
      globalAudioInstance.replace(nextTrack.uri);
      globalAudioInstance.play();

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

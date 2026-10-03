import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { CONFIG } from "./config";

const SongCtx = createContext(null);

export const useSong = () => useContext(SongCtx);

export function SongProvider({ children }) {
  const spotifyElRef = useRef(null);
  const ctlRef = useRef(null);
  const storyOpened = useRef(false);
  const wasPlaying = useRef(false);

  const [spotifyMode] = useState(true);

  // Start Spotify from the beginning
  const playSpotifyFromStart = useCallback(() => {
    const ctl = ctlRef.current;

    if (!ctl) return;

    try {
      ctl.restart();
      ctl.play();

      if (CONFIG.song.startAt) {
        ctl.seek(CONFIG.song.startAt);
      }
    } catch (error) {
      console.log("Spotify play error:", error);
    }
  }, []);

  // Load Spotify iframe API
  useEffect(() => {
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      if (!spotifyElRef.current || ctlRef.current) return;

      IFrameAPI.createController(
        spotifyElRef.current,
        {
          uri: `spotify:track:${CONFIG.song.spotifyId}`,
          width: "100%",
          height: 152,
        },
        (controller) => {
          ctlRef.current = controller;

          controller.addListener("ready", () => {
            if (storyOpened.current) {
              playSpotifyFromStart();
            }
          });
        }
      );
    };

    if (!document.getElementById("spotify-iframe-api")) {
      const script = document.createElement("script");

      script.id = "spotify-iframe-api";
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;

      document.body.appendChild(script);
    }

    return () => {
      window.onSpotifyIframeApiReady = null;
    };
  }, [playSpotifyFromStart]);

  // Called when password is successfully entered
  const start = useCallback(() => {
    storyOpened.current = true;

    // Spotify may already be ready
    if (ctlRef.current) {
      playSpotifyFromStart();
    }
  }, [playSpotifyFromStart]);

  // Pause Spotify
  const toggle = useCallback(() => {
    const ctl = ctlRef.current;

    if (!ctl) return;

    try {
      ctl.togglePlay();
    } catch (error) {
      console.log("Spotify toggle error:", error);
    }
  }, []);

  // Restart Spotify from 0:00
  const restart = useCallback(() => {
    playSpotifyFromStart();
  }, [playSpotifyFromStart]);

  // Pause song when video/audio message opens
  const pauseForMedia = useCallback(() => {
    const ctl = ctlRef.current;

    if (!ctl) return;

    try {
      ctl.pause();
      wasPlaying.current = true;
    } catch (error) {
      console.log("Spotify pause error:", error);
    }
  }, []);

  // Resume song after video/audio message
  const resumeAfterMedia = useCallback(() => {
    if (!wasPlaying.current) return;

    const ctl = ctlRef.current;

    if (ctl) {
      try {
        ctl.play();
      } catch (error) {
        console.log("Spotify resume error:", error);
      }
    }

    wasPlaying.current = false;
  }, []);

  const value = useMemo(
    () => ({
      audioRef: null,
      spotifyElRef,
      spotifyMode,
      start,
      toggle,
      restart,
      pauseForMedia,
      resumeAfterMedia,
    }),
    [
      spotifyMode,
      start,
      toggle,
      restart,
      pauseForMedia,
      resumeAfterMedia,
    ]
  );

  return (
    <SongCtx.Provider value={value}>
      {children}
    </SongCtx.Provider>
  );
}
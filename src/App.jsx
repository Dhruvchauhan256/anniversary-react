import { useEffect, useState } from "react";
import { HeartsProvider, ToastProvider, useHearts } from "./ui";
import { SongProvider, useSong } from "./song";

import {
  Lock,
  Intro,
  Hero,
  Counter,
  Timeline,
  Polaroids,
  MessageSection,
  SongSection,
  Reasons,
  StarSky,
  OpenWhen,
  Coupons,
  YearTwo,
  Quiz,
  ScratchSection,
  Letter,
  Finale,
} from "./sections";

function Story() {
  const { start, audioRef, spotifyMode } = useSong();
  const { heart } = useHearts();

  const [phase, setPhase] = useState("lock");
  const [fading, setFading] = useState(false);
  const [heartsOn, setHeartsOn] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("locked", phase !== "open");

    return () => {
      document.body.classList.remove("locked");
    };
  }, [phase]);

  useEffect(() => {
    if (!heartsOn) return;

    const id = setInterval(heart, 900);

    return () => clearInterval(id);
  }, [heartsOn, heart]);

  const unlock = () => {
    if (fading) return;

    // Start Spotify from the beginning when password is correct
    start();

    setFading(true);

    setTimeout(() => {
      setPhase("intro");
      setFading(false);
    }, 900);
  };

  const openStory = () => {
    if (fading) return;

    // Safety net if browser blocked Spotify autoplay
    if (audioRef?.current && audioRef.current.paused && !spotifyMode) {
      start();
    }

    setFading(true);
    setHeartsOn(true);

    setTimeout(() => {
      setPhase("open");
      setFading(false);
    }, 1200);
  };

  return (
    <>
      {phase === "lock" && (
        <Lock fading={fading} onSuccess={unlock} />
      )}

      {phase !== "open" && (
        <Intro
          fading={phase === "intro" && fading}
          onOpen={openStory}
        />
      )}

      <Hero />
      <Counter />
      <Timeline />
      <Polaroids />
      <MessageSection />
      <SongSection />
      <Reasons />
      <StarSky />
      <OpenWhen />
      <Coupons />
      <YearTwo />
      <Quiz />
      <ScratchSection />
      <Letter />
      <Finale />
    </>
  );
}

export default function App() {
  return (
    <HeartsProvider>
      <ToastProvider>
        <SongProvider>
          <Story />
        </SongProvider>
      </ToastProvider>
    </HeartsProvider>
  );
}
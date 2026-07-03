"use client";

import { useEffect, useRef, useState } from "react";

/**
 * AudioToggle — plays the user-provided ocean background audio in a loop.
 *
 * Uses an HTML5 <audio> element with loop=true for seamless playback.
 * Toggled on user click (autoplay policy compliant). Persists preference
 * in localStorage. Shows a small animated equalizer when active.
 */
export default function AudioToggle() {
  const [on, setOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element once
    const audio = new Audio("/audio/fondo.mp3");
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    audioRef.current = audio;

    // Check stored preference — if user previously enabled, start on first interaction
    const stored = localStorage.getItem("lcs-ocean-audio");
    if (stored === "on") {
      const startOnFirst = () => {
        setOn(true);
        window.removeEventListener("click", startOnFirst);
        window.removeEventListener("keydown", startOnFirst);
      };
      window.addEventListener("click", startOnFirst, { once: true });
      window.addEventListener("keydown", startOnFirst, { once: true });
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    const next = !on;
    setOn(next);
    localStorage.setItem("lcs-ocean-audio", next ? "on" : "off");

    if (next) {
      try {
        await audio.play();
        // Fade in
        audio.volume = 0;
        const fadeIn = setInterval(() => {
          if (audio.volume < 0.45) {
            audio.volume = Math.min(0.45, audio.volume + 0.03);
          } else {
            clearInterval(fadeIn);
          }
        }, 80);
      } catch (err) {
        console.warn("Audio playback failed:", err);
      }
    } else {
      // Fade out then pause
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - 0.05);
        } else {
          audio.volume = 0;
          audio.pause();
          clearInterval(fadeOut);
        }
      }, 60);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Silenciar océano" : "Reproducir sonido oceánico"}
      data-hover
      className="audio-toggle group fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-deep/70 backdrop-blur-xl transition-all hover:border-crab hover:bg-crab/10"
    >
      {on ? <EqualizerIcon /> : <MutedIcon />}
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md border border-white/10 bg-deep/90 px-3 py-1.5 text-xs text-cream opacity-0 transition-opacity group-hover:opacity-100">
        {on ? "Silenciar océano" : "Sonido oceánico"}
      </span>
    </button>
  );
}

function MutedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10v4h3l5 4V6L6 10H3z"
        fill="currentColor"
        className="text-mist group-hover:text-crab"
      />
      <path
        d="M16 9a4 4 0 0 1 0 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-mist group-hover:text-crab"
      />
      <line
        x1="20"
        y1="8"
        x2="22"
        y2="16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-mist group-hover:text-crab"
      />
    </svg>
  );
}

function EqualizerIcon() {
  return (
    <div className="flex h-4 items-end gap-[2px]">
      {[0.4, 0.9, 0.5, 1, 0.6].map((_, i) => (
        <span
          key={i}
          className="eq-bar w-[3px] rounded-sm bg-crab"
          style={{
            animation: `eqBar 0.9s ease-in-out ${i * 0.12}s infinite`,
            height: "100%",
          }}
        />
      ))}
      <style>{`
        @keyframes eqBar {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * AudioToggle — ambient underwater soundscape generated procedurally
 * with the Web Audio API (no external files needed).
 *
 * Layers:
 *  - Sub-bass drone (low sine wave at ~55Hz + fifth)
 *  - Filtered noise "waves" (slow LFO on bandpass filter)
 *  - Occasional bubble "pings" (random short sine envelopes)
 *  - Soft shimmer (high filtered noise, very low volume)
 *
 * Toggled on user click (autoplay policy compliant). Persists preference
 * in localStorage. Shows a small animated equalizer when active.
 */
export default function AudioToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lcs-ocean-audio");
    if (stored === "on") {
      // Don't autoplay — wait for first user interaction
      const startOnFirst = () => {
        setOn(true);
        window.removeEventListener("click", startOnFirst);
        window.removeEventListener("keydown", startOnFirst);
      };
      window.addEventListener("click", startOnFirst, { once: true });
      window.addEventListener("keydown", startOnFirst, { once: true });
    }
  }, []);

  const startAudio = async () => {
    const AC =
      window.AudioContext ||
      (window as any).webkitAudioContext;
    const ctx = new AC();
    await ctx.resume();
    ctxRef.current = ctx;

    // Master gain (low overall volume to be subtle)
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    // Fade in
    master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.2);
    masterRef.current = master;

    // ---- Sub bass drone ----
    const drone1 = ctx.createOscillator();
    drone1.type = "sine";
    drone1.frequency.value = 55; // A1
    const drone2 = ctx.createOscillator();
    drone2.type = "sine";
    drone2.frequency.value = 82.41; // E2 (fifth)
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.4;
    drone1.connect(droneGain);
    drone2.connect(droneGain);
    droneGain.connect(master);
    drone1.start();
    drone2.start();

    // LFO on drone gain for breathing effect
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.2;
    lfo.connect(lfoGain);
    lfoGain.connect(droneGain.gain);
    lfo.start();

    // ---- Filtered noise (waves) — louder for more immersion ----
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 320;
    noiseFilter.Q.value = 0.8;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.18; // louder
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();

    // ---- Second noise layer (high shimmer — water surface) ----
    const noise2 = ctx.createBufferSource();
    noise2.buffer = noiseBuffer;
    noise2.loop = true;
    const noiseFilter2 = ctx.createBiquadFilter();
    noiseFilter2.type = "bandpass";
    noiseFilter2.frequency.value = 2400;
    noiseFilter2.Q.value = 0.5;
    const noiseGain2 = ctx.createGain();
    noiseGain2.gain.value = 0.04;
    noise2.connect(noiseFilter2);
    noiseFilter2.connect(noiseGain2);
    noiseGain2.connect(master);
    noise2.start();

    // Slow LFO on noise filter — creates wave-like movement
    const waveLFO = ctx.createOscillator();
    waveLFO.frequency.value = 0.13;
    const waveLFOGain = ctx.createGain();
    waveLFOGain.gain.value = 180;
    waveLFO.connect(waveLFOGain);
    waveLFOGain.connect(noiseFilter.frequency);
    waveLFO.start();

    // ---- Bubble pings (random) ----
    let pingTimer: number;
    const schedulePing = () => {
      const delay = 1500 + Math.random() * 4500;
      pingTimer = window.setTimeout(() => {
        if (!ctxRef.current) return;
        const ping = ctx.createOscillator();
        ping.type = "sine";
        const baseFreq = 400 + Math.random() * 800;
        ping.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        ping.frequency.exponentialRampToValueAtTime(
          baseFreq * 0.4,
          ctx.currentTime + 0.18
        );
        const pingGain = ctx.createGain();
        pingGain.gain.setValueAtTime(0, ctx.currentTime);
        pingGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01);
        pingGain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + 0.35
        );
        ping.connect(pingGain);
        pingGain.connect(master);
        ping.start();
        ping.stop(ctx.currentTime + 0.4);
        schedulePing();
      }, delay);
    };
    schedulePing();

    nodesRef.current = {
      stop: () => {
        try {
          drone1.stop();
          drone2.stop();
          lfo.stop();
          waveLFO.stop();
          noise.stop();
          noise2.stop();
          window.clearTimeout(pingTimer);
        } catch {}
      },
    };
  };

  const stopAudio = () => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
      setTimeout(() => {
        nodesRef.current?.stop();
        ctx.close();
        ctxRef.current = null;
        masterRef.current = null;
      }, 900);
    }
  };

  const toggle = () => {
    const next = !on;
    setOn(next);
    localStorage.setItem("lcs-ocean-audio", next ? "on" : "off");
    if (next) startAudio();
    else stopAudio();
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Silenciar océano" : "Reproducir sonido oceánico"}
      data-hover
      className="audio-toggle group fixed bottom-6 right-6 z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-deep/70 backdrop-blur-xl transition-all hover:border-crab hover:bg-crab/10"
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

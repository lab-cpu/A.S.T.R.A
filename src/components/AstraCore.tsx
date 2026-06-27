import React, { useEffect, useState } from "react";
import { CoreState } from "../types";

interface AstraCoreProps {
  state: CoreState;
  isListening: boolean;
}

export default function AstraCore({ state, isListening }: AstraCoreProps) {
  const [pulseScale, setPulseScale] = useState(1);
  const [audioWaves, setAudioWaves] = useState<number[]>([30, 40, 50, 40, 30]);

  // Handle subtle core pulse based on state
  useEffect(() => {
    let interval: any;
    const speed = state === "thinking" ? 400 : state === "overload" ? 250 : 1200;
    
    interval = setInterval(() => {
      setPulseScale((prev) => (prev === 1 ? (state === "thinking" ? 1.08 : 1.04) : 1));
    }, speed);

    return () => clearInterval(interval);
  }, [state]);

  // Simulated audio frequency visualizer waves for talking/listening state
  useEffect(() => {
    if (state !== "talking" && !isListening) {
      setAudioWaves([10, 10, 10, 10, 10]);
      return;
    }

    const interval = setInterval(() => {
      setAudioWaves(
        Array.from({ length: 9 }, () => Math.floor(Math.random() * (state === "talking" ? 50 : 35)) + 15)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [state, isListening]);

  // Determine core colors and glow
  const getCoreColors = () => {
    switch (state) {
      case "thinking":
        return {
          primary: "text-astra-orange",
          glow: "rgba(255, 123, 0, 0.5)",
          hex: "#ff7b00",
          statusText: "SINAPSES ATIVAS",
        };
      case "talking":
        return {
          primary: "text-astra-purple",
          glow: "rgba(189, 0, 255, 0.5)",
          hex: "#bd00ff",
          statusText: "TRANSMITINDO ÁUDIO",
        };
      case "warning":
        return {
          primary: "text-astra-red",
          glow: "rgba(255, 0, 85, 0.6)",
          hex: "#ff0055",
          statusText: "ALERTA DE SISTEMA",
        };
      case "success":
        return {
          primary: "text-astra-green",
          glow: "rgba(57, 255, 20, 0.5)",
          hex: "#39ff14",
          statusText: " PROTOCOLO OK",
        };
      case "overload":
        return {
          primary: "text-astra-gold",
          glow: "rgba(255, 183, 0, 0.6)",
          hex: "#ffb700",
          statusText: "OVERCLOCK ATIVO",
        };
      case "idle":
      default:
        if (isListening) {
          return {
            primary: "text-astra-blue",
            glow: "rgba(0, 243, 255, 0.6)",
            hex: "#00f3ff",
            statusText: "OUVINDO COMANDO...",
          };
        }
        return {
          primary: "text-astra-blue",
          glow: "rgba(0, 243, 255, 0.35)",
          hex: "#00f3ff",
          statusText: "NÚCLEO ESTÁVEL",
        };
    }
  };

  const colors = getCoreColors();

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Visualizer Rings */}
      <div 
        className="relative flex items-center justify-center w-64 h-64 transition-transform duration-500 ease-out"
        style={{
          transform: `scale(${pulseScale})`,
          filter: `drop-shadow(0 0 25px ${colors.glow})`,
        }}
      >
        {/* Hologram Circle Ambient Light */}
        <div 
          className="absolute inset-0 rounded-full bg-radial opacity-10 transition-colors duration-500"
          style={{
            background: `radial-gradient(circle, ${colors.hex} 0%, transparent 70%)`
          }}
        />

        {/* Central Complex SVG Arc Reactor / Core */}
        <svg viewBox="0 0 200 200" className="w-full h-full select-none">
          {/* Defs for Glow Filters */}
          <defs>
            <filter id="glow-heavy" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-subtle" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Rotating Segmented Tracker Ring */}
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke={colors.hex}
            strokeWidth="0.75"
            strokeOpacity="0.25"
            strokeDasharray="4 6"
            className="animate-[spin_40s_linear_infinite]"
          />

          {/* Rotator Ring 1: Thick dashed speed dial */}
          <circle
            cx="100"
            cy="100"
            r="84"
            fill="none"
            stroke={colors.hex}
            strokeWidth="1.5"
            strokeDasharray="20 40 10 15 35 10"
            strokeOpacity="0.5"
            className={`origin-center transition-all duration-700 ${
              state === "thinking" 
                ? "animate-[spin_4s_linear_infinite]" 
                : state === "overload"
                ? "animate-[spin_1.5s_linear_infinite]"
                : state === "warning"
                ? "animate-[spin_15s_ease-in-out_infinite] opacity-80"
                : "animate-[spin_16s_linear_infinite]"
            }`}
          />

          {/* Rotator Ring 2: Counter-rotating fine metrics */}
          <circle
            cx="100"
            cy="100"
            r="76"
            fill="none"
            stroke={colors.hex}
            strokeWidth="0.5"
            strokeDasharray="4 2"
            strokeOpacity="0.4"
            className={`origin-center ${
              state === "thinking"
                ? "animate-[spin_3s_linear_infinite_reverse]"
                : state === "overload"
                ? "animate-[spin_1s_linear_infinite_reverse]"
                : "animate-[spin_10s_linear_infinite_reverse]"
            }`}
          />

          {/* Crosshair telemetry vectors */}
          <g stroke={colors.hex} strokeWidth="0.5" strokeOpacity="0.3">
            <line x1="100" y1="8" x2="100" y2="24" />
            <line x1="100" y1="176" x2="100" y2="192" />
            <line x1="8" y1="100" x2="24" y2="100" />
            <line x1="176" y1="100" x2="192" y2="100" />
          </g>

          {/* Inner Hexagonal HUD Matrix */}
          <polygon
            points="100,45 147.6,72.5 147.6,127.5 100,155 52.4,127.5 52.4,72.5"
            fill="none"
            stroke={colors.hex}
            strokeWidth="0.75"
            strokeOpacity="0.15"
            className="origin-center animate-[spin_30s_linear_infinite]"
          />

          {/* Rotator Ring 3: Concentric Internal Bracket */}
          <circle
            cx="100"
            cy="100"
            r="54"
            fill="none"
            stroke={colors.hex}
            strokeWidth="2"
            strokeDasharray="80 15 20 15"
            strokeOpacity="0.7"
            className={`origin-center ${
              state === "thinking"
                ? "animate-[spin_2s_linear_infinite]"
                : state === "overload"
                ? "animate-[spin_0.8s_linear_infinite]"
                : "animate-[spin_8s_linear_infinite]"
            }`}
          />

          {/* Radar Sweep Arc */}
          <path
            d="M 100 46 A 54 54 0 0 1 154 100"
            fill="none"
            stroke={colors.hex}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.3"
            className="origin-center animate-[spin_3s_linear_infinite] filter-glow"
            style={{ filter: "url(#glow-subtle)" }}
          />

          {/* Arc Reactor Core Dots */}
          <g fill={colors.hex} opacity="0.6">
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * Math.PI) / 4;
              const x = 100 + Math.cos(angle) * 40;
              const y = 100 + Math.sin(angle) * 40;
              return <circle key={i} cx={x} cy={y} r="2" />;
            })}
          </g>

          {/* Pure Center Core Orb (Arc Reactor Center) */}
          <circle
            cx="100"
            cy="100"
            r="24"
            fill={colors.hex}
            fillOpacity={state === "thinking" ? "0.9" : "0.75"}
            stroke={colors.hex}
            strokeWidth="2"
            className="transition-all duration-300"
            style={{ filter: "url(#glow-heavy)" }}
          />

          {/* High-tech inner concentric details */}
          <circle
            cx="100"
            cy="100"
            r="16"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />
          <circle
            cx="100"
            cy="100"
            r="8"
            fill="#ffffff"
          />
        </svg>

        {/* Audio Frequency Ripple (Absolute overlay for talking / listening) */}
        {(state === "talking" || isListening) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div 
              className="w-48 h-48 rounded-full border border-dashed animate-ping opacity-25"
              style={{ borderColor: colors.hex, animationDuration: "1.5s" }}
            />
            <div 
              className="w-36 h-36 rounded-full border animate-ping opacity-40"
              style={{ borderColor: colors.hex, animationDuration: "2s" }}
            />
          </div>
        )}
      </div>

      {/* Hologram Frequency Wave Visualizer at the bottom of the sphere */}
      <div className="flex items-end justify-center h-8 gap-[3px] mt-6 px-4 w-48">
        {audioWaves.map((h, i) => (
          <div
            key={i}
            className="w-[3px] rounded-t-full transition-all duration-100"
            style={{
              height: `${h}%`,
              backgroundColor: colors.hex,
              boxShadow: `0 0 8px ${colors.hex}`,
              opacity: state === "talking" || isListening ? 1 : 0.2,
            }}
          />
        ))}
      </div>

      {/* System Status Label */}
      <div className="mt-3 text-center">
        <span 
          className={`font-mono text-[10px] tracking-widest font-bold px-3 py-1 border rounded-md transition-all duration-300 ${
            state === "warning"
              ? "bg-astra-red/10 border-astra-red text-astra-red"
              : state === "thinking"
              ? "bg-astra-orange/10 border-astra-orange text-astra-orange animate-pulse"
              : state === "talking"
              ? "bg-astra-purple/10 border-astra-purple text-astra-purple"
              : state === "success"
              ? "bg-astra-green/10 border-astra-green text-astra-green"
              : state === "overload"
              ? "bg-astra-gold/10 border-astra-gold text-astra-gold animate-pulse"
              : isListening
              ? "bg-astra-blue/10 border-astra-blue text-astra-blue animate-pulse"
              : "bg-astra-blue/5 border-astra-blue/30 text-astra-blue/80"
          }`}
          style={{
            boxShadow: `inset 0 0 8px ${state !== "idle" || isListening ? colors.glow : "transparent"}`
          }}
        >
          {colors.statusText}
        </span>
      </div>
    </div>
  );
}

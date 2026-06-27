import React, { useEffect, useState } from "react";
import { SystemMetrics, CoreState } from "../types";
import { Cpu, Thermometer, Zap, ShieldAlert, CpuIcon, Layers } from "lucide-react";

interface SystemsDiagnosticProps {
  metrics: SystemMetrics;
  coreState: CoreState;
}

export default function SystemsDiagnostic({ metrics, coreState }: SystemsDiagnosticProps) {
  const [localMetrics, setLocalMetrics] = useState<SystemMetrics>(metrics);

  // Introduce small fluctuations to make it feel real-time and alive
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalMetrics((prev) => {
        let modifier = 1;
        if (coreState === "thinking") modifier = 1.6;
        if (coreState === "overload") modifier = 2.4;
        if (coreState === "warning") modifier = 1.8;

        const deltaCpu = (Math.random() * 8 - 4) * modifier;
        const deltaTemp = (Math.random() * 1.2 - 0.5) * modifier;
        const deltaFlux = (Math.random() * 4 - 2) * modifier;
        const deltaVib = (Math.random() * 6 - 3) * modifier;

        return {
          cpu: Math.min(Math.max(prev.cpu + deltaCpu, 5 * modifier), 99),
          memory: Math.min(Math.max(prev.memory + (Math.random() * 0.4 - 0.2), 42), 94),
          temperature: Math.min(Math.max(prev.temperature + deltaTemp, 35), 105),
          reactorFlux: Math.min(Math.max(prev.reactorFlux + deltaFlux, 10 * modifier), 120),
          coreVibration: Math.min(Math.max(prev.coreVibration + deltaVib, 2 * modifier), 95),
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [coreState]);

  // Adjust display text and color based on severity
  const getProgressColor = (val: number, maxWarning = 80, maxDanger = 90) => {
    if (val >= maxDanger) return "bg-astra-red shadow-[0_0_8px_rgba(255,0,85,0.5)]";
    if (val >= maxWarning) return "bg-astra-orange shadow-[0_0_8px_rgba(255,123,0,0.5)]";
    return "bg-astra-blue shadow-[0_0_8px_rgba(0,243,255,0.5)]";
  };

  const getTextColor = (val: number, maxWarning = 80, maxDanger = 90) => {
    if (val >= maxDanger) return "text-astra-red";
    if (val >= maxWarning) return "text-astra-orange";
    return "text-astra-blue";
  };

  return (
    <div className="flex flex-col h-full bg-[#111] border border-[#222] rounded-xl p-5 font-mono select-none">
      {/* Telemetry Title */}
      <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-astra-blue" />
          <h2 className="text-[11px] uppercase tracking-widest text-[#00D1FF] font-display">
            Telemetria do Sistema
          </h2>
        </div>
        <span className="text-[9px] text-[#555]">UPLINK_Q_STABLE</span>
      </div>

      {/* Grid Diagnostics */}
      <div className="space-y-5 flex-1">
        {/* Arc Reactor Flux */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-[#999]">
              <Zap className="w-3.5 h-3.5 text-astra-gold" />
              FLUXO DO REATOR ARC
            </span>
            <span className="font-bold text-white">
              {localMetrics.reactorFlux.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden p-[1px] border border-[#222]">
            <div
              className="h-full bg-astra-gold rounded-full transition-all duration-1000"
              style={{ width: `${localMetrics.reactorFlux}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px] text-[#555]">
            <span>R_OUTPUT: {(localMetrics.reactorFlux * 1.21).toFixed(2)} GW</span>
            <span>THERMAL_SHIELD: ACTIVE</span>
          </div>
        </div>

        {/* CPU/Synaptic Load */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-[#999]">
              <Cpu className="w-3.5 h-3.5 text-astra-blue" />
              PROCESSAMENTO NEURAL
            </span>
            <span className="font-bold text-white">
              {localMetrics.cpu.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden p-[1px] border border-[#222]">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(localMetrics.cpu)}`}
              style={{ width: `${localMetrics.cpu}%` }}
            />
          </div>
        </div>

        {/* 4 Multi-core CPU Visualizer */}
        <div className="grid grid-cols-4 gap-1.5 py-1">
          {[0, 1, 2, 3].map((core) => {
            const coreVal = Math.min(
              Math.max(
                localMetrics.cpu * (1 + (Math.sin(core + Date.now() / 3000) * 0.15)),
                2
              ),
              99
            );
            return (
              <div key={core} className="bg-[#050505] border border-[#222] rounded p-1.5 text-center">
                <div className="text-[8px] text-[#555]">C0{core + 1}</div>
                <div className={`text-[10px] font-bold ${getTextColor(coreVal, 75, 90)}`}>
                  {coreVal.toFixed(0)}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Memory Allocation */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-[#999]">
              <CpuIcon className="w-3.5 h-3.5 text-astra-blue" />
              SÉRIE SINÁPTICA (RAM)
            </span>
            <span className="text-white font-bold">
              {localMetrics.memory.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden p-[1px] border border-[#222]">
            <div
              className="h-full bg-astra-blue rounded-full transition-all duration-1000"
              style={{ width: `${localMetrics.memory}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px] text-[#555]">
            <span>ALOCADO: {(localMetrics.memory * 12.8).toFixed(1)} GB</span>
            <span>DISPONÍVEL: {(128 - localMetrics.memory * 1.28).toFixed(1)} GB</span>
          </div>
        </div>

        {/* Core Temperature */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-[#999]">
              <Thermometer className="w-3.5 h-3.5 text-astra-orange" />
              TEMPERATURA DO SISTEMA
            </span>
            <span className={`font-bold ${getTextColor(localMetrics.temperature, 70, 85)}`}>
              {localMetrics.temperature.toFixed(1)}°C
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden p-[1px] border border-[#222]">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(localMetrics.temperature, 70, 85)}`}
              style={{ width: `${Math.min((localMetrics.temperature / 120) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cyber Security Integrity Panel */}
      <div className="mt-4 pt-3.5 border-t border-[#222] bg-[#0c0c0c] rounded-lg p-2.5 border border-[#222]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-[#888] flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-astra-green" />
            INTEGRIDADE CRIPTOGRÁFICA
          </span>
          <span className="text-[9px] text-astra-green font-bold uppercase animate-pulse">
            Seguro
          </span>
        </div>
        <div className="text-[8px] leading-relaxed text-[#555] space-y-0.5 font-mono">
          <div>DEFENSE SHIELDS: 100% (STABLE)</div>
          <div>FIREWALL_MATRIX: CRYPTO_ALPH_85</div>
          <div>CYBER_ATTACK_SHIELD: STANDBY</div>
        </div>
      </div>
    </div>
  );
}

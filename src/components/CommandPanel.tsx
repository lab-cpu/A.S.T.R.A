import React, { useState } from "react";
import { Protocol } from "../types";
import { Shield, Radio, Globe, Zap, Navigation, Play, Loader2, CheckCircle2 } from "lucide-react";

interface CommandPanelProps {
  onTriggerCommand: (promptText: string, protocolName: string, duration: number) => void;
  activeProtocolId: string | null;
  protocolProgress: number;
}

export default function CommandPanel({ onTriggerCommand, activeProtocolId, protocolProgress }: CommandPanelProps) {
  const [protocols, setProtocols] = useState<Protocol[]>([
    {
      id: "defense",
      name: "Defesa Cibernética",
      description: "Ergue defesas digitais e isola portas de comunicação.",
      icon: "Shield",
      category: "defense",
      duration: 5000,
      dangerLevel: "guarded",
      status: "idle",
    },
    {
      id: "scan",
      name: "Varredura Quântica",
      description: "Varredura completa por vírus e anomalias de hardware.",
      icon: "Radio",
      category: "network",
      duration: 6000,
      dangerLevel: "safe",
      status: "idle",
    },
    {
      id: "satellite",
      name: "Uplink de Satélite",
      description: "Triangula satélites orbitais para rastreamento global.",
      icon: "Globe",
      category: "satellite",
      duration: 8000,
      dangerLevel: "danger",
      status: "idle",
    },
    {
      id: "overload",
      name: "Sobrecarga de Reator",
      description: "Acelera reações sinápticas, aumentando clock da IA.",
      icon: "Zap",
      category: "energy",
      duration: 4000,
      dangerLevel: "critical",
      status: "idle",
    },
    {
      id: "armor",
      name: "Sistemas Mark-85",
      description: "Diagnóstico completo de propulsão e armamentos.",
      icon: "Navigation",
      category: "armor",
      duration: 7000,
      dangerLevel: "critical",
      status: "idle",
    },
  ]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Shield":
        return <Shield className="w-4.5 h-4.5" />;
      case "Radio":
        return <Radio className="w-4.5 h-4.5" />;
      case "Globe":
        return <Globe className="w-4.5 h-4.5" />;
      case "Zap":
        return <Zap className="w-4.5 h-4.5 text-astra-gold animate-pulse" />;
      case "Navigation":
        return <Navigation className="w-4.5 h-4.5 rotate-45" />;
      default:
        return <Shield className="w-4.5 h-4.5" />;
    }
  };

  const getDangerColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-astra-red border-astra-red/20 bg-astra-red/5";
      case "danger":
        return "text-astra-orange border-astra-orange/20 bg-astra-orange/5";
      case "guarded":
        return "text-astra-gold border-astra-gold/20 bg-astra-gold/5";
      case "safe":
      default:
        return "text-astra-green border-astra-green/20 bg-astra-green/5";
    }
  };

  const handleRunProtocol = (proto: Protocol) => {
    if (activeProtocolId) return; // Prevent double trigger
    
    // Auto-generate realistic user command message
    let commandPrompt = "";
    switch (proto.id) {
      case "defense":
        commandPrompt = "ASTRA, inicie o Protocolo de Defesa Cibernética total. Blinde nossos sistemas de segurança.";
        break;
      case "scan":
        commandPrompt = "ASTRA, faça um escaneamento térmico e quântico completo no perímetro de dados.";
        break;
      case "satellite":
        commandPrompt = "ASTRA, ative o uplink de satélite orbital para triangulação de dados globais.";
        break;
      case "overload":
        commandPrompt = "ASTRA, aumente a potência do reator Arc e inicie o Overclock sináptico para rendimento máximo.";
        break;
      case "armor":
        commandPrompt = "ASTRA, carregue diagnósticos de propulsão e armas de combate da armadura Mark 85.";
        break;
    }

    onTriggerCommand(commandPrompt, proto.name, proto.duration);
  };

  return (
    <div className="flex flex-col h-full bg-[#111] border border-[#222] rounded-xl p-5 font-mono select-none">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-astra-blue fill-astra-blue/10" />
          <h2 className="text-[11px] uppercase tracking-widest text-[#00D1FF] font-display">
            Protocolos de Comando
          </h2>
        </div>
        <span className="text-[9px] text-[#555]">PROTO_EXE_V2.1</span>
      </div>

      {/* Protocol List */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {protocols.map((proto) => {
          const isCurrent = activeProtocolId === proto.id;
          const isAnyRunning = activeProtocolId !== null;

          return (
            <div
              key={proto.id}
              className={`border rounded-lg p-3 transition-all duration-300 ${
                isCurrent
                  ? "bg-[#151515] border-[#444] shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                  : "bg-[#050505] border-[#222] hover:border-[#333]"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded transition-colors ${
                      isCurrent ? "bg-[#111] text-astra-blue" : "bg-[#111] text-[#555]"
                    }`}
                  >
                    {getIcon(proto.icon)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{proto.name}</h3>
                    <span className="text-[8px] text-[#555] uppercase">{proto.category}</span>
                  </div>
                </div>

                <span
                  className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${getDangerColor(
                    proto.dangerLevel
                  )}`}
                >
                  {proto.dangerLevel.toUpperCase()}
                </span>
              </div>

              {/* Description */}
              <p className="text-[10px] text-[#888] leading-relaxed mb-3">{proto.description}</p>

              {/* Action and Progress Bar */}
              {isCurrent ? (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] text-astra-blue">
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      EXECUTANDO PROTOCOLO...
                    </span>
                    <span className="font-bold">{protocolProgress}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#111] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-astra-blue transition-all duration-100"
                      style={{ width: `${protocolProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  disabled={isAnyRunning}
                  onClick={() => handleRunProtocol(proto)}
                  className={`w-full flex items-center justify-center gap-1 py-1 px-3 text-[10px] font-bold tracking-widest border rounded transition-all duration-200 uppercase ${
                    isAnyRunning
                      ? "border-[#222] text-[#333] bg-transparent cursor-not-allowed"
                      : "border-[#333] text-white hover:text-astra-blue hover:border-astra-blue bg-transparent cursor-pointer"
                  }`}
                >
                  Confirmar Comando
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Simulated System override diagnostics */}
      <div className="mt-4 pt-3 border-t border-[#222] text-[8px] text-[#555] space-y-1 bg-[#0c0c0c] p-2.5 rounded border border-[#222]">
        <div className="flex justify-between font-mono">
          <span>COGNITIVE_CORES</span>
          <span>ONLINE [5/5]</span>
        </div>
        <div className="flex justify-between font-mono">
          <span>ARC_ENERGY_FLOW</span>
          <span className="text-astra-green">STABLE [1.21GW]</span>
        </div>
        <div className="flex justify-between font-mono">
          <span>ASTRA_MATRIX</span>
          <span>REV_85_CONNECTED</span>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Message, CoreState, SystemMetrics } from "./types";
import AstraCore from "./components/AstraCore";
import SystemsDiagnostic from "./components/SystemsDiagnostic";
import CommandPanel from "./components/CommandPanel";
import AstraQualities from "./components/AstraQualities";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Terminal,
  User,
  Clock,
  Trash2,
  ExternalLink,
  Shield,
  Layers,
  Cpu,
  Monitor,
  Sparkles,
  Info
} from "lucide-react";

export default function App() {
  // Application states
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-astra",
      role: "model",
      text: "Saudações, Senhor. Sou o A.S.T.R.A. (Assistente de Sistemas de Tecnologia e Resolução Autónoma). Meu núcleo holográfico e reator Arc estão em sincronia perfeita. Todos os módulos de pesquisa Google Grounding estão operacionais. O que deseja comandar hoje?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [coreState, setCoreState] = useState<CoreState>("idle");
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Active protocol states (triggered from right panel)
  const [activeProtocolId, setActiveProtocolId] = useState<string | null>(null);
  const [protocolProgress, setProtocolProgress] = useState(0);

  // Ref for auto scrolling the chat list
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Default system metrics
  const defaultMetrics: SystemMetrics = {
    cpu: 18,
    memory: 52.4,
    temperature: 38.5,
    reactorFlux: 65,
    coreVibration: 12,
  };

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = "pt-BR";
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
        setCoreState("idle"); // Keep core bluish and reactive
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim() !== "") {
          setInputValue(transcript);
          // Auto send command if transcribed
          handleSendMessage(transcript);
        }
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [messages]);

  // Handle auto-scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Speak text back to the user in Portuguese (PT-BR)
  const speakText = useCallback((text: string) => {
    if (!voiceEnabled) return;

    // Stop current speech before speaking new text
    window.speechSynthesis.cancel();

    // Clean up text of markdown tags to speak smoothly
    const cleanText = text
      .replace(/[*#_`~[\]()]/g, "")
      .replace(/https?:\/\/\S+/g, "link de referência");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "pt-BR";
    
    // Find a nice Portuguese voice (preferably male/metallic if available for butler vibe)
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find((v) => v.lang.includes("pt-BR") || v.lang.includes("pt_BR"));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.pitch = 1.05; // Slightly higher/crisp
    utterance.rate = 1.1;  // Slightly faster and smarter

    utterance.onstart = () => setCoreState("talking");
    utterance.onend = () => setCoreState("idle");
    utterance.onerror = () => setCoreState("idle");

    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  // Clean Speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Microphone toggle button handler
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(
        "O reconhecimento de voz não é suportado pelo seu navegador atual ou está desativado no ambiente de iframe. Digite seus comandos no console!"
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Ensure any running voice synthesis stops before we listen
      window.speechSynthesis.cancel();
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Start speech failed:", err);
      }
    }
  };

  // Core send message handler
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText !== undefined ? customText : inputValue;
    if (!textToSend.trim() || isLoading) return;

    // Reset input box if sent from text box
    if (customText === undefined) {
      setInputValue("");
    }

    // Append user message
    const userMsgId = `msg-user-${Date.now()}`;
    const newMsg: Message = {
      id: userMsgId,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);
    setCoreState("thinking");

    try {
      // Fetch response from server-side Express Gemini endpoint
      const response = await fetch("/api/command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha na conexão neural.");
      }

      // Append model response
      const modelMsgId = `msg-model-${Date.now()}`;
      const astraMsg: Message = {
        id: modelMsgId,
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, astraMsg]);
      setIsLoading(false);
      setCoreState("idle");

      // Trigger text-to-speech for ASTRA
      speakText(data.text);

    } catch (error: any) {
      console.error("Error communicating with ASTRA:", error);
      
      const errorMsgId = `msg-error-${Date.now()}`;
      const errorMsg: Message = {
        id: errorMsgId,
        role: "system",
        text: `FALHA QUÂNTICA: Não consegui estabelecer conexão com o servidor neural. Detalhes: ${
          error.message || "Erro desconhecido."
        }`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, errorMsg]);
      setIsLoading(false);
      setCoreState("warning");
      speakText("Atenção, Senhor. Ocorreu uma interrupção em nossa comunicação quântica.");
    }
  };

  // Run complex automated protocol simulation from Right Panel
  const triggerProtocol = (promptText: string, protocolName: string, duration: number) => {
    // 1. Identify protocol key mapping
    let protocolId = "defense";
    let stateOnRun: CoreState = "thinking";
    let stateOnComplete: CoreState = "success";

    if (protocolName.includes("Voo") || protocolName.includes("Mark-85")) {
      protocolId = "armor";
      stateOnRun = "thinking";
    } else if (protocolName.includes("Quântica") || protocolName.includes("Varredura")) {
      protocolId = "scan";
      stateOnRun = "thinking";
    } else if (protocolName.includes("Satélite")) {
      protocolId = "satellite";
      stateOnRun = "thinking";
    } else if (protocolName.includes("Sobrecarga")) {
      protocolId = "overload";
      stateOnRun = "overload";
      stateOnComplete = "overload";
    }

    // Set ASTRA state and current active running protocol ID
    setActiveProtocolId(protocolId);
    setProtocolProgress(0);
    setCoreState(stateOnRun);

    // Simulated progress tick timer
    const intervalTime = duration / 50;
    const timer = setInterval(() => {
      setProtocolProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          
          // Complete and fire user command automatically to server to let ASTRA comment!
          handleSendMessage(promptText);
          
          // Delay resetting protocol state briefly for user visibility
          setTimeout(() => {
            setActiveProtocolId(null);
            setCoreState(stateOnComplete);
            
            // Set back to idle after a few seconds
            setTimeout(() => {
              setCoreState("idle");
            }, 3000);
          }, 600);

          return 100;
        }
        return prev + 2;
      });
    }, intervalTime);
  };

  const clearHistory = () => {
    window.speechSynthesis.cancel();
    setMessages([
      {
        id: "init-astra",
        role: "model",
        text: "Memória sináptica limpa, Senhor. Todos os logs históricos foram apagados. Pronta para novas atribuições.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setCoreState("idle");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans scanlines relative flex flex-col overflow-x-hidden select-none">
      <div className="scanline-effect" />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10 z-10 flex flex-col gap-8">
        
        {/* HUD HEADER - Sophisticated Dark Style */}
        <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#333] pb-6 gap-4">
          {/* Title & Brand */}
          <div>
            <h1 className="text-5xl font-light tracking-tighter text-white font-display uppercase">
              ASTRA<span className="text-astra-blue font-bold">.</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#666] mt-1.5 font-mono">
              ASSISTENTE DE SISTEMAS DE TECNOLOGIA E RESOLUÇÃO AUTÓNOMA • MARK-85
            </p>
          </div>

          {/* Right Controls & Info */}
          <div className="flex items-center gap-8 font-mono">
            <div className="text-right">
              <p className="text-[10px] uppercase text-[#666] tracking-widest">NÚCLEO ESTÁVEL</p>
              <p className="text-xl font-mono text-astra-blue">99.99%</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase text-[#666] tracking-widest">UPLINK QUÂNTICO</p>
              <p className="text-xl font-mono text-white">0.0004ms</p>
            </div>
            <div className="text-right text-[10px] text-[#666] border-l border-[#333] pl-6 py-1">
              <p className="text-white font-bold">{messages[messages.length - 1]?.role === "user" ? "SENHOR" : "ASTRA"}</p>
              <p className="text-[9px] mt-0.5">lab@cebraccuiaba.com.br</p>
            </div>
          </div>
        </header>

        {/* MIDDLE CONTENT: TELEMETRY & CORE METERS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Diagnostic Meters (4 cols) */}
          <div className="lg:col-span-4 h-full">
            <SystemsDiagnostic metrics={defaultMetrics} coreState={coreState} />
          </div>

          {/* Center panel: Animated core (4 cols) with Sophisticated Dark Concentric Rings */}
          <div className="lg:col-span-4 flex flex-col justify-center items-center bg-[#050505] border border-[#1a1a1a] rounded-xl p-6 min-h-[320px] relative overflow-hidden">
            {/* Ambient Retro HUD concentric circle backgrounds */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-80 h-80 rounded-full border border-[#111] flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border border-[#222] flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border border-[#333] opacity-10"></div>
                </div>
              </div>
            </div>

            <div className="absolute top-3 left-4 font-mono text-[9px] text-[#444] tracking-widest">
              PROJEÇÃO_COGNITIVA
            </div>
            <div className="absolute top-3 right-4 font-mono text-[9px] text-astra-blue tracking-widest uppercase animate-pulse">
              SYNC_ON
            </div>
            
            <div className="relative z-10 w-full flex items-center justify-center">
              <AstraCore state={coreState} isListening={isListening} />
            </div>
          </div>

          {/* Right panel: Protocol Executions Selector (4 cols) */}
          <div className="lg:col-span-4 h-full">
            <CommandPanel
              onTriggerCommand={triggerProtocol}
              activeProtocolId={activeProtocolId}
              protocolProgress={protocolProgress}
            />
          </div>

        </section>

        {/* BOTTOM HUD SECTION: CHAT LOG CONSOLE */}
        <section className="flex-1 flex flex-col bg-[#111] border border-[#222] rounded-xl overflow-hidden min-h-[400px] relative">
          
          {/* Console Header */}
          <div className="flex justify-between items-center border-b border-[#222] p-4 px-6 bg-[#0c0c0c]">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-astra-blue" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#999]">
                LOGS DE SINAL SINÁPTICO
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* Clear History */}
              <button
                onClick={clearHistory}
                title="Limpar logs de memória"
                className="p-1.5 rounded text-[#444] hover:text-astra-red hover:bg-[#1f1113] border border-transparent hover:border-astra-red/20 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Voice feedback toggle */}
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                title={voiceEnabled ? "Mutar voz da ASTRA" : "Ativar voz da ASTRA"}
                className={`p-1.5 rounded border transition-all cursor-pointer text-[10px] uppercase tracking-wider ${
                  voiceEnabled
                    ? "bg-[#111] border-astra-blue/30 text-astra-blue"
                    : "bg-transparent border-[#222] text-[#444] hover:text-[#999]"
                }`}
              >
                {voiceEnabled ? "Voz: Ativa" : "Voz: Muta"}
              </button>
            </div>
          </div>

          {/* Chat message logs */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-xs max-h-[290px] bg-[#0c0c0c]/40">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isSystem = msg.role === "system";

              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-4 relative ${
                      isUser
                        ? "bg-[#151515] border border-[#333] text-[#FFFFFF] shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                        : isSystem
                        ? "bg-[#221114] border border-astra-red/20 text-astra-red"
                        : "bg-[#111111] border border-[#222] text-[#E0E0E0] shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                    }`}
                  >
                    {/* Header meta */}
                    <div className="flex items-center gap-2 mb-2 border-b border-[#222] pb-1.5 text-[8px] tracking-widest text-[#555] uppercase">
                      <span>{isUser ? "SENHOR" : isSystem ? "DIAGNOSTICO" : "ASTRA"}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Chat Text */}
                    <p className="leading-relaxed whitespace-pre-wrap select-text selection:bg-astra-blue/20 font-sans text-[12.5px]">
                      {msg.text}
                    </p>

                    {/* Sources (Google Grounding results) */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3.5 pt-2.5 border-t border-[#222] space-y-1.5">
                        <div className="text-[8px] text-astra-blue font-bold tracking-[0.15em] uppercase">
                          Fontes Verificadas (Google Grounding):
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {msg.sources.map((src, i) => (
                            <a
                              key={i}
                              href={src.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[9.5px] text-[#888] hover:text-white underline truncate max-w-[190px]"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              {src.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Simulated Loading message */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#111] border border-astra-orange/20 rounded-lg p-3 flex items-center gap-3">
                  <div className="flex space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-astra-orange animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-astra-orange animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-astra-orange animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[9px] text-[#888] uppercase tracking-widest font-mono">
                    Triangulando sinapses...
                  </span>
                </div>
              </div>
            )}

            {/* Ref anchor */}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input box */}
          <div className="border-t border-[#222] p-4 px-6 bg-[#0c0c0c]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-4 items-center"
            >
              {/* Mic Speech activation button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-3 rounded-lg border transition-all relative flex items-center justify-center shrink-0 cursor-pointer ${
                  isListening
                    ? "bg-[#2a1215] border-astra-red text-astra-red"
                    : "bg-[#111] border-[#333] text-[#666] hover:text-white"
                }`}
                title={isListening ? "Parar de ouvir" : "Falar com a ASTRA"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isListening && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-astra-red animate-ping" />
                )}
              </button>

              {/* Text Input Box */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isListening ? "Aguardando sinal vocal..." : "Diga algo para a ASTRA..."}
                disabled={isListening || isLoading}
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-white placeholder-[#444] font-light disabled:opacity-50"
              />

              {/* Send Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isListening || !inputValue.trim()}
                className="p-2.5 px-5 rounded bg-astra-blue text-black font-semibold tracking-wider text-[10px] hover:bg-white hover:text-black transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed uppercase shrink-0"
              >
                Transmitir
              </button>
            </form>
          </div>

        </section>

        {/* BOTTOMMOST SECTION: QUALITIES & DOCUMENTATION PANEL */}
        <section className="mt-2">
          <AstraQualities />
        </section>

      </div>
    </div>
  );
}

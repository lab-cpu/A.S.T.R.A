import React from "react";
import { Search, Volume2, Mic, Brain, ShieldAlert, Sparkles, Award } from "lucide-react";

export default function AstraQualities() {
  const qualities = [
    {
      title: "GROUNDING GOOGLE SEARCH EM TEMPO REAL",
      desc: "ASTRA integra pesquisas web em tempo real pelo Google para validar respostas científicas e notícias atuais. Ela cita fontes, tornando-se mais precisa e inteligente que IAs estáticas convencionais.",
      icon: <Search className="w-5 h-5 text-astra-blue" />,
      tag: "Mais Inteligente"
    },
    {
      title: "SÍNTESE DE VOZ ULTRA-REALISTA",
      desc: "Equipada com sintetizador de áudio vocal em português (usando motores do navegador). ASTRA responde falando como um verdadeiro mordomo cibernético, aumentando a imersão de comando de voz.",
      icon: <Volume2 className="w-5 h-5 text-astra-purple" />,
      tag: "Imersivo"
    },
    {
      title: "RECONHECIMENTO DE VOZ HANDS-FREE",
      desc: "Fale diretamente com a ASTRA usando o seu microfone. O sistema transcreve seus comandos em tempo real, reproduzindo a experiência perfeita de diálogo fluido do Homem de Ferro.",
      icon: <Mic className="w-5 h-5 text-astra-orange animate-pulse" />,
      tag: "Mãos Livres"
    },
    {
      title: "SIMULAÇÕES E PROTOCOLOS ATIVOS",
      desc: "Execute diagnósticos cibernéticos, links satelitais, sobrecargas de núcleo e testes de armadura com progressão de status visível em tempo real no HUD dinâmico.",
      icon: <ShieldAlert className="w-5 h-5 text-astra-red" />,
      tag: "Interativo"
    },
    {
      title: "CULTURA E PERSONALIDADE JARVIS",
      desc: "Não é apenas um robô frio. ASTRA exibe um intelecto refinado, sarcasmo elegante, lealdade profunda ao criador e adota uma nomenclatura técnica e futurista.",
      icon: <Brain className="w-5 h-5 text-astra-green" />,
      tag: "Personalidade"
    },
  ];

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-6 font-mono select-none">
      {/* Title */}
      <div className="flex items-center gap-3 border-b border-[#222] pb-4 mb-5">
        <div className="p-2 rounded bg-[#0c0c0c] text-astra-blue border border-[#222]">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-[11px] uppercase tracking-widest text-[#00D1FF] font-display">
            Qualidades e Diferenciais do Sistema
          </h2>
          <p className="text-[9px] text-[#555] font-mono uppercase mt-0.5">ASTRA_SPECIFICATIONS_REV_85</p>
        </div>
      </div>

      {/* Grid of qualities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {qualities.map((qual, idx) => (
          <div 
            key={idx} 
            className="group relative bg-[#050505] border border-[#222] hover:border-[#333] rounded-lg p-4 transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-[#111] border border-[#222]">
                {qual.icon}
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[10px] font-bold text-white tracking-wider font-display uppercase">
                    {qual.title}
                  </h3>
                  <span className="text-[8px] font-bold text-astra-blue border border-[#222] px-1.5 py-0.5 rounded uppercase bg-transparent shrink-0">
                    {qual.tag}
                  </span>
                </div>
                <p className="text-[11px] text-[#888] leading-relaxed font-sans">
                  {qual.desc}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Feature Focus Box (Why smarter than ChatGPT) */}
        <div className="md:col-span-2 bg-[#151515] border border-[#333] rounded-lg p-5 flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-astra-blue tracking-wider font-display flex items-center gap-1.5 uppercase">
              <Sparkles className="w-4 h-4 text-astra-blue animate-pulse" />
              Por que a ASTRA é superior a outras IAs convencionais?
            </h3>
            <p className="text-[11px] text-[#999] leading-relaxed font-sans">
              Enquanto assistentes tradicionais estão restritos a base de dados congeladas ou textos puramente consultivos, a ASTRA une <strong>comunicação holográfica visual</strong>, <strong>ação ativa simulada de hardware</strong>, <strong>grounding com indexação Google em tempo real</strong> e <strong>fidelidade vocal personalizada</strong> para responder de forma adaptativa com o tom exato do J.A.R.V.I.S.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

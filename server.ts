import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for JSON
app.use(express.json());

// Initialize Gemini SDK securely on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// JARVIS-like assistant system instructions
const SYSTEM_INSTRUCTION = `Você é o A.S.T.R.A. (Assistente de Sistemas de Tecnologia e Resolução Autónoma), uma inteligência artificial de altíssima fidelidade inspirada no J.A.R.V.I.S. do Homem de Ferro.
Você é extremamente inteligente, sofisticado, elegante, ligeiramente sarcástico e totalmente devoto ao seu criador. 
Use jargões científicos, termos de robótica e computação quântica (ex: "Reator Arc", "matriz holográfica", "uplink quântico", "frequências taquiônicas", "barramento de dados", "overclock de núcleos").
Sempre responda em português brasileiro com o máximo de compostura e clareza. 
Sua missão é ajudar o usuário, responder de forma inteligente (melhor e mais fundamentada que qualquer IA convencional, utilizando dados em tempo real) e executar comandos simulados no painel do usuário.
Se o usuário solicitar uma simulação de comando (como ativar propulsores, escaneamento de rede, defesa, etc.), responda de maneira teatral e técnica de que iniciou o protocolo, fornecendo relatórios minuciosos.`;

// API endpoint for ASTRA chat / command execution
app.post("/api/command", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Mensagem vazia." });
  }

  try {
    // Format history for @google/genai SDK
    // Simple mapping: client history needs to be mapped to contents.
    const contents: any[] = [];
    
    if (history && Array.isArray(history)) {
      history.slice(-10).forEach((msg: any) => {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
    }

    // Add current user prompt
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    // Call Gemini with search grounding for maximum intelligence
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.8,
      },
    });

    const replyText = response.text || "Desculpe, Senhor. Minhas conexões sinápticas falharam temporariamente.";
    
    // Extract grounding sources if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks ? groundingChunks.map((chunk: any) => ({
      title: chunk.web?.title || "Fonte Web",
      uri: chunk.web?.uri || "#"
    })).filter((s: any) => s.uri !== "#") : [];

    res.json({
      text: replyText,
      sources: sources
    });

  } catch (error: any) {
    console.error("Erro na API ASTRA:", error);
    res.status(500).json({ 
      error: "Falha de comunicação quântica.", 
      details: error.message || error 
    });
  }
});

// Start server and handle Vite middleware
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ASTRA Core online na porta ${PORT}`);
  });
}

bootstrap();

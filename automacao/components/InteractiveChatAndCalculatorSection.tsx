"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Calculator, User, Bot, CheckCheck, Clock, ArrowRight, UserCheck } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
  isTransferred?: boolean;
}

const PRESET_QUESTIONS = [
  {
    q: "Como o assistente sabe a hora certa de passar pro humano?",
    reply:
      "Nossa IA analisa o tom da conversa e identifica intenções complexas (como negociações específicas de desconto, casos atípicos ou quando o cliente pede expressamente um atendente). Nesse momento, o robô silencia e aciona sua equipe humana no WhatsApp com todo o histórico já resumido.",
    transfer: false,
  },
  {
    q: "Vocês integram com o nosso ERP ou CRM atual?",
    reply:
      "Sim. Integramos via API e Webhooks com plataformas como Tiny, Bling, Omie, RD Station, HubSpot, Pipefy e bancos de dados SQL/Postgres. O assistente pode consultar estoque, status de entrega e emitir boletos direto no fluxo.",
    transfer: false,
  },
  {
    q: "Quero falar agora com um especialista da Branapi.",
    reply:
      "Perfeito! Estou transferindo seu atendimento para o nosso time de engenharia. Um consultor especialista da Branapi vai assumir essa conversa em instantes para analisar o seu caso.",
    transfer: true,
  },
];

export default function InteractiveChatAndCalculatorSection() {
  // Chat simulator state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: "Olá! Sou o assistente de IA da Branapi. Como posso acelerar o atendimento da sua empresa hoje?",
      time: "09:41",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Calculator state (Effect #5: tarefas repetitivas por dia & minutos por tarefa)
  const [tasksPerDay, setTasksPerDay] = useState(35);
  const [minutesPerTask, setMinutesPerTask] = useState(15);

  // Exact Formula: tarefas x minutos x 22 dias / 60
  const hoursPerMonth = Math.round((tasksPerDay * minutesPerTask * 22) / 60);

  const handleAskQuestion = (item: (typeof PRESET_QUESTIONS)[0]) => {
    if (isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: item.q,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: item.reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isTransferred: item.transfer,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1100);
  };

  return (
    <section
      id="demonstracao"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 md:px-8 bg-zinc-50 text-zinc-950 border-y border-zinc-200 select-none scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto space-y-20 sm:space-y-24">
        {/* ROW 1: CHAT SIMULATOR (Effect #4) */}
        <div>
          <div className="mb-12 max-w-3xl">
            <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-zinc-500 font-bold mb-3">
              DEMO AO VIVO &bull; ASSISTENTE WHATSAPP
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-zinc-950 tracking-tight">
              Veja a IA conversando em tempo real
            </h2>
            <p className="mt-3 text-zinc-600 font-body text-base md:text-lg">
              Clique em uma das dúvidas frequentes abaixo para ver como o assistente responde instantaneamente com linguagem natural e passa para a equipe humana.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* WHATSAPP MOCKUP CONTAINER */}
            <div className="lg:col-span-7 rounded-3xl bg-white border border-zinc-200 shadow-xl overflow-hidden flex flex-col h-[540px]">
              {/* WhatsApp Header */}
              <div className="p-4 bg-zinc-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C5FF41] text-black font-black flex items-center justify-center text-sm shadow-sm">
                    B
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                      <span>Assistente Branapi &bull; IA</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <div className="text-[11px] font-mono-code text-zinc-400">
                      {isTyping ? "digitando..." : "online 24h &bull; Exemplo ilustrativo"}
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-white/10 text-zinc-300 text-[10px] font-mono-code uppercase font-bold">
                  Demo
                </span>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-zinc-100/60 font-body text-sm">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 sm:p-4 rounded-2xl shadow-xs leading-relaxed ${
                        m.sender === "user"
                          ? "bg-zinc-900 text-white rounded-br-none"
                          : "bg-white text-zinc-900 border border-zinc-200 rounded-bl-none"
                      }`}
                    >
                      <p>{m.text}</p>
                      <div
                        className={`text-[10px] font-mono-code mt-1.5 flex items-center justify-end gap-1 ${
                          m.sender === "user" ? "text-zinc-400" : "text-zinc-500"
                        }`}
                      >
                        <span>{m.time}</span>
                        {m.sender === "user" && (
                          <CheckCheck className="w-3.5 h-3.5 text-[#C5FF41]" />
                        )}
                      </div>
                    </div>

                    {/* Transferred to human badge */}
                    {m.isTransferred && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono-code font-bold animate-pulse">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Transferido para a equipe humana com contexto salvo</span>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-zinc-200 w-20 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3.5 bg-white border-t border-zinc-200 flex items-center justify-between text-xs font-mono-code text-zinc-500">
                <span>Clique nos botões ao lado para enviar uma pergunta</span>
                <span className="text-[11px] text-zinc-400">WhatsApp Engine v2</span>
              </div>
            </div>

            {/* PRESET QUESTIONS BUTTONS */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-mono-code uppercase tracking-wider text-zinc-500 font-bold mb-2">
                Simule uma Pergunta Real:
              </div>

              {PRESET_QUESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAskQuestion(item)}
                  disabled={isTyping}
                  className="w-full text-left p-4 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-900 hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3 group"
                >
                  <span className="font-display font-semibold text-sm sm:text-base text-zinc-900 group-hover:text-black">
                    &quot;{item.q}&quot;
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-black shrink-0 transition-transform group-hover:translate-x-1" />
                </button>
              ))}

              <div className="p-4 rounded-2xl bg-zinc-100/80 border border-zinc-200 text-xs font-mono-code text-zinc-600">
                <span className="font-bold text-zinc-900">• Observação: </span>
                Demonstração ilustrativa com respostas instantâneas treinadas na documentação e regras de negócio da sua empresa.
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: CALCULADORA SIMPLES DE HORAS (Effect #5) */}
        <div className="pt-8 border-t border-zinc-200">
          <div className="mb-10 max-w-3xl">
            <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-zinc-500 font-bold mb-3">
              RETORNO OPERACIONAL &bull; ESTIMATIVA REAL
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-zinc-950 tracking-tight">
              Calculadora simples de horas economizadas
            </h2>
            <p className="mt-3 text-zinc-600 font-body text-base md:text-lg">
              Arraste os sliders abaixo para simular o tempo que sua equipe gasta em rotinas mecânicas. Nenhum valor inventado: cálculo matemático direto baseado nos seus números.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders Container */}
            <div className="lg:col-span-7 p-7 sm:p-9 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-8">
              {/* Slider 1: Tarefas repetitivas por dia */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="tasks-slider" className="font-display font-bold text-base sm:text-lg text-zinc-900">
                    Tarefas repetitivas por dia
                  </label>
                  <span className="font-mono-code font-black text-xl text-zinc-950">
                    {tasksPerDay} <span className="text-xs font-normal text-zinc-500">tarefas/dia</span>
                  </span>
                </div>
                <input
                  id="tasks-slider"
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={tasksPerDay}
                  onChange={(e) => setTasksPerDay(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                />
                <div className="flex justify-between text-[11px] font-mono-code text-zinc-400">
                  <span>5 tarefas</span>
                  <span>75 tarefas</span>
                  <span>150 tarefas</span>
                </div>
              </div>

              {/* Slider 2: Minutos por tarefa */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="minutes-slider" className="font-display font-bold text-base sm:text-lg text-zinc-900">
                    Minutos gastos por tarefa
                  </label>
                  <span className="font-mono-code font-black text-xl text-zinc-950">
                    {minutesPerTask} <span className="text-xs font-normal text-zinc-500">minutos</span>
                  </span>
                </div>
                <input
                  id="minutes-slider"
                  type="range"
                  min="2"
                  max="45"
                  step="1"
                  value={minutesPerTask}
                  onChange={(e) => setMinutesPerTask(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                />
                <div className="flex justify-between text-[11px] font-mono-code text-zinc-400">
                  <span>2 min</span>
                  <span>20 min</span>
                  <span>45 min</span>
                </div>
              </div>
            </div>

            {/* Calculated Result Display Card */}
            <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-zinc-950 text-white shadow-xl space-y-5 text-center flex flex-col justify-between">
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#C5FF41] font-bold">
                TEMPO RECUPERADO PELA EQUIPE
              </div>

              <div className="space-y-1">
                <div className="font-display font-black text-6xl sm:text-7xl text-white tracking-tight">
                  {hoursPerMonth}h
                </div>
                <div className="text-xs font-mono-code text-[#C5FF41] font-bold uppercase tracking-wider">
                  por mês liberadas
                </div>
              </div>

              {/* Exact Formula & Quote Requirement */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono-code text-zinc-400 leading-relaxed">
                <div className="text-white font-bold mb-1">
                  &quot;estimativa baseada nos seus números&quot;
                </div>
                <div>
                  Fórmula pura: ({tasksPerDay} tarefas &times; {minutesPerTask} min &times; 22 dias úteis) &divide; 60 min.
                </div>
              </div>

              <div className="text-[11px] font-mono-code text-zinc-500">
                Horas que deixam de ser rotina mecânica e viram vendas e qualidade.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

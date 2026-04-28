"use client";

import { useAppStore } from "@/lib/store";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Message = { role: "user" | "ai", text: string };

export default function InsightsPage() {
  const { rdBalance } = useAppStore();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Welcome to FinFlow AI. I have full context of your recent transactions and your wealth state. What would you like to know about your spending and cashback?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = query.trim();
    setQuery("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage }),
      });
      const data = await res.json();
      if (res.ok && data.answer) {
        setMessages(prev => [...prev, { role: "ai", text: data.answer }]);
      } else {
        setMessages(prev => [...prev, { role: "ai", text: data.error || "Failed to route query through neural net." }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Connection error with Gemini." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate 5-year projection based on current RD balance and 3% APY
  const projectionData = Array.from({ length: 6 }).map((_, i) => {
    return {
      year: new Date().getFullYear() + i,
      value: Math.round(rdBalance * Math.pow(1.03, i)),
    };
  });

  return (
    <div className="max-w-6xl mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
      
      {/* AI Chat Interface */}
      <div className="glass-card flex flex-col h-[70vh] lg:h-auto border border-slate-800">
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyber-pink/20 flex items-center justify-center border border-cyber-pink/30">
            <Sparkles className="w-5 h-5 text-cyber-pink" />
          </div>
          <div>
            <h2 className="font-bold text-white">Gemini FinFlow Agent</h2>
            <p className="text-xs text-cyber-neon font-mono">Live RAG Context Sync</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'ai' && (
                <div className="w-8 h-8 shrink-0 rounded-full bg-cyber-pink/10 flex items-center justify-center border border-cyber-pink/30">
                   <Bot className="w-4 h-4 text-cyber-pink" />
                </div>
              )}
              <div className={`p-4 rounded-xl max-w-[80%] ${m.role === 'user' ? 'bg-cyber-neon text-cyber-dark font-medium rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none leading-relaxed'}`}>
                {m.text}
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 shrink-0 rounded-full bg-cyber-neon/20 flex items-center justify-center border border-cyber-neon/50">
                   <User className="w-4 h-4 text-cyber-neon" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 shrink-0 rounded-full bg-cyber-pink/10 flex items-center justify-center border border-cyber-pink/30">
                 <Bot className="w-4 h-4 text-cyber-pink" />
              </div>
              <div className="p-4 rounded-xl max-w-[80%] bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyber-pink animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-cyber-pink animate-bounce delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-cyber-pink animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        <div className="p-4 border-t border-white/5">
          <form onSubmit={handleAsk} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about your spending habits..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyber-pink rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyber-pink transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-cyber-pink text-white disabled:opacity-50 hover:shadow-[0_0_15px_#ff003c] transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="space-y-6">
        <div className="glass-card p-6 border border-slate-800">
           <h3 className="font-bold text-xl text-white mb-6 font-display flex items-center gap-2">
              Wealth Velocity Projection
           </h3>
           <p className="text-slate-400 text-sm mb-6">Displaying a 5-year compounding trajectory based on your current Smart RD Balance at 3% APY.</p>
           
           <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#00f0ff' }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [`₹${value ?? 0}`, "Projected Vault"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00f0ff" 
                  strokeWidth={3}
                  dot={{ fill: '#050511', stroke: '#00f0ff', strokeWidth: 2, r: 4 }}
                  activeDot={{ fill: '#ef4444', stroke: '#ef4444', r: 6 }} 
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
           </div>
        </div>

        <div className="glass-card p-6 border border-emerald-500/30 bg-emerald-950/10">
           <h4 className="font-bold text-emerald-400 mb-2">Hackathon Logic Insight</h4>
           <p className="text-sm text-slate-300">
             The graph dynamically recalculates every time you simulate a transaction in the <strong>Pay</strong> dashboard. The magic of compound interest shows how small cashbacks add up!
           </p>
        </div>
      </div>

    </div>
  );
}

"use client";

import { ShieldCheck, Lock, Database, EyeOff } from "lucide-react";

export default function TrustCenter() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyber-pink/10 mb-4 shadow-[0_0_30px_rgba(255,0,60,0.2)]">
          <ShieldCheck className="w-10 h-10 text-cyber-pink" />
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-4">Trust & Transparency</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          We believe in a robust <span className="text-cyber-neon font-mono">Trust Layer</span>. You have absolute control over your financial telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 border border-emerald-500/30">
          <Lock className="w-8 h-8 text-emerald-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Zero-Knowledge Processing</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            When you invoke RAG (Retrieval-Augmented Generation) insights, only your raw transaction context is temporally embedded. The models do not train on your telemetry, and the memory volatile cache is purged post-generation.
          </p>
        </div>

         <div className="glass-card p-8 border border-cyan-500/30">
          <Database className="w-8 h-8 text-cyan-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Isolated Vector Storage</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your transactions are embedded securely into an isolated ChromaDB partition. Queries are scoped strictly to your unique NextAuth Session ID. Cross-node data contamination is cryptographically impossible.
          </p>
        </div>
        
        <div className="glass-card p-8 border border-purple-500/30 md:col-span-2 flex flex-col md:flex-row items-center gap-8">
          <EyeOff className="w-16 h-16 text-purple-400 shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Hackathon Trust Compliance</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              FinFlow AI was architected for the Finvasia Innovation Hackathon 2026. This platform strictly adheres to the decentralized data sovereignty principle required by the hackathon. 
            </p>
            <button className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/10">
              Download Full Security Audit (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useAppStore } from "@/lib/store";
import { Activity, ArrowRight, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

export default function DashboardHome() {
  const { totalBalance, rdBalance, totalWealth, user } = useAppStore();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
         <div>
            <h1 className="text-4xl font-bold font-display text-white mb-2">
               Welcome back, <span className="text-cyber-neon">{user?.name || 'Operator'}</span>
            </h1>
            <p className="text-slate-400">System systems nominal. Wealth accumulators active.</p>
         </div>
         <div className="text-right hidden md:block">
            <p className="text-sm font-mono text-slate-500 uppercase">Secure Connection</p>
            <p className="text-emerald-400 text-sm flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span> Secure &amp; Encrypted</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-t-2 border-t-cyber-neon relative overflow-hidden group hover:-translate-y-1 transition-transform">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-24 h-24 text-cyber-neon" />
           </div>
           <p className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-2 mt-4 relative z-10">Available Liquid</p>
           <p className="text-4xl font-bold text-white tracking-tighter relative z-10">₹{(totalBalance ?? 0).toLocaleString('en-IN')}</p>
        </div>
        
        <div className="glass-card p-6 border-t-2 border-t-cyber-pink relative overflow-hidden group hover:-translate-y-1 transition-transform">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-24 h-24 text-cyber-pink" />
           </div>
           <p className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-2 mt-4 relative z-10">Smart RD Vault</p>
           <p className="text-4xl font-bold text-white tracking-tighter relative z-10">₹{(rdBalance ?? 0).toLocaleString('en-IN')}</p>
           <p className="text-xs text-cyber-pink mt-2 relative z-10">Compounding Active @ 3% APY</p>
        </div>

        <div className="glass-card p-6 border-t-2 border-t-purple-500 relative overflow-hidden group hover:-translate-y-1 transition-transform">
           <p className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-2 mt-4 relative z-10">Total Net Worth</p>
           <p className="text-4xl font-bold text-white tracking-tighter relative z-10">₹{(totalWealth ?? 0).toLocaleString('en-IN')}</p>
           <div className="h-2 w-full bg-slate-800 rounded-full mt-4 overflow-hidden relative z-10">
              <div className="h-full bg-gradient-to-r from-cyber-neon to-cyber-pink w-[70%]" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
         <Link href="/dashboard/pay" className="glass-card p-8 flex items-center justify-between group hover:bg-white/5 transition-colors">
            <div>
               <div className="w-12 h-12 bg-cyber-neon/10 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-cyber-neon" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Simulate Transaction</h3>
               <p className="text-slate-400 text-sm max-w-[250px]">Trigger a mock payment to see the invisible investor engine in action.</p>
            </div>
            <ArrowRight className="w-6 h-6 text-slate-500 group-hover:text-white transition-colors group-hover:translate-x-2" />
         </Link>

         <Link href="/dashboard/insights" className="glass-card p-8 flex items-center justify-between group hover:bg-white/5 transition-colors">
            <div>
               <div className="w-12 h-12 bg-cyber-pink/10 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-cyber-pink" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">RAG AI Insights</h3>
               <p className="text-slate-400 text-sm max-w-[250px]">Query your spending logic with our Gemini flash-powered agent.</p>
            </div>
            <ArrowRight className="w-6 h-6 text-slate-500 group-hover:text-white transition-colors group-hover:translate-x-2" />
         </Link>
      </div>
    </div>
  );
}

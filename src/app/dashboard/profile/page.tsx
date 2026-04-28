"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useAppStore } from "@/lib/store";
import { ShieldCheck, User, Fingerprint, Lock, ShieldAlert, Cpu, Sparkles, LogOut, FileText, Settings, CreditCard, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { trustScore } = useAppStore();
  
  const [operatorName, setOperatorName] = useState(session?.user?.name || "System Administrator");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleEditName = () => {
    setTempName(operatorName);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    setOperatorName(tempName);
    setIsEditingName(false);
    showToast("Operator Name protocol updated successfully.");
  };

  const mockAction = (actionName: string) => {
    showToast(`${actionName} protocol activated. Settings saved local.`);
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col gap-8 relative overflow-hidden">
      {toast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 border border-cyber-pink shadow-[0_0_20px_rgba(255,0,60,0.3)] px-6 py-4 rounded-xl animate-in fade-in zoom-in-95 flex items-center gap-4 min-w-[300px]">
             <div className="flex flex-col">
               <span className="text-xs uppercase tracking-widest font-mono font-bold text-cyber-pink">System Alert</span>
               <span className="text-white font-medium">{toast}</span>
             </div>
          </div>
      )}

      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-pink/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mb-4">
        <h1 className="text-4xl font-display font-bold text-white mb-2 flex items-center gap-3">
          <User className="text-cyber-pink w-10 h-10" />
          Operator Profile Matrix
        </h1>
        <p className="text-slate-400 text-lg">Manage your identity, settings, and network credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
         {/* ID Card Column */}
         <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="glass-card p-8 border border-cyber-pink/30 flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-b from-cyber-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="w-32 h-32 rounded-full border-4 border-cyber-pink/50 overflow-hidden mb-6 relative z-10 shadow-[0_0_30px_rgba(255,0,60,0.3)]">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.email || 'default'}&backgroundColor=ff003c`} alt="Avatar" className="w-full h-full object-cover"/>
               </div>
               <h2 className="text-2xl font-bold text-white mb-1 relative z-10">{operatorName}</h2>
               <p className="text-slate-400 font-mono text-sm relative z-10">{session?.user?.email}</p>
               
               <div className="mt-8 relative z-10 w-full p-4 border border-cyber-neon/30 bg-cyber-neon/10 rounded-xl flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-cyber-neon" />
                    <span className="text-xs uppercase tracking-widest font-mono text-slate-300">Trust Score</span>
                 </div>
                 <span className="text-2xl font-bold text-cyber-neon">{trustScore}</span>
               </div>
            </div>

            <div className="glass-card p-6 border border-slate-800 flex flex-col gap-2">
               <h3 className="text-sm uppercase tracking-widest font-mono text-slate-500 mb-2">Quick Actions</h3>
               <button onClick={() => mockAction("Account Settings")} className="w-full text-left p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-slate-700 transition-all font-medium text-slate-300 flex items-center gap-3">
                 <Settings className="w-4 h-4 text-slate-500"/> Account Settings
               </button>
               <button onClick={() => mockAction("Security")} className="w-full text-left p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-slate-700 transition-all font-medium text-slate-300 flex items-center gap-3">
                 <Lock className="w-4 h-4 text-slate-500"/> Security & 2FA
               </button>
               <button onClick={() => mockAction("Wallet Configuration")} className="w-full text-left p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-slate-700 transition-all font-medium text-slate-300 flex items-center gap-3">
                 <CreditCard className="w-4 h-4 text-slate-500"/> Saved Cards
               </button>
            </div>
         </div>

         {/* Information Grid */}
         <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-card p-8 border border-slate-800">
               <h2 className="text-xl font-bold font-mono tracking-widest text-slate-300 border-b border-slate-800 pb-4 mb-6 flex items-center gap-2">
                 <Fingerprint className="w-5 h-5 text-cyber-neon" /> Identity Protocols
               </h2>
               
               <div className="space-y-6">
                 {/* Editable Name Field */}
                 <div className="bg-black/30 p-5 rounded-xl border border-slate-800 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Operator Name</span>
                      {!isEditingName && (
                        <button onClick={handleEditName} className="text-xs text-cyber-pink hover:text-white font-mono transition-colors">EDIT</button>
                      )}
                    </div>
                    {isEditingName ? (
                      <div className="flex gap-3">
                        <input 
                           type="text" 
                           value={tempName} 
                           onChange={(e) => setTempName(e.target.value)} 
                           className="flex-1 bg-slate-900 border border-cyber-pink focus:outline-none rounded-lg px-4 py-2 text-white font-medium"
                        />
                        <button onClick={handleSaveName} className="bg-cyber-pink hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">SAVE</button>
                      </div>
                    ) : (
                      <p className="text-xl text-white font-medium">{operatorName}</p>
                    )}
                 </div>
                 
                 <div className="bg-black/30 p-5 rounded-xl border border-slate-800 transition-colors cursor-not-allowed">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Target Email Address (READ ONLY)</span>
                    </div>
                    <p className="text-xl text-slate-400 font-medium">{session?.user?.email}</p>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div onClick={() => mockAction("Hardware Acceleration")} className="glass-card p-6 border border-slate-800 hover:border-neon-cyan/50 transition-colors group cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-neon-cyan/0 group-hover:bg-neon-cyan/5 transition-colors" />
                  <Cpu className="w-8 h-8 text-slate-500 group-hover:text-neon-cyan mb-4 transition-colors" />
                  <h3 className="text-lg font-bold text-white mb-2 flex justify-between items-center">System Prefs <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-neon-cyan transition-colors" /></h3>
                  <p className="text-sm text-slate-400">Configure visual themes, data streams, and hardware acceleration.</p>
               </div>
               <div onClick={() => mockAction("Network Security Scan")} className="glass-card p-6 border border-slate-800 hover:border-amber-500/50 transition-colors group cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors" />
                  <ShieldAlert className="w-8 h-8 text-slate-500 group-hover:text-amber-500 mb-4 transition-colors" />
                  <h3 className="text-lg font-bold text-white mb-2 flex justify-between items-center">Connected Devices <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-colors" /></h3>
                  <p className="text-sm text-slate-400">Review other IPs querying your access keys. Terminate them instantly.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

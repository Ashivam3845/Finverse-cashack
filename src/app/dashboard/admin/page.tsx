"use client";

import { useState, useEffect } from "react";
import { Crown, Edit3, Save, Users, X, Database, ShieldAlert, Activity } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ totalBalance: 0, digitalCoins: 0, trustScore: 100 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email !== "admin@finflow.com") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email === "admin@finflow.com") {
      fetchUsers();
    }
  }, [session]);

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setEditForm({ totalBalance: user.totalBalance, digitalCoins: user.digitalCoins, trustScore: user.trustScore || 100 });
  };

  const handleSave = async (userId: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...editForm })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEditingId(null);
        fetchUsers();
      } else {
        alert("Failed to overwrite: " + data.error);
      }
    } catch (e) {
      alert("Override execution error.");
    }
  };

  if (status === "loading" || isLoading) return <div className="text-amber-500 font-mono text-xl p-10 animate-pulse">AUTHORIZING MASTER CONTROL...</div>;
  if (session?.user?.email !== "admin@finflow.com") return null;

  const totalPlatformFiat = users.reduce((acc, u) => acc + u.totalBalance, 0);
  const totalPlatformCoins = users.reduce((acc, u) => acc + u.digitalCoins, 0);

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col gap-8 relative">
       {/* Ambient glow */}
       <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

       <div className="mb-2 z-10">
        <h1 className="text-4xl font-display font-bold text-amber-500 mb-2 flex items-center gap-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
          <Crown className="w-10 h-10" />
          Master Control Node
        </h1>
        <p className="text-slate-400">System Override privileges active. Unrestricted Database Access granted.</p>
      </div>

      {/* Global Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 z-10">
         <div className="glass-card p-6 border border-amber-500/30 flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 blur-3xl group-hover:bg-amber-500/20 transition-all"/>
            <Users className="w-6 h-6 text-amber-500 mb-2" />
            <p className="text-xs font-mono font-bold text-slate-500 tracking-widest uppercase">Total Identities</p>
            <p className="text-3xl font-bold text-white">{users.length}</p>
         </div>
         <div className="glass-card p-6 border border-emerald-500/30 flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all"/>
            <Database className="w-6 h-6 text-emerald-500 mb-2" />
            <p className="text-xs font-mono font-bold text-slate-500 tracking-widest uppercase">Global Fiat Volume</p>
            <p className="text-3xl font-bold text-white">₹{totalPlatformFiat.toLocaleString('en-IN', {maximumFractionDigits:0})}</p>
         </div>
         <div className="glass-card p-6 border border-yellow-500/30 flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-yellow-500/10 blur-3xl group-hover:bg-yellow-500/20 transition-all"/>
            <Activity className="w-6 h-6 text-yellow-500 mb-2" />
            <p className="text-xs font-mono font-bold text-slate-500 tracking-widest uppercase">Global Digital Coins</p>
            <p className="text-3xl font-bold text-white">{totalPlatformCoins.toLocaleString()}</p>
         </div>
      </div>

      <div className="glass-card border border-amber-500/20 flex-1 flex flex-col overflow-hidden rounded-3xl z-10 bg-black/40 shadow-2xl">
         <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-black/40">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-amber-500" /> Identity Matrix</h2>
            <div className="flex gap-2">
               <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse delay-75"></span>
               <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse delay-150"></span>
            </div>
         </div>

         <div className="flex-1 overflow-auto p-6 space-y-4">
            {users.map((user) => (
               <div key={user.id} className={`p-5 rounded-2xl border transition-all ${editingId === user.id ? 'bg-amber-500/5 border-amber-500' : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'}`}>
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                     
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-700 shrink-0">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}&backgroundColor=ff003c`} alt="User" />
                        </div>
                        <div>
                           <p className="text-white font-bold text-lg">{user.name || "Anonymous User"}</p>
                           <p className="text-slate-400 font-mono text-sm">{user.email}</p>
                           <p className="text-slate-600 font-mono text-xs mt-1">ID: {user.id}</p>
                        </div>
                     </div>

                     {editingId === user.id ? (
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 bg-black/40 p-3 rounded-xl border border-amber-500/20">
                           <div className="space-y-1">
                              <label className="text-[10px] text-emerald-400 uppercase font-mono font-bold tracking-widest pl-1">Modify Fiat</label>
                              <div className="relative">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">₹</span>
                                 <input 
                                   type="number" 
                                   value={editForm.totalBalance} 
                                   onChange={(e) => setEditForm({...editForm, totalBalance: Number(e.target.value)})}
                                   className="w-full sm:w-32 bg-slate-950 border border-emerald-500/30 focus:border-emerald-500 rounded-lg pl-8 pr-3 py-2 text-white font-mono focus:outline-none transition-colors"
                                 />
                              </div>
                           </div>
                           <div className="space-y-1">
                              <label className="text-[10px] text-yellow-400 uppercase font-mono font-bold tracking-widest pl-1">Modify Coins</label>
                              <input 
                                type="number" 
                                value={editForm.digitalCoins} 
                                onChange={(e) => setEditForm({...editForm, digitalCoins: Number(e.target.value)})}
                                className="w-full sm:w-28 bg-slate-950 border border-yellow-500/30 focus:border-yellow-500 rounded-lg px-3 py-2 text-white font-mono focus:outline-none transition-colors"
                              />
                           </div>
                           <div className="flex gap-2 shrink-0 h-10 mt-1 sm:mt-0">
                              <button onClick={() => setEditingId(null)} className="px-3 border border-slate-700 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors"><X className="w-4 h-4"/></button>
                              <button onClick={() => handleSave(user.id)} className="px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all">
                                 <Save className="w-4 h-4"/> Force
                              </button>
                           </div>
                        </div>
                     ) : (
                        <div className="flex items-center gap-8 bg-black/20 p-4 rounded-xl border border-slate-800/50">
                           <div>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono text-right mb-1">Fiat Vault</p>
                              <p className="text-xl font-bold text-white font-mono text-right">₹{user.totalBalance.toFixed(2)}</p>
                           </div>
                           <div className="w-px h-8 bg-slate-800"></div>
                           <div>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono text-right mb-1">Coins</p>
                              <p className="text-xl font-bold text-yellow-400 font-mono text-right">{user.digitalCoins}</p>
                           </div>
                           <button onClick={() => handleEdit(user)} className="p-3 border border-slate-700 bg-slate-800 hover:bg-amber-500 hover:border-amber-500 hover:text-black text-slate-400 rounded-xl transition-all shadow-xl">
                              <Edit3 className="w-5 h-5" />
                           </button>
                        </div>
                     )}

                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}

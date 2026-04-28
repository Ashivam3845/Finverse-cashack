"use client";

import { useState } from "react";
import { CreditCard, ArrowRight, ShieldCheck, Zap, RefreshCw } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useSession } from "next-auth/react";

export default function PayPage() {
  const { data: session } = useSession();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [category, setCategory] = useState("PEER");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successData, setSuccessData] = useState<{ cashback: number, coins: number, amt: number } | null>(null);
  
  const { totalBalance, rdBalance, totalWealth, setBalances, digitalCoins, setDigitalCoins } = useAppStore();

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || Number(amount) > totalBalance || !recipient) return;
    
    setIsProcessing(true);
    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), recipient, category }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setBalances(data.newBalance, data.newRdBalance, data.newBalance + data.newRdBalance + (totalWealth - totalBalance - rdBalance));
        setDigitalCoins(digitalCoins + data.coinsEarned);
        setSuccessData({ cashback: data.cashback, coins: data.coinsEarned, amt: Number(amount) });
        setAmount("");
        setRecipient("");
      } else {
        alert("Payment Gateway Failed: " + data.error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col gap-8 relative overflow-hidden">
      <div className="absolute top-10 left-[-10%] w-[400px] h-[400px] bg-cyber-neon/10 blur-[100px] rounded-full pointer-events-none" />

      <div>
        <h1 className="text-4xl font-display font-bold text-white mb-2 flex items-center gap-3 relative z-10">
          <CreditCard className="text-cyber-neon w-10 h-10" />
          Neural Payment Node
        </h1>
        <p className="text-slate-400 text-lg relative z-10">Execute instant fiat transfers with dynamic smart-contract cashback.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative z-10 mt-4">
         
         {/* 3D Credit Card Visualizer */}
         <div className="lg:w-1/2 flex items-center justify-center perspective-[1000px]">
            <div className={`w-full max-w-[400px] h-64 rounded-3xl p-8 relative glass-card border border-slate-700 shadow-[0_0_50px_rgba(0,240,255,0.1)] transition-all duration-700 transform-style-3d ${isProcessing ? 'rotate-y-180 scale-105 shadow-[0_0_80px_rgba(0,240,255,0.4)]' : 'hover:rotate-y-12 hover:rotate-x-12'}`}>
               <div className="absolute inset-0 bg-gradient-to-br from-cyber-neon/20 via-transparent to-cyber-pink/20 rounded-3xl" />
               <div className="relative h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <span className="font-display font-bold text-2xl tracking-widest text-white">FIN<span className="text-cyber-neon">FLOW</span></span>
                     <Zap className="text-cyber-neon w-6 h-6 animate-pulse"/>
                  </div>
                  <div className="space-y-4">
                     <div className="text-3xl font-mono text-white tracking-[0.2em] font-medium opacity-90 drop-shadow-lg">
                        **** **** **** 4092
                     </div>
                     <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                           <span className="text-[10px] text-slate-400 uppercase tracking-widest">Operator Name</span>
                           <span className="font-mono text-white text-sm uppercase tracking-wider">{session?.user?.name || 'Administrator'}</span>
                        </div>
                        <div className="flex flex-col text-right">
                           <span className="text-[10px] text-slate-400 uppercase tracking-widest">Available</span>
                           <span className="font-mono text-cyber-neon text-lg font-bold">₹{totalBalance.toFixed(2)}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Interactive Form */}
         <div className="lg:w-1/2 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
            {successData ? (
               <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                     <ShieldCheck className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-wide uppercase">Transfer Verified</h2>
                  <p className="text-slate-400 font-mono mb-8 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
                    Routing ₹{successData.amt.toFixed(2)} complete.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 w-full mb-8">
                     <div className="bg-cyber-neon/10 border border-cyber-neon/30 p-4 rounded-xl">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Cashback Routed</p>
                        <p className="text-xl font-mono text-cyber-neon font-bold">+₹{successData.cashback.toFixed(2)}</p>
                     </div>
                     <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Coins Minted</p>
                        <p className="text-xl font-mono text-yellow-400 font-bold">+{successData.coins} D-Coins</p>
                     </div>
                  </div>

                  <button onClick={() => setSuccessData(null)} className="w-full border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 py-3 rounded-xl transition-all uppercase tracking-widest text-sm font-bold">
                     Initiate Another Transfer
                  </button>
               </div>
            ) : (
               <form onSubmit={handlePay} className="flex flex-col h-full space-y-6">
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-widest pl-1 mb-2 block">Recipient Identity</label>
                    <input 
                      type="text" 
                      value={recipient} 
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="@username or phone"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyber-neon rounded-xl px-5 py-4 text-white font-mono focus:outline-none transition-all placeholder:text-slate-600"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-widest pl-1 mb-2 block">Fiat Amount</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xl">₹</span>
                      <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        min="1"
                        max={totalBalance}
                        step="0.01"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyber-neon rounded-xl pl-12 pr-5 py-4 text-white font-mono text-xl focus:outline-none transition-all placeholder:text-slate-700"
                        required
                        disabled={isProcessing}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-widest pl-1 mb-2 block">Category Vector</label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyber-neon rounded-xl px-5 py-4 text-white focus:outline-none transition-all appearance-none cursor-pointer"
                      disabled={isProcessing}
                    >
                      <option value="PEER">Peer 2 Peer Node</option>
                      <option value="MERCHANT">Merchant Gateway</option>
                      <option value="BILL">Utility / Bills</option>
                    </select>
                  </div>

                  <div className="mt-auto pt-4">
                     <button 
                       type="submit" 
                       disabled={isProcessing || Number(amount) <= 0 || Number(amount) > totalBalance || !recipient}
                       className="w-full bg-cyber-neon hover:bg-[#00f0ff] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] text-black py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                     >
                       {isProcessing ? (
                         <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Processing Transaction...
                         </>
                       ) : (
                         <>
                          Execute Transfer
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                         </>
                       )}
                     </button>
                     {Number(amount) > totalBalance && (
                        <p className="text-rose-500 text-xs font-bold text-center mt-3 uppercase tracking-widest">Insufficient Funds detected</p>
                     )}
                  </div>
               </form>
            )}
         </div>
      </div>
    </div>
  );
}

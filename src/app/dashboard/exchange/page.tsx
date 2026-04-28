"use client";

import { useState, useEffect } from "react";
import { TrendingUp, ShoppingCart, RefreshCw, BarChart2, TrendingDown } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  marketCap: string;
}

export default function ExchangePage() {
  const [stocks, setStocks] = useState<Stock[]>([
    { symbol: "AAPL", name: "Apple Inc.", price: 175.20, change: 1.2, volume: "26.21 M", marketCap: "2.8 T" },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 345.50, change: -0.5, volume: "23.52 M", marketCap: "2.4 T" },
    { symbol: "AMZN", name: "Amazon Inc.", price: 130.10, change: 0.8, volume: "3.05 M", marketCap: "1.3 T" },
    { symbol: "GOOG", name: "Alphabet", price: 135.00, change: 2.1, volume: "13.36 M", marketCap: "1.7 T" },
    { symbol: "TSLA", name: "Tesla Inc.", price: 240.20, change: -3.1, volume: "10.42 M", marketCap: "800 B" },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 450.30, change: 4.8, volume: "45.10 M", marketCap: "1.1 T" },
  ]);
  
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [shares, setShares] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { totalBalance, setBalances, rdBalance } = useAppStore();
  const [toast, setToast] = useState<string | null>(null);

  const mockChartData = [
    { name: 'Oct 30', value: 1500 },
    { name: 'Oct 31', value: 1700 },
    { name: 'Nov 1', value: 1400 },
    { name: 'Nov 2', value: 1600 },
    { name: 'Nov 3', value: 1300 },
    { name: 'Nov 4', value: 1800 },
    { name: 'Nov 5', value: 2000 },
  ];

  const indices = [
    { name: "NASDAQ", val: "8,256.14", change: 0.37 },
    { name: "SPX500", val: "3,091.11", change: 0.15 },
    { name: "DJ30", val: "7,515.41", change: -0.41 },
    { name: "EUSTX50", val: "3,710.05", change: -0.12 },
    { name: "FRA40", val: "5,919.50", change: 0.24 },
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(s => {
        const fluc = (Math.random() - 0.5) * 5; 
        return { ...s, price: Math.max(1, s.price + fluc) };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBuy = async () => {
    if (!selectedStock) return;
    setIsProcessing(true);
    try {
      const totalCost = selectedStock.price * shares;
      
      const res = await fetch("/api/buy-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: selectedStock.symbol, shares, price: selectedStock.price, totalCost }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setBalances(data.newBalance, rdBalance, data.newBalance + data.newPortfolioValue);
        setSelectedStock(null);
        setShares(1);
        showToast(`Successfully executed purchase of ${shares} ${selectedStock.symbol} shares!`);
      } else {
        showToast(data.error || "Purchase failed");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-cyber-neon/50 shadow-[0_0_20px_rgba(0,240,255,0.3)] px-6 py-3 rounded-full animate-in fade-in slide-in-from-top-4 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyber-neon animate-pulse"></div>
          <p className="text-cyber-neon font-bold whitespace-nowrap text-sm">{toast}</p>
        </div>
      )}

      {/* LEFT COLUMN: INDICES */}
      <div className="w-full lg:w-1/4 xl:w-1/5 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
         {indices.map((idx, i) => (
            <div 
              key={idx.name} 
              onClick={() => setActiveIdx(i)}
              className={`p-5 rounded-2xl cursor-pointer transition-all border ${activeIdx === i ? 'bg-cyber-neon text-black border-cyber-neon shadow-[0_0_15px_rgba(0,240,255,0.4)]' : 'glass-card border-slate-800 text-white hover:border-cyber-neon/30'}`}
            >
               <h3 className={`font-bold mb-1 ${activeIdx === i ? 'text-black' : 'text-slate-400'}`}>{idx.name}</h3>
               <div className="flex items-baseline gap-2">
                 <span className="text-2xl font-bold">{idx.val}</span>
                 <span className={`text-xs font-bold flex items-center ${idx.change >= 0 ? (activeIdx === i ? 'text-green-800' : 'text-emerald-400') : (activeIdx === i ? 'text-red-800' : 'text-rose-400')}`}>
                   {idx.change >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5"/> : <TrendingDown className="w-3 h-3 mr-0.5"/>}
                   {Math.abs(idx.change)}%
                 </span>
               </div>
            </div>
         ))}
      </div>

      {/* RIGHT COLUMN: GRAPH & COMPONENTS */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
         {/* GRAPH SECTION */}
         <div className="glass-card border border-slate-800 rounded-3xl p-6 h-[300px] flex flex-col relative overflow-hidden group">
            <h2 className="text-2xl font-bold text-white tracking-widest absolute top-6 left-6 z-10">{indices[activeIdx].name}</h2>
            <div className="mt-8 flex-1 w-full h-full relative z-10">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={mockChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="name" stroke="#334155" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#00f0ff' }}
                   />
                   <Area type="monotone" dataKey="value" stroke="#00f0ff" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* COMPONENTS TABLE */}
         <div className="glass-card border border-slate-800 rounded-3xl flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-6 px-8 pt-6 border-b border-slate-800/50">
               <span className="font-bold text-cyber-neon border-b-2 border-cyber-neon pb-4">Components</span>
               <span className="font-bold text-slate-500 pb-4">Data</span>
               <span className="font-bold text-slate-500 pb-4">History</span>
            </div>
            
            <div className="flex-1 overflow-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-slate-800">
                     <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase">Symbol</th>
                     <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase">Company Name</th>
                     <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase text-right">Price</th>
                     <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase text-right">Volume</th>
                     <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase text-right">Market Cap</th>
                     <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase text-right">Change</th>
                     <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase text-center">Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {stocks.map(stock => (
                     <tr key={stock.symbol} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                       <td className="px-8 py-4 font-bold text-cyber-neon">{stock.symbol}</td>
                       <td className="px-8 py-4 font-bold text-white">{stock.name}</td>
                       <td className="px-8 py-4 font-mono text-white text-right">₹{stock.price.toFixed(2)}</td>
                       <td className="px-8 py-4 font-mono text-slate-400 text-right">{stock.volume}</td>
                       <td className="px-8 py-4 font-mono text-slate-400 text-right">{stock.marketCap}</td>
                       <td className={`px-8 py-4 font-bold text-right ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                         {stock.change >= 0 ? '+' : ''}{stock.change}%
                       </td>
                       <td className="px-8 py-4 text-center">
                         <button onClick={() => {setSelectedStock(stock); setShares(1);}} className="text-xs bg-cyber-neon/10 hover:bg-cyber-neon text-cyber-neon hover:text-black px-4 py-2 rounded font-bold uppercase transition-colors">
                           Trade
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
         </div>
      </div>

      {/* Buy Dialog Modal */}
      {selectedStock && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-cyber-neon/50 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.1)] max-w-sm w-full mx-auto relative overflow-hidden zoom-in-95 animate-in">
            <h2 className="text-2xl font-bold text-white mb-1 tracking-wider uppercase">Market Order</h2>
            <p className="text-slate-400 font-mono text-sm mb-6">{selectedStock.name} ({selectedStock.symbol})</p>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-sm">Market Price</span>
                <span className="font-mono text-white">₹{selectedStock.price.toFixed(2)}</span>
              </div>
              
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest pl-1 mb-1 block">Quantity</label>
                <input 
                  type="number" min="1" 
                  value={shares} 
                  onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyber-neon rounded-lg px-4 py-3 text-white text-center font-mono text-xl focus:outline-none focus:ring-1 focus:ring-cyber-neon transition-all"
                />
              </div>

              <div className="flex justify-between items-center bg-cyber-neon/10 p-3 rounded-lg border border-cyber-neon/30">
                <span className="text-cyber-neon text-sm font-bold">Total Cost</span>
                <span className="font-mono text-neon-cyan font-bold text-xl">₹{(selectedStock.price * shares).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedStock(null)} 
                className="flex-1 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={isProcessing || (selectedStock.price * shares) > totalBalance}
                onClick={handleBuy} 
                className="flex-1 py-3 bg-cyber-neon text-black font-bold uppercase rounded-lg hover:bg-[#00f0ff] transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:bg-slate-700"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                Execute
              </button>
            </div>
            
            {(selectedStock.price * shares) > totalBalance && (
              <p className="text-rose-400 text-xs text-center mt-3 font-mono">Insufficient Fiat Value</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

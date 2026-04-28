"use client";

import { useState, useEffect } from "react";
import { FileText, Search, ArrowUpRight, Coins, Zap, BadgePercent, TrendingUp } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  cashbackEarned: number;
  coinsEarned: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  food: "#f59e0b",
  shopping: "#6366f1",
  transport: "#14b8a6",
  entertainment: "#ef4444",
  utilities: "#0ea5e9",
  health: "#10b981",
  travel: "#f97316",
  education: "#8b5cf6",
};

function getCategoryColor(cat: string) {
  const key = Object.keys(CATEGORY_COLORS).find((k) => cat.toLowerCase().includes(k));
  return key ? CATEGORY_COLORS[key] : "#64748b";
}

export default function LedgerPage() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ totalSpent: 0, totalCashback: 0, totalCoins: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "cashback" | "coins">("all");

  useEffect(() => {
    fetch("/api/ledger")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setTxs(data.transactions);
          setSummary(data.summary);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = txs
    .filter((t) => t.category.toLowerCase().includes(searchFilter.toLowerCase()))
    .filter((t) => {
      if (activeFilter === "cashback") return t.cashbackEarned > 0;
      if (activeFilter === "coins") return t.coinsEarned > 0;
      return true;
    });

  // Savings rate
  const savingsRate =
    summary.totalSpent > 0 ? ((summary.totalCashback / summary.totalSpent) * 100).toFixed(1) : "0.0";

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="text-emerald-400 w-8 h-8" />
            Ledger & Rewards
          </h1>
          <p className="text-slate-400">
            Every payment earns you cashback + DigiCoins. Track it all here.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="flex gap-3 flex-wrap">
          <div className="glass-card px-5 py-3 border border-emerald-500/30 flex items-center gap-3">
            <Zap className="text-emerald-400 w-5 h-5 shrink-0" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Total Cashback</p>
              <p className="text-xl font-bold text-white">₹{summary.totalCashback.toFixed(2)}</p>
            </div>
          </div>
          <div className="glass-card px-5 py-3 border border-yellow-500/30 flex items-center gap-3">
            <Coins className="text-yellow-400 w-5 h-5 shrink-0" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">DigiCoins Earned</p>
              <p className="text-xl font-bold text-white">{summary.totalCoins}</p>
            </div>
          </div>
          <div className="glass-card px-5 py-3 border border-violet-500/30 flex items-center gap-3">
            <TrendingUp className="text-violet-400 w-5 h-5 shrink-0" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Savings Rate</p>
              <p className="text-xl font-bold text-white">{savingsRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-black/20">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search merchants..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "cashback", "coins"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeFilter === f
                    ? f === "all"
                      ? "bg-slate-700 text-white"
                      : f === "cashback"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {f === "all" ? "All Transactions" : f === "cashback" ? "💚 Cashback Only" : "🟡 Coins Only"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 animate-pulse font-mono tracking-widest">
              QUERYING LEDGER...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-950">
                    Date
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-950">
                    Merchant / Category
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-950 text-right">
                    Amount
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-950 text-center">
                    Cashback Earned
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-950 text-center">
                    DigiCoins Earned
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-950 text-right">
                    Net Benefit
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => {
                  const catColor = getCategoryColor(tx.category);
                  const netBenefit = tx.cashbackEarned + tx.coinsEarned * 0.1; // approx coin value
                  const cashbackPct = tx.amount > 0 ? ((tx.cashbackEarned / tx.amount) * 100).toFixed(1) : "0";
                  return (
                    <tr
                      key={tx.id}
                      className="border-b border-slate-800/50 hover:bg-white/5 transition-colors group"
                    >
                      {/* Date */}
                      <td className="p-4 text-sm text-slate-400 font-mono whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Merchant */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-white text-sm"
                            style={{ backgroundColor: `${catColor}25`, border: `1px solid ${catColor}40`, color: catColor }}
                          >
                            {tx.category.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{tx.category}</p>
                            <p className="text-xs text-slate-500 font-mono">
                              #{tx.id.substring(0, 8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="p-4 text-right">
                        <span className="text-white font-mono font-bold">₹{tx.amount.toFixed(2)}</span>
                      </td>

                      {/* Cashback Earned */}
                      <td className="p-4 text-center">
                        {tx.cashbackEarned > 0 ? (
                          <div className="inline-flex flex-col items-center gap-1">
                            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg font-bold text-sm font-mono">
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              ₹{tx.cashbackEarned.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-mono flex items-center gap-1">
                              <BadgePercent className="w-2.5 h-2.5" />
                              {cashbackPct}% back
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-700 text-xs font-mono">—</span>
                        )}
                      </td>

                      {/* DigiCoins Earned */}
                      <td className="p-4 text-center">
                        {tx.coinsEarned > 0 ? (
                          <div className="inline-flex flex-col items-center gap-1">
                            <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-3 py-1.5 rounded-lg font-bold text-sm font-mono">
                              <Coins className="w-3.5 h-3.5" />
                              +{tx.coinsEarned}
                            </span>
                            <span className="text-[10px] text-yellow-700 font-mono">DigiCoins</span>
                          </div>
                        ) : (
                          <span className="text-slate-700 text-xs font-mono">—</span>
                        )}
                      </td>

                      {/* Net Benefit */}
                      <td className="p-4 text-right">
                        {(tx.cashbackEarned > 0 || tx.coinsEarned > 0) ? (
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-sm font-bold text-white font-mono">
                              ≈ ₹{(tx.cashbackEarned + tx.coinsEarned * 0.1).toFixed(2)}
                            </span>
                            <span className="text-[10px] text-slate-600 font-mono">total rewards</span>
                          </div>
                        ) : (
                          <span className="text-slate-700 text-xs font-mono">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-500 font-mono">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer totals */}
        {!isLoading && filtered.length > 0 && (
          <div className="border-t border-slate-800 px-4 py-3 bg-black/20 flex items-center justify-between flex-wrap gap-4">
            <p className="text-xs text-slate-500 font-mono">
              Showing {filtered.length} of {txs.length} transactions
            </p>
            <div className="flex items-center gap-6 text-sm">
              <span className="text-slate-500">
                Total Spent:{" "}
                <span className="text-white font-bold font-mono">
                  ₹{filtered.reduce((acc, t) => acc + t.amount, 0).toFixed(2)}
                </span>
              </span>
              <span className="text-emerald-400 font-bold font-mono flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                ₹{filtered.reduce((acc, t) => acc + t.cashbackEarned, 0).toFixed(2)} cashback
              </span>
              <span className="text-yellow-400 font-bold font-mono flex items-center gap-1">
                <Coins className="w-3 h-3" />
                {filtered.reduce((acc, t) => acc + t.coinsEarned, 0)} coins
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

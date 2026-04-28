"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { 
  Vault, TrendingUp, Lock, Unlock, Plus, Calculator, 
  ArrowDownLeft, Clock, Sparkles, Info, ChevronRight 
} from "lucide-react";

interface VaultEntry {
  id: string;
  amount: number;
  interest: number;
  date: string;
  type: "deposit" | "interest";
}

const ANNUAL_RATE = 0.085; // 8.5% p.a.
const MONTHLY_RATE = ANNUAL_RATE / 12;
const WITHDRAWAL_THRESHOLD = 1000; // ₹1000 minimum to withdraw

export default function FlexibleRDVault() {
  const { totalBalance, rdBalance, totalWealth, setBalances } = useAppStore();

  // Vault State
  const [vaultEntries, setVaultEntries] = useState<VaultEntry[]>([
    { id: "e1", amount: 200, interest: 0, date: new Date(Date.now() - 86400000 * 30).toISOString(), type: "deposit" },
    { id: "e2", amount: 1.42, interest: 0, date: new Date(Date.now() - 86400000 * 30).toISOString(), type: "interest" },
    { id: "e3", amount: 300, interest: 0, date: new Date(Date.now() - 86400000 * 15).toISOString(), type: "deposit" },
    { id: "e4", amount: 2.13, interest: 0, date: new Date(Date.now() - 86400000 * 15).toISOString(), type: "interest" },
    { id: "e5", amount: 150, interest: 0, date: new Date(Date.now() - 86400000 * 5).toISOString(), type: "deposit" },
    { id: "e6", amount: 0.53, interest: 0, date: new Date(Date.now() - 86400000 * 5).toISOString(), type: "interest" },
  ]);

  const [depositAmount, setDepositAmount] = useState<string>("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Simulator State
  const [simMonthly, setSimMonthly] = useState<string>("500");
  const [simMonths, setSimMonths] = useState<string>("12");

  // Computed values
  const totalDeposited = vaultEntries
    .filter((e) => e.type === "deposit")
    .reduce((acc, e) => acc + e.amount, 0);
  const totalInterest = vaultEntries
    .filter((e) => e.type === "interest")
    .reduce((acc, e) => acc + e.amount, 0);
  const vaultBalance = totalDeposited + totalInterest;
  const canWithdraw = vaultBalance >= WITHDRAWAL_THRESHOLD;
  const progressToWithdraw = Math.min((vaultBalance / WITHDRAWAL_THRESHOLD) * 100, 100);

  const showToast = (msg: string, type: "success" | "error" | "info" = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDeposit = async () => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return showToast("Please enter a valid deposit amount.", "error");
    if (amt > totalBalance) return showToast("Insufficient wallet balance.", "error");
    if (amt < 10) return showToast("Minimum deposit is ₹10.", "error");

    setIsDepositing(true);

    // Optimistic update
    const interestEarned = parseFloat((amt * MONTHLY_RATE).toFixed(2));
    const now = new Date().toISOString();
    
    const newDeposit: VaultEntry = {
      id: `d${Date.now()}`,
      amount: amt,
      interest: 0,
      date: now,
      type: "deposit",
    };
    const newInterest: VaultEntry = {
      id: `i${Date.now()}`,
      amount: interestEarned,
      interest: 0,
      date: now,
      type: "interest",
    };

    setVaultEntries((prev) => [...prev, newDeposit, newInterest]);
    setBalances(totalBalance - amt, rdBalance + amt + interestEarned, totalWealth);
    setDepositAmount("");
    showToast(`₹${amt.toFixed(2)} deposited! +₹${interestEarned} interest accrued this month.`, "success");
    setIsDepositing(false);
  };

  const handleWithdraw = async () => {
    if (!canWithdraw) {
      return showToast(`You need at least ₹${WITHDRAWAL_THRESHOLD} saved to withdraw.`, "error");
    }
    setIsWithdrawing(true);

    setBalances(totalBalance + vaultBalance, rdBalance - vaultBalance, totalWealth);
    setVaultEntries([]);
    showToast(`₹${vaultBalance.toFixed(2)} successfully withdrawn to your wallet!`, "success");
    setIsWithdrawing(false);
  };

  // Simulator calculation
  const calcSimulation = () => {
    const monthly = parseFloat(simMonthly) || 0;
    const months = parseInt(simMonths) || 0;
    let balance = 0;
    let totalInt = 0;
    for (let i = 0; i < months; i++) {
      balance += monthly;
      const monthInterest = balance * MONTHLY_RATE;
      balance += monthInterest;
      totalInt += monthInterest;
    }
    return {
      finalBalance: balance,
      totalDeposited: monthly * months,
      totalInterest: totalInt,
    };
  };

  const sim = calcSimulation();

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col gap-8 relative">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 border px-6 py-4 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 flex items-center gap-4 min-w-[300px]"
          style={{
            borderColor:
              toast.type === "success"
                ? "#10b981"
                : toast.type === "error"
                ? "#f43f5e"
                : "#00f0ff",
          }}
        >
          <div className="flex flex-col">
            <span
              className="text-xs uppercase tracking-widest font-mono font-bold"
              style={{
                color:
                  toast.type === "success"
                    ? "#10b981"
                    : toast.type === "error"
                    ? "#f43f5e"
                    : "#00f0ff",
              }}
            >
              {toast.type === "success" ? "VAULT RECEIPT" : toast.type === "error" ? "ERROR" : "INFO"}
            </span>
            <span className="text-white font-medium">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
            <Vault className="text-emerald-400 w-8 h-8" />
            Flexible RD Vault
          </h1>
          <p className="text-slate-400">
            Auto-save with{" "}
            <span className="text-emerald-400 font-bold">8.5% p.a.</span> interest. Withdraw
            after saving ₹{WITHDRAWAL_THRESHOLD.toLocaleString()}.
          </p>
        </div>

        {/* Rate Badge */}
        <div className="glass-card px-5 py-3 border border-emerald-500/30 flex items-center gap-3">
          <TrendingUp className="text-emerald-400 w-5 h-5" />
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Annual Rate</p>
            <p className="text-xl font-bold text-emerald-400">8.5% p.a.</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Deposited */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 blur-[30px] group-hover:bg-emerald-500/10 transition-all" />
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Total Deposited</p>
          <p className="text-3xl font-black text-white">₹{totalDeposited.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-1">Principal amount saved</p>
        </div>

        {/* Interest Earned */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 blur-[30px] group-hover:bg-amber-500/10 transition-all" />
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-amber-400" /> Interest Earned
          </p>
          <p className="text-3xl font-black text-amber-400">₹{totalInterest.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-1">Free money accrued 🎉</p>
        </div>

        {/* Vault Balance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 blur-[30px] group-hover:bg-cyan-500/10 transition-all" />
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Vault Balance</p>
          <p className="text-3xl font-black text-white">₹{vaultBalance.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-1">Principal + Interest</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Left: Deposit & Withdraw */}
        <div className="flex flex-col gap-6">
          {/* Deposit Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="text-emerald-400 w-5 h-5" /> Add to Vault
            </h3>

            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
              <input
                type="number"
                min="10"
                step="10"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-4 text-white text-xl font-bold focus:outline-none transition-colors"
              />
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {[100, 250, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setDepositAmount(String(amt))}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-500/10 hover:border-emerald-500 border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-emerald-400 transition-all font-medium"
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            {depositAmount && parseFloat(depositAmount) > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 mb-4 text-sm">
                <p className="text-slate-400">
                  Est. monthly interest:{" "}
                  <span className="text-emerald-400 font-bold">
                    +₹{(parseFloat(depositAmount) * MONTHLY_RATE).toFixed(2)}
                  </span>
                </p>
              </div>
            )}

            <button
              onClick={handleDeposit}
              disabled={isDepositing || !depositAmount || parseFloat(depositAmount) <= 0}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              {isDepositing ? "Processing..." : "Deposit to Vault"}
            </button>
          </div>

          {/* Withdrawal Lock */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              {canWithdraw ? (
                <Unlock className="text-emerald-400 w-5 h-5" />
              ) : (
                <Lock className="text-slate-500 w-5 h-5" />
              )}
              Withdrawal Gate
            </h3>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">
                  ₹{vaultBalance.toFixed(2)} saved
                </span>
                <span className="text-slate-400">Goal: ₹{WITHDRAWAL_THRESHOLD}</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progressToWithdraw}%`,
                    background: canWithdraw
                      ? "linear-gradient(90deg, #10b981, #34d399)"
                      : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                  }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {canWithdraw ? (
                  <span className="text-emerald-400 font-bold">✓ Threshold reached! Ready to withdraw.</span>
                ) : (
                  `₹${(WITHDRAWAL_THRESHOLD - vaultBalance).toFixed(2)} more to unlock withdrawal`
                )}
              </p>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={!canWithdraw || isWithdrawing}
              className={`w-full py-3 font-bold rounded-xl transition-all ${
                canWithdraw
                  ? "bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  : "bg-slate-800 text-slate-600 cursor-not-allowed"
              }`}
            >
              {isWithdrawing
                ? "Processing..."
                : canWithdraw
                ? `Withdraw ₹${vaultBalance.toFixed(2)}`
                : `🔒 Locked — Save ₹${WITHDRAWAL_THRESHOLD}`}
            </button>

            {!canWithdraw && (
              <div className="flex items-start gap-2 mt-3 text-xs text-slate-500">
                <Info className="w-3 h-3 shrink-0 mt-0.5" />
                <span>
                  The vault enforces a minimum ₹{WITHDRAWAL_THRESHOLD} savings target to build disciplined saving habits.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Transaction Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="text-cyan-400 w-5 h-5" /> Vault Activity
          </h3>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {vaultEntries.length === 0 ? (
              <div className="text-center py-12 text-slate-600">
                <Vault className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-mono text-sm">No vault activity yet.</p>
                <p className="text-xs mt-1">Make your first deposit to start earning!</p>
              </div>
            ) : (
              [...vaultEntries].reverse().map((entry) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    entry.type === "deposit"
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-amber-500/5 border-amber-500/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        entry.type === "deposit"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {entry.type === "deposit" ? (
                        <Plus className="w-4 h-4" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {entry.type === "deposit" ? "Deposit" : "Interest Credit"}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {new Date(entry.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold font-mono ${
                        entry.type === "deposit" ? "text-white" : "text-amber-400"
                      }`}
                    >
                      +₹{entry.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-600">
                      {entry.type === "deposit" ? "principal" : "8.5% p.a."}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Interest Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Calculator className="text-violet-400 w-6 h-6" />
          Interest Simulator
          <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded-lg">
            See how much you can earn
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Inputs */}
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-widest font-bold block mb-2">
              Monthly Deposit
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="100"
                step="100"
                value={simMonthly}
                onChange={(e) => setSimMonthly(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-violet-500 rounded-xl pl-8 pr-4 py-3 text-white font-bold focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 uppercase tracking-widest font-bold block mb-2">
              Duration (Months)
            </label>
            <div className="flex gap-2">
              {[6, 12, 24, 36].map((m) => (
                <button
                  key={m}
                  onClick={() => setSimMonths(String(m))}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    simMonths === String(m)
                      ? "bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                      : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">You Deposit</p>
                <p className="text-lg font-bold text-white">
                  ₹{sim.totalDeposited.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-amber-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Interest
                </p>
                <p className="text-lg font-bold text-amber-400">
                  +₹{sim.totalInterest.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <div className="border-t border-slate-700 mt-3 pt-3">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Final Balance</p>
              <p className="text-2xl font-black text-emerald-400">
                ₹{sim.finalBalance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

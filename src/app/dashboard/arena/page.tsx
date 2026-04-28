"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  Gamepad2, Coins, ArrowRight, Sparkles, Database, Skull, Tv, Music, Zap, Monitor, BookOpen, Film
} from "lucide-react";

// Subscription reward tiers
const SUBSCRIPTIONS = [
  {
    id: "netflix",
    label: "Netflix 1 Month",
    plan: "Standard HD",
    icon: Tv,
    cost: 150,
    value: 649,
    color: "#e50914",
    glow: "rgba(229,9,20,0.3)",
    badge: "Most Popular",
  },
  {
    id: "prime",
    label: "Amazon Prime",
    plan: "Monthly Access",
    icon: Film,
    cost: 100,
    value: 299,
    color: "#00a8e0",
    glow: "rgba(0,168,224,0.3)",
    badge: "",
  },
  {
    id: "spotify",
    label: "Spotify Premium",
    plan: "1 Month",
    icon: Music,
    cost: 60,
    value: 119,
    color: "#1db954",
    glow: "rgba(29,185,84,0.3)",
    badge: "",
  },
  {
    id: "hotstar",
    label: "Disney+ Hotstar",
    plan: "Super Monthly",
    icon: Monitor,
    cost: 80,
    value: 299,
    color: "#002d5b",
    glow: "rgba(0,45,91,0.5)",
    badge: "",
  },
  {
    id: "coursera",
    label: "Coursera Plus",
    plan: "7-Day Access",
    icon: BookOpen,
    cost: 200,
    value: 999,
    color: "#0056d2",
    glow: "rgba(0,86,210,0.3)",
    badge: "Best Value",
  },
  {
    id: "zee5",
    label: "ZEE5 Premium",
    plan: "Monthly",
    icon: Zap,
    cost: 50,
    value: 99,
    color: "#7b2fff",
    glow: "rgba(123,47,255,0.3)",
    badge: "",
  },
];

// Game config — entry coin cost is ~5% of reward (win coins * 20 = roughly the ratio)
// Win rates set to ~10%
const GAMES = [
  {
    id: "cyberflip",
    name: "Cyber Flip",
    desc: "Wager coins on a blockchain coin toss. Fast & fierce.",
    reward: 200,
    coinCost: 10,   // reward/20
    winRate: 0.10,
    color: "cyber-pink",
    borderColor: "border-cyber-pink/50",
    glowColor: "bg-cyber-pink/10",
    glowHover: "group-hover:bg-cyber-pink/20",
    btnClass: "bg-cyber-pink text-white hover:bg-rose-500",
    Icon: Sparkles,
    iconColor: "text-cyber-pink",
    rewardLabel: "₹200 Cashback",
  },
  {
    id: "datamine",
    name: "Data Mine",
    desc: "Scan the blockchain grid. Uncover hidden vaults. One sector holds the jackpot.",
    reward: 1000,
    coinCost: 50,   // reward/20
    winRate: 0.10,
    color: "neon-cyan",
    borderColor: "border-neon-cyan/50",
    glowColor: "bg-neon-cyan/10",
    glowHover: "group-hover:bg-neon-cyan/20",
    btnClass: "border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan hover:text-black",
    Icon: Database,
    iconColor: "text-neon-cyan",
    rewardLabel: "₹1,000 Jackpot",
  },
  {
    id: "doomspin",
    name: "Doom Spin",
    desc: "Extreme risk, extreme reward. Spin the reel for a massive payout.",
    reward: 5000,
    coinCost: 250,  // reward/20
    winRate: 0.10,
    color: "violet-400",
    borderColor: "border-violet-500/50",
    glowColor: "bg-violet-500/10",
    glowHover: "group-hover:bg-violet-500/20",
    btnClass: "bg-violet-600 hover:bg-violet-500 border border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]",
    Icon: Skull,
    iconColor: "text-violet-400",
    rewardLabel: "₹5,000 JACKPOT",
  },
];

export default function ArenaPage() {
  const { digitalCoins, setDigitalCoins, setBalances, totalBalance, totalWealth, rdBalance } = useAppStore();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [mineGridOpen, setMineGridOpen] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [revealedCells, setRevealedCells] = useState<number[]>([]);
  const [winCell, setWinCell] = useState<number | null>(null);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" | "info" = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  const executeArenaAPI = async (coinCost: number, rewardAmt: number, game: string) => {
    const res = await fetch("/api/arena/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coinCost, rewardAmt, game }),
    });
    return res.json();
  };

  // Cyber Flip — 10% win rate, 200 reward, 10 cost
  const handleCyberFlip = async () => {
    const game = GAMES.find((g) => g.id === "cyberflip")!;
    if (digitalCoins < game.coinCost) return showToast(`Need ${game.coinCost} DigiCoins to play Cyber Flip!`, "error");
    setActiveGame("cyberflip");
    setTimeout(async () => {
      const isWin = Math.random() < game.winRate;
      const rewardAmt = isWin ? game.reward : 0;
      await executeArenaAPI(game.coinCost, rewardAmt, game.name);
      // Compute state client-side
      const newCoins = (digitalCoins ?? 0) - game.coinCost;
      const newBalance = (totalBalance ?? 0) + rewardAmt;
      setDigitalCoins(newCoins);
      setBalances(newBalance, rdBalance ?? 0, newBalance + (rdBalance ?? 0));
      showToast(
        isWin ? `🎉 FLIP WON! ₹${game.reward} added to your wallet!` : `Flip lost. Better luck next time!`,
        isWin ? "success" : "error"
      );
      setActiveGame(null);
    }, 1500);
  };

  // Data Mine — 10% win rate, 1000 reward, 50 cost
  const handleDataMineInitiate = () => {
    const game = GAMES.find((g) => g.id === "datamine")!;
    if (digitalCoins < game.coinCost) return showToast(`Need ${game.coinCost} DigiCoins to scan the blockchain!`, "error");
    setMineGridOpen(true);
  };

  const executeDataMine = async (cellIndex: number) => {
    const game = GAMES.find((g) => g.id === "datamine")!;
    setSelectedCell(cellIndex);
    setIsMining(true);
    setTimeout(async () => {
      const isWin = Math.random() < game.winRate;
      const winningIndex = isWin ? cellIndex : Math.floor(Math.random() * 9);
      setWinCell(winningIndex);
      setRevealedCells((prev) => [...prev, cellIndex]);
      const rewardAmt = isWin ? game.reward : 0;
      await executeArenaAPI(game.coinCost, rewardAmt, game.name);
      // Compute state client-side
      const newCoins = (digitalCoins ?? 0) - game.coinCost;
      const newBalance = (totalBalance ?? 0) + rewardAmt;
      setDigitalCoins(newCoins);
      setBalances(newBalance, rdBalance ?? 0, newBalance + (rdBalance ?? 0));
      showToast(
        isWin ? `💰 JACKPOT! ₹${game.reward.toLocaleString()} uncovered!` : `Block empty. Try again!`,
        isWin ? "success" : "error"
      );
      setTimeout(() => {
        setIsMining(false);
        setMineGridOpen(false);
        setSelectedCell(null);
        setRevealedCells([]);
        setWinCell(null);
      }, 3000);
    }, 1500);
  };

  // Doom Spin — 10% win rate, 5000 reward, 250 cost
  const handleDoomSpin = async () => {
    const game = GAMES.find((g) => g.id === "doomspin")!;
    if (digitalCoins < game.coinCost) return showToast(`Need ${game.coinCost} DigiCoins for Doom Spin!`, "error");
    setActiveGame("doomspin");
    setTimeout(async () => {
      const isWin = Math.random() < game.winRate;
      const rewardAmt = isWin ? game.reward : 0;
      await executeArenaAPI(game.coinCost, rewardAmt, game.name);
      // Compute state client-side
      const newCoins = (digitalCoins ?? 0) - game.coinCost;
      const newBalance = (totalBalance ?? 0) + rewardAmt;
      setDigitalCoins(newCoins);
      setBalances(newBalance, rdBalance ?? 0, newBalance + (rdBalance ?? 0));
      showToast(
        isWin ? `[7][7][7] DOOM JACKPOT! ₹${game.reward.toLocaleString()} INJECTED!` : `[2][9][4] Spin failed. Coins lost.`,
        isWin ? "success" : "error"
      );
      setActiveGame(null);
    }, 3000);
  };

  const handleRedeem = async (sub: typeof SUBSCRIPTIONS[0]) => {
    if (digitalCoins < sub.cost) return showToast(`Need ${sub.cost} DigiCoins to redeem ${sub.label}!`, "error");
    setIsRedeeming(true);
    try {
      await executeArenaAPI(sub.cost, 0, `Subscription: ${sub.label}`);
      // Deduct coins client-side
      setDigitalCoins((digitalCoins ?? 0) - sub.cost);
      showToast(`✅ ${sub.label} subscription activated! Check your email for access.`, "success");
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col gap-8 relative">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 border px-6 py-4 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 flex items-center gap-4 min-w-[300px]"
          style={{
            borderColor:
              toast.type === "success" ? "#10b981" : toast.type === "error" ? "#f43f5e" : "#00f0ff",
          }}
        >
          <div className="flex flex-col">
            <span
              className="text-xs uppercase tracking-widest font-mono font-bold"
              style={{
                color:
                  toast.type === "success" ? "#10b981" : toast.type === "error" ? "#f43f5e" : "#00f0ff",
              }}
            >
              {toast.type === "success" ? "SYSTEM RECEIPT" : "TRANSACTION ALERT"}
            </span>
            <span className="text-white font-medium">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-2 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
            <Gamepad2 className="text-cyber-pink w-8 h-8" />
            Cashback Arena
          </h1>
          <p className="text-slate-400">
            Use your DigiCoins to win cashback or redeem premium subscriptions.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Arena Balance</p>
          <p className="text-3xl font-bold text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)] flex items-center gap-2">
            <Coins className="w-6 h-6" /> {digitalCoins}
          </p>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {GAMES.map((game) => {
          const isActive = activeGame === game.id || (game.id === "datamine" && mineGridOpen);
          return (
            <div
              key={game.id}
              className={`glass-card p-6 border border-slate-800 flex flex-col hover:${game.borderColor} transition-all group relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${game.glowColor} blur-[40px] pointer-events-none ${game.glowHover} transition-all`} />

              {/* Win Rate Badge */}
              <div className="absolute top-4 right-4 bg-slate-800 border border-slate-700 px-2 py-1 rounded-md text-xs font-bold text-slate-400 font-mono">
                ~10% Win
              </div>

              <h3 className={`text-xl font-bold text-white mb-1 flex items-center gap-2`}>
                <game.Icon className={`${game.iconColor} w-5 h-5`} /> {game.name}
              </h3>

              {/* Entry cost pill */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                  <Coins className="w-3 h-3" /> {game.coinCost} entry
                </span>
                <span className="text-xs text-slate-500">→</span>
                <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                  {game.rewardLabel}
                </span>
              </div>

              <p className="text-sm text-slate-400 mb-6">{game.desc}</p>

              <div className="mt-auto">
                {game.id === "cyberflip" && (
                  <button
                    onClick={handleCyberFlip}
                    disabled={!!activeGame}
                    className={`w-full ${game.btnClass} py-3 font-bold uppercase rounded-lg transition-all disabled:opacity-50`}
                  >
                    {activeGame === "cyberflip" ? "Flipping..." : `Flip (${game.coinCost} Coins)`}
                  </button>
                )}
                {game.id === "datamine" && (
                  <button
                    onClick={handleDataMineInitiate}
                    disabled={isMining || mineGridOpen}
                    className={`w-full ${game.btnClass} py-3 font-bold uppercase rounded-lg transition-all disabled:opacity-50`}
                  >
                    Mine Block ({game.coinCost} Coins)
                  </button>
                )}
                {game.id === "doomspin" && (
                  <button
                    onClick={handleDoomSpin}
                    disabled={!!activeGame}
                    className={`w-full ${game.btnClass} py-3 font-bold uppercase rounded-lg transition-all disabled:opacity-50`}
                  >
                    {activeGame === "doomspin" ? "Spinning..." : `Pull Lever (${game.coinCost} Coins)`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscription Store */}
      <div>
        <h2 className="text-xl font-bold font-mono tracking-widest text-slate-300 border-b border-slate-800 pb-4 mb-6 flex items-center gap-3">
          <Tv className="w-5 h-5 text-cyber-pink" />
          Subscription Store
          <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded-lg font-sans normal-case tracking-normal">
            Redeem DigiCoins for real subscriptions
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBSCRIPTIONS.map((sub) => {
            const canAfford = digitalCoins >= sub.cost;
            return (
              <div
                key={sub.id}
                className="glass-card border border-slate-800 p-5 rounded-xl hover:border-slate-600 transition-all group relative overflow-hidden flex flex-col gap-4"
              >
                {sub.badge && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {sub.badge}
                  </div>
                )}

                {/* Icon & Name */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: `${sub.color}20`, border: `1px solid ${sub.color}40` }}
                  >
                    <sub.icon className="w-6 h-6" style={{ color: sub.color }} />
                  </div>
                  <div>
                    <p className="font-bold text-white">{sub.label}</p>
                    <p className="text-xs text-slate-500">{sub.plan}</p>
                  </div>
                </div>

                {/* Cost & Value */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Worth</p>
                    <p className="text-lg font-bold text-white">₹{sub.value}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">You Pay</p>
                    <p className="text-lg font-bold text-yellow-400 flex items-center gap-1">
                      <Coins className="w-4 h-4" /> {sub.cost}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRedeem(sub)}
                  disabled={!canAfford || isRedeeming}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    canAfford
                      ? "bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/20"
                      : "bg-slate-800 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  {canAfford ? (
                    <>Redeem <ArrowRight className="w-4 h-4" /></>
                  ) : (
                    `Need ${sub.cost - digitalCoins} more coins`
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Mine Grid Modal */}
      {mineGridOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-neon-cyan/50 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] w-full max-w-md relative overflow-hidden">
            <h2 className="text-2xl font-bold text-white mb-1">
              <Database className="inline w-6 h-6 text-neon-cyan mr-2" /> Select Target Node
            </h2>
            <p className="text-slate-400 font-mono text-sm mb-6">
              Choose a sector to decrypt. Wager: 50 DigiCoins. Win: ₹1,000
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
                let statusStyle = "border-slate-700 bg-slate-800 hover:border-neon-cyan hover:bg-neon-cyan/10 cursor-pointer";
                let content = "?";

                if (selectedCell !== null && selectedCell !== idx && winCell !== idx) {
                  statusStyle = "border-slate-800 bg-slate-900 opacity-50 cursor-not-allowed";
                } else if (winCell === idx) {
                  statusStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-400";
                  content = "₹1K";
                } else if (revealedCells.includes(idx)) {
                  statusStyle = "border-rose-500 bg-rose-500/20 text-rose-400";
                  content = "NULL";
                } else if (selectedCell === idx && isMining) {
                  statusStyle = "border-neon-cyan bg-neon-cyan/20 animate-pulse text-neon-cyan border-2";
                  content = "...";
                }

                return (
                  <div
                    key={idx}
                    onClick={() => !isMining && executeDataMine(idx)}
                    className={`aspect-square rounded-xl border flex items-center justify-center text-xl font-bold font-mono transition-all select-none ${statusStyle}`}
                  >
                    {content}
                  </div>
                );
              })}
            </div>

            <button
              disabled={isMining}
              onClick={() => setMineGridOpen(false)}
              className="w-full py-3 text-slate-400 hover:text-white border border-slate-700 rounded-lg hover:bg-slate-800 font-medium transition-colors disabled:hidden"
            >
              Abort Scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

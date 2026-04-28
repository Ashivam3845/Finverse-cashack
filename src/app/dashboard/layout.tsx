"use client";

import { useAppStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Wallet, Activity, Home, LogOut, TrendingUp, User, Coins, Gamepad2, FileText, Crown, Briefcase, Settings, ArrowRightLeft, ChevronDown } from "lucide-react";
import { ChatBot } from "@/components/ChatBot";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout, totalBalance, rdBalance, totalWealth, digitalCoins } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-16 h-16 border-4 border-cyber-neon border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const navLinks = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Exchange", href: "/dashboard/exchange", icon: TrendingUp },
    { name: "RD Vault", href: "/dashboard/portfolio", icon: Briefcase },
    { name: "Pay", href: "/dashboard/pay", icon: Wallet },
    { name: "Cashback Arena", href: "/dashboard/arena", icon: Gamepad2 },
    { name: "Ledger", href: "/dashboard/ledger", icon: FileText },
    { name: "Insights", href: "/dashboard/insights", icon: Activity },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-cyber-neon/30">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 glass-card m-4 mr-2 flex flex-col items-center py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-pink/10 blur-3xl rounded-full" />
        
        <h2 className="text-2xl font-bold font-mono tracking-tight text-white mb-10">
          FinFlow <span className="text-neon-cyan">AI</span>
        </h2>
        
        <nav className="w-full px-4 flex-1 space-y-2 relative z-10">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.name} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${active ? 'bg-cyber-neon/10 border border-cyber-neon/50 text-cyber-neon shadow-[0_0_15px_rgba(0,240,255,0.15)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <link.icon className={`w-5 h-5 ${active ? 'text-cyber-neon' : ''}`} />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}

          {user?.email === "admin@finflow.com" && (
            <Link href="/dashboard/admin" className={`flex items-center gap-3 px-4 py-3 mt-4 rounded-xl transition-all duration-300 ${pathname === '/dashboard/admin' ? 'bg-amber-500/10 border border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)]' : 'text-amber-500/50 hover:text-amber-400 hover:bg-amber-500/5'}`}>
              <Crown className="w-5 h-5" />
              <span className="font-bold">Master Control</span>
            </Link>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 m-4 ml-2 gap-4 h-[calc(100vh-2rem)]">
        {/* Global State Header */}
        <header className="glass-card h-20 flex-shrink-0 flex items-center justify-between px-8 relative z-50">
           <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute top-0 right-1/4 w-32 h-32 bg-cyber-neon/10 blur-3xl rounded-full" />
           </div>
           <div className="flex gap-12 relative z-10">
              <div>
                <p className="text-xs text-slate-400 font-mono mb-1 uppercase tracking-wider">Total Wealth</p>
                <p className="text-xl font-bold text-white tracking-tight">₹{totalWealth.toLocaleString('en-IN', {minimumFractionDigits:2})}</p>
              </div>
              <div className="h-8 w-px bg-slate-800 self-center"></div>
              <div>
                <p className="text-xs text-slate-400 font-mono mb-1 uppercase tracking-wider">Available Cash</p>
                <p className="text-xl font-medium text-cyber-neon tracking-tight drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">₹{totalBalance.toLocaleString('en-IN', {minimumFractionDigits:2})}</p>
              </div>
              <div className="h-8 w-px bg-slate-800 self-center"></div>
              <div>
                <p className="text-xs text-slate-400 font-mono mb-1 uppercase tracking-wider">RD Balance</p>
                <p className="text-xl font-medium text-cyber-pink tracking-tight drop-shadow-[0_0_5px_rgba(255,0,60,0.5)]">₹{rdBalance.toLocaleString('en-IN', {minimumFractionDigits:2})}</p>
              </div>
              <div className="h-8 w-px bg-slate-800 self-center"></div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-xs text-slate-400 font-mono mb-1 uppercase tracking-wider">Digital Coins</p>
                <p className="text-xl font-bold text-yellow-400 tracking-tight flex items-center gap-1 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"><Coins className="w-5 h-5"/>{digitalCoins}</p>
              </div>
           </div>
           
           <div className="flex items-center gap-6 text-sm relative z-10">
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 bg-slate-900 border border-slate-700 hover:border-cyber-neon/50 px-4 py-2 rounded-full transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-cyber-pink overflow-hidden border border-cyber-pink">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}&backgroundColor=ff003c`} alt="Avatar" className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-white leading-tight">{user?.name || 'Operator'}</span>
                    <span className="text-[10px] text-slate-400 font-mono leading-tight flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyber-neon animate-pulse shadow-[0_0_5px_#00f0ff]"></div>
                      ONLINE
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden py-2 animate-in slide-in-from-top-2 z-50">
                     <div className="px-4 py-3 border-b border-slate-800 mb-2">
                       <p className="text-xs text-slate-500 font-mono">Connected as</p>
                       <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                     </div>
                     <Link href="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                       <User className="w-4 h-4" /> Profile Matrix
                     </Link>
                     <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                       <Settings className="w-4 h-4" /> Global Settings
                     </button>
                     <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                       <ArrowRightLeft className="w-4 h-4" /> Switch Account
                     </button>
                     <div className="h-px bg-slate-800 my-2"></div>
                     <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors">
                       <LogOut className="w-4 h-4" /> Terminate Session
                     </button>
                  </div>
                )}
              </div>
           </div>
        </header>

        {/* Page Content */}
        <div className="glass-card flex-1 overflow-y-auto p-8 relative">
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-cyber-pink/5 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />
          {children}
        </div>
      </main>
      
      {/* Global Support Widget */}
      <ChatBot />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { loginUser } from "@/lib/auth-local";
import { useAppStore } from "@/lib/store";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = loginUser(email, password);
    if (result.success && result.user) {
      login(result.user);
      router.push("/dashboard");
    } else {
      setError(result.error || "Login failed.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-pink/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-neon/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="glass-card w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-mono tracking-tight text-white mb-2">
            FinFlow <span className="text-neon-cyan">AI</span>
          </h1>
          <p className="text-slate-400">Welcome back. Enter the grid.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-cyber-pink/10 border border-cyber-pink/40 rounded-xl text-cyber-pink text-sm">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon transition-all"
              placeholder="operator@finflow.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-cyber w-full mt-2 disabled:opacity-50">
            {loading ? "Authenticating..." : "Initialize Session"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          First time in the network?{" "}
          <Link href="/register" className="text-cyber-neon hover:underline hover:text-white transition-colors">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}

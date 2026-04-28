"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyber-pink/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyber-neon/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="glass-card w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-mono tracking-tight text-white mb-2">
            FinFlow <span className="text-neon-pink">ID</span>
          </h1>
          <p className="text-slate-400">Join the algorithmic revolution.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-cyber-pink/10 border border-cyber-pink/40 rounded-xl text-cyber-pink text-sm">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Alias / Name</label>
            <input
              type="text"
              required
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all"
              placeholder="Neo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all"
              placeholder="neo@matrix.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-cyber w-full mt-2 !border-cyber-pink !text-cyber-pink hover:!bg-cyber-pink hover:!text-white hover:shadow-[0_0_20px_#ff003c]">
            Generate Node ID
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already authorized?{" "}
          <Link href="/login" className="text-cyber-pink hover:underline hover:text-white transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

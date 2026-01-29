"use client";

import React, { useState } from "react";
import { auth } from "@/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Loader2, Moon, Zap } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#000c1d]">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[180px] rounded-full opacity-40"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[150px] rounded-full opacity-30"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="glass p-8 lg:p-12 rounded-[3rem] lg:rounded-[4rem] border-white/10 space-y-8 shadow-2xl">
                    <div className="text-center space-y-2">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-secondary/10 rounded-2xl">
                                <Moon className="text-secondary w-10 h-10 floating" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-black gold-text tracking-tighter">WELCOME BACK</h1>
                        <p className="text-blue-100/30 text-xs font-bold tracking-widest uppercase">Login to Sehrify AI</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-blue-100/40 tracking-widest uppercase ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 group-focus-within:text-secondary transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/5 rounded-[2rem] py-5 pl-14 pr-4 text-white focus:border-secondary transition-all outline-none font-bold text-lg"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-blue-100/40 tracking-widest uppercase ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 group-focus-within:text-secondary transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/5 rounded-[2rem] py-5 pl-14 pr-4 text-white focus:border-secondary transition-all outline-none font-bold text-lg"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-3xl text-xs font-bold text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-secondary to-accent py-6 rounded-[2.5rem] text-black font-black text-xl flex items-center justify-center gap-4 hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-secondary/20 disabled:opacity-50 group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-white/30 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>LOGIN <LogIn className="w-6 h-6" /></>}
                        </button>
                    </form>

                    <p className="text-center text-blue-100/40 text-sm font-medium">
                        New here? <Link href="/auth/signup" className="text-secondary hover:underline font-bold">Create account</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

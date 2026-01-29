"use client";

import React, { useEffect, useState } from "react";
import {
    Calendar,
    Trash2,
    Printer,
    ChefHat,
    ShoppingCart,
    Clock,
    Utensils,
    Zap,
    Star,
    Flame,
    Loader2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [days, setDays] = useState(0);
    const [selectedDay, setSelectedDay] = useState(1);
    const [dayContent, setDayContent] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchPlan = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, "plans", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const fullPlan = data.fullPlan;
                    const savedDays = parseInt(data.planDays || "0");
                    setDays(savedDays);
                    // More robust split regex that handles various day formats
                    const blocks = fullPlan.split(/(?=# (?:Day|Day:)\s*\d+)|(?=## (?:Day|Day:)\s*\d+)/i)
                        .filter((p: string) => p.trim().length > 0 && p.toLowerCase().includes("day"));
                    setDayContent(blocks);
                }
            } catch (err) {
                console.error("Error fetching plan:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPlan();
        }
    }, [user]);

    const clearPlan = async () => {
        if (!user) return;
        if (confirm("Are you sure you want to clear your plan from the cloud?")) {
            try {
                await deleteDoc(doc(db, "plans", user.uid));
                window.location.href = "/";
            } catch (err) {
                console.error("Error clearing plan:", err);
            }
        }
    };

    if (authLoading || (loading && user)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#000c1d] text-white">
                <Loader2 className="w-12 h-12 text-secondary animate-spin mb-4" />
                <p className="text-blue-100/40 font-black uppercase tracking-widest">Syncing with Cloud...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen px-4 lg:px-20 py-8 lg:py-12 pb-32 lg:pb-12 bg-transparent text-foreground relative">
            {/* Decorative Lanterns */}
            <div className="absolute top-0 left-0 w-full h-[300px] pointer-events-none overflow-hidden opacity-10 lg:opacity-20 no-print">
                <div className="absolute top-10 left-[5%] lg:left-[10%] floating"><img src="https://img.icons8.com/color/96/000000/lantern.png" className="w-12 h-12 lg:w-16 lg:h-16" /></div>
                <div className="absolute top-20 right-[5%] lg:right-[15%] floating" style={{ animationDelay: '1s' }}><img src="https://img.icons8.com/color/96/000000/lantern.png" className="w-10 h-10 lg:w-12 lg:h-12" /></div>
                <div className="absolute top-5 left-[30%] lg:left-[40%] floating" style={{ animationDelay: '2s' }}><img src="https://img.icons8.com/color/96/000000/lantern.png" className="w-16 h-16 lg:w-20 lg:h-20" /></div>
            </div>

            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8 mb-10 lg:mb-16 relative z-10">
                <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                        <span className="px-3 py-1 bg-secondary text-black text-[10px] font-black uppercase tracking-tighter rounded-md">Pro SaaS v3.0 Cloud</span>
                        <div className="h-[1px] w-8 lg:w-12 bg-blue-500/20"></div>
                        <span className="text-secondary flex items-center gap-1 text-[10px] lg:text-xs font-bold uppercase tracking-widest"><Flame className="w-3 h-3" /> {user.displayName || "Blessed User"}</span>
                    </div>
                    <h1 className="text-4xl lg:text-7xl font-black gold-text tracking-tighter leading-none mb-4 uppercase">
                        {user.displayName?.split(' ')[0] || "MY"} DASHBOARD
                    </h1>
                    <p className="text-blue-200/40 text-sm lg:text-lg max-w-xl mx-auto lg:mx-0">Cloud-synced spiritual journey for {user.email}.</p>
                </div>

                <div className="flex justify-center lg:justify-end gap-3 lg:gap-4 no-print">
                    <button onClick={() => window.print()} className="glass p-4 lg:p-5 rounded-2xl lg:rounded-[2rem] hover:bg-white/10 transition-all text-blue-200 border-white/5 active:scale-95">
                        <Printer className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                    <button onClick={clearPlan} className="glass p-4 lg:p-5 rounded-2xl lg:rounded-[2rem] hover:bg-red-500/10 transition-all text-red-400 border-red-500/10 active:scale-95 group">
                        <Trash2 className="w-5 h-5 lg:w-6 lg:h-6 group-hover:rotate-12 transition-transform" />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 relative z-10">
                {/* Day Selector - Horizontal on Mobile */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="glass p-6 lg:p-8 rounded-[2.5rem] lg:rounded-[3rem] border-white/5 lg:sticky lg:top-12">
                        <div className="flex items-center justify-between mb-4 lg:mb-8">
                            <h3 className="text-lg lg:text-xl font-bold flex items-center gap-2 text-white">
                                <Calendar className="w-5 h-5 text-secondary" /> Calendar
                            </h3>
                            <span className="text-[10px] text-blue-200/30 font-mono tracking-widest uppercase">{days} Days</span>
                        </div>

                        <div className="flex lg:grid lg:grid-cols-3 gap-2 lg:gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 no-scrollbar">
                            {Array.from({ length: days }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDay(i + 1)}
                                    className={`flex-shrink-0 relative w-12 lg:w-full h-12 lg:h-auto lg:p-4 rounded-xl lg:rounded-2xl text-center font-bold text-sm transition-all overflow-hidden ${selectedDay === i + 1
                                        ? "bg-secondary text-black"
                                        : "bg-white/5 text-blue-100/30 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    <span className="lg:inline">{i + 1}</span>
                                    {selectedDay === i + 1 && (
                                        <motion.div layoutId="dayIndicator" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 lg:w-3 h-[2px] bg-black/40 rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>
                        {days === 0 && (
                            <p className="text-[10px] text-blue-100/20 font-bold uppercase tracking-widest text-center py-4">No active plan found</p>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9 space-y-8 lg:space-y-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedDay}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="glass rounded-[3rem] lg:rounded-[4rem] border-white/10 overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 lg:p-20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-[200px] lg:w-[400px] h-[200px] lg:h-[400px] bg-secondary/5 blur-[80px] lg:blur-[120px] -z-10 pointer-events-none"></div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 lg:mb-16">
                                    <div className="space-y-4 text-center lg:text-left">
                                        <div className="flex flex-col lg:flex-row items-center gap-4">
                                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-lg shadow-secondary/20">
                                                <Star className="text-black w-6 lg:w-8 h-6 lg:h-8 font-black" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-secondary font-black uppercase tracking-widest">Blessed Journey</p>
                                                <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter">Day {selectedDay}</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose prose-invert prose-blue max-w-none 
                                   prose-h2:text-xl lg:prose-h2:text-3xl prose-h2:font-bold prose-h2:text-blue-400 prose-h2:mt-8 lg:prose-h2:mt-12 prose-h2:mb-4 lg:prose-h2:mb-6
                                   prose-p:text-blue-100/70 prose-p:text-base lg:prose-p:text-xl prose-p:leading-relaxed
                                   prose-li:text-blue-100/80 prose-li:text-sm lg:prose-li:text-lg">
                                    {dayContent[selectedDay - 1] ? (
                                        <ReactMarkdown
                                            components={{
                                                h1: ({ node, ...props }) => <h1 {...props} className="hidden" />,
                                                h2: ({ node, ...props }) => <h2 {...props} className="flex items-center gap-3 lg:gap-4 group cursor-default !mt-12 !mb-8 text-2xl lg:text-4xl">
                                                    <span className="w-1.5 h-8 lg:h-10 bg-secondary rounded-full group-hover:scale-y-110 transition-transform shadow-[0_0_15px_rgba(246,224,94,0.4)]"></span>
                                                    <span className="gold-text uppercase tracking-tighter">{props.children}</span>
                                                </h2>,
                                                ul: ({ node, ...props }) => <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 list-none p-0 !my-8" {...props} />,
                                                li: ({ node, ...props }) => (
                                                    <li className="glass p-5 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border-white/5 hover:border-secondary/20 transition-all group flex items-start gap-4 lg:gap-6 shadow-xl">
                                                        <div className="p-2.5 bg-secondary/5 rounded-xl group-hover:bg-secondary/10 transition-colors shrink-0">
                                                            <Zap className="w-4 lg:w-5 h-4 lg:h-5 text-secondary" />
                                                        </div>
                                                        <span className="flex-grow pt-1 text-blue-50 text-base lg:text-xl font-medium leading-[1.6]">{props.children}</span>
                                                    </li>
                                                ),
                                                table: ({ node, ...props }) => (
                                                    <div className="my-8 overflow-x-auto rounded-2xl lg:rounded-[2.5rem] border border-white/5 no-scrollbar">
                                                        <table className="min-w-full bg-white/5 text-left border-collapse" {...props} />
                                                    </div>
                                                ),
                                                th: ({ node, ...props }) => <th className="p-4 lg:p-6 bg-white/10 font-black text-secondary uppercase text-[8px] lg:text-[10px] tracking-widest border-b border-white/10" {...props} />,
                                                td: ({ node, ...props }) => <td className="p-4 lg:p-6 border-b border-white/5 text-blue-100/60 text-xs lg:text-base" {...props} />,
                                            }}
                                        >
                                            {dayContent[selectedDay - 1]}
                                        </ReactMarkdown>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 lg:py-40 text-blue-200/10 text-center">
                                            {loading ? (
                                                <Loader2 className="w-12 h-12 animate-spin text-secondary mb-4" />
                                            ) : (
                                                <ChefHat className="w-20 lg:w-32 h-20 lg:h-32 mb-6 lg:mb-8 animate-pulse" />
                                            )}
                                            <p className="text-xl lg:text-3xl font-black italic">
                                                {loading ? "Fetching From Cloud..." : (days === 0 ? "No plan found. Go to home to generate." : "Planning Your Blessed Meals...")}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Quick Stats on Mobile - Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pb-10">
                        {[
                            { label: "Wellness", title: "Fiber Intake", text: "Eat whole grains for Suhoor to stay full longer.", icon: Clock, color: "text-secondary", border: "hover:border-secondary/20" },
                            { label: "Shopping", title: "Bulk Buying", text: "Buy dates in bulk to save money.", icon: ShoppingCart, color: "text-primary", border: "hover:border-primary/20" },
                            { label: "Chef Tip", title: "Healthy Frying", text: "Use an air fryer for Iftar snacks.", icon: Utensils, color: "text-accent", border: "hover:border-accent/20" }
                        ].map((card, i) => (
                            <div key={i} className={`glass p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] border-white/5 relative overflow-hidden group transition-all ${card.border}`}>
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><card.icon className="w-20 lg:w-32 h-20 lg:h-32" /></div>
                                <p className={`${card.color} font-black text-[10px] uppercase tracking-widest mb-3 lg:mb-4`}>{card.label}</p>
                                <h4 className="text-xl lg:text-2xl font-bold text-white mb-2 lg:mb-4">{card.title}</h4>
                                <p className="text-blue-200/40 text-xs lg:text-sm leading-relaxed">{card.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

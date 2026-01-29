"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Wallet,
  ChefHat,
  Send,
  Loader2,
  Moon,
  Zap,
  Star,
  LogIn,
  UserPlus
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({
    familySize: "4",
    dailyBudget: "2000",
    days: "7",
    cuisineType: "Pakistani Desi",
    ageGroups: "Adults and kids",
    equipment: "Stove, Oven",
    foodItems: "Chicken, Lentils, Dates",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "days") {
      const val = parseInt(value);
      if (val > 30) return;
    }
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const generatePlan = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    let fullPlan = "";
    const totalDays = parseInt(formData.days);
    const chunkSize = 5;

    const generateSegment = (startDay: number): Promise<void> => {
      return new Promise((resolve, reject) => {
        const endDay = Math.min(startDay + chunkSize - 1, totalDays);
        setStatus(`Syncing Days ${startDay}-${endDay}...`);

        const websocket = new WebSocket('wss://backend.buildpicoapps.com/ask_ai_streaming_v2');

        const prompt = `Generate a high-end, professional Ramadan meal plan for Days ${startDay} to ${endDay} (Total Goal: ${totalDays} days). 
        
        CRITICAL FORMAT for EACH day (${startDay} to ${endDay}):
        # Day [Number]
        
        ## Suhoor
        - [Feature Item 1 (e.g., Oat Porridge with Honey)]
        - [Feature Item 2]
        
        ## Iftar
        - [Feature Item 1 (e.g., Dates and Fresh Juice)]
        - [Feature Item 2]
        
        ## Preparation
        - [Step 1]
        - [Step 2]
        
        ## Shopping List
        - [Generic Item 1]
        - [Generic Item 2]

        Context: Family of ${formData.familySize}, Budget PKR ${formData.dailyBudget}/day, ${formData.cuisineType} style.
        IMPORTANT: Use Markdown headings (##) for Suhoor, Iftar, Preparation, and Shopping List sections.`;

        websocket.addEventListener("open", () => {
          websocket.send(JSON.stringify({ appId: "early-ahead", prompt }));
        });

        websocket.addEventListener("message", (event) => {
          fullPlan += event.data;
        });

        websocket.addEventListener("close", (event) => {
          if (event.code === 1000) {
            if (endDay < totalDays) {
              generateSegment(endDay + 1).then(resolve).catch(reject);
            } else {
              resolve();
            }
          } else {
            reject(new Error("Segment failed"));
          }
        });

        websocket.addEventListener("error", (err) => reject(err));
      });
    };

    try {
      await generateSegment(1);

      // Save to Firestore
      await setDoc(doc(db, "plans", user.uid), {
        fullPlan: fullPlan,
        planDays: formData.days,
        updatedAt: new Date().toISOString()
      });

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      // Even if it fails, try to save what we have
      if (fullPlan) {
        await setDoc(doc(db, "plans", user.uid), {
          fullPlan: fullPlan,
          planDays: formData.days,
          updatedAt: new Date().toISOString()
        });
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 lg:p-12 overflow-hidden bg-[#000c1d]">
      <style jsx global>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
        .hero-glow {
          box-shadow: 0 0 100px rgba(246, 224, 94, 0.1);
        }
      `}</style>

      {/* Dynamic Background Elements - Constellation & Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[180px] rounded-full opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[150px] rounded-full opacity-30"></div>

      {/* Decorative Moon/Lantern - Top Right Perspective */}
      <div className="absolute top-10 right-10 opacity-10 lg:opacity-20 pointer-events-none hidden lg:block">
        <Star className="w-12 h-12 text-secondary floating-alternate fill-secondary" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center"
      >
        <div className="lg:col-span-7 space-y-8 lg:space-y-12 text-left">
          <div className="space-y-6 lg:space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2.5 bg-secondary/5 glass rounded-full border border-secondary/20 group hover:border-secondary/40 transition-all cursor-default ml-1 lg:ml-0"
            >
              <Zap className="w-4 h-4 text-secondary fill-secondary animate-pulse" />
              <span className="text-secondary text-[11px] lg:text-xs font-black uppercase tracking-[0.25em]">Ramadan Planner Pro</span>
            </motion.div>

            <div className="space-y-4 text-left w-full overflow-visible">
              <h1 className="text-[11vw] xs:text-5xl sm:text-7xl lg:text-[10rem] font-black text-yellow-300 leading-[1.1] lg:leading-[0.85] tracking-normal filter drop-shadow-[0_10px_30px_rgba(246, 224, 94, 0.5)] py-2 block w-full text-left overflow-visible">
                <span className="inline-block whitespace-nowrap">SEHRIFY</span>
                <span className="text-white inline-block mt-[-0.1em]">&nbsp;AI</span>
              </h1>
              <p className="text-blue-200/40 text-[10px] lg:text-sm font-black uppercase tracking-[0.4em] ml-0 lg:ml-4 text-left">
                AI-Powered Iftar & Suhoor Management
              </p>
            </div>

            <p className="text-blue-100/60 text-xl lg:text-3xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium px-4 lg:px-0">
              Personalized meal planning for a <span className="text-white border-b-2 border-secondary/30">blessed and healthy</span> Ramadan journey.
            </p>
          </div>

          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/login" className="px-8 py-4 bg-secondary text-black rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-[1.05] transition-all">
                <LogIn className="w-5 h-5" /> START JOURNEY
              </Link>
              <Link href="/auth/signup" className="px-8 py-4 glass text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                <UserPlus className="w-5 h-5" /> CREATE ACCOUNT
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 py-4 px-6 glass rounded-2xl w-fit">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center font-black text-secondary">
                {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-blue-100/30 text-[10px] font-black uppercase tracking-widest">Active Member</p>
                <p className="text-white font-black">{user.displayName || user.email}</p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 px-4 lg:px-0 pb-20 lg:pb-0">
          <div className="glass p-10 lg:p-14 rounded-[4rem] lg:rounded-[5rem] border-white/10 space-y-10 lg:space-y-12 relative shadow-2xl hero-glow">
            <div className="space-y-1">
              <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-2xl"><Moon className="text-secondary w-8 h-8" /></div> Launchpad
              </h2>
              <p className="text-blue-100/30 text-xs font-bold tracking-widest uppercase ml-1">Configure your 2026 experience</p>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-blue-100/40 tracking-widest uppercase ml-1">Family Units</label>
                  <div className="relative group">
                    <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 group-focus-within:text-secondary transition-colors" />
                    <input id="familySize" type="number" value={formData.familySize} onChange={handleInputChange} className="w-full bg-white/5 border border-white/5 rounded-[2rem] py-5 pl-14 pr-4 text-white focus:border-secondary transition-all outline-none font-bold text-lg" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-blue-100/40 tracking-widest uppercase ml-1">Plan Period</label>
                  <div className="relative group">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 group-focus-within:text-secondary transition-colors" />
                    <input id="days" type="number" min="1" max="30" value={formData.days} onChange={handleInputChange} className="w-full bg-white/5 border border-white/5 rounded-[2rem] py-5 pl-14 pr-4 text-white focus:border-secondary transition-all outline-none font-bold text-lg" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-blue-100/40 tracking-widest uppercase ml-1">Budget Allocation (PKR)</label>
                <div className="relative group">
                  <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 group-focus-within:text-secondary transition-colors" />
                  <input id="dailyBudget" type="number" value={formData.dailyBudget} onChange={handleInputChange} className="w-full bg-white/5 border border-white/5 rounded-[2rem] py-5 pl-14 pr-4 text-white focus:border-secondary transition-all outline-none font-bold text-lg" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-blue-100/40 tracking-widest uppercase ml-1">Kitchen Preferences</label>
                <div className="relative group">
                  <ChefHat className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 group-focus-within:text-secondary transition-colors" />
                  <input id="cuisineType" type="text" value={formData.cuisineType} onChange={handleInputChange} className="w-full bg-white/5 border border-white/5 rounded-[2rem] py-5 pl-14 pr-4 text-white focus:border-secondary transition-all outline-none font-bold text-lg" placeholder="Desi, Arab, Healthy" />
                </div>
              </div>
            </div>

            <button
              onClick={generatePlan}
              disabled={loading}
              className="w-full bg-gradient-to-r from-secondary to-accent py-6 lg:py-8 rounded-[2rem] lg:rounded-[3rem] text-black font-black text-lg lg:text-2xl flex items-center justify-center gap-2 lg:gap-4 hover:scale-[1.03] active:scale-95 transition-all shadow-2xl shadow-secondary/30 disabled:opacity-50 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/30 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              {loading ? (
                <div className="flex items-center gap-3 lg:gap-5 relative z-10 px-4">
                  <Loader2 className="w-5 h-5 lg:w-7 lg:h-7 animate-spin shrink-0" />
                  <span className="animate-pulse truncate">{status || "Syncing AI..."}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 lg:gap-5 relative z-10 px-4">
                  <span className="whitespace-nowrap">{user ? "INITIALIZE PLAN" : "LOGIN TO START"}</span>
                  <Send className="w-5 h-5 lg:w-7 lg:h-7 shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </button>
            <p className="text-center text-blue-100/10 text-[10px] lg:text-xs font-black tracking-[0.5em] uppercase">Meticulously Crafted AI v3.0</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingCart,
    Moon,
    Home,
    LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
    const pathname = usePathname();
    const { user } = useAuth();

    const handleLogout = async () => {
        if (confirm("Logout from Sehrify AI?")) {
            await signOut(auth);
            window.location.href = "/auth/login";
        }
    };

    const menuItems = [
        { name: "Home", icon: Home, path: "/" },
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { name: "Shopping", icon: ShoppingCart, path: "/shopping-list" },
    ];

    return (
        <>
            {/* Desktop Sidebar (Left Floating Minimalist) */}
            <div className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 h-fit py-8 w-20 flex-col items-center glass rounded-full border-white/5 z-50 gap-8 no-print shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="p-3 bg-secondary/10 rounded-full mb-4">
                    <Moon className="text-secondary w-6 h-6 floating filter drop-shadow-[0_0_8px_rgba(246,224,94,0.5)]" />
                </div>

                <div className="flex flex-col gap-6">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className="relative group"
                            >
                                <div className={`p-4 rounded-full transition-all duration-300 ${isActive
                                    ? "bg-secondary text-black shadow-[0_0_20px_rgba(246,224,94,0.6)]"
                                    : "text-blue-100/40 hover:text-white"
                                    }`}>
                                    <item.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                                </div>

                                <div className="absolute left-full ml-4 px-3 py-1 bg-white text-black text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    {item.name}
                                </div>
                            </Link>
                        );
                    })}

                    {user && (
                        <button
                            onClick={handleLogout}
                            className="p-4 rounded-full text-red-400 hover:bg-red-500/10 transition-all mt-4"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5 lg:w-6 lg:h-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Bottom Navigation (Solid Premium Color) */}
            <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] bg-[#001229] border border-white/10 p-3 rounded-[2.5rem] flex items-center justify-around z-50 no-print shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link key={item.name} href={item.path} className="relative flex-1 flex flex-col items-center gap-1.5 py-1">
                            <div className={`p-2.5 rounded-xl transition-all ${isActive ? "bg-secondary text-black scale-110 shadow-[0_0_15px_rgba(246,224,94,0.4)]" : "text-blue-100/40"
                                }`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${isActive ? "text-secondary" : "text-blue-100/20"}`}>
                                {item.name}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="bubble-active"
                                    className="absolute -bottom-1 w-1 h-1 bg-secondary rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
                {user && (
                    <button onClick={handleLogout} className="flex-1 flex flex-col items-center gap-1.5 py-1 text-red-500/60 transition-colors active:text-red-500">
                        <div className="p-2.5 rounded-xl">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.15em]">Exit</span>
                    </button>
                )}
            </div>
        </>
    );
};

export default Sidebar;

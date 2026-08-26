"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  Database,
  LayoutGrid,
  Key,
  Layers,
  Terminal,
  Zap,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import { getStoredToken } from "@/lib/apollo-client";

export type ActiveTab =
  | "crud"
  | "posts"
  | "playground"
  | "cache"
  | "auth"
  | "pagination"
  | "guide";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [hasToken, setHasToken] = useState<boolean>(false);

  useEffect(() => {
    const checkToken = () => {
      setHasToken(!!getStoredToken());
    };
    checkToken();
    const interval = setInterval(checkToken, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "crud", label: "User CRUD Showcase", icon: <Database className="w-4 h-4" /> },
    { id: "posts", label: "Post Cards CRUD", icon: <LayoutGrid className="w-4 h-4" />, badge: "Card View" },
    { id: "playground", label: "GraphQL IDE & Schema", icon: <Terminal className="w-4 h-4" /> },
    { id: "cache", label: "Apollo Cache Lab", icon: <Zap className="w-4 h-4" />, badge: "4 Policies" },
    { id: "auth", label: "JWT Auth Studio", icon: <Key className="w-4 h-4" /> },
    { id: "pagination", label: "Pagination Arena", icon: <Layers className="w-4 h-4" /> },
    { id: "guide", label: "GraphQL Syllabus Guide", icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/25">
            <Code2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white tracking-tight">
                GraphQL<span className="text-pink-500">Mastery</span>
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                v16 App Router
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Apollo & Next.js Learning Hub
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full py-1 px-1 bg-slate-900/90 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-purple-500/20 text-purple-300"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Server & Auth Badges */}
        <div className="hidden xl:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-[11px]">/api/graphql</span>
          </div>

          {hasToken ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>JWT Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700 font-mono text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
              <span>No Token</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import React, { useState } from "react";
import Navbar, { ActiveTab } from "@/components/Navbar";
import UserCrudView from "@/components/views/UserCrudView";
import PostCrudView from "@/components/views/PostCrudView";
import PlaygroundView from "@/components/views/PlaygroundView";
import CacheLabView from "@/components/views/CacheLabView";
import AuthStudioView from "@/components/views/AuthStudioView";
import PaginationView from "@/components/views/PaginationView";
import GuideView from "@/components/views/GuideView";
import { Code2, Terminal, Zap, ShieldCheck, Heart } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("crud");

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#080c14] text-slate-100 font-sans">
      {/* Header Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {activeTab === "crud" && <UserCrudView />}
        {activeTab === "posts" && <PostCrudView />}
        {activeTab === "playground" && <PlaygroundView />}
        {activeTab === "cache" && <CacheLabView />}
        {activeTab === "auth" && <AuthStudioView />}
        {activeTab === "pagination" && <PaginationView />}
        {activeTab === "guide" && <GuideView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060911] py-6 px-4 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center font-bold">
              GQL
            </div>
            <span>GraphQL Mastery & Apollo Client Interactive Studio</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <button
              onClick={() => setActiveTab("playground")}
              className="hover:text-pink-400 transition flex items-center gap-1"
            >
              <Terminal className="w-3.5 h-3.5" /> IDE
            </button>
            <button
              onClick={() => setActiveTab("cache")}
              className="hover:text-cyan-400 transition flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" /> Caching
            </button>
            <button
              onClick={() => setActiveTab("auth")}
              className="hover:text-purple-400 transition flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> JWT Auth
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Built with Next.js 16 & Apollo Client</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

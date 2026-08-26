"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { gql, FetchPolicy } from "@apollo/client";
import {
  Zap,
  Database,
  RefreshCw,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Activity,
  Layers,
  ArrowRight,
  Server,
} from "lucide-react";
import { apolloCache, apolloClient } from "@/lib/apollo-client";

const GET_USERS_CACHE_TEST = gql`
  query GetUsersForCacheTest {
    users {
      id
      name
      email
      role
    }
  }
`;

export default function CacheLabView() {
  const [selectedPolicy, setSelectedPolicy] = useState<FetchPolicy>("cache-first");
  const [cacheSnapshot, setCacheSnapshot] = useState<any>({});
  const [requestLogs, setRequestLogs] = useState<
    { id: string; time: string; policy: string; durationMs: number; isCacheHit: boolean }[]
  >([]);

  // Function to capture cache state
  const refreshCacheSnapshot = () => {
    setCacheSnapshot(apolloCache.extract());
  };

  useEffect(() => {
    refreshCacheSnapshot();
  }, []);

  // Query hook with dynamic fetchPolicy
  const { data, loading, error, refetch } = useQuery(GET_USERS_CACHE_TEST, {
    fetchPolicy: selectedPolicy,
    notifyOnNetworkStatusChange: true,
  });

  const handleRunTest = async () => {
    const startTime = performance.now();
    await refetch();
    const durationMs = Math.round(performance.now() - startTime);

    const isCacheHit = durationMs < 8 && selectedPolicy !== "network-only" && selectedPolicy !== "no-cache";

    const newLog = {
      id: Math.random().toString(36).substring(2, 7),
      time: new Date().toLocaleTimeString(),
      policy: selectedPolicy,
      durationMs,
      isCacheHit,
    };

    setRequestLogs((prev) => [newLog, ...prev.slice(0, 9)]);
    refreshCacheSnapshot();
  };

  const handleClearCache = async () => {
    await apolloCache.reset();
    refreshCacheSnapshot();
    setRequestLogs([]);
  };

  const policyDescriptions: Record<string, { desc: string; flow: string; iconColor: string }> = {
    "cache-first": {
      desc: "Default policy. Checks Apollo Cache first. If data exists, returns immediately without network request. If missing, fetches from API.",
      flow: "Component ➔ Apollo Cache ➔ (If hit: Render) | (If miss: API Request)",
      iconColor: "text-emerald-400",
    },
    "network-only": {
      desc: "Always sends a network request to the backend server. Saves the response into Apollo Cache to keep cache fresh.",
      flow: "Component ➔ API Request ➔ Save to Apollo Cache ➔ Render",
      iconColor: "text-purple-400",
    },
    "no-cache": {
      desc: "Always sends a network request to the backend server. Does NOT save the result in Apollo Cache.",
      flow: "Component ➔ API Request ➔ Render (Bypasses Cache Store)",
      iconColor: "text-pink-400",
    },
    "cache-and-network": {
      desc: "Returns cached data immediately for fast rendering, while concurrently sending a network request to revalidate and update cache.",
      flow: "Component ➔ Apollo Cache (Instant) + API Request (Background Sync)",
      iconColor: "text-cyan-400",
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" /> Apollo Client Caching Engine
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Fetch Policy Experiment Lab & Cache Inspector
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Understand how <code className="text-cyan-400 font-mono">InMemoryCache</code> and different fetch policies optimize GraphQL data fetching.
          </p>
        </div>

        <button
          onClick={handleClearCache}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold transition"
        >
          <Trash2 className="w-4 h-4" /> Purge Apollo Cache Store
        </button>
      </div>

      {/* Main Grid: Control Panel & Live Cache Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Policy Selector & Tester (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Policy Selector Tabs */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Select Fetch Policy:
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["cache-first", "network-only", "no-cache", "cache-and-network"] as FetchPolicy[]).map(
                (policy) => (
                  <button
                    key={policy}
                    onClick={() => setSelectedPolicy(policy)}
                    className={`p-3 rounded-xl border text-xs font-mono font-semibold text-left transition-all ${
                      selectedPolicy === policy
                        ? "bg-pink-600/20 border-pink-500 text-pink-300 shadow-md shadow-pink-500/10"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {policy}
                  </button>
                )
              )}
            </div>

            {/* Selected Policy Breakdown Card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${policyDescriptions[selectedPolicy].iconColor}`} />
                <h4 className="font-mono text-xs font-bold text-white uppercase">
                  Policy: {selectedPolicy}
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {policyDescriptions[selectedPolicy].desc}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
                <span className="text-slate-500">Data Flow:</span>
                <span>{policyDescriptions[selectedPolicy].flow}</span>
              </div>
            </div>

            {/* Run Test Button */}
            <button
              onClick={handleRunTest}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Fetching Query Data..." : `Execute Query with fetchPolicy="${selectedPolicy}"`}
            </button>
          </div>

          {/* Latency & Log History */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Latency & Network Execution History
              </h3>
              <span className="text-[11px] text-slate-500">Last 10 executions</span>
            </div>

            {requestLogs.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                Click "Execute Query" above to test caching latency and response speed.
              </p>
            ) : (
              <div className="space-y-2">
                {requestLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">{log.time}</span>
                      <span className="text-pink-400 font-semibold">{log.policy}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.isCacheHit
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        }`}
                      >
                        {log.isCacheHit ? "CACHE HIT (<8ms)" : "NETWORK FETCH"}
                      </span>
                      <span className="text-white font-bold">{log.durationMs}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live InMemoryCache Store Viewer (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 sticky top-20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-xs text-slate-100 uppercase tracking-wider">
                  Live Apollo InMemoryCache Normalized Store
                </h3>
              </div>
              <button
                onClick={refreshCacheSnapshot}
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
              >
                <RefreshCw className="w-3 h-3" /> Refresh Store
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Apollo automatically normalizes objects by <code className="text-pink-400 font-mono">__typename:id</code>. Notice how query records are stored internally:
            </p>

            <div className="code-block p-4 rounded-xl text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto max-h-[500px]">
              <pre>{JSON.stringify(cacheSnapshot, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

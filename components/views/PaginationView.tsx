"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import {
  Layers,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Code,
  FileJson,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

// Offset Pagination Document
const GET_USERS_OFFSET = gql`
  query GetUsersOffset($limit: Int, $offset: Int) {
    usersOffset(limit: $limit, offset: $offset) {
      nodes {
        id
        name
        email
        role
      }
      totalCount
      hasMore
      offset
      limit
    }
  }
`;

// Cursor Pagination Document
const GET_USERS_CURSOR = gql`
  query GetUsersCursor($first: Int, $after: String) {
    usersCursor(first: $first, after: $after) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          name
          email
          role
        }
      }
    }
  }
`;

export default function PaginationView() {
  // Offset pagination state
  const [offsetPage, setOffsetPage] = useState(0);
  const limit = 2;

  // Cursor pagination state
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [currentCursorIndex, setCurrentCursorIndex] = useState(0);
  const first = 2;

  // Offset Query
  const { data: rawOffsetData, loading: offsetLoading } = useQuery(GET_USERS_OFFSET, {
    variables: { limit, offset: offsetPage * limit },
    fetchPolicy: "network-only",
  });
  const offsetData: any = rawOffsetData;

  // Cursor Query
  const currentAfterCursor = cursorHistory[currentCursorIndex];
  const { data: rawCursorData, loading: cursorLoading } = useQuery(GET_USERS_CURSOR, {
    variables: { first, after: currentAfterCursor },
    fetchPolicy: "network-only",
  });
  const cursorData: any = rawCursorData;

  const handleNextCursorPage = () => {
    const endCursor = cursorData?.usersCursor?.pageInfo?.endCursor;
    if (endCursor) {
      const nextIndex = currentCursorIndex + 1;
      const updated = [...cursorHistory.slice(0, nextIndex), endCursor];
      setCursorHistory(updated);
      setCurrentCursorIndex(nextIndex);
    }
  };

  const handlePrevCursorPage = () => {
    if (currentCursorIndex > 0) {
      setCurrentCursorIndex(currentCursorIndex - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" /> GraphQL API Design Patterns
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Pagination Arena: Offset vs Cursor Comparison
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Compare traditional <code className="text-indigo-400 font-mono">Offset (limit/offset)</code> vs Relay specification <code className="text-pink-400 font-mono">Cursor (first/after/edges)</code> pagination strategies.
          </p>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Offset Pagination */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <h3 className="font-bold text-slate-100 text-lg">1. Offset Pagination</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                users(limit: {limit}, offset: {offsetPage * limit})
              </p>
            </div>
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              TRADITIONAL
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Uses numerical index offsets. Simple for jump-to-page controls, but susceptible to missing or duplicate items if dataset rows are added/deleted during user pagination.
          </p>

          {/* GraphQL Query Code Snippet */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              GraphQL Query
            </label>
            <div className="code-block p-3 rounded-xl text-[11px] font-mono text-indigo-300 overflow-x-auto">
              <pre>{`query GetUsersOffset {
  usersOffset(limit: ${limit}, offset: ${offsetPage * limit}) {
    totalCount
    hasMore
    nodes { id name email }
  }
}`}</pre>
            </div>
          </div>

          {/* Results Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Nodes Page {offsetPage + 1}</span>
              <span className="font-mono">Total Users: {offsetData?.usersOffset?.totalCount || 0}</span>
            </div>

            {offsetLoading ? (
              <div className="p-8 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
              </div>
            ) : (
              <div className="space-y-2">
                {offsetData?.usersOffset?.nodes.map((user: any) => (
                  <div
                    key={user.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-semibold text-white">{user.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      ID: {user.id}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Nav */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setOffsetPage((p) => Math.max(0, p - 1))}
                disabled={offsetPage === 0 || offsetLoading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-200"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Offset
              </button>

              <span className="text-xs font-mono text-slate-400">
                Offset: {offsetPage * limit}
              </span>

              <button
                onClick={() => setOffsetPage((p) => p + 1)}
                disabled={!offsetData?.usersOffset?.hasMore || offsetLoading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs text-white font-medium"
              >
                Next Offset <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Cursor Pagination */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                <h3 className="font-bold text-slate-100 text-lg">2. Cursor Pagination (Relay Spec)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                users(first: {first}, after: "{currentAfterCursor || "null"}")
              </p>
            </div>
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              RECOMMENDED / RELAY
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Uses opaque cursor pointers (`edges`, `node`, `pageInfo`). Provides guaranteed consistency for live feeds and infinite scrolling regardless of inserts or deletes.
          </p>

          {/* GraphQL Query Code Snippet */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              GraphQL Query
            </label>
            <div className="code-block p-3 rounded-xl text-[11px] font-mono text-pink-300 overflow-x-auto">
              <pre>{`query GetUsersCursor {
  usersCursor(first: ${first}, after: ${currentAfterCursor ? `"${currentAfterCursor}"` : "null"}) {
    pageInfo { endCursor hasNextPage }
    edges { cursor node { id name } }
  }
}`}</pre>
            </div>
          </div>

          {/* Results Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Edges & Nodes</span>
              <span className="font-mono text-pink-400">
                endCursor: {cursorData?.usersCursor?.pageInfo?.endCursor || "null"}
              </span>
            </div>

            {cursorLoading ? (
              <div className="p-8 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-pink-400" />
              </div>
            ) : (
              <div className="space-y-2">
                {cursorData?.usersCursor?.edges.map((edge: any) => (
                  <div
                    key={edge.node.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white">{edge.node.name}</h4>
                      <span className="text-[10px] font-mono text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded">
                        Cursor: {edge.cursor}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">{edge.node.email}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Nav */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrevCursorPage}
                disabled={currentCursorIndex === 0 || cursorLoading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-200"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Edge
              </button>

              <span className="text-xs font-mono text-slate-400">
                Step: {currentCursorIndex + 1}
              </span>

              <button
                onClick={handleNextCursorPage}
                disabled={!cursorData?.usersCursor?.pageInfo?.hasNextPage || cursorLoading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 disabled:opacity-40 text-xs text-white font-medium"
              >
                Next Edge <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

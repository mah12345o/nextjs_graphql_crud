"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import {
  Play,
  Terminal,
  FileCode,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react";
import { getStoredToken } from "@/lib/apollo-client";

const GET_SCHEMA_SDL = gql`
  query GetSchemaSDL {
    schemaSDL
  }
`;

const QUERY_TEMPLATES = [
  {
    name: "1. Query: Get Users & Nested Posts",
    query: `query GetUsersWithPosts {
  users {
    id
    name
    email
    role
    posts {
      id
      title
      createdAt
    }
  }
}`,
    variables: `{}`,
  },
  {
    name: "2. Query with Variable ($id: ID!)",
    query: `query GetSingleUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    role
    createdAt
    posts {
      title
    }
  }
}`,
    variables: `{\n  "id": "1"\n}`,
  },
  {
    name: "3. Mutation: Create User",
    query: `mutation CreateNewUser($name: String!, $email: String!, $role: String) {
  createUser(name: $name, email: $email, role: $role) {
    id
    name
    email
    role
    createdAt
  }
}`,
    variables: `{\n  "name": "Sarah Jenkins",\n  "email": "sarah.jenkins@dev.net",\n  "role": "DEVELOPER"\n}`,
  },
  {
    name: "4. Mutation: Login (JWT Token)",
    query: `mutation UserLogin($email: String!) {
  login(email: $email) {
    token
    user {
      id
      name
      email
      role
    }
  }
}`,
    variables: `{\n  "email": "mahesh@gmail.com"\n}`,
  },
  {
    name: "5. Query: Offset Pagination",
    query: `query GetUsersOffset($limit: Int, $offset: Int) {
  usersOffset(limit: $limit, offset: $offset) {
    totalCount
    hasMore
    nodes {
      id
      name
      email
    }
  }
}`,
    variables: `{\n  "limit": 3,\n  "offset": 0\n}`,
  },
  {
    name: "6. Query: Cursor Pagination",
    query: `query GetUsersCursor($first: Int, $after: String) {
  usersCursor(first: $first, after: $after) {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        name
        email
      }
    }
  }
}`,
    variables: `{\n  "first": 3,\n  "after": null\n}`,
  },
  {
    name: "7. Protected Query: Me (JWT Required)",
    query: `query GetMyProfile {
  me {
    id
    name
    email
    role
    createdAt
  }
}`,
    variables: `{}`,
  },
];

export default function PlaygroundView() {
  const [queryText, setQueryText] = useState(QUERY_TEMPLATES[0].query);
  const [variablesText, setVariablesText] = useState(QUERY_TEMPLATES[0].variables);
  const [customAuthToken, setCustomAuthToken] = useState(getStoredToken() || "");
  const [activeSubTab, setActiveSubTab] = useState<"playground" | "schema">("playground");

  // Output states
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Schema query
  const { data: rawSchemaData } = useQuery(GET_SCHEMA_SDL);
  const schemaData: any = rawSchemaData;

  const handleExecute = async () => {
    setIsExecuting(true);
    setResponseOutput(null);
    const startTime = performance.now();

    try {
      let parsedVariables = {};
      if (variablesText.trim()) {
        parsedVariables = JSON.parse(variablesText);
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (customAuthToken) {
        headers["Authorization"] = customAuthToken.startsWith("Bearer ")
          ? customAuthToken
          : `Bearer ${customAuthToken}`;
      }

      const res = await fetch("/api/graphql", {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: queryText,
          variables: parsedVariables,
        }),
      });

      const resJson = await res.json();
      const endTime = performance.now();
      setExecutionTimeMs(Math.round(endTime - startTime));
      setResponseOutput(resJson);
    } catch (err: any) {
      setResponseOutput({ errors: [{ message: err.message || "Failed to execute request." }] });
    } finally {
      setIsExecuting(false);
    }
  };

  const loadTemplate = (tpl: typeof QUERY_TEMPLATES[0]) => {
    setQueryText(tpl.query);
    setVariablesText(tpl.variables);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Subtabs & Presets */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("playground")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeSubTab === "playground"
                ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Terminal className="w-4 h-4" /> GraphQL IDE Playground
          </button>
          <button
            onClick={() => setActiveSubTab("schema")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeSubTab === "schema"
                ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <BookOpen className="w-4 h-4" /> GraphQL Schema SDL Browser
          </button>
        </div>

        {activeSubTab === "playground" && (
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-xs text-slate-400 font-medium shrink-0">Presets:</span>
            <select
              onChange={(e) => {
                const idx = parseInt(e.target.value, 10);
                if (!isNaN(idx)) loadTemplate(QUERY_TEMPLATES[idx]);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
            >
              {QUERY_TEMPLATES.map((t, idx) => (
                <option key={idx} value={idx}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeSubTab === "playground" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side: Query Editor & Variables (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Header Authorization token setting */}
            <div className="glass-panel p-3 rounded-xl flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono font-semibold shrink-0">
                Authorization Header:
              </span>
              <input
                type="text"
                placeholder="Bearer jwt_mock_..."
                value={customAuthToken}
                onChange={(e) => setCustomAuthToken(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-pink-300 placeholder-slate-600 focus:outline-none focus:border-pink-500"
              />
              {getStoredToken() && (
                <button
                  onClick={() => setCustomAuthToken(getStoredToken() || "")}
                  className="text-[10px] text-pink-400 hover:underline shrink-0"
                >
                  Use Active Token
                </button>
              )}
            </div>

            {/* Query Document Editor */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
              <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <FileCode className="w-4 h-4 text-pink-400" />
                  <span>GraphQL Document (Query / Mutation)</span>
                </div>
                <button
                  onClick={() => loadTemplate(QUERY_TEMPLATES[0])}
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              <textarea
                rows={12}
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                className="w-full p-4 bg-[#050811] text-xs font-mono text-pink-300 focus:outline-none resize-y leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Variables JSON Editor */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
              <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span>Variables (JSON Format)</span>
                </div>
              </div>

              <textarea
                rows={5}
                value={variablesText}
                onChange={(e) => setVariablesText(e.target.value)}
                className="w-full p-4 bg-[#050811] text-xs font-mono text-purple-300 focus:outline-none resize-y leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <Play className={`w-4 h-4 ${isExecuting ? "animate-spin" : "fill-current"}`} />
              {isExecuting ? "Executing GraphQL Query..." : "Run GraphQL Operation"}
            </button>
          </div>

          {/* Right Side: Execution Output (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden sticky top-20">
              <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-200 font-bold">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Response Payload</span>
                </div>

                <div className="flex items-center gap-3">
                  {executionTimeMs !== null && (
                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{executionTimeMs}ms</span>
                    </div>
                  )}

                  {responseOutput && (
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(responseOutput, null, 2))}
                      className="p-1 text-slate-400 hover:text-white rounded"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 bg-[#050811] min-h-[480px] text-xs font-mono overflow-auto max-h-[600px]">
                {isExecuting ? (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-500 gap-2">
                    <Clock className="w-6 h-6 animate-spin text-pink-500" />
                    <span>Executing POST request to /api/graphql...</span>
                  </div>
                ) : responseOutput ? (
                  <pre className="text-emerald-300 leading-relaxed whitespace-pre-wrap">
                    {JSON.stringify(responseOutput, null, 2)}
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-600 gap-2">
                    <Play className="w-8 h-8 opacity-40 text-pink-500" />
                    <span>Click "Run GraphQL Operation" to see live API output</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Schema SDL Viewer */
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-pink-400" /> GraphQL Schema Definition Language (SDL)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically generated GraphQL types, queries, mutations, and resolver definitions.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(schemaData?.schemaSDL || "")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200 hover:bg-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Schema</span>
            </button>
          </div>

          <div className="code-block p-6 rounded-xl text-xs font-mono text-purple-300 leading-relaxed overflow-x-auto max-h-[600px]">
            <pre>{schemaData?.schemaSDL || "Loading GraphQL Schema SDL..."}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

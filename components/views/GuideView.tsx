"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Code2,
  Database,
  Layers,
  Zap,
  Key,
  CheckCircle,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function GuideView() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>("basics");

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const sections = [
    {
      id: "basics",
      title: "1. GraphQL Core Basics & REST Comparison",
      icon: <Code2 className="w-5 h-5 text-pink-400" />,
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <p>
            GraphQL is an API query language where the <strong className="text-white">frontend asks for exactly the data it needs</strong>—no over-fetching and no under-fetching.
          </p>

          {/* REST vs GraphQL Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-400 uppercase font-mono">REST Endpoint</span>
                <span className="text-[10px] text-slate-500 font-mono">Multiple Endpoints</span>
              </div>
              <div className="code-block p-2.5 rounded-lg text-slate-300 font-mono text-[11px]">
                GET /users/1
              </div>
              <p className="text-[11px] text-slate-400">Returns fixed payload determined solely by backend server.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-pink-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-pink-400 uppercase font-mono">GraphQL Query</span>
                <span className="text-[10px] text-pink-400 font-mono">Single Endpoint /graphql</span>
              </div>
              <div className="code-block p-2.5 rounded-lg text-pink-300 font-mono text-[11px]">
                {`query {\n  user(id: "1") {\n    name\n    email\n  }\n}`}
              </div>
              <p className="text-[11px] text-pink-300 font-semibold">Client requests exact fields required for UI view!</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-pink-400 font-bold block">Query</span>
              <span className="text-slate-400 text-[11px]">Read Data</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-purple-400 font-bold block">Mutation</span>
              <span className="text-slate-400 text-[11px]">Create, Update, Delete</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-cyan-400 font-bold block">Schema</span>
              <span className="text-slate-400 text-[11px]">Defines data & operations</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-emerald-400 font-bold block">Type</span>
              <span className="text-slate-400 text-[11px]">Defines data shape</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "query",
      title: "2. Query — Reading Data & React Integration",
      icon: <Database className="w-5 h-5 text-cyan-400" />,
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <p>A query is executed to fetch structured data from the GraphQL server.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                GraphQL Query Document
              </label>
              <div className="code-block p-3 rounded-xl text-pink-300 font-mono text-[11px]">
                <pre>{`query {\n  users {\n    id\n    name\n    email\n  }\n}`}</pre>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                Frontend Receives (JSON)
              </label>
              <div className="code-block p-3 rounded-xl text-emerald-300 font-mono text-[11px]">
                <pre>{`{\n  "data": {\n    "users": [\n      {\n        "id": "1",\n        "name": "Mahesh",\n        "email": "mahesh@gmail.com"\n      }\n    ]\n  }\n}`}</pre>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
              React Apollo Hook Integration
            </label>
            <div className="code-block p-3 rounded-xl text-purple-300 font-mono text-[11px]">
              <pre>{`const { data, loading, error } = useQuery(GET_USERS);`}</pre>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "mutation",
      title: "3. Mutation — Changing Data (Create, Update, Delete)",
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <p>Mutations are used for state modifications on the server (CREATE, UPDATE, DELETE).</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                GraphQL Mutation Document
              </label>
              <div className="code-block p-3 rounded-xl text-purple-300 font-mono text-[11px]">
                <pre>{`mutation {\n  createUser(\n    name: "Mahesh"\n    email: "mahesh@gmail.com"\n  ) {\n    id\n    name\n    email\n  }\n}`}</pre>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                React Mutation Invocation
              </label>
              <div className="code-block p-3 rounded-xl text-cyan-300 font-mono text-[11px]">
                <pre>{`const [createUser] = useMutation(CREATE_USER);\n\nawait createUser({\n  variables: {\n    name: "Mahesh",\n    email: "mahesh@gmail.com"\n  }\n});`}</pre>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "variables",
      title: "4. Variables — Parameterized GraphQL Queries",
      icon: <Code2 className="w-5 h-5 text-emerald-400" />,
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <p>Avoid hardcoding dynamic values directly inside query strings. Use GraphQL variables!</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2">
              <span className="text-red-400 font-bold font-mono">❌ Hardcoded (Not Recommended)</span>
              <div className="code-block p-2.5 rounded-lg text-slate-400 font-mono text-[11px]">
                {`query {\n  user(id: "123") {\n    name\n  }\n}`}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <span className="text-emerald-400 font-bold font-mono">✅ Recommended (Parameterized)</span>
              <div className="code-block p-2.5 rounded-lg text-emerald-300 font-mono text-[11px]">
                {`query GetUser($id: ID!) {\n  user(id: $id) {\n    name\n    email\n  }\n}`}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "cache",
      title: "5. Apollo Client Caching & Fetch Policies",
      icon: <Zap className="w-5 h-5 text-pink-400" />,
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <p>Apollo Client stores query results inside an <strong className="text-white">InMemoryCache</strong> store to prevent redundant network round-trips.</p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
            <span className="text-pink-400 font-bold text-xs">Cache Workflow</span>
            <p className="text-[11px] text-slate-300">
              Component ➔ Apollo Cache ➔ If data exists ➔ Return Cache | Else ➔ Send API Network Request
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-pink-400 font-bold block">cache-first</span>
              <span className="text-slate-400 text-[11px]">Checks cache first, fetches API on miss</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-purple-400 font-bold block">network-only</span>
              <span className="text-slate-400 text-[11px]">Always fetches API, updates cache</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-cyan-400 font-bold block">no-cache</span>
              <span className="text-slate-400 text-[11px]">Always fetches API, bypasses cache</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-emerald-400 font-bold block">cache-and-network</span>
              <span className="text-slate-400 text-[11px]">Returns cache fast, syncs background</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "auth",
      title: "6. Authentication & JWT Authorization Headers",
      icon: <Key className="w-5 h-5 text-purple-400" />,
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <p>Pass JWT tokens in Apollo Client link headers to authenticate resolvers on the backend.</p>
          <div className="code-block p-3 rounded-xl text-purple-300 font-mono text-[11px]">
            <pre>{`Authorization: Bearer <token>`}</pre>
          </div>
        </div>
      ),
    },
    {
      id: "pagination",
      title: "7. Pagination — Offset vs Cursor Pagination",
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-indigo-400 font-bold font-mono">Offset Pagination</span>
              <div className="code-block p-2.5 rounded-lg text-indigo-300 font-mono text-[11px]">
                {`query {\n  users(limit: 20, offset: 0) {\n    id\n    name\n  }\n}`}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-pink-400 font-bold font-mono">Cursor Pagination (Relay Spec)</span>
              <div className="code-block p-2.5 rounded-lg text-pink-300 font-mono text-[11px]">
                {`query {\n  users(first: 20, after: "cursor123") {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}`}
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" /> Syllabus & Architectural Roadmap
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Interactive GraphQL Concept Reference
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Comprehensive guide covering GraphQL Schema, Query vs Mutation, Apollo Client, Caching, Auth, and Pagination.
          </p>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {sections.map((section) => {
          const isOpen = openSection === section.id;
          return (
            <div
              key={section.id}
              className="glass-panel rounded-2xl border border-slate-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-3">
                  {section.icon}
                  <h3 className="font-bold text-slate-100 text-sm">{section.title}</h3>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-5 h-5 text-pink-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                )}
              </button>

              {isOpen && (
                <div className="p-5 border-t border-slate-800/80 bg-slate-950/60">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Concept Tree Summary Box */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2 font-mono">
          <Code2 className="w-5 h-5 text-pink-400" /> Complete GraphQL Architecture Map
        </h3>

        <div className="code-block p-6 rounded-xl text-xs font-mono text-pink-300 leading-relaxed overflow-x-auto">
          <pre>{`GraphQL
│
├── Basics
│     ├── Schema
│     ├── Types
│     └── Resolver concept
│
├── Query
│     ├── Fields
│     ├── Nested data
│     └── Variables
│
├── Mutation
│     ├── Create
│     ├── Update
│     └── Delete
│
├── Apollo Client
│     ├── useQuery
│     ├── useMutation
│     └── ApolloProvider
│
├── Cache
│     ├── InMemoryCache
│     └── Fetch policies (cache-first, network-only, no-cache, cache-and-network)
│
├── Authentication
│     └── JWT / Authorization Bearer Headers
│
└── Pagination
      ├── Offset (limit, offset)
      └── Cursor (first, after, edges, node, pageInfo)`}</pre>
        </div>
      </div>
    </div>
  );
}

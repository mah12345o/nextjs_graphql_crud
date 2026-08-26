"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import {
  Key,
  ShieldCheck,
  ShieldAlert,
  LogIn,
  LogOut,
  User,
  Lock,
  ArrowRight,
  Code,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { getStoredToken, setStoredToken, clearStoredToken } from "@/lib/apollo-client";

const LOGIN_MUTATION = gql`
  mutation LoginUser($email: String!) {
    login(email: $email) {
      token
      user {
        id
        name
        email
        role
        avatar
      }
    }
  }
`;

const ME_QUERY = gql`
  query GetMyProfile {
    me {
      id
      name
      email
      role
      createdAt
    }
  }
`;

export default function AuthStudioView() {
  const [email, setEmail] = useState("mahesh@gmail.com");
  const [currentToken, setCurrentToken] = useState<string | null>(null);

  useEffect(() => {
    setCurrentToken(getStoredToken());
  }, []);

  const [login, { loading: loggingIn, error: loginError }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data: any) => {
      if (data?.login?.token) {
        setStoredToken(data.login.token);
        setCurrentToken(data.login.token);
      }
    },
  });

  const [fetchMe, { data: meData, loading: loadingMe, error: meError, called: meCalled }] =
    useLazyQuery(ME_QUERY, {
      fetchPolicy: "network-only",
    });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ variables: { email } });
  };

  const handleLogout = () => {
    clearStoredToken();
    setCurrentToken(null);
  };

  // Decode mock JWT payload
  const decodeToken = (tokenStr: string) => {
    try {
      const clean = tokenStr.replace("jwt_mock_", "");
      const raw = atob(clean);
      const [id, userEmail, role, timestamp] = raw.split(":");
      return { id, email: userEmail, role, issuedAt: new Date(parseInt(timestamp, 10)).toLocaleString() };
    } catch {
      return null;
    }
  };

  const decodedPayload = currentToken ? decodeToken(currentToken) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Key className="w-4 h-4" /> GraphQL Security & Authentication
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            JWT Token & Authorization Header Studio
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Simulate JWT login, inspect HTTP <code className="text-purple-400 font-mono">Authorization: Bearer &lt;token&gt;</code> headers, and execute protected resolvers.
          </p>
        </div>

        {currentToken && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" /> Clear Token / Logout
          </button>
        )}
      </div>

      {/* Main Grid: Left Login Simulator & Right Token Inspector / Protected Resolver */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Login Simulator (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <LogIn className="w-5 h-5 text-pink-400" />
              <h3 className="font-bold text-slate-100 text-base">Step 1: JWT Authentication Login</h3>
            </div>

            <p className="text-xs text-slate-400">
              Submit email to trigger GraphQL <code className="text-pink-400 font-mono">login(email)</code> mutation and receive a signed JWT token.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  User Email Address
                </label>
                <select
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-pink-500"
                >
                  <option value="mahesh@gmail.com">mahesh@gmail.com (ADMIN)</option>
                  <option value="sarah.chen@tech.io">sarah.chen@tech.io (DEVELOPER)</option>
                  <option value="alex.rivera@design.co">alex.rivera@design.co (DESIGNER)</option>
                  <option value="elena@ai-labs.org">elena@ai-labs.org (RESEARCHER)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition"
              >
                {loggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                Execute login(email: "{email}")
              </button>
            </form>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError.message}</span>
              </div>
            )}
          </div>

          {/* Flow Visualizer Diagram */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              GraphQL Auth Architecture Flow
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-slate-300">
                <span>1. Frontend Login</span>
                <ArrowRight className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-pink-400">mutation login(...)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-slate-300">
                <span>2. Store JWT</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-purple-400">localStorage / Cookie</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-slate-300">
                <span>3. Apollo Link</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-cyan-400">setContext Authorization Header</span>
              </div>
            </div>
          </div>
        </div>

        {/* Token Inspector & Protected Resolver Test (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Token Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-slate-100 text-base">Step 2: Inspect Bearer Header & Decoded JWT</h3>
              </div>
              <span
                className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full ${
                  currentToken
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {currentToken ? "TOKEN ACTIVE" : "NO ACTIVE TOKEN"}
              </span>
            </div>

            {currentToken ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    HTTP Authorization Header Attached by Apollo Link
                  </label>
                  <div className="code-block p-3 rounded-xl text-xs font-mono text-pink-300 overflow-x-auto">
                    <code>Authorization: Bearer {currentToken}</code>
                  </div>
                </div>

                {decodedPayload && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Decoded Token Payload
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">User ID</span>
                        <span className="text-white font-bold">{decodedPayload.id}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Role</span>
                        <span className="text-purple-300 font-bold">{decodedPayload.role}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Email</span>
                        <span className="text-cyan-300 font-bold">{decodedPayload.email}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Issued At</span>
                        <span className="text-slate-300">{decodedPayload.issuedAt}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center text-slate-500 space-y-2">
                <Lock className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">No JWT token present in Apollo Link headers. Log in on the left to obtain a token.</p>
              </div>
            )}
          </div>

          {/* Protected Resolver Tester (query me) */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-400" /> Step 3: Test Protected Resolver (<code className="text-purple-400 text-xs">query me</code>)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  The <code className="text-pink-400 font-mono">me</code> query checks context.currentUser. Throws error if Authorization header is missing.
                </p>
              </div>
            </div>

            <button
              onClick={() => fetchMe()}
              disabled={loadingMe}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20"
            >
              {loadingMe ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Execute query {"{ me { id name email role } }"}
            </button>

            {meCalled && (
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  GraphQL Execution Output
                </label>

                {meError ? (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 space-y-2 font-mono text-xs">
                    <div className="flex items-center gap-2 font-bold text-red-400">
                      <AlertCircle className="w-4 h-4" /> Auth Error Response (UNAUTHENTICATED)
                    </div>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(meError, null, 2)}</pre>
                  </div>
                ) : meData ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2 font-mono text-xs">
                    <div className="flex items-center gap-2 font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Protected Data Successfully Retrieved!
                    </div>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(meData, null, 2)}</pre>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

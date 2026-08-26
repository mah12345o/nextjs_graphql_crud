"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import {
  Users,
  UserPlus,
  Trash2,
  Edit2,
  Search,
  Filter,
  FileText,
  PlusCircle,
  Code,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// GraphQL Documents
const GET_USERS = gql`
  query GetUsers($search: String, $role: String) {
    users(search: $search, role: $role) {
      id
      name
      email
      role
      avatar
      createdAt
      posts {
        id
        title
        content
        createdAt
      }
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $role: String) {
    createUser(name: $name, email: $email, role: $role) {
      id
      name
      email
      role
      avatar
      createdAt
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $email: String, $role: String) {
    updateUser(id: $id, name: $name, email: $email, role: $role) {
      id
      name
      email
      role
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $authorId: ID!) {
    createPost(title: $title, content: $content, authorId: $authorId) {
      id
      title
      content
      createdAt
    }
  }
`;

export default function UserCrudView() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  // Form states
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [newPostUserId, setNewPostUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: "", email: "", role: "DEVELOPER" });
  const [postFormData, setPostFormData] = useState({ title: "", content: "" });

  // Last executed operation inspector state
  const [inspectorLog, setInspectorLog] = useState<{
    type: "QUERY" | "MUTATION";
    name: string;
    query: string;
    variables?: any;
    data?: any;
    error?: string;
  }>({
    type: "QUERY",
    name: "GetUsers",
    query: GET_USERS.loc?.source.body || "",
  });

  // Apollo Query
  const { data: rawData, loading, error, refetch } = useQuery(GET_USERS, {
    variables: { search: search || undefined, role: roleFilter !== "ALL" ? roleFilter : undefined },
    fetchPolicy: "cache-and-network",
  });
  const data: any = rawData;

  React.useEffect(() => {
    if (rawData) {
      setInspectorLog({
        type: "QUERY",
        name: "GetUsers",
        query: GET_USERS.loc?.source.body || "",
        variables: { search: search || null, role: roleFilter },
        data: rawData,
      });
    }
  }, [rawData, search, roleFilter]);

  // Mutations
  const [createUser, { loading: creating }] = useMutation(CREATE_USER, {
    onCompleted: (resData) => {
      refetch();
      setIsAddingUser(false);
      setFormData({ name: "", email: "", role: "DEVELOPER" });
      setInspectorLog({
        type: "MUTATION",
        name: "CreateUser",
        query: CREATE_USER.loc?.source.body || "",
        variables: formData,
        data: resData,
      });
    },
  });

  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER, {
    onCompleted: (resData) => {
      refetch();
      setEditingUser(null);
      setInspectorLog({
        type: "MUTATION",
        name: "UpdateUser",
        query: UPDATE_USER.loc?.source.body || "",
        variables: editingUser,
        data: resData,
      });
    },
  });

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: (resData) => {
      refetch();
      setInspectorLog({
        type: "MUTATION",
        name: "DeleteUser",
        query: DELETE_USER.loc?.source.body || "",
        data: resData,
      });
    },
  });

  const [createPost, { loading: posting }] = useMutation(CREATE_POST, {
    onCompleted: (resData) => {
      refetch();
      setNewPostUserId(null);
      setPostFormData({ title: "", content: "" });
      setInspectorLog({
        type: "MUTATION",
        name: "CreatePost",
        query: CREATE_POST.loc?.source.body || "",
        variables: { ...postFormData, authorId: newPostUserId },
        data: resData,
      });
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    createUser({ variables: formData });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser({ variables: editingUser });
  };

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostUserId || !postFormData.title) return;
    createPost({ variables: { ...postFormData, authorId: newPostUserId } });
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Live GraphQL Integration
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            User & Content Management Showcase
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Perform full CRUD operations using Apollo Client <code className="text-pink-400">useQuery</code> and <code className="text-purple-400">useMutation</code> hooks.
          </p>
        </div>

        <button
          onClick={() => setIsAddingUser(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium text-sm shadow-lg shadow-pink-500/25 transition-all duration-200"
        >
          <UserPlus className="w-4 h-4" /> Create New User
        </button>
      </div>

      {/* Main Grid: Left Directory & Right Live GraphQL Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User List Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls: Search & Filter */}
          <div className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-pink-500"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">ADMIN</option>
                <option value="DEVELOPER">DEVELOPER</option>
                <option value="DESIGNER">DESIGNER</option>
                <option value="RESEARCHER">RESEARCHER</option>
              </select>
            </div>
          </div>

          {/* User Cards List */}
          {loading && !data && (
            <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
              <p className="text-sm font-medium">Fetching users via GraphQL Query...</p>
            </div>
          )}

          {error && (
            <div className="glass-panel p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 shrink-0 text-red-400" />
              <p className="text-sm">{error.message}</p>
            </div>
          )}

          {data?.users && (
            <div className="space-y-3">
              {data.users.length === 0 ? (
                <div className="glass-panel p-8 rounded-xl text-center text-slate-400">
                  No users found matching filter.
                </div>
              ) : (
                data.users.map((user: any) => {
                  const isExpanded = expandedUserId === user.id;
                  return (
                    <div
                      key={user.id}
                      className="glass-panel rounded-xl border border-slate-800/80 overflow-hidden transition-all duration-200 hover:border-slate-700"
                    >
                      {/* Card Header */}
                      <div className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-11 h-11 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-100 text-sm">{user.name}</h3>
                              <span
                                className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md ${
                                  user.role === "ADMIN"
                                    ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                                    : user.role === "DEVELOPER"
                                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                    : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                }`}
                              >
                                {user.role}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              setExpandedUserId(isExpanded ? null : user.id)
                            }
                            className="flex items-center gap-1 text-xs text-slate-300 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 transition"
                          >
                            <FileText className="w-3.5 h-3.5 text-pink-400" />
                            <span>{user.posts?.length || 0} Posts</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() =>
                              setEditingUser({
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                role: user.role,
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => deleteUser({ variables: { id: user.id } })}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Section: Nested Posts & Add Post */}
                      {isExpanded && (
                        <div className="bg-slate-950/60 border-t border-slate-800/80 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-pink-400" /> Nested Posts (GraphQL Field)
                            </span>
                            <button
                              onClick={() => setNewPostUserId(user.id)}
                              className="flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 font-medium"
                            >
                              <PlusCircle className="w-3.5 h-3.5" /> Add Post
                            </button>
                          </div>

                          {user.posts?.length === 0 ? (
                            <p className="text-xs text-slate-500 italic">No posts authored yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {user.posts.map((post: any) => (
                                <div
                                  key={post.id}
                                  className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-1"
                                >
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-slate-200">{post.title}</h4>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      ID: {post.id}
                                    </span>
                                  </div>
                                  <p className="text-slate-400 leading-relaxed">{post.content}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Live GraphQL Inspector Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 sticky top-20 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-pink-400" />
                <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
                  Live GraphQL Execution Log
                </h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  inspectorLog.type === "QUERY"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                }`}
              >
                {inspectorLog.type}: {inspectorLog.name}
              </span>
            </div>

            {/* Request Document */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                GraphQL Request Body
              </label>
              <div className="code-block p-3 rounded-xl text-xs text-pink-300 font-mono overflow-x-auto max-h-48">
                <pre>{inspectorLog.query}</pre>
              </div>
            </div>

            {/* Variables */}
            {inspectorLog.variables && (
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Variables
                </label>
                <div className="code-block p-3 rounded-xl text-xs text-purple-300 font-mono overflow-x-auto">
                  <pre>{JSON.stringify(inspectorLog.variables, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* Response JSON */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Apollo Data Result
              </label>
              <div className="code-block p-3 rounded-xl text-xs text-emerald-300 font-mono overflow-x-auto max-h-60">
                <pre>{JSON.stringify(inspectorLog.data || {}, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create User */}
      {isAddingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-pink-400" /> Create User via Mutation
              </h3>
              <button
                onClick={() => setIsAddingUser(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. elena@tech.io"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-pink-500"
                >
                  <option value="DEVELOPER">DEVELOPER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="DESIGNER">DESIGNER</option>
                  <option value="RESEARCHER">RESEARCHER</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingUser(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium text-xs flex items-center gap-2"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Execute createUser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-purple-400" /> Update User Mutation
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="DEVELOPER">DEVELOPER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="DESIGNER">DESIGNER</option>
                  <option value="RESEARCHER">RESEARCHER</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-2"
                >
                  {updating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Execute updateUser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Post */}
      {newPostUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-pink-400" /> Add Post Mutation
              </h3>
              <button
                onClick={() => setNewPostUserId(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Post Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js 16 App Router & GraphQL"
                  value={postFormData.title}
                  onChange={(e) => setPostFormData({ ...postFormData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Content</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter post description or content body..."
                  value={postFormData.content}
                  onChange={(e) => setPostFormData({ ...postFormData, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewPostUserId(null)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={posting}
                  className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-medium text-xs flex items-center gap-2"
                >
                  {posting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Execute createPost
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

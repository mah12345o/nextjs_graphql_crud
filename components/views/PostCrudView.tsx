"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import {
  FileText,
  PlusCircle,
  Edit2,
  Trash2,
  Search,
  Code,
  Loader2,
  X,
  Sparkles,
  User,
  Clock,
  LayoutGrid,
} from "lucide-react";

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
      createdAt
      author {
        id
        name
        email
        avatar
        role
      }
    }
    users {
      id
      name
      role
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $authorId: ID!) {
    createPost(title: $title, content: $content, authorId: $authorId) {
      id
      title
      content
      createdAt
      author {
        id
        name
      }
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String, $content: String) {
    updatePost(id: $id, title: $title, content: $content) {
      id
      title
      content
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export default function PostCrudView() {
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingPost, setEditingPost] = useState<{ id: string; title: string; content: string } | null>(null);

  const [createForm, setCreateForm] = useState({ title: "", content: "", authorId: "" });

  const [inspectorLog, setInspectorLog] = useState<{
    type: "QUERY" | "MUTATION";
    name: string;
    query: string;
    variables?: any;
    data?: any;
  }>({
    type: "QUERY",
    name: "GetPosts",
    query: GET_POSTS.loc?.source.body || "",
  });

  const { data: rawData, loading, error, refetch } = useQuery(GET_POSTS, {
    fetchPolicy: "cache-and-network",
  });
  const data: any = rawData;

  React.useEffect(() => {
    if (rawData) {
      setInspectorLog({
        type: "QUERY",
        name: "GetPosts",
        query: GET_POSTS.loc?.source.body || "",
        data: rawData,
      });
    }
  }, [rawData]);

  const [createPost, { loading: creating }] = useMutation(CREATE_POST, {
    onCompleted: (resData: any) => {
      refetch();
      setIsAdding(false);
      setCreateForm({ title: "", content: "", authorId: "" });
      setInspectorLog({
        type: "MUTATION",
        name: "CreatePost",
        query: CREATE_POST.loc?.source.body || "",
        variables: createForm,
        data: resData,
      });
    },
  });

  const [updatePost, { loading: updating }] = useMutation(UPDATE_POST, {
    onCompleted: (resData: any) => {
      refetch();
      setEditingPost(null);
      setInspectorLog({
        type: "MUTATION",
        name: "UpdatePost",
        query: UPDATE_POST.loc?.source.body || "",
        variables: editingPost,
        data: resData,
      });
    },
  });

  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: (resData: any) => {
      refetch();
      setInspectorLog({
        type: "MUTATION",
        name: "DeletePost",
        query: DELETE_POST.loc?.source.body || "",
        data: resData,
      });
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title || !createForm.content || !createForm.authorId) return;
    createPost({ variables: createForm });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title) return;
    updatePost({ variables: editingPost });
  };

  const filteredPosts = data?.posts?.filter((post: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      post.author?.name?.toLowerCase().includes(q)
    );
  }) || [];

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <LayoutGrid className="w-4 h-4" /> Card Component Showcase
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Post Cards Management (Add, Edit, Update & Delete)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Interactive Post Cards powered by GraphQL queries & mutations (<code className="text-purple-400">createPost</code>, <code className="text-pink-400">updatePost</code>, <code className="text-red-400">deletePost</code>).
          </p>
        </div>

        <button
          onClick={() => {
            const firstAuthor = data?.users?.[0]?.id || "";
            setCreateForm({ title: "", content: "", authorId: firstAuthor });
            setIsAdding(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium text-sm shadow-lg shadow-purple-500/25 transition-all duration-200"
        >
          <PlusCircle className="w-4 h-4" /> Add New Post Card
        </button>
      </div>

      {/* Main Grid: Left Post Cards Grid (7 Cols) & Right Live Execution Log (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Post Cards Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search Input */}
          <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search post title, description or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {loading && !data && (
            <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <p className="text-sm font-medium">Loading Post Cards via GraphQL...</p>
            </div>
          )}

          {error && (
            <div className="glass-panel p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 flex items-center gap-3">
              <p className="text-sm">{error.message}</p>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPosts.map((post: any) => (
              <div
                key={post.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all duration-200 group"
              >
                <div className="space-y-3">
                  {/* Card Top: Author Info & Post ID */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"}
                        alt={post.author?.name}
                        className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-semibold text-white">{post.author?.name}</h4>
                        <span className="text-[9px] font-mono text-purple-400">{post.author?.role}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      ID: {post.id}
                    </span>
                  </div>

                  {/* Title & Body */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-100 text-sm group-hover:text-purple-300 transition">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {post.content}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Timestamp & Edit/Delete Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingPost({ id: post.id, title: post.title, content: post.content })}
                      className="p-1.5 text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition"
                      title="Edit Post Card"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePost({ variables: { id: post.id } })}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      title="Delete Post Card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Execution Inspector Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 sticky top-20 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
                  Post Mutation Log
                </h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  inspectorLog.type === "QUERY"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                }`}
              >
                {inspectorLog.type}: {inspectorLog.name}
              </span>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                GraphQL Document
              </label>
              <div className="code-block p-3 rounded-xl text-xs text-purple-300 font-mono overflow-x-auto max-h-48">
                <pre>{inspectorLog.query}</pre>
              </div>
            </div>

            {inspectorLog.variables && (
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Variables
                </label>
                <div className="code-block p-3 rounded-xl text-xs text-pink-300 font-mono overflow-x-auto">
                  <pre>{JSON.stringify(inspectorLog.variables, null, 2)}</pre>
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Response Payload
              </label>
              <div className="code-block p-3 rounded-xl text-xs text-emerald-300 font-mono overflow-x-auto max-h-60">
                <pre>{JSON.stringify(inspectorLog.data || {}, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Post Card Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-purple-400" /> Create Post Card
              </h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Author User</label>
                <select
                  value={createForm.authorId}
                  onChange={(e) => setCreateForm({ ...createForm, authorId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  {data?.users?.map((u: any) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Post Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced GraphQL Server Caching"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Post Content Body</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter content details..."
                  value={createForm.content}
                  onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-xs flex items-center gap-2"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Execute createPost
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Post Card Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-purple-400" /> Edit Post Card Mutation
              </h3>
              <button onClick={() => setEditingPost(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Post Title</label>
                <input
                  type="text"
                  required
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Post Content Body</label>
                <textarea
                  rows={4}
                  required
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
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
                  Execute updatePost
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

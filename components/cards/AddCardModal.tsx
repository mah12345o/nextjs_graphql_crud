"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, X } from "lucide-react";
import { CreateCardInput } from "@/hooks/useCards";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (input: CreateCardInput) => Promise<any>;
  isCreating?: boolean;
}

export default function AddCardModal({ isOpen, onClose, onAddCard, isCreating }: AddCardModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    await onAddCard({ title, description, category });
    setTitle("");
    setDescription("");
    setCategory("General");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-slate-900/95 rounded-2xl border border-indigo-500/30 space-y-4 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" /> Create New Card
        </h2>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Card Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Next.js App Router"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Category</label>
          <input
            type="text"
            placeholder="e.g. Frontend, Basics, Database"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-1">Description</label>
        <textarea
          rows={3}
          required
          placeholder="Enter description details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs hover:bg-slate-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isCreating}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition"
        >
          {isCreating && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Card
        </button>
      </div>
    </form>
  );
}

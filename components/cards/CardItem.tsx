"use client";

import React, { useState } from "react";
import { Edit2, Trash2, Check, Loader2, X } from "lucide-react";
import { Card } from "@/lib/graphql/schema";
import { UpdateCardInput } from "@/hooks/useCards";

interface CardItemProps {
  card: Card;
  onEdit: (input: UpdateCardInput) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  isUpdating?: boolean;
}

export default function CardItem({ card, onEdit, onDelete, isUpdating }: CardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [category, setCategory] = useState(card.category || "General");

  const handleSave = async () => {
    if (!title || !description) return;
    await onEdit({ id: card.id, title, description, category });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-indigo-500/50 space-y-3 shadow-xl">
        <div>
          <label className="text-[10px] text-indigo-400 font-mono uppercase">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] text-indigo-400 font-mono uppercase">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] text-indigo-400 font-mono uppercase">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
          >
            {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-white text-base leading-snug">{card.title}</h3>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
            {card.category || "General"}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">{card.description}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
        <span className="text-[10px] font-mono text-slate-500">ID: {card.id}</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1.5 transition"
          >
            <Edit2 className="w-3.5 h-3.5 text-indigo-400" /> Edit
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-200 hover:text-red-300 rounded-lg text-xs flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

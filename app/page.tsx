"use client";

import React, { useState } from "react";
import { Plus, X, Layers } from "lucide-react";
import { useCards } from "@/hooks/useCards";
import CardList from "@/components/cards/CardList";
import AddCardModal from "@/components/cards/AddCardModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    cards,
    loading,
    creating,
    updating,
    addCard,
    editCard,
    removeCard,
  } = useCards();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 px-4 py-8 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Navigation Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">GraphQL Card Manager</h1>
              <p className="text-xs text-slate-400">Architecture Pattern: Fragment Colocation & Custom Hook Layer</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-xs shadow-lg shadow-indigo-500/20 transition"
          >
            {isModalOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isModalOpen ? "Cancel" : "Add New Card"}
          </button>
        </header>

        {/* Add Card Form Modal */}
        <AddCardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddCard={addCard}
          isCreating={creating}
        />

        {/* Modular Card List Component */}
        <CardList
          cards={cards}
          loading={loading}
          onEditCard={editCard}
          onDeleteCard={removeCard}
          isUpdating={updating}
        />
      </div>
    </div>
  );
}

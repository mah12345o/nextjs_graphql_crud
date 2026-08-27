"use client";

import React, { useState, useTransition } from "react";
import { Plus, X, Layers } from "lucide-react";
import { Card } from "@/lib/graphql/schema";
import CardList from "./CardList";
import AddCardModal from "./AddCardModal";
import { createCardAction, updateCardAction, deleteCardAction } from "@/actions/cardActions";

interface CardManagerClientProps {
  initialCards: Card[];
}

export default function CardManagerClient({ initialCards }: CardManagerClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAddCard = async (input: { title: string; description: string; category?: string }) => {
    startTransition(async () => {
      await createCardAction(input);
      setIsModalOpen(false);
    });
  };

  const handleEditCard = async (input: { id: string; title?: string; description?: string; category?: string }) => {
    startTransition(async () => {
      await updateCardAction(input);
    });
  };

  const handleDeleteCard = async (id: string) => {
    startTransition(async () => {
      await deleteCardAction(id);
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">GraphQL Card Manager</h1>
            <p className="text-xs text-slate-400">Architecture: Next.js Server Components + Server Actions</p>
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

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCard={handleAddCard}
        isCreating={isPending}
      />

      {/* Card List Component */}
      <CardList
        cards={initialCards}
        loading={false}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCard}
        isUpdating={isPending}
      />
    </div>
  );
}

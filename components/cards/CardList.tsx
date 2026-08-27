"use client";

import React from "react";
import { Loader2, Layers } from "lucide-react";
import { Card } from "@/lib/graphql/schema";
import CardItem from "./CardItem";
import { UpdateCardInput } from "@/actions/cardActions";

interface CardListProps {
  cards: Card[];
  loading: boolean;
  onEditCard: (input: UpdateCardInput) => Promise<any>;
  onDeleteCard: (id: string) => Promise<any>;
  isUpdating?: boolean;
}

export default function CardList({ cards, loading, onEditCard, onDeleteCard, isUpdating }: CardListProps) {
  if (loading && cards.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-2" />
        <p className="text-xs font-mono">Loading cards via GraphQL...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800 space-y-2">
        <Layers className="w-8 h-8 text-slate-600 mx-auto" />
        <h3 className="text-sm font-semibold text-slate-300">No cards found</h3>
        <p className="text-xs text-slate-500">Click "+ Add New Card" to create your first GraphQL card.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          onEdit={onEditCard}
          onDelete={onDeleteCard}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  );
}

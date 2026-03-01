"use client";

import type { Edge } from "@/models/Edge";

interface TradeListProps {
  edges: Edge[];
  loading: boolean;
  skillMap: Record<string, string>;
  onDelete: (edgeId: string) => void;
}

export default function TradeList({ edges, loading, skillMap, onDelete }: TradeListProps) {
  if (loading) {
    return <p className="text-[var(--color-text)]/60 text-sm">Loading edges…</p>;
  }

  if (edges.length === 0) {
    return (
      <p className="text-[var(--color-text)]/60 text-sm">
        No edges yet. Add one above.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2 overflow-auto min-h-0">
      {edges.map((edge) => (
        <li
          key={edge.edgeId}
          className="dashboard-card dashboard-card--glow rounded-xl border p-3 flex items-center justify-between gap-2 shrink-0"
        >
          <span className="text-[var(--color-text)] text-sm">
            {skillMap[edge.from] ?? edge.from} → {skillMap[edge.to] ?? edge.to}
          </span>
          <button
            type="button"
            onClick={() => onDelete(edge.edgeId)}
            className="text-xs text-[var(--color-text)]/70 hover:text-teal-600 underline"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}

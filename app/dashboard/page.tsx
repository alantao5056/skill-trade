"use client";

import React, { useState } from "react";
import {
  currentUserId,
  dummySkills,
  dummyTradeRequests,
  dummyCycles,
  type DummyTradeRequest,
  type DummyCycleMatch,
} from "@/lib/dummy-data";

const THEME_PRIMARY = "13, 148, 136"; // #0d9488 teal for glow/border

export default function DashboardPage() {
  const [trades, setTrades] = useState<DummyTradeRequest[]>(() =>
    dummyTradeRequests.filter((t) => t.uid === currentUserId)
  );
  const [cycles, setCycles] = useState<DummyCycleMatch[]>(() => [...dummyCycles]);
  const [give, setGive] = useState("");
  const [want, setWant] = useState("");

  const addTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!give || !want || give === want) return;
    setTrades((prev) => [
      ...prev,
      {
        id: `tr-${Date.now()}`,
        uid: currentUserId,
        give,
        want,
      },
    ]);
    setGive("");
    setWant("");
  };

  const dismissTrade = (id: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  };

  const acceptCycle = (id: string) => {
    setCycles((prev) => prev.filter((c) => c.id !== id));
  };

  const denyCycle = (id: string) => {
    setCycles((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <main className="font-sans h-screen w-full flex flex-col overflow-hidden">
      <style>
        {`
          .dashboard-bento {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color: ${THEME_PRIMARY};
            --border-color: rgba(13, 148, 136, 0.35);
          }
          .dashboard-bento .dashboard-card {
            background-color: white;
            border: 1px solid rgba(13, 148, 136, 0.2);
            color: var(--color-text);
          }
          .dashboard-bento .dashboard-card:hover {
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(13, 148, 136, 0.15);
          }
          .dashboard-bento .dashboard-card--glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 6px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
              rgba(${THEME_PRIMARY}, calc(var(--glow-intensity) * 0.12)) 0%,
              rgba(${THEME_PRIMARY}, calc(var(--glow-intensity) * 0.06)) 30%,
              transparent 60%);
            border-radius: inherit;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            z-index: 1;
          }
        `}
      </style>

      <div className="dashboard-bento grid grid-cols-1 lg:grid-cols-2 gap-0 flex-1 min-h-0 w-full">
        {/* Left: Trades */}
        <section className="flex flex-col h-full min-h-0 p-6 border-r border-[rgba(13,148,136,0.15)] bg-transparent">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">Trades</h2>
          <div className="dashboard-card dashboard-card--glow rounded-[20px] border p-5 flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
            <form onSubmit={addTrade} className="flex flex-wrap items-end gap-3 shrink-0">
              <label className="flex flex-col gap-1 text-sm text-[var(--color-text)]">
                I give
                <select
                  value={give}
                  onChange={(e) => setGive(e.target.value)}
                  className="bg-white border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--color-text)] min-w-[140px] focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488]"
                >
                  <option value="">Select skill</option>
                  {dummySkills.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm text-[var(--color-text)]">
                I want
                <select
                  value={want}
                  onChange={(e) => setWant(e.target.value)}
                  className="bg-white border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--color-text)] min-w-[140px] focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488]"
                >
                  <option value="">Select skill</option>
                  {dummySkills.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
              <button type="submit" className="btn-primary text-sm">
                Add trade
              </button>
            </form>
            <ul className="flex flex-col gap-2 overflow-auto min-h-0">
              {trades.length === 0 ? (
                <li className="text-[var(--color-text)]/60 text-sm">No trade requests yet.</li>
              ) : (
                trades.map((t) => (
                  <li
                    key={t.id}
                    className="dashboard-card dashboard-card--glow rounded-xl border p-3 flex flex-row items-center justify-between gap-2 shrink-0"
                  >
                    <span className="text-[var(--color-text)] text-sm">
                      {t.give} → {t.want}
                    </span>
                    <button
                      type="button"
                      onClick={() => dismissTrade(t.id)}
                      className="text-xs text-[var(--color-text)]/70 hover:text-[var(--color-text)] hover:text-[#0d9488] underline"
                    >
                      Dismiss
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        {/* Right: Cycles */}
        <section className="flex flex-col h-full min-h-0 p-6 bg-transparent">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">Cycles</h2>
          <div className="dashboard-card dashboard-card--glow rounded-[20px] border p-5 flex flex-col flex-1 min-h-0 overflow-hidden">
            <p className="text-[var(--color-text)]/70 text-sm mb-3 shrink-0">Matches with other users’ trade requests.</p>
            <ul className="flex flex-col gap-2 overflow-auto min-h-0">
              {cycles.length === 0 ? (
                <li className="text-[var(--color-text)]/60 text-sm">No cycle matches right now.</li>
              ) : (
                cycles.map((c) => (
                  <li
                    key={c.id}
                    className="dashboard-card dashboard-card--glow rounded-xl border p-3 flex flex-row items-center justify-between gap-2 shrink-0"
                  >
                    <span className="text-[var(--color-text)] text-sm">{c.summary}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => acceptCycle(c.id)}
                        className="btn-primary text-xs px-2 py-1 rounded-lg"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => denyCycle(c.id)}
                        className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Deny
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

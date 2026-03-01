"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import {
  getUserEdges,
  enqueueAddEdge,
  enqueueRemoveEdge,
  getUserCycles,
  approveCycle,
  getSkills,
  getUser,
} from "@/firebase/utils";
import type { Edge } from "@/models/Edge";
import type { Cycle } from "@/models/Cycle";
import type { Skill } from "@/models/Skill";
import TradeForm from "./components/TradeForm";
import TradeList from "./components/TradeList";
import CycleList from "./components/CycleList";

export default function DashboardPage() {
  const { user } = useUser();

  const [edges, setEdges] = useState<Edge[]>([]);
  const [edgesLoading, setEdgesLoading] = useState(true);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [cyclesLoading, setCyclesLoading] = useState(true);
  const [give, setGive] = useState("");
  const [want, setWant] = useState("");
  const [skillMap, setSkillMap] = useState<Record<string, string>>({});
  const [userMap, setUserMap] = useState<Record<string, string>>({});

  const fetchEdges = useCallback(async () => {
    if (!user) return;
    setEdgesLoading(true);
    const res = await getUserEdges(user.uid);
    if (res.ok) {
      setEdges(res.data as Edge[]);
    }
    setEdgesLoading(false);
  }, [user]);

  const fetchCycles = useCallback(async () => {
    if (!user) return;
    setCyclesLoading(true);
    const res = await getUserCycles(user.uid);
    if (res.ok) {
      const fetchedCycles = res.data as Cycle[];
      setCycles(fetchedCycles);

      const allUids = new Set(fetchedCycles.flatMap((c) => c.uids));
      const userEntries = await Promise.all(
        [...allUids].map(async (uid) => {
          const userRes = await getUser(uid);
          const name = userRes.ok ? userRes.data.displayName ?? uid : uid;
          return [uid, name] as const;
        })
      );
      setUserMap((prev) => {
        const next = { ...prev };
        for (const [uid, name] of userEntries) {
          next[uid] = name;
        }
        return next;
      });
    }
    setCyclesLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchEdges();
    fetchCycles();

    getSkills().then((res) => {
      if (res.ok) {
        const map: Record<string, string> = {};
        for (const s of res.data as Skill[]) {
          map[s.id] = s.label;
        }
        setSkillMap(map);
      }
    });
  }, [user, fetchEdges, fetchCycles]);

  const handleAddEdge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !give || !want || give === want) return;
    await enqueueAddEdge(give, want, user.uid);
    setGive("");
    setWant("");
  };

  const handleDeleteEdge = async (edgeId: string) => {
    if (!user) return;
    const res = await enqueueRemoveEdge(edgeId, user.uid);
    if (res.ok) {
      setEdges((prev) => prev.filter((e) => e.edgeId !== edgeId));
    }
  };

  const handleAcceptCycle = async (cycleId: string) => {
    if (!user) return;
    const res = await approveCycle(cycleId, user.uid);
    if (res.ok) {
      setCycles((prev) =>
        prev.map((c) => (c.cycleId === cycleId ? (res.data as Cycle) : c))
      );
    }
  };

  return (
    <main className="font-sans h-screen w-full flex flex-col overflow-hidden">
      <div className="dashboard-bento grid grid-cols-1 lg:grid-cols-2 gap-0 flex-1 min-h-0 w-full">
        {/* Trades */}
        <section className="flex flex-col h-full min-h-0 p-6 border-r border-teal-600/15 bg-[var(--color-background)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
            Trades
          </h2>
          <div className="dashboard-card dashboard-card--glow rounded-[20px] border p-5 flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
            <TradeForm
              give={give}
              want={want}
              onGiveChange={setGive}
              onWantChange={setWant}
              onSubmit={handleAddEdge}
            />
            <TradeList
              edges={edges}
              loading={edgesLoading}
              skillMap={skillMap}
              onDelete={handleDeleteEdge}
            />
          </div>
        </section>

        {/* Cycles */}
        <section className="flex flex-col h-full min-h-0 p-6 bg-[var(--color-background)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
            Cycles
          </h2>
          <div className="dashboard-card dashboard-card--glow rounded-[20px] border p-5 flex flex-col flex-1 min-h-0 overflow-hidden">
            <p className="text-[var(--color-text)]/70 text-sm mb-3 shrink-0">
              Matches with other users&apos; trade requests.
            </p>
            <CycleList
              cycles={cycles}
              loading={cyclesLoading}
              currentUid={user?.uid ?? ""}
              skillMap={skillMap}
              userMap={userMap}
              onAccept={handleAcceptCycle}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

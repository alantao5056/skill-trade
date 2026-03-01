"use client";

import React from "react";
import type { Cycle } from "@/models/Cycle";

interface CycleListProps {
  cycles: Cycle[];
  loading: boolean;
  currentUid: string;
  skillMap: Record<string, string>;
  userMap: Record<string, string>;
  onAccept: (cycleId: string) => void;
}

function ApprovalChain({
  uids,
  approvals,
  userMap,
}: {
  uids: string[];
  approvals: Cycle["approvals"];
  userMap: Record<string, string>;
}) {
  const approvalLookup = new Map(approvals.map((a) => [a.uid, a.approved]));

  return (
    <span className="flex flex-wrap items-center gap-1 text-sm">
      {uids.map((uid, i) => {
        const approved = approvalLookup.get(uid) ?? false;
        return (
          <React.Fragment key={uid}>
            <span className={approved ? "text-green-600 font-medium" : "text-amber-500 font-medium"}>
              {userMap[uid] ?? uid}
            </span>
            {i < uids.length - 1 && (
              <span className="text-[var(--color-text)]/40">→</span>
            )}
          </React.Fragment>
        );
      })}
    </span>
  );
}

function SkillChain({
  skillIds,
  skillMap,
}: {
  skillIds: string[];
  skillMap: Record<string, string>;
}) {
  return (
    <span className="flex flex-wrap items-center gap-1 text-sm">
      {skillIds.map((id, i) => (
        <React.Fragment key={id}>
          <span className="text-[var(--color-text)]">{skillMap[id] ?? id}</span>
          {i < skillIds.length - 1 && (
            <span className="text-[var(--color-text)]/40">→</span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
}

export default function CycleList({
  cycles,
  loading,
  currentUid,
  skillMap,
  userMap,
  onAccept,
}: CycleListProps) {
  if (loading) {
    return <p className="text-[var(--color-text)]/60 text-sm">Loading cycles…</p>;
  }

  if (cycles.length === 0) {
    return (
      <p className="text-[var(--color-text)]/60 text-sm">
        No cycle matches right now.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3 overflow-auto min-h-0">
      {cycles.map((c) => (
        <li
          key={c.cycleId}
          className="dashboard-card dashboard-card--glow rounded-xl border p-4 flex flex-col gap-2 shrink-0"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text)]/50">
                Users
              </span>
              <ApprovalChain uids={c.uids} approvals={c.approvals} userMap={userMap} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text)]/50">
                Skills
              </span>
              <SkillChain skillIds={c.skillIds} skillMap={skillMap} />
            </div>
          </div>
          <div className="flex justify-end">
            {c.approvals.some((a) => a.uid === currentUid && a.approved) ? (
              <span className="text-xs px-3 py-1 rounded-lg bg-gray-200 text-gray-400 cursor-default select-none">
                Accepted
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onAccept(c.cycleId)}
                className="btn-primary text-xs px-3 py-1 rounded-lg"
              >
                Accept
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

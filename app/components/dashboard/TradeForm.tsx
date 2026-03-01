"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getSkills } from "@/firebase/utils";
import type { Skill } from "@/models/Skill";
import { IoAdd } from "react-icons/io5";

interface TradeFormProps {
  give: string;
  want: string;
  onGiveChange: (value: string) => void;
  onWantChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  userOffer: Record<string, number>;
  userNeed: Record<string, number>;
}

function GroupedSkillOptions({
  skills,
  disabledSkills,
}: {
  skills: Skill[];
  disabledSkills: Set<string>;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const skill of skills) {
      const cat = skill.category || "Other";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(skill);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [skills]);

  return (
    <>
      {grouped.map(([category, items]) => (
        <optgroup key={category} label={category}>
          {items.map((s) => (
            <option key={s.id} value={s.id} disabled={disabledSkills.has(s.id)}>
              {s.label}
            </option>
          ))}
        </optgroup>
      ))}
    </>
  );
}

export default function TradeForm({
  give,
  want,
  onGiveChange,
  onWantChange,
  onSubmit,
  userOffer,
  userNeed,
}: TradeFormProps) {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    getSkills().then((res) => {
      if (res.ok) {
        setSkills(res.data as Skill[]);
      }
    });
  }, []);

  const disabledForGive = useMemo(() => new Set(Object.keys(userOffer)), [userOffer]);
  const disabledForWant = useMemo(() => new Set(Object.keys(userNeed)), [userNeed]);

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-4 shrink-0">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--color-text)]">
        I give
        <select
          value={give}
          onChange={(e) => onGiveChange(e.target.value)}
          className="select-skill"
        >
          <option value="" disabled>
            Select skill…
          </option>
          <GroupedSkillOptions skills={skills} disabledSkills={disabledForWant} />
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--color-text)]">
        I want
        <select
          value={want}
          onChange={(e) => onWantChange(e.target.value)}
          className="select-skill"
        >
          <option value="" disabled>
            Select skill…
          </option>
          <GroupedSkillOptions skills={skills} disabledSkills={disabledForGive} />
        </select>
      </label>

      <button type="submit" className="btn-primary text-sm p-2 rounded-lg" aria-label="Add trade">
      <IoAdd size={20} />
      </button>
    </form>
  );
}

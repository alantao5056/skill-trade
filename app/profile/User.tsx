"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { getUser, getSkills, updateUserProfile } from "@/firebase/utils";
import type { User as UserModel } from "@/models/User";
import type { Skill } from "@/models/Skill";

type UserProps = {
  userId: string;
};

export default function User({ userId }: UserProps) {
  const { user: authUser, loading: authLoading } = useUser();
  const [profileUser, setProfileUser] = useState<UserModel | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const isOwnProfile = authUser?.uid === userId;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    const [userRes, skillsRes] = await Promise.all([
      getUser(userId),
      getSkills(),
    ]);

    if (userRes.ok && userRes.data) {
      setProfileUser(userRes.data);
    } else {
      setError(userRes.error || "User not found");
    }

    if (skillsRes.ok) {
      setSkills(skillsRes.data);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getSkillLabel = (skillId: string) => {
    const skill = skills.find((s) => s.id === skillId);
    return skill ? skill.label : skillId;
  };

  const startEditingName = () => {
    setNameInput(profileUser?.displayName ?? "");
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (!profileUser) return;
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    const res = await updateUserProfile(userId, { displayName: trimmed });
    if (res.ok) {
      setProfileUser({ ...profileUser, displayName: trimmed });
      setIsEditingName(false);
    }
  };

  if (loading || authLoading) {
    return <div className="p-6 font-sans">Loading...</div>;
  }

  if (error || !profileUser) {
    return (
      <div className="p-6 font-sans">
        <p>{error || "User not found."}</p>
      </div>
    );
  }

  const displayName = profileUser.displayName || profileUser.uid;
  const offerSkillIds = Object.keys(profileUser.offer ?? {});
  const needSkillIds = Object.keys(profileUser.need ?? {});

  return (
    <div className="p-6 max-w-xl font-sans">
      <div className="space-y-6">
        <div>
          {isOwnProfile && isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="border rounded px-2 py-1 text-xl"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") setIsEditingName(false);
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveName}
                className="text-sm text-[var(--color-primary)] hover:underline"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">{displayName}</h1>
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={startEditingName}
                  className="text-sm text-[var(--color-primary)] hover:underline"
                >
                  Edit name
                </button>
              )}
            </div>
          )}
        </div>

        <SkillList
          title="Skills Offered"
          skillIds={offerSkillIds}
          getSkillLabel={getSkillLabel}
          emptyText="No skills offered yet."
        />

        <SkillList
          title="Skills Needed"
          skillIds={needSkillIds}
          getSkillLabel={getSkillLabel}
          emptyText="No skills needed yet."
        />

        {isOwnProfile && (
          <Link
            href="/meetings"
            className="inline-block mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:opacity-90"
          >
            My meetings
          </Link>
        )}
      </div>
    </div>
  );
}

type SkillListProps = {
  title: string;
  skillIds: string[];
  getSkillLabel: (id: string) => string;
  emptyText: string;
};

function SkillList({ title, skillIds, getSkillLabel, emptyText }: SkillListProps) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">{title}</h2>
      {skillIds.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyText}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {skillIds.map((id) => (
            <li
              key={id}
              className="text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
            >
              {getSkillLabel(id)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

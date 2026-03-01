"use client";

import { useState } from "react";
import Link from "next/link";
import { dummyUsers } from "@/lib/dummy-data";
import SignOutButton from "@/app/SignOutButton";

type UserProps = {
  userId: string;
  currentUserId: string;
};

export default function User({ userId, currentUserId }: UserProps) {
  const user = dummyUsers.find((u) => u.id === userId);
  const [name, setName] = useState(user?.name ?? "");
  const [skills, setSkills] = useState<string[]>(user?.skills ?? []);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const isOwnProfile = userId === currentUserId;

  if (!user) {
    return (
      <div className="p-6 font-sans">
        <p>User not found.</p>
      </div>
    );
  }

  const displayName = name || user.name;
  const displaySkills = skills.length ? skills : user.skills;

  return (
    <div className="p-6 max-w-xl font-sans">
      <div className="space-y-4">
        <div>
          {isOwnProfile && !isEditingName ? (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">{displayName}</h1>
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                className="text-sm text-[var(--color-primary)] hover:underline"
              >
                Edit name
              </button>
            </div>
          ) : isOwnProfile && isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-2 py-1 text-xl"
              />
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="text-sm text-[var(--color-primary)] hover:underline"
              >
                Save
              </button>
            </div>
          ) : (
            <h1 className="text-2xl font-semibold">{displayName}</h1>
          )}
        </div>

        <div>
          <h2 className="text-lg font-medium mb-2">Skills</h2>
          {isOwnProfile && !isEditingSkills ? (
            <div className="space-y-2">
              <ul className="flex flex-wrap gap-2">
                {displaySkills.map((s) => (
                  <li
                    key={s}
                    className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                  >
                    {s}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setIsEditingSkills(true)}
                className="text-sm text-[var(--color-primary)] hover:underline"
              >
                Edit skills
              </button>
            </div>
          ) : isOwnProfile && isEditingSkills ? (
            <div className="space-y-2">
              <ul className="flex flex-wrap gap-2">
                {displaySkills.map((s) => (
                  <li
                    key={s}
                    className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex items-center gap-1"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() =>
                        setSkills((prev) => prev.filter((sk) => sk !== s))
                      }
                      className="text-red-500 hover:underline"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill"
                  className="border rounded px-2 py-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newSkill.trim()) {
                      setSkills((prev) => [...prev, newSkill.trim()]);
                      setNewSkill("");
                    }
                  }}
                  className="text-sm text-[var(--color-primary)] hover:underline"
                >
                  Add
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingSkills(false)}
                className="text-sm text-[var(--color-primary)] hover:underline block mt-2"
              >
                Done
              </button>
            </div>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {displaySkills.map((s) => (
                <li
                  key={s}
                  className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {isOwnProfile && (
          <>
            <Link
              href="/meetings"
              className="inline-block mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:opacity-90"
            >
              My meetings
            </Link>
            <div className="mt-4">
              <SignOutButton />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

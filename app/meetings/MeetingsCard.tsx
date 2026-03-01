"use client";

import { useEffect, useState } from "react";
import { getUser, getSkill } from "@/firebase/utils";
import type { Meeting } from "@/models/Meeting";
import UserLink from "@/app/components/ui/UserLink";

interface MeetingsCardProps {
  meeting: Meeting;
  onDismiss: (meetingId: string) => void;
}

export default function MeetingsCard({ meeting, onDismiss }: MeetingsCardProps) {
  const [giverName, setGiverName] = useState(meeting.giveUid);
  const [receiverName, setReceiverName] = useState(meeting.wantUid);
  const [skillLabel, setSkillLabel] = useState(meeting.skillId);

  useEffect(() => {
    getUser(meeting.giveUid).then((r) => {
      if (r.ok) setGiverName(r.data.displayName ?? meeting.giveUid);
    });
    getUser(meeting.wantUid).then((r) => {
      if (r.ok) setReceiverName(r.data.displayName ?? meeting.wantUid);
    });
    getSkill(meeting.skillId).then((r) => {
      if (r.ok) setSkillLabel(r.data.label ?? meeting.skillId);
    });
  }, [meeting.giveUid, meeting.wantUid, meeting.skillId]);

  return (
    <div className="card p-4 flex items-center justify-between w-full">
      <div className="flex items-center gap-3 text-sm">
        <UserLink uid={meeting.giveUid} name={giverName} className="font-semibold text-gray-800" />
        <span className="text-gray-400">→</span>
        <span className="badge-skill">{skillLabel}</span>
        <span className="text-gray-400">→</span>
        <UserLink uid={meeting.wantUid} name={receiverName} className="font-semibold text-gray-800" />
      </div>

      <button
        type="button"
        onClick={() => onDismiss(meeting.meetingId)}
        className="text-xs px-3 py-1 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
      >
        Dismiss
      </button>
    </div>
  );
}

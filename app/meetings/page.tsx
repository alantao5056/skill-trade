"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { getUserMeetings, dismissMeeting } from "@/firebase/utils";
import type { Meeting } from "@/models/Meeting";
import MeetingsCard from "./MeetingsCard";

export default function MeetingsPage() {
  const { user } = useUser();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const res = await getUserMeetings(user.uid);
    if (res.ok) {
      setMeetings(res.data as Meeting[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleDismiss = async (meetingId: string) => {
    const res = await dismissMeeting(meetingId);
    if (res.ok) {
      setMeetings((prev) => prev.filter((m) => m.meetingId !== meetingId));
    }
  };

  return (
    <main className="p-6 font-sans">
      <h1 className="text-2xl font-semibold mb-6">Meetings</h1>
      {loading ? (
        <p className="text-gray-500 text-sm">Loading meetings…</p>
      ) : meetings.length === 0 ? (
        <p className="text-gray-500 text-sm">No meetings yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {meetings.map((meeting) => (
            <MeetingsCard
              key={meeting.meetingId}
              meeting={meeting}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      )}
    </main>
  );
}

import MeetingsCard from "./MeetingsCard";
import { dummyMeetings } from "@/lib/dummy-data";

export default function MeetingsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Meetings</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dummyMeetings.map((meeting) => (
          <MeetingsCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </main>
  );
}

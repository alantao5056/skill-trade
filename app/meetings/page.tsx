import MeetingsCard from "./MeetingsCard";
import { dummyMeetings } from "@/lib/dummy-data";

export default function MeetingsPage() {
  return (
    <main className="p-6 font-sans px-8 md:px-12">
      <h1 className="text-2xl font-bold text-center mb-6">Meetings</h1>
      <div className="flex flex-col gap-4">
        {dummyMeetings.map((meeting) => (
          <MeetingsCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </main>
  );
}

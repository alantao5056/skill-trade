import { dummyUsers } from "@/lib/dummy-data";

type Meeting = {
  id: string;
  title: string;
  participants: string[];
  date: string;
  time: string;
  status: string;
};

type MeetingsCardProps = {
  meeting: Meeting;
};

export default function MeetingsCard({ meeting }: MeetingsCardProps) {
  // derive participant names individually so we can show arrow direction
  const participantList = meeting.participants.map(
    (id) => dummyUsers.find((u) => u.id === id)?.name ?? id
  );
  const firstParticipant = participantList[0] ?? "";
  const secondParticipant = participantList[1] ?? participantList.slice(1).join(", ");

  // use the meeting title as the skill label; could parse differently if needed
  const skillLabel = meeting.title;

  return (
    <div className="card">
      {/* skill tag above the arrow, using global.css class */}
      <div className="skill-tag">
        {skillLabel}
      </div>
      <p className="meeting-info">
        {firstParticipant} → {secondParticipant}
      </p>
      <span
        className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${
          meeting.status === "completed"
            ? "bg-gray-200 dark:bg-gray-700"
            : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
        }`}
      >
        {meeting.status}
      </span>
    </div>
  );
}

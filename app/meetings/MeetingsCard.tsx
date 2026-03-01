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
  <div className="card p-6 space-y-4 w-full">

    {/* Arrow Row */}
    <div className="flex items-center justify-between">

      {/* Left Person */}
      <span className="font-semibold text-gray-800">
        {firstParticipant}
      </span>

      {/* Center Arrow + Skill */}
      <div className="flex items-center flex-1 mx-6">
        <div className="flex-1 h-0.5 bg-teal-300"></div>

        <span className="badge-skill mx-4">
          {skillLabel}
        </span>

        <div className="flex-1 h-0.5 bg-teal-300"></div>
      </div>

      {/* Right Person */}
      <span className="font-semibold text-gray-800 text-right">
        {secondParticipant}
      </span>

    </div>

    {/* Meeting Details */}
    <div className="flex justify-between text-sm text-gray-500">
      <span>{meeting.date}</span>
      <span>{meeting.time}</span>
      <span>{meeting.status}</span>
    </div>
  </div>
);
}

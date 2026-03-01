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
  const participantNames = meeting.participants
    .map((id) => dummyUsers.find((u) => u.id === id)?.name ?? id)
    .join(", ");

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg">{meeting.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
        {participantNames}
      </p>
      <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
        {meeting.date} at {meeting.time}
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

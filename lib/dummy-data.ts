export const currentUserId = "user-1";

export const dummyUsers = [
  {
    id: "user-1",
    name: "Alex Chen",
    skills: ["React", "TypeScript", "UI Design"],
  },
  {
    id: "user-2",
    name: "Jordan Lee",
    skills: ["Python", "Data Analysis", "Machine Learning"],
  },
  {
    id: "user-3",
    name: "Sam Taylor",
    skills: ["Node.js", "GraphQL", "DevOps"],
  },
];

export const dummyMeetings = [
  {
    id: "meeting-1",
    title: "React Pair Programming",
    participants: ["user-1", "user-2"],
    date: "2025-03-05",
    time: "14:00",
    status: "scheduled",
  },
  {
    id: "meeting-2",
    title: "TypeScript Workshop",
    participants: ["user-1", "user-3"],
    date: "2025-03-08",
    time: "10:00",
    status: "scheduled",
  },
  {
    id: "meeting-3",
    title: "Python Review",
    participants: ["user-2", "user-3"],
    date: "2025-03-03",
    time: "16:00",
    status: "completed",
  },
];

export const dummySkills = [
  "React",
  "TypeScript",
  "UI Design",
  "Python",
  "Data Analysis",
  "Machine Learning",
  "Node.js",
  "GraphQL",
  "DevOps",
];

export type DummyTradeRequest = {
  id: string;
  uid: string;
  give: string;
  want: string;
};

export const dummyTradeRequests: DummyTradeRequest[] = [
  { id: "tr-1", uid: "user-1", give: "React", want: "Python" },
  { id: "tr-2", uid: "user-1", give: "TypeScript", want: "Data Analysis" },
  { id: "tr-3", uid: "user-2", give: "Python", want: "React" },
];

export type DummyCycleMatch = {
  id: string;
  canonicalKey: string;
  skillIds: string[];
  uids: string[];
  summary: string;
};

export const dummyCycles: DummyCycleMatch[] = [
  {
    id: "cycle-1",
    canonicalKey: "react-python",
    skillIds: ["React", "Python"],
    uids: ["user-1", "user-2"],
    summary: "React ↔ Python",
  },
  {
    id: "cycle-2",
    canonicalKey: "typescript-data",
    skillIds: ["TypeScript", "Data Analysis"],
    uids: ["user-1", "user-2"],
    summary: "TypeScript ↔ Data Analysis",
  },
];

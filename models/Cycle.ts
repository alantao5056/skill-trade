export interface Cycle {
  approvals: { uid: string, approved: boolean }[];
  edgeIds: string[];
  skillIds: string[];
  uids: string[];
  canonicalKey: string;
}
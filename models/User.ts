export interface User {
  uid: string;
  displayName?: string;
  cycles: string[];
  edges: string[];
  meetings: string[];
  offer: Record<string, number>;
  need: Record<string, number>;
}